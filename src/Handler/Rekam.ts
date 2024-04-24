import { PrismaClient } from "@prisma/client";
import { Request,Response,NextFunction } from "express";
import { ErrStatus, ErrStatusDB } from "../HTTPs/Status";
import { _validation_Rekam } from "../validation/_Validation";

const prisma = new PrismaClient({
    log:['query','warn','error']
})

interface ResponseRekam {
    rekam:{
        tindakan:string
        diagnosa:string
        terapi:string
        dokter:string
        perawat:string
    }[]
    pages:{
        totalData?:number
        nextPage?:number
    }
    }
   

export const _getRekam = async(req:Request,res:Response)=>{
  

    try {
        const pas = await prisma.rekam.findMany({})
        return res.status(200).json({rekam:pas})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

export const _addRekam = async(req:Request,res:Response)=>{
    const idP = req.params.id
    const {tindakan,diagnosa,terapi,dokter,perawat} = req.body
    
    const {error} = _validation_Rekam({tindakan,diagnosa,terapi,dokter,perawat})
    if(error) return res.status(404).json({message:error.details[0].message})

    try {
       
        const rekam = await prisma.rekam.create({
            data:{
              tindakan,
              diagnosa,
              terapi,
              dokter,
              perawat,
              pasienId:idP
            },
         
        }).catch((err)=>{
            throw err
        })
        return res.status(201).json({message:"data berhasil ditambahkan"})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}
export const _deleteRekam = async(req:Request,res:Response)=>{
    const idR = req.params.id
   

    try {

     
        const d = await prisma.rekam.delete({
            where:{
                id:idR
            }
        }).catch((err)=>{
            throw err
        })
        return res.status(201).json({message:"data berhasil dihapus"})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}
export const _editRekam = async(req:Request,res:Response)=>{
    const {tindakan,diagnosa,terapi,dokter,perawat} = req.body
    const idR = req.params.id
   
    const {error} = _validation_Rekam({tindakan,diagnosa,terapi,dokter,perawat})
    if(error) return res.status(404).json({message:error.details[0].message})
    
    try {
        
        const pasien = await prisma.rekam.update({
            where:{
                id:idR
            },
            data:{
               tindakan,
               diagnosa,
               terapi
            }
        }).catch((err)=>{throw err})
    return res.status(201).json({message:"data berhasil diperbarui"})
        
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }

    

}
export const _getRekamById = async(req:Request,res:Response)=>{
    let {page,perPage} : {page?:number ,perPage?:number  } = req.query
    const {id} : {id?:string} = req.params
    console.log(id)
    page  =  page || 1 ;
    perPage= perPage || 5;

    try {
        const [rekam,count] = await Promise.all([
            prisma.rekam.findMany({
              where:{pasienId:id},
              skip: (+page - 1) * +perPage,
              take: +perPage,
              orderBy: { createdAt: 'desc' }, 
            }),
            prisma.rekam.count({where:{pasienId:id}}),
        ]);
        const response : ResponseRekam = {
            rekam:rekam,
            pages:{
                totalData:count
            }
        }
        return res.status(200).json(response)
    }catch(error){
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}

