import  express from "express";
import {routerPas} from './Route/Pasien'
import cors = require("cors")
import dotenv from 'dotenv'; 
import bodyParser = require("body-parser");
// import { db } from "./Config/Db";
// import mongoose from "mongoose";
import helmet = require('helmet')
import rateLimit from "express-rate-limit";
import { ErrStatus } from "./HTTPs/Status";





const app = express()
app.use(bodyParser.json())
dotenv.config()
// const ATLAS = process.env.ATLAS


// mongoose.connect(`${ATLAS}`)
// .then((res)=>{
//     console.log("db connected")
// }).catch((err)=>{
//     console.log(err)
// })

app.use(helmet.contentSecurityPolicy({
        directives:{
            "script-src":["'self'","code.jquery.com","cdn.jsdelivr.net"]
        },
    
    })
)
app.disable('x-powered-by')
const Limiter = rateLimit({
    windowMs:1*60*1000,
    max:20
})

app.use(Limiter)
let corsOptions = {
    origin: "*",
    maxAge:8000,
}
app.use(express.static("public")) 
app.all('*',(req,res)=>{
    return res.status(404).json(ErrStatus[0].err404.message).end()
})
app.use(cors(corsOptions))

app.get('/',(req,res)=>{
    res.send("active")
})

app.use('/pasien', routerPas)
const PORT = process.env.PORT || 5000
app.listen(PORT ,()=>{
    console.log(`running at ${PORT}`)
})


module.exports = app;
