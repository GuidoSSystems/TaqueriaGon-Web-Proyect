import { NextFunction, Request, Response } from 'express';
import { getSession } from './auth.middleware';
import { PAGE_ROLES } from '../config/permissions';

// Protege las páginas HTML EN EL SERVIDOR: si no tienes permiso, ni siquiera se envía el archivo.
export function pageGuard(req: Request, res: Response, next: NextFunction): void {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api')) return next();

    // Archivos con otra extensión (css, js, imágenes) pasan directo
    const ext = req.path.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
    if (ext && ext !== 'html') return next();

    // "/inventario", "/inventario/" e "/inventario.html" son la misma página
    let name = req.path.toLowerCase().replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
    if (name === '') name = 'index';

    const session = getSession(req);

    if (name === 'login') {
        // Con sesión válida no tiene caso ver el login
        if (session) return res.redirect('/pos.html');
        res.set('Cache-Control', 'no-store');
        return next();
    }

    const allowed = PAGE_ROLES[name];
    if (!allowed) return next(); // página que no existe: la atrapa el 404 final

    // Para que el botón "atrás" no muestre páginas guardadas después de cerrar sesión
    res.set('Cache-Control', 'no-store');

    if (!session) return res.redirect('/login.html');
    if (!allowed.includes(session.rol)) return res.redirect('/pos.html');

    next();
}

