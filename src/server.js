const express = require('express');
const cors = require('cors');

class Server {
    constructor({ port, routes }) {
        this.app = express();
        this.port = port;
        this.routes = routes;

        this.configureMiddlewares();
        this.configureRoutes();
    }

    configureMiddlewares() {
        // Habilitar CORS
        this.app.use(cors());

        // Parseo de cuerpo JSON
        this.app.use(express.json());

        // Parseo de formularios URL-encoded
        this.app.use(express.urlencoded({ extended: true }));

        // Servir archivos estáticos del frontend (HTML, CSS, JS)
        this.app.use(express.static('src/public'));
    }

    configureRoutes() {
        // Si se proveen rutas personalizadas se montan en /api
        if (this.routes) {
            this.app.use('/api', this.routes);
        }

        // Endpoint de salud / estado de la API
        this.app.get('/api/health', (req, res) => {
            res.status(200).json({ status: 'ok', message: 'Servidor Taquería Gon activo' });
        });
    }

    start() {
        return this.app.listen(this.port, () => {
            console.log(`[Server] Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;

