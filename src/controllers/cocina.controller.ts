import { Request, Response } from 'express';

export class CocinaController {
    public getCola = async (req: Request, res: Response) => {
        try {
            // Mocks temporales para que el frontend pueda trabajar (Issue #27)
            // Se reemplazarán con Sequelize cuando los modelos estén listos.
            
            const dineIn = [
                {
                    idOrden: 1,
                    tipo_servicio: 'LOCAL',
                    mesa: 5,
                    nivel_prioridad: 2,
                    estado_orden: 'PENDIENTE',
                    personas: [
                        { idPersona: 1, pedidos: [{ idPedido: 1, platillo: 'Taco Pastor', estado_cocina: 'PENDIENTE' }] }
                    ]
                }
            ];

            const takeout = [
                {
                    idOrden: 2,
                    tipo_servicio: 'LLEVAR',
                    ficha: 15,
                    nivel_prioridad: 1,
                    estado_orden: 'PENDIENTE',
                    personas: [
                        { idPersona: 2, pedidos: [{ idPedido: 2, platillo: 'Gringa', estado_cocina: 'PENDIENTE' }] }
                    ]
                }
            ];

            return res.status(200).json({ dineIn, takeout });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al cargar la cola.' });
        }
    };
}