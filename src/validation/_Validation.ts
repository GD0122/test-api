import Joi from "joi"



export const _validation_users = (data:Object) =>{
    
    const schema = Joi.object({
        username:Joi.string().min(6).max(30).required(),
        password:Joi.string().min(8).max(100).required(),
    })
 
    return schema.validate(data)
   
}

export const _validation_pasien = (data:Object)=>{
   
    const schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        alamat:Joi.string().min(3).max(100).required(),
        noTelp:Joi.string().min(10).max(13).required(),
        tanggalLahir: Joi.date().iso().optional()
    })

    return schema.validate(data)
}

export const _validation_Rekam = (data:Object)=>{
    const schema = Joi.object({
        tindakan:Joi.string().min(2).max(1000).required(),
        dokter:Joi.string().min(2).max(1000).required(),
        perawat:Joi.string().min(2).max(1000).required(),
        diagnosa:Joi.string().min(2).max(1000).required(),
        terapi:Joi.string().min(2).max(1000).required()
    })

    return schema.validate(data)
}

export const _validation_Jadwal = (data:Object)=>{
    const schema = Joi.object({
        waktu:Joi.string().min(2).max(10).required(),
        tanggal:Joi.date().required()
    })

    return schema.validate(data)
}

export const _validation_Images = (data:Object)=>{
    const schema = Joi.object({
        page:Joi.number().min(1).optional(),
        perPage:Joi.number().min(1).optional(),
        idP:Joi.string().min(2).max(1000).required(),
      
    })

    return schema.validate(data)
}