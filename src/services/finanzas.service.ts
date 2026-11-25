import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../database/connection';
import { HttpError } from '../errors/http.error';
import { ResumenCorteDiario, TransaccionFinanza } from '../models/finanza.model';
import { RegistrarGastoDTO, RegistrarIngresoDTO } from '../dtos/finanzas.dto';

type TransaccionRow = TransaccionFinanza & RowDataPacket;

export class FinanzasService {
    static async getAll(limit = 100): Promise<TransaccionFinanza[]> {
        const [rows] = await pool.execute<TransaccionRow[]>(
            `SELECT idTransaccion, idOrden, idUsuario, tipo, categoria, monto, detalle, fecha 
             FROM finanzas 
             ORDER BY fecha DESC 
             LIMIT ?`,
            [String(limit)]
        );
        return rows.map(r => ({ ...r, monto: Number(r.monto) }));
    }

    static async registrarGasto(dto: RegistrarGastoDTO): Promise<TransaccionFinanza> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO finanzas (idUsuario, tipo, categoria, monto, detalle)
             VALUES (?, 'GASTO', ?, ?, ?)`,
            [dto.idUsuario || null, dto.categoria, dto.monto, dto.detalle || null]
        );

        return {
            idTransaccion: result.insertId,
            idUsuario: dto.idUsuario || null,
            tipo: 'GASTO',
            categoria: dto.categoria,
            monto: dto.monto,
            detalle: dto.detalle || null,
            fecha: new Date()
        };
    }

    static async registrarIngreso(dto: RegistrarIngresoDTO): Promise<TransaccionFinanza> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO finanzas (idOrden, idUsuario, tipo, categoria, monto, detalle)
             VALUES (?, ?, 'INGRESO', ?, ?, ?)`,
            [dto.idOrden || null, dto.idUsuario || null, dto.categoria, dto.monto, dto.detalle || null]
        );

        return {
            idTransaccion: result.insertId,
            idOrden: dto.idOrden || null,
            idUsuario: dto.idUsuario || null,
            tipo: 'INGRESO',
            categoria: dto.categoria,
            monto: dto.monto,
            detalle: dto.detalle || null,
            fecha: new Date()
        };
    }

    // Calcula el corte y balance neto del día (RF-09)
    static async getCorteDiario(fechaFiltro?: string): Promise<ResumenCorteDiario> {
        const fechaTarget = fechaFiltro || new Date().toISOString().slice(0, 10);

        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                COALESCE(SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END), 0) AS totalIngresos,
                COALESCE(SUM(CASE WHEN tipo = 'GASTO' THEN ABS(monto) ELSE 0 END), 0) AS totalGastos,
                COALESCE(SUM(monto), 0) AS gananciaNeta,
                COUNT(*) AS numeroTransacciones
             FROM finanzas 
             WHERE DATE(fecha) = ?`,
            [fechaTarget]
        );

        const data = rows[0] || {};

        return {
            fecha: fechaTarget,
            totalIngresos: Number(data.totalIngresos || 0),
            totalGastos: Number(data.totalGastos || 0),
            gananciaNeta: Number(data.gananciaNeta || 0),
            numeroTransacciones: Number(data.numeroTransacciones || 0)
        };
    }
}
