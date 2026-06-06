import connection from '../database/DataBase.js';

export class Libro {
    //1 Registrar un nuevo libro con los datos exactos que tienes en tu lista
    static async registrar(data) {
        try {
            const query = `
                INSERT INTO Libro (Nombre, Genero, Autor, fecha_recepcion, cantidad_copias, edad_sugerida, editorial, precio, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [respuesta] = await connection.query(query, [
                data.Nombre, 
                data.Genero, 
                data.Autor, 
                data.fecha_recepcion, 
                data.cantidad_copias, 
                data.edad_sugerida, 
                data.editorial, 
                data.precio, 
                true //El estado inicia en true (activo) automaticamente al ingresar
            ]);
            return respuesta;
        } catch (error) {
            throw new Error("Error en el modelo Libro al registrar: " + error.message);
        }
    }

    //4 Actualizar el precio de un libro (Debe ser mayor al actual)
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

    //11 Listar todos los libros disponibles (con stock activo)
    static async listarDisponibles() {
        try {
            const query = 'SELECT * FROM Libro WHERE cantidad_copias > 0 AND estado = true';
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw new Error("Error al listar libros disponibles: " + error.message);
        }
    }
}