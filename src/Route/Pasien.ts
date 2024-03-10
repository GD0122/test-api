
import { Router } from 'express';



export const Pasien = Router()
Pasien.get('/',(req,res)=>{
    res.send("hello")
})

Pasien.get('/oi',(req,res)=>{
    res.send("coba")
})

