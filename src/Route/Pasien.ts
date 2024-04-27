
import { Router } from 'express';
import {  _addPasien2, 
      _deletePasien, 
      _editPasien,  
      _getPasien,
      _getPasien2,
      _getPasienById,
      _SearchPasien } from '../Handler/Pasien';
import { _csrfProtect, _parse_Form } from '../Handler/_CsrfProtect';
import { _VerifyToken } from '../validation/_Verify_token';
import { _validation_admin } from '../validation/_validation_Admin';
import { PrismaClient } from '@prisma/client';



export const routerPas = Router()

routerPas.post('/addPasien',_parse_Form,_csrfProtect,_VerifyToken,_addPasien2)
routerPas.post('/addPasiens',_VerifyToken,_validation_admin,_addPasien2)
routerPas.get('/pasien',_parse_Form,_csrfProtect,_VerifyToken,_validation_admin,_getPasien)
routerPas.get('/search/:name',_parse_Form,_csrfProtect,_VerifyToken,)
routerPas.put('/edit/:id',_parse_Form,_csrfProtect,_VerifyToken,_editPasien)
routerPas.delete('/delete_pas/:id',_VerifyToken,_deletePasien)
routerPas.get('/search/:names',_parse_Form,_csrfProtect,_VerifyToken,_SearchPasien)
routerPas.get('/detail/:id',_parse_Form,_csrfProtect,_VerifyToken,_getPasienById)

