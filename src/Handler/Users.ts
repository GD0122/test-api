import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import { ErrStatus, ErrStatusDB, ResStatus } from "../HTTPs/Status"
import { _validation_users } from "../validation/_Validation"
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import { _hashData } from "../validation/_hash_data"
const salt = process.env.SALT
import cryptoJS from "crypto-js"
const prisma = new PrismaClient({
    log:["info","query","warn"],

})
export const _addUsers = async(req:Request,res:Response)=>{
       const {username,password,role} = req.body
       
       const {error} = _validation_users({username,password})
       if(error) return res.status(400).json({message:error.details[0].message})

      const salt = await bcrypt.genSalt()
      const hashPass = await bcrypt.hash(password,salt)
     
    
       try {
        const users = await prisma.users.create({
            data:{
                username,
                password:hashPass,
                role
            }
           }).catch((err)=>{
             throw err
           })
        return res.status(201).json({message:"Account added"})
       } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)

        if(errM.length !== 0){
            return res.status(errM[0]?.status).json({message:errM[0]?.message}).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message}).end()
    }
     
       
}

export const _getUsers = async(req:Request,res:Response)=>{
    try {
        const data = await prisma.users.findMany({select:{username:true}})
        return res.status(200).json(data)
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)

        if(errM.length !== 0){
            return res.status(errM[0]?.status).json({message:errM[0]?.message}).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message}).end()
    }
}


export const _loginUsers = async(req:Request,res:Response)=>{
    const {username,password} = req.body
  
    const {error} = _validation_users({username,password})
    if(error) return res.status(400).json({message:error.details[0].message})
    

    try {
       
        const _user = await prisma.users.findUniqueOrThrow({where:{username}})
        .catch((err)=>{throw err})
        const checkVal = await bcrypt.compare(password,_user.password)
        
        if(!checkVal)return res.status(403).json({message:"Pasword Salah"})
        const name = _user.username
        const id = _user.id
        const role = _user.role
     
      
    
        const access_token = Jwt.sign({name,id},process.env.ACCESS_TOKEN,{
            expiresIn:'20s'
        })
        const refresh_token = Jwt.sign({name,id,role},process.env.REFRESH_TOKEN,{
            expiresIn:'1d'
        })
      await prisma.users.update({
        where:
          {
            id:id,
         },
        data:{
            refresh_token,
        }
      }).catch((err)=>{
        throw err
      })
      const acc = cryptoJS.AES.encrypt(access_token,salt).toString()
     
        res.cookie('refresh_token',refresh_token,{
        httpOnly:true,
        maxAge: 24*60*60*1000,
        secure:true, //only https
    })
 
    res.status(200).json({message:"Login Berhasil",ac:acc}) 
        
    } catch (error) {

        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)

        if(errM.length !== 0){
            return res.status(errM[0]?.status).json({message:errM[0]?.message}).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message}).end()
        
    }


}

export const _usersLogout = async(req:Request,res:Response)=>{

     const idU = req.id
    try {
        
        
        const user = await prisma.users.update({where:{
            id:idU
        },
        data:{
            refresh_token:null
        }
        }).catch((err)=>{
            throw err
        })
        res.clearCookie('_csrf')
        res.clearCookie('refresh_token')
        return res.status(201).json({message:"Berhasil Logout"})
       
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json({message:errM[0]?.message}).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message}).end()
    }
}

export const _getUsersById = async(req:Request,res:Response)=>{
    
    const idU = req.id
    try {
        const users = await prisma.users.findUnique({
            where:{
                id:idU
            },select:{id:true,username:true,}
        }).catch((err)=>{
            throw err
        })

        return res.status(200).json({user:users})
    } catch (error) {
        const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
        if(errM.length !== 0){
            return res.status(errM[0]?.status).json({message:errM[0]?.message}).end()
        }
        return res.status(500).json({message:ErrStatus[0].err500.message}).end()
    }
}
