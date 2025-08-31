import express from 'express';
import Auth from '../Controllers/Authorization/Auth.js'

const router = express.Router()


router.post('/login', Auth.login)

export default router;