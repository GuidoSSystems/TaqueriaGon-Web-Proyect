import { Router } from 'express';
import { FinanzasController } from '../../controllers/finanzas.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

export class FinanzasRoutes {
    static get router(): Router {
        const router = Router();

        // Todas las rutas financieras son exclusivas de Administrador (RF-01, RS-04)
        router.use(verifyToken, requireRole('Administrador'));

        router.get('/', FinanzasController.getAll);
        router.get('/corte', FinanzasController.getCorteDiario);
        router.post('/gastos', FinanzasController.registrarGasto);
        router.post('/ingresos', FinanzasController.registrarIngreso);

        return router;
    }
}
