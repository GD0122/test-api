import cryptoJs from 'crypto-js'



export async function CreateToken (salt,secret){
    return  cryptoJs.AES.encrypt(
        JSON.stringify(secret),
        salt
     ).toString();
}

exports.module = CreateToken