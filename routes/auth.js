import { Router } from "express";
import { registerUser, loginAnónimo, loginUser } from '../controllers/authController.js';

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
auth.post('/login', loginUser);
auth.get('/auth/anonimo', loginAnónimo);

auth.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Al destruir la sesión, vuelve al index 
    });
});

export default auth;