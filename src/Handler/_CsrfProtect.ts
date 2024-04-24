import csrf from 'csurf'
import bodyParser from 'body-parser'

export const _csrfProtect = csrf({cookie:{
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000
}})

export const _parse_Form = bodyParser.urlencoded({extended:false})