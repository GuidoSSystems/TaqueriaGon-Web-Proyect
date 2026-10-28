require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'taqueriadb',
        port: process.env.DB_PORT || 3306
    },
    jwtSecret: process.env.JWT_SECRET || 'taqueria_gon_super_secret_key_2026'
};

module.exports = config;

