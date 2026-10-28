import { Rol } from '../models/usuario';

const TODOS: Rol[] = ['Administrador', 'trabajador'];
const SOLO_ADMIN: Rol[] = ['Administrador'];

// Qué roles pueden abrir cada página (nombre sin .html)
export const PAGE_ROLES: Record<string, Rol[]> = {
    index: TODOS,
    pos: TODOS,
    mesas: TODOS,
    cocina: TODOS,
    inventario: SOLO_ADMIN,
    corte: SOLO_ADMIN,
    finanzas: SOLO_ADMIN
};

