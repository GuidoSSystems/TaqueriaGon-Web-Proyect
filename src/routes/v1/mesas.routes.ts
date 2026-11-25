import { Router } from 'express';
import { MesasController } from '../../controllers/mesas.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

export class MesasRoutes {
    static get router(): Router {
        const router = Router();

        // Ver mesas disponible para usuarios autenticados
        router.get('/', verifyToken, MesasController.getAll);
        router.get('/:id', verifyToken, MesasController.getById);

        // Actualizar estado de mesa (ej. mesero toma la mesa: 'Atendida')
        router.put('/:id/estado', verifyToken, MesasController.updateEstado);

        // Crear o borrar mesas físicas (exclusivo Administrador)
        router.post('/', verifyToken, requireRole('Administrador'), MesasController.create);
        router.delete('/:id', verifyToken, requireRole('Administrador'), MesasController.delete);

        return router;
    }
}
