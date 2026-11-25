import { Request, Response } from 'express';
import { MesasService } from '../services/mesas.service';
import { MesasValidator } from '../dtos/mesas.dto';
import { HttpError } from '../errors/http.error';

export class MesasController {
    static async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const mesas = await MesasService.getAll();
            res.status(200).json(mesas);
        } catch (error) {
            MesasController.handleError(error, res, 'obtener mesas');
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de mesa no válido' });
                return;
            }
            const mesa = await MesasService.getById(id);
            res.status(200).json(mesa);
        } catch (error) {
            MesasController.handleError(error, res, 'obtener mesa');
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const dto = MesasValidator.validateCrear(req.body);
            const nuevaMesa = await MesasService.create(dto);
            res.status(201).json(nuevaMesa);
        } catch (error) {
            MesasController.handleError(error, res, 'crear mesa');
        }
    }

    static async updateEstado(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de mesa no válido' });
                return;
            }
            const dto = MesasValidator.validateActualizarEstado(req.body);
            const mesa = await MesasService.updateEstado(id, dto.estado);
            res.status(200).json(mesa);
        } catch (error) {
            MesasController.handleError(error, res, 'actualizar estado de mesa');
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID de mesa no válido' });
                return;
            }
            await MesasService.delete(id);
            res.status(200).json({ mensaje: `Mesa ${id} eliminada` });
        } catch (error) {
            MesasController.handleError(error, res, 'eliminar mesa');
        }
    }

    private static handleError(err: unknown, res: Response, accion: string): void {
        if (err instanceof HttpError) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        console.error(`[MesasController] Error en ${accion}:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
