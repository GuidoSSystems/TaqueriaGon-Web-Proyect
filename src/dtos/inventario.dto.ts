import { HttpError } from '../errors/http.error';
import { CategoriaProducto } from '../models/inventario.model';

export interface CrearProductoDTO {
    nombre: string;
    categoria: CategoriaProducto;
    precio: number;
    stock?: number;
    controla_stock?: number;
    disponible?: number;
    tiempo_estimado_min?: number;
}

export interface ActualizarProductoDTO {
    nombre?: string;
    categoria?: CategoriaProducto;
    precio?: number;
    stock?: number;
    controla_stock?: number;
    disponible?: number;
    tiempo_estimado_min?: number;
}

export interface AjustarStockDTO {
    cantidad: number;
    accion: 'sumar' | 'restar' | 'fijar';
}

export class InventarioValidator {
    static validateCrear(body: any): CrearProductoDTO {
        const { nombre, categoria, precio } = body || {};

        if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
            throw new HttpError(400, 'El nombre del producto es obligatorio');
        }
        if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
            throw new HttpError(400, 'La categoría es obligatoria');
        }

        const precioNum = Number(precio);
        if (isNaN(precioNum) || precioNum < 0) {
            throw new HttpError(400, 'El precio debe ser un número igual o mayor a cero');
        }

        const stock = body.stock !== undefined ? Number(body.stock) : 0;
        if (isNaN(stock) || stock < 0) {
            throw new HttpError(400, 'El stock inicial no puede ser negativo');
        }

        return {
            nombre: nombre.trim(),
            categoria: categoria.trim(),
            precio: precioNum,
            stock,
            controla_stock: body.controla_stock ? 1 : 0,
            disponible: body.disponible !== undefined ? (body.disponible ? 1 : 0) : 1,
            tiempo_estimado_min: body.tiempo_estimado_min ? Math.max(0, Number(body.tiempo_estimado_min)) : 5
        };
    }

    static validateActualizar(body: any): ActualizarProductoDTO {
        if (!body || typeof body !== 'object') {
            throw new HttpError(400, 'Datos de actualización requeridos');
        }

        const dto: ActualizarProductoDTO = {};

        if (body.nombre !== undefined) {
            if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
                throw new HttpError(400, 'El nombre no puede estar vacío');
            }
            dto.nombre = body.nombre.trim();
        }

        if (body.categoria !== undefined) {
            if (typeof body.categoria !== 'string' || !body.categoria.trim()) {
                throw new HttpError(400, 'La categoría no puede estar vacía');
            }
            dto.categoria = body.categoria.trim();
        }

        if (body.precio !== undefined) {
            const precioNum = Number(body.precio);
            if (isNaN(precioNum) || precioNum < 0) {
                throw new HttpError(400, 'El precio debe ser un número válido no negativo');
            }
            dto.precio = precioNum;
        }

        if (body.stock !== undefined) {
            const stockNum = Number(body.stock);
            if (isNaN(stockNum) || stockNum < 0) {
                throw new HttpError(400, 'El stock no puede ser negativo');
            }
            dto.stock = stockNum;
        }

        if (body.controla_stock !== undefined) {
            dto.controla_stock = body.controla_stock ? 1 : 0;
        }

        if (body.disponible !== undefined) {
            dto.disponible = body.disponible ? 1 : 0;
        }

        if (body.tiempo_estimado_min !== undefined) {
            const t = Number(body.tiempo_estimado_min);
            if (isNaN(t) || t < 0) {
                throw new HttpError(400, 'Tiempo estimado no válido');
            }
            dto.tiempo_estimado_min = t;
        }

        return dto;
    }

    static validateAjustarStock(body: any): AjustarStockDTO {
        const cantidad = Number(body?.cantidad);
        const accion = body?.accion;

        if (isNaN(cantidad) || cantidad < 0) {
            throw new HttpError(400, 'La cantidad debe ser un número no negativo');
        }
        if (!['sumar', 'restar', 'fijar'].includes(accion)) {
            throw new HttpError(400, 'La acción debe ser sumar, restar o fijar');
        }

        return { cantidad, accion };
    }
}
