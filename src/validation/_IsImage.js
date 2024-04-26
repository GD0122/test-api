import sharp from "sharp";
import fs from 'fs'
import { promisify } from "util";
import { _uploaders } from "./_uploader";
export const _IsImage = async(req,res,next)=>{
    const images = req.files ;
 
    // if(req?.files?.size > 5 * 1024 *1024) return res.status(404).json({message:"maaf size max hanya 5mb"})
    let  maxSizeImg = 5 * 1024 * 1024
    const validImages = [];
    const invalidImages = [];
 
    try {
      
      const _ViewImage = await Promise.all(images?.map(async (image) => {
      
        const isValid = await isImage(image.path)
    
    if (!isValid || image.size > maxSizeImg) {
        invalidImages.push(image);
        try {
          await fs.unlinkSync(image.path);
       
        } catch (error) {
          console.error('Error deleting invalid image:', error);
        }
      } else {
        validImages.push(image);
        
      }
      }))
      if(validImages.length === 0) return res.status(404).json({message:'maaf tidak dapat memproses gambar'})
      req.validImages = validImages
      req.invalidImages = invalidImages
     
      next()
    
    } catch (error) {
        console.log("Terjadi kesalahan:", error);
        res.status(500).send("Terjadi kesalahan saat memproses gambar.");
    }

}

const isImage = async (filepath) => {
    try {
       await sharp(filepath).metadata()
    
        return true; // File dapat dibuka, kemungkinan besar adalah gambar
    } catch (error) {
        return false; // File tidak dapat dibuka, bukan gambar
    }
};