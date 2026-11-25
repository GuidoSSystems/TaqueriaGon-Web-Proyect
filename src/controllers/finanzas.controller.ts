import { Request, Response } from 'express';
import { FinanzasService } from '../services/finanzas.service';
import { FinanzasValidator } from '../dtos/finanzas.dto';
import { HttpError } from '../errors/http.error';

export class FinanzasController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 100;
            const transacciones = await FinanzasService.getAll(isNaN(limit) ? 100 : limit);
            res.status(200).json(transacciones);
        } catch (error) {
            FinanzasController.handleError(error, res, 'obtener transacciones');
        }
    }

    static async registrarGasto(req: Request, res: Response): Promise<void> {
        try {
            const dto = FinanzasValidator.validateGasto(req.body);
            const transaccion = await FinanzasService.registrarGasto(dto);
            res.status(201).json(transaccion);
        } catch (error) {
            FinanzasController.handleError(error, res, 'registrar gasto');
        }
    }

    static async registrarIngreso(req: Request, res: Response): Promise<void> {
        try {
            const dto = FinanzasValidator.validateIngreso(req.body);
            const transaccion = await FinanzasService.registrarIngreso(dto);
            res.status(201).json(transaccion);
        } catch (error) {
            FinanzasController.handleError(error, res, 'registrar ingreso');
        }
    }

    static async getCorteDiario(req: Request, res: Response): Promise<void> {
        try {
            const fecha = req.query.fecha ? String(req.query.fecha) : undefined;
            const balance = await FinanzasService.getCorteDiario(fecha);
            res.status(200).json(balance);
        } catch (error) {
            FinanzasController.handleError(error, res, 'obtener corte diario');
        }
    }

    private static handleError(err: unknown, res: Response, accion: string): void {
        if (err instanceof HttpError) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        console.error(`[FinanzasController] Error en ${accion}:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
