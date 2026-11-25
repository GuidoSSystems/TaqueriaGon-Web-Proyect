export type EstadoMesa = 'Libre' | 'Esperando' | 'Atendida';

export const ESTADOS_MESA: EstadoMesa[] = ['Libre', 'Esperando', 'Atendida'];

export interface Mesa {
    idMesa: number;
    numero_mesa: number;
    estado: EstadoMesa;
}
