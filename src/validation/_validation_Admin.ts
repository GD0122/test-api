import { Request, Response, NextFunction, response } from "express"
import { ErrStatus, ErrStatusDB } from "../HTTPs/Status"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log:["error","info"]
})

export const _validation_admin = async(req:Request,res:Response,next:NextFunction)=>{
    const role = req.role
    const idUs = req.id

    if(role !== "ADMIN") return res.status(405).json(ErrStatus[0].err405.message)
    try {
        const user = await prisma.users.findUnique({where:{
            id:idUs
        }}).catch((err)=>{throw err})
        if(user.role !== "ADMIN") return res.status(405).json(ErrStatus[0].err405.message)
     
        next()
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }   
}