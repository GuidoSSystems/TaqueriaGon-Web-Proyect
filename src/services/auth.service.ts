import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { pool } from '../database/connection';
import { config } from '../config/envs';
import { HttpError } from '../errors/http.error';
import { LoginResponse, Rol, Usuario } from '../models/usuario';

type UsuarioRow = Usuario & RowDataPacket;

export class AuthService {
    // Genera el hash de una contraseña (se usa para crear usuarios nuevos)
    static hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, 10);
    }

    // Crea un usuario nuevo con la contraseña ya hasheada
    static async register(usuario: string, password: string, rol: Rol): Promise<{ usuario: string; rol: Rol }> {
        const [existe] = await pool.execute<UsuarioRow[]>(
            'SELECT usuario FROM usuarios WHERE usuario = ?',
            [usuario]
        );
        if (existe.length > 0) {
            throw new HttpError(409, 'Ese usuario ya existe');
        }

        const hash = await AuthService.hashPassword(password);
        await pool.execute(
            'INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)',
            [usuario, hash, rol]
        );
        return { usuario, rol };
    }

    // Valida usuario/contraseña y regresa { token, usuario, rol }
    static async login(usuario: string, password: string): Promise<LoginResponse> {
        const [rows] = await pool.execute<UsuarioRow[]>(
            'SELECT usuario, password, rol FROM usuarios WHERE usuario = ?',
            [usuario]
        );
        const user = rows[0];

        // Mismo error para usuario inexistente o contraseña mala (no dar pistas)
        const valid = user && await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new HttpError(401, 'Usuario o contraseña incorrectos');
        }

        const token = jwt.sign(
            { usuario: user.usuario, rol: user.rol },
            config.jwtSecret,
            { expiresIn: '8h' }
        );
        return { token, usuario: user.usuario, rol: user.rol };
    }
}

