import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../database/connection';
import { HttpError } from '../errors/http.error';
import { Mesa, EstadoMesa } from '../models/mesa.model';
import { CrearMesaDTO } from '../dtos/mesas.dto';

type MesaRow = Mesa & RowDataPacket;

export class MesasService {
    static async getAll(): Promise<Mesa[]> {
        const [rows] = await pool.execute<MesaRow[]>(
            'SELECT idMesa, numero_mesa, estado FROM mesas ORDER BY numero_mesa ASC'
        );
        return rows;
    }

    static async getById(idMesa: number): Promise<Mesa> {
        const [rows] = await pool.execute<MesaRow[]>(
            'SELECT idMesa, numero_mesa, estado FROM mesas WHERE idMesa = ?',
            [idMesa]
        );
        if (rows.length === 0) {
            throw new HttpError(404, 'Mesa no encontrada');
        }
        return rows[0];
    }

    static async create(dto: CrearMesaDTO): Promise<Mesa> {
        const [existente] = await pool.execute<MesaRow[]>(
            'SELECT idMesa FROM mesas WHERE numero_mesa = ?',
            [dto.numero_mesa]
        );
        if (existente.length > 0) {
            throw new HttpError(409, `La mesa número ${dto.numero_mesa} ya existe`);
        }

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO mesas (numero_mesa, estado) VALUES (?, ?)',
            [dto.numero_mesa, dto.estado || 'Libre']
        );

        return {
            idMesa: result.insertId,
            numero_mesa: dto.numero_mesa,
            estado: dto.estado || 'Libre'
        };
    }

    static async updateEstado(idMesa: number, nuevoEstado: EstadoMesa): Promise<Mesa> {
        const mesa = await this.getById(idMesa);
        await pool.execute(
            'UPDATE mesas SET estado = ? WHERE idMesa = ?',
            [nuevoEstado, idMesa]
        );
        return { ...mesa, estado: nuevoEstado };
    }

    static async delete(idMesa: number): Promise<void> {
        await this.getById(idMesa);
        await pool.execute('DELETE FROM mesas WHERE idMesa = ?', [idMesa]);
    }
}
