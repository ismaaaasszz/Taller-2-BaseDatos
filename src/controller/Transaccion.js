import { TransaccionModel } from "../models/Transaccion.js";

export class TransaccionController {
    
    static async create(req, res) {
        try {
            const respuesta = await TransaccionModel.createTransaccion(req.body);
            
            if (!respuesta.success) {
                return res.status(400).json(respuesta);
            }
            return res.status(201).json(respuesta);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    
    //Punto 15: Top 10 libros ficcion
    static async getTopFiccion(req, res) {
        try {
            const data = await TransaccionModel.top10Ficcion2026();
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    //Punto 14: Cantidad de libros vendidos durante el año actual.
    static async getTotalVendidosAnio(req, res) {
        try {
            const total = await TransaccionModel.totalVendidosAnioActual();
            return res.json({ success: true, total_vendidos: total });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    //Punto 7: Detalle de transacciones por usuario y fecha
    static async getDetalleUsuarioFecha(req, res) {
        try {
            const { usuarioId, fecha } = req.query;

            if (!usuarioId || !fecha) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Los parámetros usuarioId y fecha son obligatorios" 
                });
            }

            const data = await TransaccionModel.consultarPorUsuarioYFecha(usuarioId, fecha);
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    //Punto 12: Libros con movimiento en la semana actual
    static async getLibrosSemanaActual(req, res) {
        try {
            const data = await TransaccionModel.listarSemanaActual();
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    //Punto 16: Top 10 menos prestados Comedia 2025
    static async getMenosPrestadosComedia(req, res) {
        try {
            const data = await TransaccionModel.top10MenosPrestadosComedia2025();
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}