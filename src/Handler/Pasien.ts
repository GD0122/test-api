import { PasienModel } from "../Models/PasienModels"
import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import { ErrStatus } from "../HTTPs/Status"
import { ResStatus } from "../HTTPs/Status"
const prisma = new PrismaClient()



export const _addPasien2 = async(req:Request,res:Response)=>{
    const newP = req.body

    try {
        const add = await  prisma.pasien.create({
            data:newP
        })
        return res.status(201).json(ResStatus[0].res201.message)
    } catch (error) {
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}
export const _getPasien2 = async(req:Request,res:Response)=>{
    try {
        const data = await prisma.pasien.findMany({select:{name:true,alamat:true,}})
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json(ErrStatus[0].err500.message)
    }
    
}

