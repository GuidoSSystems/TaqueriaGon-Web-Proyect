import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

export class AuthRoutes {
    static get router(): Router {
        const router = Router();

        router.post('/login', AuthController.login);
        router.post('/logout', AuthController.logout);
        router.post('/register', verifyToken, requireRole('Administrador'), AuthController.register);
        router.get('/me', verifyToken, AuthController.me);

        return router;
    }
}

