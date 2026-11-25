import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../database/connection';
import { HttpError } from '../errors/http.error';
import { ProductoInventario } from '../models/inventario.model';
import { ActualizarProductoDTO, AjustarStockDTO, CrearProductoDTO } from '../dtos/inventario.dto';

type ProductoRow = ProductoInventario & RowDataPacket;

export class InventarioService {
    static async getAll(categoria?: string, soloDisponibles = false): Promise<ProductoInventario[]> {
        let query = 'SELECT idProd, nombre, categoria, precio, stock, controla_stock, disponible, tiempo_estimado_min FROM inventario WHERE 1=1';
        const params: any[] = [];

        if (categoria) {
            query += ' AND categoria = ?';
            params.push(categoria);
        }
        if (soloDisponibles) {
            query += ' AND disponible = 1';
        }

        query += ' ORDER BY categoria ASC, nombre ASC';

        const [rows] = await pool.execute<ProductoRow[]>(query, params);
        // Formatear precio a número por si mysql2 lo regresa como string numérico
        return rows.map(r => ({ ...r, precio: Number(r.precio) }));
    }

    static async getById(idProd: number): Promise<ProductoInventario> {
        const [rows] = await pool.execute<ProductoRow[]>(
            'SELECT idProd, nombre, categoria, precio, stock, controla_stock, disponible, tiempo_estimado_min FROM inventario WHERE idProd = ?',
            [idProd]
        );
        if (rows.length === 0) {
            throw new HttpError(404, 'Producto no encontrado');
        }
        const item = rows[0];
        return { ...item, precio: Number(item.precio) };
    }

    static async create(dto: CrearProductoDTO): Promise<ProductoInventario> {
        const [existente] = await pool.execute<ProductoRow[]>(
            'SELECT idProd FROM inventario WHERE nombre = ?',
            [dto.nombre]
        );
        if (existente.length > 0) {
            throw new HttpError(409, `El producto "${dto.nombre}" ya existe en el inventario`);
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO inventario (nombre, categoria, precio, stock, controla_stock, disponible, tiempo_estimado_min)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                dto.nombre,
                dto.categoria,
                dto.precio,
                dto.stock ?? 0,
                dto.controla_stock ?? 0,
                dto.disponible ?? 1,
                dto.tiempo_estimado_min ?? 5
            ]
        );

        return {
            idProd: result.insertId,
            nombre: dto.nombre,
            categoria: dto.categoria,
            precio: dto.precio,
            stock: dto.stock ?? 0,
            controla_stock: dto.controla_stock ?? 0,
            disponible: dto.disponible ?? 1,
            tiempo_estimado_min: dto.tiempo_estimado_min ?? 5
        };
    }

    static async update(idProd: number, dto: ActualizarProductoDTO): Promise<ProductoInventario> {
        await this.getById(idProd);

        const campos: string[] = [];
        const valores: any[] = [];

        if (dto.nombre !== undefined) {
            campos.push('nombre = ?');
            valores.push(dto.nombre);
        }
        if (dto.categoria !== undefined) {
            campos.push('categoria = ?');
            valores.push(dto.categoria);
        }
        if (dto.precio !== undefined) {
            campos.push('precio = ?');
            valores.push(dto.precio);
        }
        if (dto.stock !== undefined) {
            campos.push('stock = ?');
            valores.push(dto.stock);
        }
        if (dto.controla_stock !== undefined) {
            campos.push('controla_stock = ?');
            valores.push(dto.controla_stock);
        }
        if (dto.disponible !== undefined) {
            campos.push('disponible = ?');
            valores.push(dto.disponible);
        }
        if (dto.tiempo_estimado_min !== undefined) {
            campos.push('tiempo_estimado_min = ?');
            valores.push(dto.tiempo_estimado_min);
        }

        if (campos.length > 0) {
            valores.push(idProd);
            await pool.execute(
                `UPDATE inventario SET ${campos.join(', ')} WHERE idProd = ?`,
                valores
            );
        }

        return this.getById(idProd);
    }

    static async ajustarStock(idProd: number, dto: AjustarStockDTO): Promise<ProductoInventario> {
        const prod = await this.getById(idProd);
        let nuevoStock = prod.stock;

        if (dto.accion === 'sumar') {
            nuevoStock += dto.cantidad;
        } else if (dto.accion === 'restar') {
            nuevoStock = Math.max(0, nuevoStock - dto.cantidad);
        } else if (dto.accion === 'fijar') {
            nuevoStock = dto.cantidad;
        }

        await pool.execute(
            'UPDATE inventario SET stock = ? WHERE idProd = ?',
            [nuevoStock, idProd]
        );

        return { ...prod, stock: nuevoStock };
    }

    static async toggleDisponible(idProd: number): Promise<ProductoInventario> {
        const prod = await this.getById(idProd);
        const nuevoDisponible = prod.disponible === 1 ? 0 : 1;

        await pool.execute(
            'UPDATE inventario SET disponible = ? WHERE idProd = ?',
            [nuevoDisponible, idProd]
        );

        return { ...prod, disponible: nuevoDisponible };
    }
}
