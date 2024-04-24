import { Router } from "express";
import { _Refresh_token } from "../Handler/_Refresh_token";
import { _csrfProtect, _parse_Form } from "../Handler/_CsrfProtect";


export const TokenRoutes = Router()

TokenRoutes.get('/refresh',_parse_Form,_csrfProtect,_Refresh_token)