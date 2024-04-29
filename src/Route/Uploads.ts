

import * as express from 'express'
import multer ,{MulterError} from 'multer'
import { _deleteFilesImages, _deleteImage, _getImage, _getImages, _Upload, _uploadersImages } from '../Handler/Uploads'
import  path  from 'path'
import fs from 'fs'
const rimraf = require('rimraf')
import { _File_filters } from '../validation/_file_fileters'
import { _IsImage } from '../validation/_IsImage'
import {Request,Response} from 'express'
import { _validation_admin } from '../validation/_validation_Admin'
import { _VerifyToken } from '../validation/_Verify_token'
import { _csrfProtect, _parse_Form } from '../Handler/_CsrfProtect'


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads');
//     },
//     filename: function (req, file, cb) {
//       cb(null,(Date.now()+file.originalname.replace(/\s/g, '').replace(/\.(jpg|png)$/i, '')) + path.extname(file.originalname));
//     },
//   });
  
const storage = multer.memoryStorage()
const uploads = multer({storage})
export const _UploadsRoute = express.Router()

// _UploadsRoute.post('/upload/:id',uploads.array('images',5),_VerifyToken,_validation_admin,_IsImage, _Upload)
_UploadsRoute.post('/uploads/',uploads.array('images',5),_VerifyToken,_validation_admin,_IsImage,_uploadersImages)
_UploadsRoute.delete('/delete/:id',_deleteImage)
_UploadsRoute.get('/gambar',_VerifyToken,_getImage)
_UploadsRoute.get('/gambars',_getImages)
_UploadsRoute.get('/gambarss',_VerifyToken,_validation_admin,_getImages)
_UploadsRoute.delete('/gambar/delete',_VerifyToken,_validation_admin, _deleteFilesImages)




// _UploadsRoute.use(async(err:Error, req:Request, res:Response, next:express.NextFunction) => {

//   if (err instanceof MulterError) {
//     // A Multer error occurred when uploading
//     if (err.code === 'LIMIT_FILE_SIZE') {
      
//       return res.status(404).json({ message: 'File terlalu besar. Batas maksimum adalah 5MB.' });
//     }
//   }

//   // Other errors
//   res.status(500).json({ message: 'Terjadi kesalahan saat memproses file.' });
// });


