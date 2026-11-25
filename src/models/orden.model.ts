export type TipoServicio = 'Comedor' | 'ParaLlevar';
export type EstadoOrden = 'Pendiente' | 'Servido' | 'Pagado' | 'Cancelado';
export type EstadoPersona = 'Pendiente' | 'Completado';
export type EstadoPedidoItem = 'Pendiente' | 'Terminado';

export interface PedidoItem {
    idPedido: number;
    idPersona: number;
    idProd: number;
    cantidad: number;
    producto?: string;
    variante_carne?: string | null;
    notas_extras?: string | null;
    precio: number;
    estado: EstadoPedidoItem;
}

export interface PersonaComanda {
    idPersona: number;
    idOrden: number;
    nombre: string;
    estado: EstadoPersona;
    pedidos?: PedidoItem[];
}

export interface Orden {
    idOrden: number;
    idMesa?: number | null;
    idUsuario?: number | null;
    tipo_servicio: TipoServicio;
    numero_ticket?: number | null;
    estado: EstadoOrden;
    prioridad: number;
    fecha_creacion: Date | string;
    personas?: PersonaComanda[];
}
