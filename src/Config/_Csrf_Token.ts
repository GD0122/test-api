import { Request,Response,NextFunction } from "express"
import csurf = require("csurf");
import { generateSalt } from "./GenerateSalt";
import {CreateToken} from './CreateToken'
import { ErrStatus } from "../HTTPs/Status"




export const _Csrf_Token_Sec = (req:Request,res:Response,next:NextFunction)=>{
        
        return next()
        // return res.status(500).json(ErrStatus[0].err500.message)
}

exports.module = _Csrf_Token_Sec

