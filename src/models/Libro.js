import connection from '../database/DataBase.js';

export class Libro {
//Punto 1: Registrar un nuevo libro
    static async registrar(data) {
        try {
            // AGREGADO: Se incluye 'id' al principio de la estructura y en los VALUES
            const query = `
                INSERT INTO Libro (id, Nombre, Genero, Autor, fecha_recepcion, cantidad_copias, edad_sugerida, editorial, precio, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [respuesta] = await connection.query(query, [
                data.id, // <-- AGREGADO: Pasamos el id que viene desde el api.http
                data.Nombre, 
                data.Genero, 
                data.Autor, 
                data.fecha_recepcion, 
                data.cantidad_copias, 
                data.edad_sugerida, 
                data.editorial, 
                data.precio, 
                true // El estado inicia en true (activo) automaticamente al ingresar
            ]);
            return respuesta;
        } catch (error) {
            throw new Error("Error en el modelo Libro al registrar: " + error.message);
        }
    }

    //Punto 3: Eliminar (deshabilitar) una copia de libro
    static async deshabilitarCopia(idCopia) {
        try {
            const query = 'UPDATE Copia_libro SET estado = 0 WHERE id = ?';
            const [result] = await connection.query(query, [idCopia]);
            return result;
        } catch (error) {
            throw new Error("Error en el modelo Libro (deshabilitarCopia): " + error.message);
        }
    }


    //Punto 4: Actualizar el precio de un libro (Debe ser mayor al actual)
    static async actualizarPrecio(id, nuevoPrecio) {
        try {
            //Buscamos el precio actual en la base de datos para comparar
            const [rows] = await connection.query('SELECT precio FROM Libro WHERE id = ?', [id]);
            if (rows.length === 0) throw new Error("Libro no encontrado");
            
            // Regla de negocio obligatoria: precio nuevo debe ser mayor al actual
            if (nuevoPrecio <= rows[0].precio) {
                throw new Error("El precio nuevo debe ser estrictamente mayor al precio actual");
            }

            const query = 'UPDATE Libro SET precio = ? WHERE id = ?';
            await connection.query(query, [nuevoPrecio, id]);
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //Punto 11: Listar libros con stock disponible
    static async listarDisponibles() {
        try {
            const query = `
                SELECT DISTINCT l.* FROM Libro l
                INNER JOIN Copia_libro cl ON l.id = cl.Libroid
                WHERE cl.estado = 1
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al listar libros disponibles: " + error.message);
        }
    }

    //Punto 13: Incrementar el stock de un libro 
    static async agregarCopia(Libroid, codigoBarra) {
        try {
            const query = 'INSERT INTO Copia_libro (codigo_barra, estado, LibroId) VALUES (?, 1, ?)';
            const [result] = await connection.query(query, [codigoBarra, Libroid]);
            return result;
        } catch (error) {
            throw new Error("Error en el modelo Libro (agregarCopia): " + error.message);
        }
    }
}