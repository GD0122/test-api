import  express from "express";
const app = express()

app.get('/',(req,res)=>{
    res.send("active")
})

app.listen(5500,()=>{
    console.log("running")
})