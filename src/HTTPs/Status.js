export const ErrStatus =[
  {
   err400:{
    ErrCode:400,
    message:"maaf ada sesuatu yang salah",
   },  
   err404:{
    ErrCode:404,
    message:"maaf konten belum tersedia",
   },
   err500:{
    ErrCode:500,
    message:"maaf ada sesuatu yang salah"
   },
   err401:{
    ErrCode:401,
    message:"Akun Tidak Diketahui / UnAuhtorized"
   },
   err403:{
    ErrCode:403,
    message:"maaf permintaan anda tidak bisa dilanjutkan"
   },
   err405:{
    errCode:405,
    message:"maaf sepertinya anda tidak di izinkan untuk melakukan tindakan ini"
   }
  }
]
export const ErrStatusDB = [{
        errCode:'P2002',
        status:400,
        message:'maaf permintaan tidak bisa diteruskan, mungkin username sudah terdaftar, silahkan gunakan username lain'
}
    ,
    {
    
        errCode:'P1001',
        status:500,
        message:"maaf server mengalami gangguan jaringan ke database"
    
},{
    errCode:'P2025',
    status:404,
    message:"maaf username belum terdaftar"
}
]
export const ResStatus=[
    {
        res201:{
            code:201,
            message:"data berhasil ditambahkan"
        },
        res204:{
            code:204,
            message:"maaf tidak bisa meneruskan permintaan anda"
        }
    }
]