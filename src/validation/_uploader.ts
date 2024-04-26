import { Stream } from "stream"
import {google} from 'googleapis' 
import path from 'path'
import fs from 'fs'
const credentials = require('./credentials')
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes:SCOPES
});

export const _uploaders = async(filesObj:any) =>{
  
    const fileData = fs.readFileSync(filesObj.path);
    const bufferS = new Stream.PassThrough()
    bufferS.end(fileData)
    const GLOGIN = await google.drive({ version: 'v3', auth });
    const response = await GLOGIN.files.create({
        media: {
            mimeType: filesObj.mimeType,
            body: bufferS,
        },
        requestBody: {
            name: filesObj.originalname,
            parents: [process.env.PARENT_FILE],
        },
        fields: "id,name",
    }).catch((err)=>{
        throw err
    })as any;
  
    const data = response.data
    return {data}

}
export const _deleteFilesImg =  async(fileId?:string)=>{
    try {
        await google.drive({version:"v3",auth}).files.delete({fileId})
        return {message:`file ${fileId} berhasil dihapus`}
    } catch (error) {
        console.log('terjadi kesalahan saat menghapus file',error)
        throw error
    }
}