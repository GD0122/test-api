import {Request, Response, NextFunction, request } from "express"
import {IncomingHttpHeaders} from 'http';
import Jwt from 'jsonwebtoken'


declare module 'express'{
    interface Request{
        headers?:IncomingHttpHeaders
        name?:string
        id?:string
        role?:string
        files?:any
        validImages?:any
        invalidImages?:any,
       
    }
}

export const _VerifyToken = async(req:Request,res:Response,next:NextFunction)=>{
    const authH = req.headers['authorization']
    const token = authH && authH.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    Jwt.verify(token, process.env.ACCESS_TOKEN,(err:any,decoded:any)=>{
        if(err) return res.sendStatus(403)
        req.id = decoded.id
        req.role = decoded.role
        next()
    })
}