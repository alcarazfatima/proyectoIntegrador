import { Router } from "express";
import { registerUser } from '../controllers/authController.js';

const auth = Router()
auth.get('/login', (req, res) => {
    res.render('auth/login')
})

auth.get('/signup', (req, res) => {
    res.render('auth/signup')
})
auth.get('/anonimous', (req, res) => {
    res.redirect('home')
})
auth.post('/signup', registerUser);
export default auth;