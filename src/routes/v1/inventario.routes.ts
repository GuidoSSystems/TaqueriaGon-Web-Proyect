import { Router } from 'express';
import { InventarioController } from '../../controllers/inventario.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

export class InventarioRoutes {
    static get router(): Router {
        const router = Router();

        // Consulta de catálogo (disponible para autenticados como meseros / POS)
        router.get('/', verifyToken, InventarioController.getAll);
        router.get('/:id', verifyToken, InventarioController.getById);

        // Modificaciones exclusivas de Administrador (RF-06)
        router.post('/', verifyToken, requireRole('Administrador'), InventarioController.create);
        router.put('/:id', verifyToken, requireRole('Administrador'), InventarioController.update);
        router.patch('/:id/stock', verifyToken, requireRole('Administrador'), InventarioController.ajustarStock);
        router.patch('/:id/disponible', verifyToken, requireRole('Administrador'), InventarioController.toggleDisponible);

        return router;
    }
}
