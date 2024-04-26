import {google} from 'googleapis'
import { any, number, string } from 'joi';
import path from 'path'
import { _deleteFilesImg, _uploaders } from '../validation/_uploader';
import { Request, Response, NextFunction } from "express"
import multer from 'multer';
import fs from 'fs'
import { promisify } from 'util';
import mimetype from 'mime-types';
import { Prisma, PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import CryptoJS from 'crypto-js';
import { _validation_Images } from '../validation/_Validation';
import { ErrStatus } from '../HTTPs/Status';
import { ErrStatusDB } from '../HTTPs/Status';



interface ResponseData {
    images: {
      id: string;
      name: string;
      datas: string;
      content_type: string;
      pasienId: string;
    }[];
    nextPage?: number | string;
    totalData?:number; // nextPage bisa berupa nomor halaman atau string 'no'
  }

 


const Salt_img = process.env.SALT_IMG
const prisma = new PrismaClient()

export const _Upload = async(req:Request,res:Response)=>{
        const idP = req?.params?.id 

        const {nama_pas,idPas} = req.body
        const {error} = _validation_Images({idP})
        if(error) return res.status(400).json({message:error.details[0].message})

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
        try {
            const images = req.validImages as Express.Multer.File[]
            const SaveImages = await Promise.all(images.map(async (image) => {
                const imagesFile = fs.readFileSync(image.path);
                
                const savedImage = await prisma.gambar.create({
                  data: {
                    name: image.originalname,
                    // datas: imagesFile,
                    content_type: image.mimetype,
                    pasienId: idP
                  }
                }).catch((err) => {
                  throw new Error(`gagal memasukan ${image} kedalam database`);
                });
                await fs.unlinkSync(image.path)
                return savedImage;
              }));
            
            const validImg = req.validImages as Express.Multer.File[]
            const invalidImg = req.invalidImages as Express.Multer.File[]

            const uploadSuccess = validImg?.map(image=> image.originalname)
            const uploadFail = invalidImg?.map(image=>image.originalname)
          
            if(invalidImg.length === 0){
                return res.status(201).json({message:`berhasil mengupload gambar ${uploadSuccess}`})
            }
            return res.status(201).json({message:`berhasil mengupload gambar ${uploadSuccess} , ${uploadFail?` image yang gagal diupload ${uploadFail}`:""}`})
        } catch (error) {
        
            return res.status(500).json({message:"maaf gagal saat mencoba memasukan gambar"})
        }
    
}

export const _getImage = async(req:Request,res:Response)=>{
        let { page , perPage , idP } : { page?: number | string  , perPage?: number | string, idP: string }= req.body ;
        const {error} = _validation_Images({idP,page,perPage})
        if(error) return res.status(400).json({message:error.details[0].message})

        page = page || 1;
        perPage = perPage || 1;
        try {
            const [images, totalCount] = await Promise.all([
                prisma.gambar.findMany({
                  where:{pasienId:idP},
                  skip: (+page - 1) * +perPage,
                  take: +perPage,
                  orderBy: { createdAt: 'asc' }, // Urutkan berdasarkan tanggal pembuatan secara descending
                }),
                prisma.gambar.count(), // Menghitung jumlah total gambar
              ]);
              const totals = Math.ceil(totalCount / +perPage)
           
              const response:ResponseData = {images,totalData:totals}
              const nextPage = +page < totals ? +page + 1 : "no";

              // if(nextPage !== 'no'){
              //    response.nextPage=nextPage
              // }
       
              res.json(response);
          
        } catch (error) {
          res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data gambar.' });
        
      ;
}
}

export const _deleteImage = async(req:Request,res:Response)=>{
    const idP = req.params.id
    try {
        const data = await prisma.gambar.deleteMany({where:{
            pasienId:idP
        }}).catch((err)=>{
            throw new Error("Maaf gagal mengambil data dari database")
        })
        return res.status(200).json({message:"semua gambar berhasil dihapus"})
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const _uploadersImages = async(req:Request,res:Response)=>{
  
  const {idP} = req.body
  const images = req.validImages as Express.Multer.File[]

  const {error} = _validation_Images({idP})
  if(error) return res.status(400).json({message:error.details[0].message})

  try {
    const SaveImages = await Promise.all(images.map(async (image) => {
     
      
      try {
        const Guploads = await _uploaders(image);
    
        const savedImage = await prisma.gambar.create({
        data: {
          name: image.originalname,
          datas: Guploads['data'].id,
          content_type: image.mimetype,
          pasienId: idP
        }
      }).catch((err) => {
        throw new Error(`gagal memasukan ${image.originalname} kedalam database`);
      });
    } catch (error) {
        console.error('Error uploading image:', error);
        await fs.unlinkSync(image.path)
        throw error
    }
      await fs.unlinkSync(image.path)
     
 }));
  
    const validImg = req.validImages as Express.Multer.File[]
    const invalidImg = req.invalidImages as Express.Multer.File[]
    const uploadSuccess = validImg?.map(image=> image.originalname)
    const uploadFail = invalidImg?.map(image=>image.originalname)
    return res.status(201).json({message:`berhasil mengupload gambar ${uploadSuccess} , ${uploadFail?` image yang gagal diupload ${uploadFail}`:""}`})
  } catch (error) {
    return res.status(500).json({message:"maaf ada sesuatu yang salah"})
  }
}


export const _getImages = async(req:Request,res:Response)=>{
   let { page, perPage,idP} : { page?: number | string, perPage?: number | string, idP?:string } = req.query;
   
    page = page || 1;
    perPage = perPage || 1;
    if(!idP) return res.status(404).json({message:'maaf permintaan tidak dapat diteruskan'})
  
  try {
    const [images, totalCount] = await Promise.all([
      prisma.gambar.findMany({
        where:{pasienId:idP},
        skip: (+page - 1) * +perPage,
        take: +perPage,
        orderBy: { createdAt: 'asc' }, // Urutkan berdasarkan tanggal pembuatan secara descending
      }),
      prisma.gambar.count({where:{pasienId:idP}}), // Menghitung jumlah total gambar
    ]);
    const totals = Math.ceil(totalCount / +perPage)
 
    const response:ResponseData = {images,totalData:totalCount}
    const nextPage = +page < totals ? +page + 1 : "no";

    // if(nextPage !== 'no'){
    //    response.nextPage=nextPage
    // }

    res.json(response,);
  } catch (error) {
    const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
    if(errM.length !== 0){
        return res.status(errM[0]?.status).json(errM[0]?.message).end()
    }
    return res.status(500).json(ErrStatus[0].err500.message)
  }

  
}



export const _deleteFilesImages = async(req:Request,res:Response)=>{
  let {pasienId,imgId,imgGdId} : {pasienId?:string,imgId?:string,imgGdId?:string} = req.query

  if(!pasienId || !imgGdId || !imgId) return res.status(404).json({message:"maaf permintaan anda tidak bisa dilanjutkan"})

  try {
    const [delDb,delGD] = await Promise.all([
     await prisma.gambar.delete({
        where:{
          id:imgId,
          pasienId:pasienId
        }
      }).catch((err)=>{
        throw err
      }),
      await _deleteFilesImg(imgGdId).catch((err)=>{
        throw err
      })
    ])

   
    return res.status(201).json({message:"gambar sukses dihapus"})
  } catch (error) {
    const errM = ErrStatusDB.filter((data)=>data.errCode == error.code)
    if(errM.length !== 0){
        return res.status(errM[0]?.status).json(errM[0]?.message).end()
    }
    return res.status(500).json(ErrStatus[0].err500.message)
  }

}

