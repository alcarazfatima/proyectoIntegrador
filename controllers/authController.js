import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, birthDate, username, rol, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('auth/signup', { error: 'Las contraseñas no coinciden' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create(
            {
                firstName,
                lastName,
                email,
                birthDate,
                rol,
                password: hashedPassword,
                username
            }
        );
        res.redirect('/auth/login')
    } catch (error) {
        console.error('Error al registrar', error);
        res.render('auth/signup', { error: 'Error al crear cuenta' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busco el usuario por su correo
        const usuarioEncontrado = await User.findOne({ where: { email } });

        // Verifico si existe 
        if (usuarioEncontrado) {
            const match = await bcrypt.compare(password, usuarioEncontrado.password);
            if (match) {
                // Se crea la session para recordar quién es en toda la app
                req.session.user = {
                    id: usuarioEncontrado.id,
                    username: `${usuarioEncontrado.username}`,
                    email: usuarioEncontrado.email,
                    rol: usuarioEncontrado.rol
                };

                // redirijo al home 
                return res.redirect('/home');
            } else {
                return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
            }
        } else {
            // Si falla, volvemos a mostrar el login avisando el error
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.render('auth/login', { error: 'Error interno en el servidor' });
    }
};


export const loginAnónimo = (req, res) => {

    req.session.user = null;

    // Redirigir a la ruta 
    res.redirect('/home');
};