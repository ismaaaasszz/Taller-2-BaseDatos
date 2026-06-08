import connection from "../database/DataBase.js";

export class Usuario {
    static async registrar(data) {
        try {
            const query = 'INSERT INTO usuario (nombre, edad, rut, direccion, estado) VALUES (?, ?, ?, ?, ?)';
            const [result] = await connection.query(query, [
                data.nombre,
                data.edad,
                data.rut,
                data.direccion,
                1
            ]);
            return result;
        } catch (error) {
            throw new Error("Error en el modelo Usuario: " + error.message);
        }
    }

    //Punto 5: Desactivar un usuario
    static async desactivarUsuario(id) {
        try {
            const query = `
                UPDATE usuario 
                SET estado = 0 
                WHERE id = ?
            `;
            //Ejecutamos la query y retornamos el primer elemento
            const [resultado] = await connection.query(query, [id]);
            return resultado;
        } catch (error) {
            throw new Error("Error en el modelo al desactivar usuario: " + error.message);
        }
    }

    //Punto 8: Listar usuarios y bibliotecarias consolidados usando UNION
    static async listarUsuariosYBibliotecarias() {
        try {
            const query = `
                SELECT id, nombre, edad, rut, estado, 'Usuario' AS tipo_entidad FROM usuario
                UNION
                SELECT id, nombre, 0 AS edad, rut, estado, 'Bibliotecaria' AS tipo_entidad FROM trabajador
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al listar usuarios y personal: " + error.message);
        }
    }

    //Punto 9: Listar usuarios que tienen al menos una transaccion registrada
    static async listarConTransacciones() {
        try {
            const query = `
                SELECT DISTINCT u.id, u.nombre, u.edad, u.rut, u.direccion, u.estado 
                FROM usuario u
                INNER JOIN Transaccion t ON u.id = t.Usuarioid
            `;
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al listar usuarios con movimientos: " + error.message);
        }
    }

    //Punto 10: Listar absolutamente todos los clientes
    static async listarTodos() {
        try {
            const [rows] = await connection.query('SELECT * FROM usuario');
            return rows;
        } catch (error) {
            throw new Error("Error en el modelo al listar todos los clientes: " + error.message);
        }
    }
}