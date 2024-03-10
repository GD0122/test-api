
import { Router } from 'express';
import {  _addPasien2,  _getPasien2 } from '../Handler/Pasien';



export const routerPas = Router()
// Pasien.post('/tambah_pasien',_addPasien)

// Pasien.get('/',_getPasien)
routerPas.post('/addPasien',_addPasien2)
routerPas.get('/',_getPasien2)
