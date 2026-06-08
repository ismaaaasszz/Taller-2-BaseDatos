import connection from "../database/DataBase.js";
import { randomUUID } from "crypto";

export class TransaccionModel {
    
    //Registrar un nuevo prestamo/venta 
    static async createTransaccion(transaccion) {

        //Conexion unica para controlar la transacción
        const conn = await connection.getConnection();
        
        try {
            
            await conn.beginTransaction();

            //Verificar si existe el trabajador
            const queryVerificarTrabajador = 'SELECT id FROM Trabajador WHERE id = ?';
            const [resultadoTrabajador] = await conn.query(queryVerificarTrabajador, [transaccion.TrabajadorId]);
            
            if (resultadoTrabajador.length === 0) {
                await conn.rollback(); 
                conn.release(); 
                return { success: false, message: 'El trabajador no existe', data: null }; 
            }

            //2. Obtener la edad del usuario
            const queryVerificarUsuario = 'SELECT edad FROM usuario WHERE id = ?';
            const [resultadoUsuario] = await conn.query(queryVerificarUsuario, [transaccion.Usuarioid]);
            
            if (resultadoUsuario.length === 0) {
                await conn.rollback(); conn.release(); 
                return { success: false, message: 'El usuario no existe', data: null }; 
            }
            const edadUsuario = resultadoUsuario[0].edad;

            //Validar que la transaccion no sea prestamo y venta a la vez
            const isVenta = transaccion.es_venta ? 1 : 0;
            const isPrestamo = transaccion.es_prestamo ? 1 : 0; 

            if (isVenta === 0 && isPrestamo === 0) {
                await conn.rollback(); conn.release();
                return { success: false, message: 'La transacción debe ser una venta o un préstamo', data: null }; 
            }
            if (isVenta === 1 && isPrestamo === 1) {
                await conn.rollback(); conn.release();
                return { success: false, message: 'La transacción no puede ser ambas cosas a la vez', data: null }; 
            }

            //Parametros para el calculo del bono por tiempo
            const ahora = new Date();
            const diaSemana = ahora.getDay(); //0=Domingo, 6=Sabado
            const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);

            let precioTotalAcumulado = 0;
            let bonoTotalAcumulado = 0;

            //Procesar las copias del libro una por una (Arreglo dinamico nativo)
            for (let i = 0; i < transaccion.Copia_libroid.length; i++) {
                const copiaId = transaccion.Copia_libroid[i];

                //Verificar existencia y disponibilidad de la copia
                const queryCopia = `
                    SELECT cl.id, cl.estado, l.precio 
                    FROM Copia_libro cl 
                    INNER JOIN Libro l ON cl.Libroid = l.id 
                    WHERE cl.id = ?
                `;
                const [resultadoCopia] = await conn.query(queryCopia, [copiaId]);

                if (resultadoCopia.length === 0) {
                    await conn.rollback(); conn.release();
                    return { success: false, message: `La copia con id ${copiaId} no existe`, data: null }; 
                }

                //Estado = 0 significa "No Disponible/Prestado"
                if (resultadoCopia[0].estado === 0) {
                    await conn.rollback(); conn.release();
                    return { success: false, message: `La copia con id ${copiaId} no está disponible`, data: null }; 
                }

                //Validacion REGLA DE EDAD 
                const edadSugerida = resultadoCopia[0].edad_sugerida;
                if (edadUsuario < edadSugerida) {
                    await conn.rollback(); conn.release();
                    return { 
                        success: false, 
                        message: `Bloqueado: El usuario tiene ${edadUsuario} años y el libro sugiere mínimo ${edadSugerida} años.`, 
                        data: null 
                    }; 
                }

                const precioBaseLibro = parseFloat(resultadoCopia[0].precio);
                let precioCopia = precioBaseLibro;

                //Aplicacion de Formulas para precios y bonos
                if (isVenta === 1) {
                    precioCopia = precioBaseLibro * 1.19; //+19% IVA
                    bonoTotalAcumulado += (precioBaseLibro * 0.3) + (esFinDeSemana ? 650 : 500); 
                } else if (isPrestamo === 1) {
                    precioCopia = 0; //Los prestamos no suman al costo total inmediato del libro
                    bonoTotalAcumulado += (precioBaseLibro * 0.1) + (esFinDeSemana ? 250 : 100); 
                }
                
                precioTotalAcumulado += precioCopia;

                //Cambiar el estado de la copia a 0 (No disponible) 
                const queryActualizarCopia = 'UPDATE Copia_libro SET estado = 0 WHERE id = ?';
                await conn.query(queryActualizarCopia, [copiaId]);
            }

            //Parametros de tiempo automaticos
            const fechaActual = new Date().toISOString().split('T')[0];
            const mesActual = new Date().getMonth() + 1;
            const semestre = mesActual <= 6 ? 1 : 2; 
            
            const idTransaccion = Math.floor(Date.now() / 1000);


            //Insertar cabecera de la transaccion 
            const queryInsert = `
                INSERT INTO Transaccion 
                (id, TrabajadorId, Usuarioid, Fecha, semestre, precio_total, es_venta, es_prestamo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `; 
            
            await conn.query(queryInsert, [
                idTransaccion, 
                transaccion.TrabajadorId, 
                transaccion.Usuarioid, 
                fechaActual, 
                semestre, 
                precioTotalAcumulado, 
                isVenta, 
                isPrestamo
            ]);

            //Actualizar el bono de la bibliotecaria en la tabla Trabajador
            const queryActualizarBono = 'UPDATE Trabajador SET bono = COALESCE(bono, 0) + ? WHERE id = ?';
            await conn.query(queryActualizarBono, [bonoTotalAcumulado, transaccion.TrabajadorId]);

            //Se guarda cambios en MySQL
            await conn.commit(); 
            conn.release(); 

            return {
                success: true,
                message: 'Transacción creada exitosamente',
                data: { id_transaccion: idTransaccion, precio_total: precioTotalAcumulado }
            }; 

        } catch (error) {
            await conn.rollback(); 
            conn.release(); 
            return { success: false, message: 'Error al crear la transacción: ' + error.message, data: null }; 
        }
    }


    //Punto 14: Cantidad de libros vendidos durante el año actual
    static async totalVendidosAnioActual() {
        try {
            const query = `
                SELECT COUNT(*) AS total_vendidos 
                FROM Transaccion 
                WHERE es_venta = 1 AND YEAR(Fecha) = YEAR(CURDATE())
            `;
            const [resultado] = await connection.query(query);
            return resultado[0].total_vendidos;
        } catch (error) {
            throw new Error("Error en totalVendidosAnioActual: " + error.message);
        }
    }

    //Punto 15: Top 10 libros mas vendidos de Ficcion= 2 (1er Semestre 2026)
    static async top10Ficcion2026() {
        try {
            const query = `
                SELECT l.Nombre, l.Autor, COUNT(t.id) AS total_ventas
                FROM transaccion t
                INNER JOIN libro l ON 1=1 
                WHERE l.Genero = 2  
                  AND t.es_venta = 1
                  AND t.semestre = 1
                  AND YEAR(t.Fecha) = 2026
                GROUP BY l.id, l.Nombre, l.Autor
                ORDER BY total_ventas DESC
                LIMIT 10;
            `;
            const [resultado] = await connection.query(query);
            return resultado;
        } catch (error) {
            throw new Error("Error en top10Ficcion2026: " + error.message);
        }
    }

    //Punto 7: Detalle de prestamo o venta de un usuario especifico para una fecha determinada
    static async consultarPorUsuarioYFecha(Usuarioid, fecha) {
        try {
            const query = `
                SELECT 
                    t.id AS transaccion_id,
                    t.Fecha,
                    t.precio_total,
                    t.es_venta,
                    t.es_prestamo
                FROM Transaccion t
                WHERE t.Usuarioid = ? AND t.Fecha = ?
            `;
            const [rows] = await connection.query(query, [Usuarioid, fecha]);
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al consultar detalle por fecha: " + error.message);
        }
    }

    //Punto 12: Listar libros con prestamo/venta en la semana actual
    static async listarSemanaActual() {
        try {
            //Buscamos los libros que coincidan con los movimientos semanales de las transacciones
            const query = `
                SELECT DISTINCT l.* FROM Transaccion t
                INNER JOIN Libro l ON 1=1
                WHERE YEARWEEK(t.Fecha, 1) = YEARWEEK(CURDATE(), 1)
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al listar libros de la semana actual: " + error.message);
        }
    }

    //Punto 16: Los 10 libros menos prestados de Comedia= 3 (2do Semestre 2025)
    static async top10MenosPrestadosComedia2025() {
        try {
            const query = `
                SELECT 
                    l.id, 
                    l.Nombre, 
                    l.Autor, 
                    COUNT(t.id) AS total_prestamos
                FROM libro l
                LEFT JOIN transaccion t ON 1=1 
                    AND t.es_prestamo = 1 
                    AND t.Fecha BETWEEN '2025-07-01' AND '2025-12-31'
                WHERE l.Genero = 3
                GROUP BY l.id, l.Nombre, l.Autor
                ORDER BY total_prestamos ASC
                LIMIT 10;
            `;
            const [resultado] = await connection.query(query);
            return resultado;
        } catch (error) {
            throw new Error("Error en top10MenosPrestadosComedia2025: " + error.message);
        }
    }
}