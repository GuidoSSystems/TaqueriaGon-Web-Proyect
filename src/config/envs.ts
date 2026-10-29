import dotenv from 'dotenv';

dotenv.config();

export interface Config {
    port: number;
    db: {
        host: string;
        user: string;
        password: string;
        name: string;
        port: number;
    };
    jwtSecret: string;
}

const getEnvOrThrow = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[Config Error]: Missing required environment variable: ${key}`);
    }
    return value;
};

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'taqueriadb',
        port: Number(process.env.DB_PORT) || 3306
    },
    jwtSecret: getEnvOrThrow('JWT_SECRET')
};