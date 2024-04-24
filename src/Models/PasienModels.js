const mongoose = require('mongoose')

const _PasienSchema = new mongoose.Schema({
    id: { 
    type: String,
    required:true,
    unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    noTelp:{
        type: Number,
        required:true,
    },
    alamat:{
        type:String,
        required:true,
    },
    createdAT:{
        type:Date,
        
    }
})
const PasienModel = mongoose.model("Pasien", _PasienSchema);

module.exports = { PasienModel };

