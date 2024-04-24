import { Stream } from "stream"
import {google} from 'googleapis' 
import { auth } from "../Handler/Uploads"
import fs from 'fs'
export const _uploaders = async(filesObj:any) =>{
    
    const fileData = fs.readFileSync(filesObj.path);
    const bufferS = new Stream.PassThrough()
    bufferS.end(fileData)

    const response = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: filesObj.mimeType,
            body: bufferS,
        },
        requestBody: {
            name: filesObj.originalname,
            parents: ["1FdqmOVuCmobfdwHzjKRH4rirZbPccClV"],
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