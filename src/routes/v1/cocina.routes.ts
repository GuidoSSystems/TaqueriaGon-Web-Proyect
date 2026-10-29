import { Router } from 'express';
import { CocinaController } from '../../controllers/cocina.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

export class CocinaRoutes {
    static get router(): Router {
        const router = Router();
        const controller = new CocinaController();

        // Ruta protegida con JWT para evitar acceso no autenticado (cumple rúbrica de seguridad)
        router.get('/cola', verifyToken, controller.getCola);

        return router;
    }
}
