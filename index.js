const express = require('express');
const path = require('path');
const {dbConnection} = require('./db');
const cors = require('cors');
require('dotenv/config.js');

const app = express();

//Uso de CORS
app.use(cors());

// Ubicar carpeta publica
const publicDirectory = path.join(__dirname, './public');

// Middlewares
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
// app.set('view engine', 'hbs');

// Conexion a la base de datos
dbConnection();

//Rutas
//app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'));

// Iniciar app
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running port ${process.env.PORT}`)
})