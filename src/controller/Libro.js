import { Libro } from '../models/Libro.js';

export class LibroController {
    //Punto 1: creacion del libro
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

    //Punto 3: Deshabilitar copia fisica
    static async deshabilitarCopia(req, res) {
        try {
            const { copiaId } = req.params;
            const result = await Libro.deshabilitarCopia(copiaId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "La copia de libro especificada no existe" });
            }

            return res.json({ message: "Copia de libro deshabilitada exitosamente" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    //Punto 4: cambio de precio
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

    //Punto 11: Libros disponibles
    static async listarDisponibles(req, res) {
        try {
            const data = await Libro.listarDisponibles();
            return res.json({ success: true, data });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    //Punto 13: Incrementar stock
    static async incrementarStock(req, res) {
        try {
            const { Libroid } = req.body;
            if (!Libroid) return res.status(400).json({ error: "Libroid es obligatorio" });

            //Se genera un codigo de barra aleatorio
            const codigoBarra = 'BC-' + Math.floor(100000 + Math.random() * 900000);
            
            await Libro.agregarCopia(Libroid, codigoBarra);
            return res.status(201).json({ success: true, message: "Stock incrementado con éxito", codigo_barra: codigoBarra });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}