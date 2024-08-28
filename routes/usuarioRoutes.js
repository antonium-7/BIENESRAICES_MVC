import express from "express";
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";

const router = express.Router();

//Rounting
router.get('/login', formularioLogin);
router.post('/login', autenticar);

//cerrar sesión
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


//Routing POST
//router.post('/', (req,res) => {
//    res.json({msg: 'Respuesta de Tipo Post'})
//});

// Routing con router
//router.route('/')
//    .get(function(req, res) {
//        res.json({msg: 'Hola Mundo en express'})
//    })
//    .post(function(req, res){
//        res.json({msg: 'Respuesta de Tipo Post'})
//    })

export default router