import path from 'path'

export const _File_filters = (req,file,cb)=>{
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true); 
    } else {
      cb(new Error('Hanya file JPG atau PNG yang diizinkan!'), false); // Tolak file dengan ekstensi yang tidak diizinkan
    }
} 