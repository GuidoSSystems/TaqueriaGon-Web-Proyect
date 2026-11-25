import { ESTADOS_MESA, EstadoMesa } from '../models/mesa.model';
import { HttpError } from '../errors/http.error';

export interface CrearMesaDTO {
    numero_mesa: number;
    estado?: EstadoMesa;
}

export interface ActualizarEstadoMesaDTO {
    estado: EstadoMesa;
}

export class MesasValidator {
    static validateCrear(body: any): CrearMesaDTO {
        const numero = Number(body?.numero_mesa);
        if (isNaN(numero) || numero <= 0) {
            throw new HttpError(400, 'El número de mesa debe ser un entero positivo');
        }
        let estado: EstadoMesa = 'Libre';
        if (body?.estado) {
            if (!ESTADOS_MESA.includes(body.estado)) {
                throw new HttpError(400, `Estado inválido. Opciones: ${ESTADOS_MESA.join(', ')}`);
            }
            estado = body.estado;
        }
        return { numero_mesa: numero, estado };
    }

    static validateActualizarEstado(body: any): ActualizarEstadoMesaDTO {
        const estado = body?.estado;
        if (!estado || !ESTADOS_MESA.includes(estado)) {
            throw new HttpError(400, `Estado obligatorio y válido. Opciones: ${ESTADOS_MESA.join(', ')}`);
        }
        return { estado };
    }
}
