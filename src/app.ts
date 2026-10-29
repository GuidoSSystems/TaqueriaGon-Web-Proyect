import { Server } from './server';
import { config } from './config/envs';
import { AppRoutes } from './routes/app.routes';

const server = new Server({
    port: config.port,
    routes: AppRoutes.router
});

server.start();

