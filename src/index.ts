import  express, { Request, Response } from 'express';
import {routerPas} from './Route/Pasien'
import cors = require("cors")
import dotenv from 'dotenv'; 
import bodyParser = require("body-parser");
// import { db } from "./Config/Db";
// import mongoose from "mongoose";
import helmet = require('helmet')
import rateLimit from "express-rate-limit";
import { ErrStatus } from "./HTTPs/Status";
import csrf = require("csurf");
import cookieParser = require("cookie-parser");
import {_Csrf_Token_Sec} from "./Config/_Csrf_Token";
import { _UserRoute } from "./Route/Users";
import { TokenRoutes } from "./Route/Tokens";
import { _csrfProtect } from "./Handler/_CsrfProtect";
import { _Rekam_Routes } from "./Route/Rekam";
import { _Jadwal_route } from "./Route/Jadwal";
import { _UploadsRoute } from "./Route/Uploads";
import fs from 'fs'
const morgan = require("morgan");
import  path  from 'path'




const app = express()
app.use(cookieParser())
app.use(bodyParser.json())

app.use(helmet.contentSecurityPolicy({
        directives:{
            "script-src":["'self'","code.jquery.com","cdn.jsdelivr.net"]
        },
    
    })
)
app.use(helmet.xFrameOptions({action:'deny'}))
const parseForm = bodyParser.urlencoded({extended:false})
app.disable('x-powered-by')



const Limiter = rateLimit({
    windowMs:1*60*1000,
    max:50
})

app.use(Limiter)
const ori = process.env.PROD_SERV || 'http://localhost:3000'

app.use(cors({
    origin:ori,
    credentials:true,
}))
app.get('/send-cookie', (req: Request, res: Response) => {
    res.cookie('test', 'hello',{
        maxAge: 24 * 60 * 1000,
        sameSite:'none',
        secure:true,
        httpOnly:true
    });
    res.status(200).json({ message: 'Cookie berhasil dikirim', cookie: 'test' });
  });
  
  // Endpoint untuk memeriksa cookie
  app.get('/check-cookie', (req: Request, res: Response) => {
    // Mengecek apakah ada cookie yang dikirimkan dalam permintaan
    if (req.cookies && req.cookies.test || req.cookies.tester) {
      const cookieValue = req.cookies.test || req.cookies.tester;
      res.status(200).json({ success: true, cookieValue });
    } else {
      res.status(400).json({ success: false, message: 'Cookie tidak ditemukan.' });
    }
  });

app.get('/test',_csrfProtect,(req,res)=>{
    res.send({message:"test",csrfToken:req.csrfToken()})
})

app.post('/post',parseForm,_csrfProtect,(req,res)=>{
    res.send('data proccess')
})
app.post('/tester',(req,res)=>{
    const {test} = req.body
    return res.cookie('tester','login',{
        maxAge: 24 * 60 * 60 * 1000,
        sameSite:'none',
        secure:true,
        httpOnly:true
    }).status(200).json({message:"halo"})
})
app.get('/',(req,res)=>{
    
    return res.status(200).json({message:"oke"})
     
})
// logger

// Custom token untuk mendapatkan req body
morgan.token('params', (req: Request, res: Response) => JSON.stringify(req.params));

// Custom token untuk mendapatkan nilai dari req.body
morgan.token('body', (req: Request, res: Response) => JSON.stringify(req.body));

// Custom token untuk mendapatkan nilai dari req.query
morgan.token('query', (req: Request, res: Response) => JSON.stringify(req.query));

const accessLogStream = fs.createWriteStream('./Logger/access.log', { flags: 'a' });
app.use(morgan((tokens:any, req: Request, res: Response) => {
    const currentDate = new Date().toISOString();
    return [
      `[${currentDate}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      JSON.stringify(req.params),
      JSON.stringify(req.body),
      JSON.stringify(req.query),
      tokens['response-time'](req, res), 'ms',
      '-',
      tokens['remote-addr'](req, res),
      tokens['user-agent'](req, res),
    ].join(' ');
  }, { stream: accessLogStream, skip: (req: Request, res: Response) => req.method === 'GET' }));
  
  // Routes

app.use('/files',_UploadsRoute)
app.use('/jadwal',_Jadwal_route)
app.use('/rekam',_Rekam_Routes)
app.use('/token',TokenRoutes)
app.use('/account', _UserRoute)
app.use('/pasien', routerPas)

const PORT = process.env.PORT || 5000
app.listen(PORT ,()=>{
    console.log(`running at ${PORT}`)
})
app.use('/*',(req,res)=>{
    return res.status(404).json(ErrStatus[0].err404.message).end()
})

module.exports = app;
