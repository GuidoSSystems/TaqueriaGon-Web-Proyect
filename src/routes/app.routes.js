const { Router } = require('express');

class AppRoutes {
    static get router() {
        const router = Router();

        // Versionado obligatorio: /api/v1/...
        // router.use('/v1/auth', AuthRoutes.router);
        // router.use('/v1/inventario', InventoryRoutes.router);

        router.get('/v1', (req, res) => {
            res.status(200).json({ version: 'v1', status: 'online' });
        });

        return router;
    }
}

module.exports = AppRoutes;

