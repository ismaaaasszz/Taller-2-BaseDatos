import express from 'express';
import { TrabajadorController } from '../controller/Trabajador.js';

const router = express.Router();

//Verifica que apunte exactamente a RegistrarTrabajador y IniciarSesion
router.post('/registro', TrabajadorController.RegistrarTrabajador);
router.post('/login', TrabajadorController.IniciarSesion);

export default router;