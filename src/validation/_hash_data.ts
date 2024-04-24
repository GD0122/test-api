import cryptoJs from 'crypto-js'
const salt = process.env.SALT
export const _hashData = async(data:string)=>{
   const text = cryptoJs.AES.encrypt(
        data,salt
    ).toString()

   return text
}