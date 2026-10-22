const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares basicos
app.use(cors());
app.use(express.json()); // Para que el servidor entienda datos en formato JSON

// Ruta de prueba
app.get('/api/estado', (req, res) => {
    res.json({ mensaje: '¡El servidor de Taquería Gon está vivo!' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});