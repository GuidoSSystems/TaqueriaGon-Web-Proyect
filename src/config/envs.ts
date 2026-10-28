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

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'taqueriadb',
        port: Number(process.env.DB_PORT) || 3306
    },
    jwtSecret: process.env.JWT_SECRET || 'taqueria_gon_super_secret_key_2026'
};

