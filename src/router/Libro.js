import express from 'express';
import { LibroController } from '../controller/Libro.js';

const router = express.Router();

// 2. Ruta para listar los disponibles (GET /libros/disponibles)
router.get('/disponibles', LibroController.listarDisponibles);

//1. Ruta para registrar libros (POST /libros)
router.post('/', LibroController.registrar);

// 3. Actualizar precio (PUT /libros/:id/precio)
router.put('/:id/precio', LibroController.actualizarPrecio);

export default router;