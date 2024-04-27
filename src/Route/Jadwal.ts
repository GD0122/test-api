import { Router } from "express";
import { GetJadwalToday, GetJadwalTomorrow, GetJadwalYesterday, _addJadwal, _deleteJadwal, _editJadwal, _getJadwal } from "../Handler/Jadwal";
import { _csrfProtect } from "../Handler/_CsrfProtect";
import { _parse_Form } from "../Handler/_CsrfProtect";
import { _validation_admin } from "../validation/_validation_Admin";
import { _VerifyToken } from "../validation/_Verify_token";



export const _Jadwal_route = Router()

_Jadwal_route.get('/all',_VerifyToken,_validation_admin,_getJadwal)
_Jadwal_route.post('/tambah_jadwal/:id',_VerifyToken,_validation_admin,_addJadwal)
_Jadwal_route.put('/edit/:id',_VerifyToken,_validation_admin,_editJadwal)
_Jadwal_route.delete('/delete/:id',_VerifyToken,_validation_admin,_deleteJadwal)
_Jadwal_route.post('/tambah/:id',_VerifyToken,_validation_admin,_addJadwal)
_Jadwal_route.get('/todays',_VerifyToken,_validation_admin,GetJadwalToday)
_Jadwal_route.get('/tomorrows',_VerifyToken,_validation_admin,GetJadwalTomorrow)
_Jadwal_route.get('/yesterdays',_VerifyToken,_validation_admin,GetJadwalYesterday)

