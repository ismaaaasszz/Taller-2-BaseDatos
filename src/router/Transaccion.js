import express from 'express';
import { TransaccionController } from '../controller/Transaccion.js';

const router = express.Router();

//Rutas del modulo transaccional
router.post('/create', TransaccionController.create);
router.get('/top10-ficcion', TransaccionController.getTopFiccion);

//7. Detalle por usuario y fecha (GET /transaccion/usuario-detalle)
router.get('/usuario-detalle', TransaccionController.getDetalleUsuarioFecha);

//12. Libros con movimiento en la semana actual (GET /transaccion/semana-actual)
router.get('/semana-actual', TransaccionController.getLibrosSemanaActual);

//14. Cantidad de libros vendidos en el año actual (GET /transaccion/total-vendidos-anio)
router.get('/total-vendidos-anio', TransaccionController.getTotalVendidosAnio);

//16. Los 10 menos prestados de comedia 2025 (GET /transaccion/menos-prestados-comedia)
router.get('/menos-prestados-comedia', TransaccionController.getMenosPrestadosComedia);

export default router;