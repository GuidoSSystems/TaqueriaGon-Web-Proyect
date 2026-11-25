import { Request, Response, Router } from 'express';
import { AuthRoutes } from './v1/auth.routes';
import { CocinaRoutes } from './v1/cocina.routes';
import { MesasRoutes } from './v1/mesas.routes';
import { InventarioRoutes } from './v1/inventario.routes';
import { FinanzasRoutes } from './v1/finanzas.routes';

export class AppRoutes {
    static get router(): Router {
        const router = Router();

        // Versionado obligatorio: /api/v1/...
        router.use('/v1/auth', AuthRoutes.router);
        router.use('/v1/mesas', MesasRoutes.router);
        router.use('/v1/inventario', InventarioRoutes.router);
        router.use('/v1/finanzas', FinanzasRoutes.router);
        router.use('/v1/cocina', CocinaRoutes.router);

        router.get('/v1', (_req: Request, res: Response) => {
            res.status(200).json({ version: 'v1', status: 'online' });
        });

        return router;
    }
}
