import { TokenPayload } from '../models/usuario';

// Agrega `req.user` (lo llena verifyToken)
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export {};

