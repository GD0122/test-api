import { Router } from "express";
import { _addRekam, _deleteRekam, _editRekam, _getRekam, _getRekamById } from "../Handler/Rekam";
import { _csrfProtect } from "../Handler/_CsrfProtect";
import { _parse_Form } from "../Handler/_CsrfProtect";
import { _validation_admin } from "../validation/_validation_Admin";
import { _VerifyToken } from "../validation/_Verify_token";


export const _Rekam_Routes = Router()

_Rekam_Routes.get('/',_parse_Form,_csrfProtect,_VerifyToken,_validation_admin,_getRekam)
_Rekam_Routes.post('/tambah_rekam/:id',_parse_Form,_csrfProtect,_VerifyToken,_validation_admin,_addRekam)
_Rekam_Routes.put('/edit/:id',_parse_Form,_csrfProtect,_VerifyToken,_validation_admin,_editRekam)
_Rekam_Routes.delete('/delete/:id',_VerifyToken,_validation_admin,_deleteRekam)
_Rekam_Routes.post('/tambah/:idP',_addRekam)
_Rekam_Routes.get('/:id',_VerifyToken,_getRekamById)

