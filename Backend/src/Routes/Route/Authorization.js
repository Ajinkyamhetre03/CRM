import express from 'express';
import Auth from '../Controllers/Authorization/Auth.js'

const router = express.Router()

router.post('/login', Auth.login)
router.post('/reset-password', Auth.resetPassword) // New route for password reset

export default router;