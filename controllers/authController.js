import { User } from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, birthDate, rol, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('auth/signup', { error: 'Las contraseñas no coinciden' });
        }
        await User.create(
            {
                firstName,
                lastName,
                email,
                birthDate,
                rol,
                password
            }
        );
        res.redirect('/auth/login')
    } catch (error) {
        console.error('Error al registrar', error);
        res.render('auth/signup', { error: 'Error al crear cuenta' });
    }
};