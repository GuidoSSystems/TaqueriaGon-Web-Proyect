import path from 'path';
import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import { pageGuard } from './middlewares/page.middleware';

interface ServerOptions {
    port: number;
    routes?: Router;
}

export class Server {
    private readonly app: Application;
    private readonly port: number;
    private readonly routes?: Router;

    constructor({ port, routes }: ServerOptions) {
        this.app = express();
        this.port = port;
        this.routes = routes;

        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares(): void {
        // Habilitar CORS
        this.app.use(cors());

        // Parseo de cuerpo JSON
        this.app.use(express.json());

        // Parseo de formularios URL-encoded
        this.app.use(express.urlencoded({ extended: true }));

        // Servir archivos estáticos del frontend (HTML, CSS, JS)
        // Funciona igual desde src/ (tsx) y desde dist/ (compilado)
        // Primero pasa por pageGuard: sin permiso, el HTML ni se envía
        this.app.use(pageGuard);
        this.app.use(express.static(path.resolve(__dirname, '../src/public'), { extensions: ['html'] }));
    }

    private configureRoutes(): void {
        // Si se proveen rutas personalizadas se montan en /api
        if (this.routes) {
            this.app.use('/api', this.routes);
        }

        // Endpoint de salud / estado de la API
        this.app.get('/api/health', (_req: Request, res: Response) => {
            res.status(200).json({ status: 'ok', message: 'Servidor Taquería Gon activo' });
        });

        // Rutas que no existen: nada de "Cannot GET", se regresa al inicio
        this.app.use((req: Request, res: Response) => {
            if (req.path.startsWith('/api')) {
                res.status(404).json({ error: 'Ruta no encontrada' });
                return;
            }
            res.redirect('/');
        });
    }

    getApp(): Application {
        return this.app;
    }

    start() {
        return this.app.listen(this.port, () => {
            console.log(`[Server] Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

