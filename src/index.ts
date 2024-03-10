import  express from "express";
import {Pasien} from './Route/Pasien'
import { string } from "joi";
import cors = require("cors")


const app = express()
let corsOptions = {
    origin: "*",
    maxAge:8000
}
app.use(cors(corsOptions))

app.get('/',(req,res)=>{
    res.send("active")
})
app.use('/test', Pasien)
app.listen(5500,()=>{
    console.log("running")
})