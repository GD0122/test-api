import  express from "express";
import {routerPas} from './Route/Pasien'
import cors = require("cors")
import dotenv from 'dotenv'; 
import bodyParser = require("body-parser");
import { db } from "./Config/Db";
import mongoose from "mongoose";






const app = express()
app.use(bodyParser.json())
dotenv.config()
const ATLAS = process.env.ATLAS


// mongoose.connect(`${ATLAS}`)
// .then((res)=>{
//     console.log("db connected")
// }).catch((err)=>{
//     console.log(err)
// })
let corsOptions = {
    origin: "*",
    maxAge:8000,
}

app.use(cors(corsOptions))

app.get('/',(req,res)=>{
    res.send("active")
})
app.use('/pasien', routerPas)
const PORT = process.env.PORT || 5000
app.listen(PORT ,()=>{
    console.log(`running at ${PORT}`)
})