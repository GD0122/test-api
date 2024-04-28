import { Router } from "express";
import { _addUsers, _getUsers, _getUsersById, _loginUsers, _usersLogout } from "../Handler/Users";
import { _VerifyToken } from "../validation/_Verify_token";
import { _validation_admin } from "../validation/_validation_Admin";



export const _UserRoute = Router()


_UserRoute.post('/addusers',_addUsers)
_UserRoute.get('/',_VerifyToken,_validation_admin,_getUsers)
_UserRoute.post('/login',_loginUsers)
_UserRoute.delete('/logout',_VerifyToken,_validation_admin,_usersLogout)
_UserRoute.get('/users',_VerifyToken, _getUsersById)