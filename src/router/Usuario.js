import express from 'express';
import { UsuarioController } from '../controller/Usuario.js';

const router = express.Router();

//2. Registrar usuario (POST /usuario)
router.post('/', UsuarioController.registrar);

//5: Desactivar usuario
router.patch('/:id/desactivar', UsuarioController.desactivarUsuario);

//8. Listar usuarios y bibliotecarias (GET /usuario/personal-sistema)
router.get('/personal-sistema', UsuarioController.listarTodoElPersonal);

//9. Listar usuarios con al menos un prestamo/venta (GET /usuario/con-movimientos)
router.get('/con-movimientos', UsuarioController.listarConTransacciones);

//10. Listar todos los clientes (GET /usuario/todos)
router.get('/todos', UsuarioController.listarTodos);

export default router;