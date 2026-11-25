import { HttpError } from '../errors/http.error';
import { TipoTransaccion } from '../models/finanza.model';

export interface RegistrarGastoDTO {
    categoria: string;
    monto: number;
    detalle?: string | null;
    idUsuario?: number | null;
}

export interface RegistrarIngresoDTO {
    idOrden?: number | null;
    categoria: string;
    monto: number;
    detalle?: string | null;
    idUsuario?: number | null;
}

export class FinanzasValidator {
    static validateGasto(body: any): RegistrarGastoDTO {
        const { categoria, monto, detalle } = body || {};

        if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
            throw new HttpError(400, 'La categoría del gasto es requerida (ej. Servicios, Insumos, Sueldos)');
        }

        const montoNum = Number(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            throw new HttpError(400, 'El monto del gasto debe ser un número mayor a cero');
        }

        return {
            categoria: categoria.trim(),
            // En se guarda negativo para gastos
            monto: -Math.abs(montoNum),
            detalle: detalle ? String(detalle).trim() : null
        };
    }

    static validateIngreso(body: any): RegistrarIngresoDTO {
        const { categoria, monto, detalle, idOrden } = body || {};

        if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
            throw new HttpError(400, 'La categoría del ingreso es requerida');
        }

        const montoNum = Number(monto);
        if (isNaN(montoNum) || montoNum <= 0) {
            throw new HttpError(400, 'El monto del ingreso debe ser mayor a cero');
        }

        return {
            idOrden: idOrden ? Number(idOrden) : null,
            categoria: categoria.trim(),
            monto: Math.abs(montoNum),
            detalle: detalle ? String(detalle).trim() : null
        };
    }
}
