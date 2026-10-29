import { describe, it, expect, jest, afterAll } from '@jest/globals';
import request from 'supertest';
import { Server } from '../../src/server';
import { AppRoutes } from '../../src/routes/app.routes';
import { pool } from '../../src/database/connection';
import { AuthService } from '../../src/services/auth.service';

const server = new Server({
    port: 3000,
    routes: AppRoutes.router
});
const app = server.getApp();

describe('Pruebas Automatizadas de Integración - Sprint 2 (API Taquería Gon)', () => {

    afterAll(async () => {
        // Cierra el pool de conexiones al terminar la suite
        try {
            await pool.end();
        } catch {
            // Ignorar si el pool ya estaba cerrado
        }
    });

    describe('1. Endpoint de Salud del Servidor', () => {
        it('GET /api/health -> debe responder 200 con status ok', async () => {
            const res = await request(app).get('/api/health');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                status: 'ok',
                message: 'Servidor Taquería Gon activo'
            });
        });

        it('GET /api/ruta-inexistente -> debe responder 404', async () => {
            const res = await request(app).get('/api/ruta-inexistente');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', 'Ruta no encontrada');
        });
    });

    describe('2. Flujo de Autenticación - Login (Flujos Exitosos y Entradas Inválidas)', () => {
        it('POST /api/v1/auth/login -> debe rechazar si faltan credenciales (400)', async () => {
            const resSinPassword = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'Admin' });

            expect(resSinPassword.status).toBe(400);
            expect(resSinPassword.body).toHaveProperty('error', 'Usuario y contraseña son obligatorios');

            const resVacio = await request(app)
                .post('/api/v1/auth/login')
                .send({});

            expect(resVacio.status).toBe(400);
            expect(resVacio.body).toHaveProperty('error', 'Usuario y contraseña son obligatorios');
        });

        it('POST /api/v1/auth/login -> debe rechazar credenciales incorrectas (401)', async () => {
            // Simulamos que el usuario no existe en la base de datos
            jest.spyOn(pool, 'execute').mockResolvedValueOnce([[], []] as any);

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'UsuarioFalso', password: 'password123' });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Usuario o contraseña incorrectos');
        });

        it('POST /api/v1/auth/login -> debe iniciar sesión con credenciales válidas (200)', async () => {
            const hashPassword = await AuthService.hashPassword('12345');
            
            // Simulamos el retorno de la base de datos para el usuario Admin
            jest.spyOn(pool, 'execute').mockResolvedValueOnce([[
                { usuario: 'Admin', password: hashPassword, rol: 'Administrador' }
            ], []] as any);

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'Admin', password: '12345' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.usuario).toBe('Admin');
            expect(res.body.rol).toBe('Administrador');
            // Verifica que se haya establecido la cookie httpOnly
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('3. Restricciones de Acceso y Verificación de Tokens (Rutas Protegidas)', () => {
        it('GET /api/v1/auth/me -> debe denegar acceso sin token (401)', async () => {
            const res = await request(app).get('/api/v1/auth/me');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Token requerido');
        });

        it('GET /api/v1/auth/me -> debe denegar acceso con token inválido (401)', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer token_invalido_o_manipulado');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
        });

        it('GET /api/v1/auth/me -> debe autorizar el acceso con token válido (200)', async () => {
            const hashPassword = await AuthService.hashPassword('12345');
            jest.spyOn(pool, 'execute').mockResolvedValueOnce([[
                { usuario: 'Admin', password: hashPassword, rol: 'Administrador' }
            ], []] as any);

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'Admin', password: '12345' });

            const token = loginRes.body.token;

            const meRes = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(meRes.status).toBe(200);
            expect(meRes.body).toEqual({
                usuario: 'Admin',
                rol: 'Administrador'
            });
        });
    });

    describe('4. Autorización y Control de Acceso por Roles (RBAC)', () => {
        it('POST /api/v1/auth/register -> debe prohibir registro a un trabajador (403)', async () => {
            const hashPassword = await AuthService.hashPassword('54321');
            jest.spyOn(pool, 'execute').mockResolvedValueOnce([[
                { usuario: 'juan', password: hashPassword, rol: 'trabajador' }
            ], []] as any);

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'juan', password: '54321' });

            const tokenTrabajador = loginRes.body.token;

            const res = await request(app)
                .post('/api/v1/auth/register')
                .set('Authorization', `Bearer ${tokenTrabajador}`)
                .send({
                    usuario: 'nuevo_mesero',
                    password: 'password123',
                    rol: 'trabajador'
                });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error', 'No tienes permiso para esto');
        });

        it('POST /api/v1/auth/register -> Administrador no puede registrar contraseña menor a 4 caracteres (400)', async () => {
            const hashPassword = await AuthService.hashPassword('12345');
            jest.spyOn(pool, 'execute').mockResolvedValueOnce([[
                { usuario: 'Admin', password: hashPassword, rol: 'Administrador' }
            ], []] as any);

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'Admin', password: '12345' });

            const tokenAdmin = loginRes.body.token;

            const res = await request(app)
                .post('/api/v1/auth/register')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usuario: 'pepe',
                    password: '12',
                    rol: 'trabajador'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'La contraseña debe tener al menos 4 caracteres');
        });

        it('POST /api/v1/auth/register -> Administrador registra exitosamente nuevo usuario (201)', async () => {
            const hashPassword = await AuthService.hashPassword('12345');
            jest.spyOn(pool, 'execute')
                .mockResolvedValueOnce([[ { usuario: 'Admin', password: hashPassword, rol: 'Administrador' } ], []] as any)
                .mockResolvedValueOnce([[], []] as any)
                .mockResolvedValueOnce([{ insertId: 3, affectedRows: 1 }, []] as any);

            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({ usuario: 'Admin', password: '12345' });

            const tokenAdmin = loginRes.body.token;

            const res = await request(app)
                .post('/api/v1/auth/register')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    usuario: 'carlos',
                    password: 'password123',
                    rol: 'trabajador'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('mensaje', 'Usuario creado');
            expect(res.body).toHaveProperty('usuario', 'carlos');
            expect(res.body).toHaveProperty('rol', 'trabajador');
        });
    });

    describe('5. Cierre de Sesión (Logout)', () => {
        it('POST /api/v1/auth/logout -> debe responder 200 y limpiar la cookie de sesión', async () => {
            const res = await request(app).post('/api/v1/auth/logout');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ mensaje: 'Sesión cerrada' });
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });
});
