import { Libro } from '../models/Libro.js';

export class LibroController {
    //creacion del libro (para punto 1)
    static async registrar(req, res) {
        try {
            const result = await Libro.registrar(req.body);
            return res.status(201).json({ 
                message: "Libro registrado exitosamente", 
                id: result.insertId 
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    //cambio de precio (del punto 4)
    static async actualizarPrecio(req, res) {
        try {
            const { precio } = req.body;
            const { id } = req.params;
            
            await Libro.actualizarPrecio(id, precio);
            return res.json({ message: "Precio actualizado correctamente" });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    //Orquesta el listado de stock disponible (el del punto 11)
    static async listarDisponibles(req, res) {
        try {
            const data = await Libro.listarDisponibles();
            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}