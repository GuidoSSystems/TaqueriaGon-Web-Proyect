import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/envs';
import { Rol, TokenPayload } from '../models/usuario';

export const COOKIE_NAME = 'token';

// Opciones de la cookie de sesión (no se puede leer desde JavaScript del navegador)
export const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

function readCookie(req: Request, name: string): string | null {
    const raw = req.headers.cookie || '';
    for (const part of raw.split(';')) {
        const [key, ...value] = part.trim().split('=');
        if (key === name) return decodeURIComponent(value.join('='));
    }
    return null;
}

function decode(token: string | null): TokenPayload | null {
    if (!token) return null;
    try {
        return jwt.verify(token, config.jwtSecret) as TokenPayload;
    } catch {
        return null;
    }
}

// Sesión por cookie (para proteger las páginas)
export function getSession(req: Request): TokenPayload | null {
    return decode(readCookie(req, COOKIE_NAME));
}

// Verifica el header "Authorization: Bearer <token>" (para la API)
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }

    const payload = decode(token);
    if (!payload) {
        res.status(401).json({ error: 'Token inválido o expirado' });
        return;
    }

    req.user = payload;
    next();
}

// Uso: router.get('/x', verifyToken, requireRole('Administrador'), handler)
export function requireRole(...roles: Rol[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.rol)) {
            res.status(403).json({ error: 'No tienes permiso para esto' });
            return;
        }
        next();
    };
}
