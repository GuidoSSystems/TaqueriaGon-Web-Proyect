// Error con código HTTP para responder mensajes simples al cliente
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'HttpError';
    }
}

