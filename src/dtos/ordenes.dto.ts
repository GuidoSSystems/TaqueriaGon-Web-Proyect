import { HttpError } from '../errors/http.error';
import { EstadoOrden, EstadoPedidoItem, TipoServicio } from '../models/orden.model';

export interface ItemPedidoDTO {
    idProd: number;
    cantidad: number;
    variante_carne?: string;
    notas_extras?: string;
}

export interface PersonaOrdenDTO {
    nombre?: string;
    pedidos: ItemPedidoDTO[];
}

export interface CrearOrdenDTO {
    tipo_servicio: TipoServicio;
    idMesa?: number | null;
    numero_ticket?: number | null;
    prioridad?: number;
    personas: PersonaOrdenDTO[];
}

export class OrdenesValidator {
    static validateCrear(body: any): CrearOrdenDTO {
        const { tipo_servicio, idMesa, numero_ticket, personas } = body || {};

        if (!tipo_servicio || !['Comedor', 'ParaLlevar'].includes(tipo_servicio)) {
            throw new HttpError(400, 'tipo_servicio debe ser Comedor o ParaLlevar');
        }

        if (tipo_servicio === 'Comedor' && (!idMesa || isNaN(Number(idMesa)))) {
            throw new HttpError(400, 'idMesa es requerido para servicio de Comedor');
        }

        if (!Array.isArray(personas) || personas.length === 0) {
            throw new HttpError(400, 'La orden debe contener al menos una persona o comensal con pedidos');
        }

        const personasValidadas: PersonaOrdenDTO[] = personas.map((p, idx) => {
            if (!Array.isArray(p?.pedidos) || p.pedidos.length === 0) {
                throw new HttpError(400, `La persona ${idx + 1} debe contener al menos un producto pedido`);
            }
            const pedidosValidados: ItemPedidoDTO[] = p.pedidos.map((it: any) => {
                const idProd = Number(it?.idProd);
                const cantidad = Number(it?.cantidad);
                if (isNaN(idProd) || idProd <= 0) {
                    throw new HttpError(400, 'idProd no válido');
                }
                if (isNaN(cantidad) || cantidad <= 0) {
                    throw new HttpError(400, 'cantidad debe ser mayor a 0');
                }
                return {
                    idProd,
                    cantidad,
                    variante_carne: it.variante_carne ? String(it.variante_carne).trim() : undefined,
                    notas_extras: it.notas_extras ? String(it.notas_extras).trim() : undefined
                };
            });

            return {
                nombre: p.nombre ? String(p.nombre).trim() : `Persona ${idx + 1}`,
                pedidos: pedidosValidados
            };
        });

        return {
            tipo_servicio,
            idMesa: tipo_servicio === 'Comedor' ? Number(idMesa) : null,
            numero_ticket: numero_ticket ? Number(numero_ticket) : null,
            prioridad: body.prioridad ? Number(body.prioridad) : 0,
            personas: personasValidadas
        };
    }
}
