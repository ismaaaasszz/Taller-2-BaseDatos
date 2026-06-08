import express from 'express';
import { LibroController } from '../controller/Libro.js';

const router = express.Router();

//1. Ruta para registrar libros (POST /libros)
router.post('/', LibroController.registrar);

//3. Eliminar/Deshabilitar una copia (PATCH /libros/copia/:id)
router.patch('/:id/copia/:copiaId', LibroController.deshabilitarCopia);

//4. Actualizar precio (PUT /libros/:id/precio)
router.put('/:id/precio', LibroController.actualizarPrecio);

//11. Listar libros disponibles (GET /libros/disponibles)
router.get('/disponibles', LibroController.listarDisponibles);

//13. Incrementar stock (POST /libros/incrementar-stock)
router.post('/incrementar-stock', LibroController.incrementarStock);

//a
export default router;