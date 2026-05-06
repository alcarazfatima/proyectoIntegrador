import { Router } from "express"

const auth = Router()
auth.get('/login', (req, res) => {
    res.render('auth/login')
})

auth.get('/signup', (req, res) => {
    res.render('auth/signup')
})
auth.get('/anonimous', (req, res) => {
    res.render('auth/anonimous')
})
export default auth;