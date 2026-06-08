import { Usuario } from '../models/Usuario.js';

export class UsuarioController {
    //Punto 2: Registrar usuario
    static async registrar(req, res) {
        try {
            const result = await Usuario.registrar(req.body);
            return res.status(201).json({ 
                message: "Usuario registrado exitosamente", 
                id: result.insertId 
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    //Punto 8: Listar todo el personal
    static async listarTodoElPersonal(req, res) {
        try {
            const data = await Usuario.listarUsuariosYBibliotecarias();
            return res.json({ success: true, data });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    //Punto 5: Eliminar (desactivar) usuario
    static async desactivarUsuario(req, res) {
        try {
            const { id } = req.params;
            const result = await Usuario.desactivarUsuario(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "El usuario no existe" });
            }

            return res.json({ message: "Usuario desactivado exitosamente" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    //Punto 9: Usuarios con al menos un prestamo o venta
    static async listarConTransacciones(req, res) {
        try {
            const data = await Usuario.listarConTransacciones();
            return res.json({ success: true, data });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    //Punto 10: Listar todos los clientes
    static async listarTodos(req, res) {
        try {
            const data = await Usuario.listarTodos();
            return res.json({ success: true, data });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}