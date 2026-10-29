import { Request, Response } from 'express';

export class CocinaController {
    public getCola = async (_req: Request, res: Response) => {
        try {
            // Datos temporales de KDS alineados con el esquema oficial de BD (ordenes, personas, pedidos)
            const dineIn = [
                {
                    idOrden: 1,
                    idMesa: 5,
                    tipo_servicio: 'Comedor',
                    prioridad: 2,
                    estado: 'Pendiente',
                    personas: [
                        {
                            idPersona: 1,
                            nombre: 'Persona 1',
                            pedidos: [
                                {
                                    idPedido: 1,
                                    producto: 'Tacos',
                                    variante_carne: 'Pastor',
                                    notas_extras: 'Con todo',
                                    estado: 'Pendiente'
                                }
                            ]
                        }
                    ]
                }
            ];

            const takeout = [
                {
                    idOrden: 2,
                    idMesa: null,
                    numero_ticket: 15,
                    tipo_servicio: 'ParaLlevar',
                    prioridad: 1,
                    estado: 'Pendiente',
                    personas: [
                        {
                            idPersona: 2,
                            nombre: 'Cliente Mostrador',
                            pedidos: [
                                {
                                    idPedido: 2,
                                    producto: 'Quesadillas',
                                    variante_carne: 'Bisteck',
                                    notas_extras: 'Sin cebolla',
                                    estado: 'Pendiente'
                                }
                            ]
                        }
                    ]
                }
            ];

            return res.status(200).json({ dineIn, takeout });
        } catch (error) {
            console.error('[Cocina] Error al cargar la cola:', error);
            return res.status(500).json({ error: 'Error al cargar la cola de cocina' });
        }
    };
}
