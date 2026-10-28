import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpError } from '../errors/http.error';
import { COOKIE_NAME, cookieOptions } from '../middlewares/auth.middleware';
import { ROLES, Rol } from '../models/usuario';

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        const { usuario, password } = req.body || {};

        if (!usuario || !password) {
            res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
            return;
        }

        try {
            const data = await AuthService.login(String(usuario).trim(), String(password));
            // La cookie permite que el servidor proteja las páginas; dura lo mismo que el token
            res.cookie(COOKIE_NAME, data.token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });
            res.status(200).json(data);
        } catch (err) {
            AuthController.handleError(err, res, 'login');
        }
    }

    // Crea un usuario nuevo (solo Administrador)
    static async register(req: Request, res: Response): Promise<void> {
        const { usuario, password, rol } = req.body || {};

        if (!usuario || !password || !rol) {
            res.status(400).json({ error: 'Usuario, contraseña y rol son obligatorios' });
            return;
        }
        if (!ROLES.includes(rol)) {
            res.status(400).json({ error: 'El rol debe ser Administrador o trabajador' });
            return;
        }
        if (String(password).length < 4) {
            res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
            return;
        }

        try {
            const data = await AuthService.register(String(usuario).trim(), String(password), rol as Rol);
            res.status(201).json({ mensaje: 'Usuario creado', ...data });
        } catch (err) {
            AuthController.handleError(err, res, 'register');
        }
    }

    // Cierra la sesión: borra la cookie
    static logout(_req: Request, res: Response): void {
        res.clearCookie(COOKIE_NAME, cookieOptions);
        res.status(200).json({ mensaje: 'Sesión cerrada' });
    }

    // Regresa los datos del usuario del token (ruta protegida)
    static me(req: Request, res: Response): void {
        res.status(200).json({ usuario: req.user?.usuario, rol: req.user?.rol });
    }

    private static handleError(err: unknown, res: Response, accion: string): void {
        if (err instanceof HttpError) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        console.error(`[Auth] Error en ${accion}:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

