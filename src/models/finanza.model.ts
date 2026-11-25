export type TipoTransaccion = 'INGRESO' | 'GASTO';

export interface TransaccionFinanza {
    idTransaccion: number;
    idOrden?: number | null;
    idUsuario?: number | null;
    tipo: TipoTransaccion;
    categoria: string;
    monto: number;
    detalle?: string | null;
    fecha: Date | string;
}

export interface ResumenCorteDiario {
    fecha: string;
    totalIngresos: number;
    totalGastos: number;
    gananciaNeta: number;
    numeroTransacciones: number;
}
