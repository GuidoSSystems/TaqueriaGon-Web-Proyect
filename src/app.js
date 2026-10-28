const Server = require('./server');
const config = require('./config/envs');
const AppRoutes = require('./routes/app.routes');

const server = new Server({
    port: config.port,
    routes: AppRoutes.router
});

server.start();
