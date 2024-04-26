import { Request, Response, NextFunction, response } from "express"
import { PrismaClient } from '@prisma/client'
import { ErrStatus } from "../HTTPs/Status"
import { ErrStatusDB } from "../HTTPs/Status"
import { _validation_Jadwal } from "../validation/_Validation"


const prisma  = new PrismaClient({
    log:["query","info"]
})
interface Jadwal {
    jadwal?: {
        pasien: {
            id: string;
            name: string;
            alamat: string;
            noTelp: string;
            tanggalLahir:Date;
            createdAt: Date;
            updatedAt: Date;
        };
        pasienId:string;
        tanggal: Date;
        waktu: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pages?: {
        nextPage?: number | string;
        totalPages?: number;
        totalData?: number;
    }
}
export const _addJadwal = async(req:Request,res:Response)=>{

    const idP = req.params.id
    const {waktu,tanggal} = req.body
    const {error} = _validation_Jadwal({waktu,tanggal})
    if(error) return res.status(404).json(error.details[0].message)
    
    try {
        const dats = await prisma.jadwals.create({
         data:{
            waktu,
            tanggal,
            pasienId:idP
         }
        }).catch((err)=>{throw err})
       return res.status(201).json({message:"data berhasil ditambahkan"})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}




export const _getJadwal = async(req:Request,res:Response)=>{
    let { page , perPage  } : {page?:number,perPage?:number} = req.query;
    const today: Date = new Date(); 
    today.setHours(0, 0, 0, 0); // Atur jam pada awal hari untuk 'today'
    const tomorrow: Date = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    page= page || 1
    perPage= perPage || 10
    

     try {
     
        const [todayData, yesterdayData, tomorrowData] = await Promise.all([
            await prisma.jadwals.findMany({
                where: {
                   
                    tanggal: {
                        gte: today, 
                        lt: tomorrow 
                    }
                },
                skip: ((page - 1) * perPage),
                take: perPage,
                include: {
                    pasien: true
                }
            }),
            prisma.jadwals.findMany({
                where: {
                    tanggal:{
                        lt:today
                    }
                },
                skip: ((page - 1) * perPage),
                take: perPage,
                include: {
                    pasien: true
                }
            }),
            prisma.jadwals.findMany({
                where: {
                    tanggal: {
                        gte: tomorrow, 
                       
                    },
                
                },
                
                skip: ((page - 1) * perPage),
                take: perPage,
                select:{pasien:true,pasienId:true,createdAt:true,waktu:true,tanggal:true,updatedAt:true,}
            })
        ]);

        console.log('Today Data:', todayData);
        console.log('Yesterday Data:', yesterdayData);
        console.log('Tomorrow Data:', tomorrowData);

        return res.status(200).json({ today: todayData, yesterday: yesterdayData, tomorrow: tomorrowData });

    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}


const today: Date = new Date(); 
today.setHours(0, 0, 0, 0); // Atur jam pada awal hari untuk 'today'
const tomorrow: Date = new Date(today.getTime() + (24 * 60 * 60 * 1000));


export const GetJadwalToday = async(req:Request,res:Response)=>{
    let { page , perPage  } : {page?:number,perPage?:number} = req.query;
    page=page || 1
    perPage = perPage || 10

    try {


      const [todayss,count] = await Promise.all([
        await prisma.jadwals.findMany({
            where: {
                tanggal:{
                    gte: today,
                    lt:tomorrow
                }
            },
            skip: ((page - 1) * parseInt(perPage.toString())),
            take: parseInt(perPage.toString()),
            select:{pasien:true,pasienId:true,createdAt:true,waktu:true,tanggal:true,updatedAt:true,}
        }),
        prisma.jadwals.count({
            where: {
                tanggal:{
                    gte:today,
                    lt:tomorrow
                }
            },
        })
    ]);
      const response : Jadwal = {
        jadwal:todayss,
        pages:{
            totalData:count
        }
    }
    
      return res.status(200).json({today:response})
    } catch (error) {
        
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

export const GetJadwalTomorrow = async(req:Request,res:Response)=>{

    let {page,perPage}:{page?:number,perPage?:number} = req.query
    page = page || 1
    perPage = perPage || 5

    try {
      
        const [tomorrowss,count] = await Promise.all([
            await prisma.jadwals.findMany({
                where: {
                    tanggal:{
                        gte: tomorrow
                    }
                },
                skip: ((page - 1) * parseInt(perPage.toString())),
                take: parseInt(perPage.toString()),
                select:{pasien:true,pasienId:true,createdAt:true,waktu:true,tanggal:true,updatedAt:true,}
            }),
            prisma.jadwals.count({
                where: {
                    tanggal:{
                        gte:tomorrow
                    }
                },
            })
        ]);
        const response : Jadwal = {
            jadwal:tomorrowss,
            pages:{
                totalData:count
            }
        }
     
        return res.status(200).json({tomorrow:response})

    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

export const GetJadwalYesterday = async(req:Request,res:Response)=>{
   
    let {page,perPage}:{page?:number,perPage?:number} = req.query
    page = page || 1
    perPage = perPage || 10

    try {
        const [yesterdays,count] = await Promise.all([
            await prisma.jadwals.findMany({
                where: {
                    tanggal:{
                        lt:today
                    }
                },
                skip: ((page - 1) * parseInt(perPage.toString())),
                take: parseInt(perPage.toString()),
                select:{pasien:true,pasienId:true,createdAt:true,waktu:true,tanggal:true,updatedAt:true,}
            }),
            prisma.jadwals.count({
                where: {
                    tanggal:{
                        lt:today
                    }
                },
            })
        ]);

     
        const response : Jadwal = {
            jadwal:yesterdays,
            pages:{
                totalData:count
            }
        }
      
        return res.status(200).json({yesterday:response})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

const fetchDataWithPagination = async (query:any,page:number,pageSize:number) => {
    const offset = (page - 1) * pageSize;
    const result = await query({
        skip: offset,
        take: pageSize,
        include: {
            pasien: true
        }
    });
    return result;
};

export const _editJadwal = async(req:Request,res:Response)=>{
    const idJ = req.params.id
    const {waktu,tanggal} = req.body

    const {error} = _validation_Jadwal({waktu,tanggal})
    if(error) return res.status(404).json(error.details[0].message)
    try {
        const data = await prisma.jadwals.update({
            where:{
                id:idJ
            },
            data:{
                waktu,
                tanggal
            }
        }).catch((err)=>{throw err})
        return res.status(201).json({message:"data berhasil diupdate"})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

export const _deleteJadwal = async(req:Request,res:Response)=>{
    const idJ = req.params.id

     try {
        const data = await prisma.jadwals.delete({
            where:{
                id:idJ
            }
        }).catch((err)=>{throw err})
        return res.status(202).json("data berhasil dihapus")
     } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
     }
}