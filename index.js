//const express = require('express') // Common JS
import express from 'express' // ENM Script modules
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express()

//Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}) )

// Middleware para el análisis de cookies
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexión a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexión correcta a la Base de datos')
}catch (error){
    console.log(error)
}


//habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta Pública
app.use( express.static('public') )


// Rouating
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)


// Defenir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});