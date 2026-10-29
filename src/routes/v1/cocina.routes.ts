import { Router } from 'express';
import { CocinaController } from '../../controllers/cocina.controller';

export class CocinaRoutes {
    static get router(): Router {
        const router = Router();
        const controller = new CocinaController();
        router.get('/cola', controller.getCola);
        return router;
    }
}