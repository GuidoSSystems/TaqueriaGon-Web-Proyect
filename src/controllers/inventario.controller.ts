import { Request, Response } from 'express';
import { InventarioService } from '../services/inventario.service';
import { InventarioValidator } from '../dtos/inventario.dto';
import { HttpError } from '../errors/http.error';

export class InventarioController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const categoria = req.query.categoria ? String(req.query.categoria) : undefined;
            const soloDisponibles = req.query.soloDisponibles === 'true';
            const productos = await InventarioService.getAll(categoria, soloDisponibles);
            res.status(200).json(productos);
        } catch (error) {
            InventarioController.handleError(error, res, 'obtener catálogo');
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de producto inválido' });
                return;
            }
            const producto = await InventarioService.getById(id);
            res.status(200).json(producto);
        } catch (error) {
            InventarioController.handleError(error, res, 'obtener producto');
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const dto = InventarioValidator.validateCrear(req.body);
            const producto = await InventarioService.create(dto);
            res.status(201).json(producto);
        } catch (error) {
            InventarioController.handleError(error, res, 'crear producto');
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de producto inválido' });
                return;
            }
            const dto = InventarioValidator.validateActualizar(req.body);
            const producto = await InventarioService.update(id, dto);
            res.status(200).json(producto);
        } catch (error) {
            InventarioController.handleError(error, res, 'actualizar producto');
        }
    }

    static async ajustarStock(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de producto inválido' });
                return;
            }
            const dto = InventarioValidator.validateAjustarStock(req.body);
            const producto = await InventarioService.ajustarStock(id, dto);
            res.status(200).json(producto);
        } catch (error) {
            InventarioController.handleError(error, res, 'ajustar stock');
        }
    }

    static async toggleDisponible(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de producto inválido' });
                return;
            }
            const producto = await InventarioService.toggleDisponible(id);
            res.status(200).json(producto);
        } catch (error) {
            InventarioController.handleError(error, res, 'cambiar disponibilidad');
        }
    }

    private static handleError(err: unknown, res: Response, accion: string): void {
        if (err instanceof HttpError) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        console.error(`[InventarioController] Error en ${accion}:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
