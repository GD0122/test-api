import { Request, Response, NextFunction, response } from "express"
import { ErrStatus, ErrStatusDB } from "../HTTPs/Status"
import { PrismaClient} from "@prisma/client"
import * as Jwt from "jsonwebtoken"
import CryptoJS from "crypto-js"


const prisma = new PrismaClient({
    log:["info"]
})
const salt = process.env.SALT
export const _Refresh_token = async(req:Request,res:Response)=>{

    try {
        const ref_tok = req.cookies.refresh_token
        if(!ref_tok)return res.status(401).json(ErrStatus[0].err401.message)
        const user = await prisma.users.findUnique({where:{
        refresh_token:ref_tok
         }}).catch((err)=>{
            throw err
         })
         if(!user) return res.status(404).json({message:"maaf sepertinya anda telah logout silahkan login ulang"})
  
         Jwt.verify(ref_tok,process.env.REFRESH_TOKEN,(err:any
         ,decoded:any)=>{
            if(err) return res.sendStatus(403)
            const id = decoded.id
            const name = decoded.name
            const role = decoded.role
            const accesToken = Jwt.sign({name,id,role},process.env.ACCESS_TOKEN,{
                expiresIn:'60s'
            })
       
            const ac = CryptoJS.AES.encrypt(accesToken,salt).toString()
      
      
          return res.send({ac,csrfToken:req.csrfToken()})
        })
         
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json(errM[0]?.message).end()
        }
        return res.status(500).json(ErrStatus[0].err500.message)
    }
}