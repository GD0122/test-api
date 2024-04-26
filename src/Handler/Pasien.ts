
import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import { ErrStatus, ErrStatusDB } from "../HTTPs/Status"
import { ResStatus } from "../HTTPs/Status"
import { _validation_pasien } from "../validation/_Validation"
import { _hashData } from "../validation/_hash_data"






const prisma = new PrismaClient({
    log:["info"]
})





interface DataPasien {
    pasien: {
      name?:string,
      id?:string,
      alamat?:string,
      noTelp?:string,
      tanggalLahir?:Date,
      createdAt?:Date,
      rekam?:any,
      jadwal?:any
     
    }[];
    pages?:{
        nextPage?:number | string;
        totalPages?:number;
        totalData?:number;
      }
  }


export const _addPasien2 = async(req:Request,res:Response)=>{
  
    const {name,alamat,noTelp,tanggalLahir} = req.body
    console.log(tanggalLahir)
   
    
    const {error} = _validation_pasien({name,alamat,noTelp,tanggalLahir})
    if(error) return res.status(404).json({message:error.details[0].message})


    const getPas = await prisma.pasien.findFirst({where:{
        name:name
    }
    })
    if(getPas) return res.status(404).json({message:"Upss...sepertinya nama pasien sudah terdaftar"})
    const alamatHash = await _hashData(alamat)
    const noTelpHash = await _hashData(noTelp)

    try { 
        const add = await  prisma.pasien.create({
            data:{
                name:name,
                alamat:alamatHash,
                noTelp:noTelpHash,
                tanggalLahir:new Date(tanggalLahir),
            }
        }).catch((err)=>{
            throw err
        })
     
        return res.status(201).json(ResStatus[0].res201.message).end()
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
       
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

export const _getPasien2 = async(req:Request,res:Response)=>{
   
        const idP = req.params.id
        if(!idP) return res.status(404).json(ErrStatus[0].err404.message)
    try {
       
        const data = await prisma.pasien.findUnique({where:{id:idP},
        select:{id:true,name:true,alamat:true,tanggalLahir:true,noTelp:true,createdAt:true}
        }).then((res)=>{
            return {pasien:{name:res.name,id:res.id,tanggalLahir:res.tanggalLahir,alamat:res.alamat,CreatedAt:res.createdAt,noTelp:res.noTelp},}
        })
        return res.status(200).json(data)
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
    
}

export const _getPasien = async(req:Request,res:Response)=>{
    let { page, perPage,idP} : { page?: number | string, perPage?: number | string, idP?:string } = req.query;
    page = page || 1;
    perPage = perPage || 5;
    
    try {
    
        const [pasien, totalCount] = await Promise.all([
            prisma.pasien.findMany({
              select:{id:true,name:true,noTelp:true,tanggalLahir:true,alamat:true,createdAt:true,},
              skip: (+page - 1) * +perPage,
              take: +perPage,
              orderBy: { createdAt: 'desc' }, 
            }),
            prisma.pasien.count(),
        ]);
      
        const totals = Math.ceil(totalCount / +perPage)
        // const nextPage = +page < totals ? +page + 1 : "no";
        const response: DataPasien = {
          pasien:pasien,
          pages:{
            totalPages:totals,
            totalData:totalCount
          }
        };
        
        return res.status(200).json(response);
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}


export const _editPasien = async(req:Request,res:Response)=>{
    const {name,alamat,noTelp,tanggalLahir} = req.body
    const id = req?.params?.id
    if(!id) return res.status(400).json(ErrStatus[0].err400.message)
    console.log(tanggalLahir)


    const {error} = _validation_pasien({name,alamat,noTelp,tanggalLahir})
   
    if(error) return res.status(404).json({message:error.details[0].message})

    const alamatHash = await _hashData(alamat)
    const noTelpHash = await _hashData(noTelp)
   
    try {
   
        const pasien = await prisma.pasien.update({
            where:{
                id:id
            },
            data:{
                name,
                alamat:alamatHash,
                noTelp:noTelpHash,
                tanggalLahir:new Date(tanggalLahir)
                
            }
        }).catch((err)=>{throw err})
        return res.status(201).json("data sukses diupdate").end()
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message})
    }
    
}

export const _searchPasien = async(req:Request,res:Response)=>{
    const names = req?.params?.name
    let {page,perPage} :{page?:number | string,perPage?:number | string} = req.query
    page = page || 1
    perPage = perPage || 5

    try {
        const pasien = await prisma.pasien.findUnique({
            where: {
                name: names
            },
            select: {name: true, alamat: true,tanggalLahir:true, createdAt: true, noTelp: true},
            
        }).catch((err) => {
            throw err
        });
        if (!pasien) {
            return res.status(404).json({message: "Pasien not found"});
        }
        const response: DataPasien = {
            pasien: [pasien], // Wrap the pasien object in an array
            pages: {
                totalData: [pasien].length // Assuming you're fetching one pasien, so totalData is 1
            }
        };
        return res.status(200).json(response);
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message})
    }
}


export const _deletePasien = async(req:Request,res:Response)=>{
    const idP = req?.params?.id
    if(!idP) return res.status(404).json(ErrStatus[0].err404.message)

    try {
       const rekam = await prisma.rekam.deleteMany({
         where:{pasienId:idP}
       })
           .catch((err)=>{
            throw err
           })
        const jad = await prisma.jadwals.deleteMany({
            where:{pasienId:idP}
        }).catch((err)=>{
            throw err
        })

        const gam = await prisma.gambar.deleteMany({
            where:{pasienId:idP}
        }).catch((err)=>{
            throw err
        })
        
      
       const pasien = await prisma.pasien.delete({where:{id:idP},})
       .catch((err)=>{
      
        throw err
       })
        return res.status(201).json("pasien sukses dihapus")
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}



export const _SearchPasien = async(req:Request,res:Response)=>{
    const  {names} = req.params
    let {page,perPage} :{page?:number | string,perPage?:number | string} = req.query
    page = page || 1
    perPage = perPage || 5
 
 
    try {
      
        const [pasien, count] = await Promise.all([
            prisma.pasien.findMany({
              where:{name:{contains:names,mode:"insensitive"}},
              select:{id:true,name:true,noTelp:true,tanggalLahir:true,alamat:true,createdAt:true,},
              skip: (+page - 1) * +perPage,
              take: +perPage,
              orderBy: { createdAt: 'desc' }, 
            }),
            prisma.pasien.count({where:{name:{contains:names,mode:"insensitive"}}}),
        ]).catch((err)=>{
            throw err
        });
    

        const response: DataPasien = {
            pasien: pasien, 
            pages: {
                totalData: count 
            }
        };
        return res.status(200).json(response);
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message})
    }
}

export const _getPasienById = async(req:Request,res:Response)=>{
    const {id} = req.params
    if(!id) return res.status(404).json(ErrStatus[0].err404.message)

    try {
        const pasien = await prisma.pasien.findUnique({where:{id:id},
        select:{id:true,name:true,tanggalLahir:true,alamat:true,noTelp:true}})
        
        return res.status(200).json(pasien)
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message})
    
    }
}


