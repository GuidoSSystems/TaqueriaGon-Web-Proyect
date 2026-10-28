export type Rol = 'Administrador' | 'trabajador';

export const ROLES: Rol[] = ['Administrador', 'trabajador'];

// Fila de la tabla `usuarios`
export interface Usuario {
    usuario: string;
    password: string;
    rol: Rol;
}

// Datos que viajan dentro del JWT
export interface TokenPayload {
    usuario: string;
    rol: Rol;
}

// Respuesta del login
export interface LoginResponse {
    token: string;
    usuario: string;
    rol: Rol;
}

