import connection from "../database/DataBase.js";
//Importamos bcrypt para el manejo de contrase;as
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/JwtGenerador.js";

//Clase trabajador que representa a un trabajdor en el sistema
export class Trabajador {
    
    //Metodo estatico para iniciar sesion, recibe un objeto comn los datos de inicio de seison
    static async IniciarSesion(Data) {
        try {
            if (Data === null){
                return {
                    "status": 400,
                    "message": "Datos de inicio de sesion no proporcionados",
                    "data": null
                }
            }

            //Consulta SQL para obtener  la contrasela y el correo del trabajodr con el correo proporcionado
            const query = 'SELECT id, contraseniam correo FROM Trabajadorl WHERE correo = ?'
            const [respuesta] = await connection.query(query, [Data.correo]);

            // Verificar si se encontrto un trabajor con el correo proporcionado
            if (respuesta.length == 0){
                return {
                    "status": 404,
                    "message": "Trabajador no encontrado",
                    "data": null
                }
            }
            
            //Obtener el primer trabajador encontrado (deberia ser unico debido a la restricc de correo unico
            // y verificar la contrasena
        
            const trabajador = respuesta[0];

            //Verificar si la contrasena proporcionada coincide con la contrasena
            //almacenad en la base de datos
            const passwordMatch = await bcrypt.compare(Data.contrasenia, trabajador.contrasenia);
            if (passwordMatch) {
                return {
                    "status": 200,
                    "message": "Inicio de sesion exitoso",
                    "data": {
                        "id": trabajador.id,
                        "correo": trabajador.correo,
                        "contrasenia": trabajador.contrasenia,
                        "token": generateToken(trabajador)
                    }
                }
            }

            return {
                "status": 401,
                "message": "Contrasena incorrecta",
                "data": null
            }
        }catch(error){
            return {
                "status": 500,
                "message": "Error al iniciar sesion"+ error.message,
                "data": null
            }
        }
    }

    static async RegistrarTrabajador(Data) {
        if (Data == null) {
            return {
                "status": 400,
                "message": "Datos de registro no proporcionados",
                "data": null
            }
        }
        
        try {
            const query = 'INSERT INTO Trabajador (bono, contrasenia, correo, estado, nombre, rut, sueldo, rolid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const hashedPassword = await bcrypt.hash(Data.contrasenia, 10);

            const [respuesta] = await connection.query(query, [Data.bono, hashedPassword, Data.correo, true, Data.nombre, Data.rut, Data.sueldo, 1]);

            if(respuesta.affectedRows === 0) {
                return{
                    "status": 400,
                    "message": "Error al registrar trabajador",
                    "data": null
                }
            }

            return {
                "status": 201,
                "message": "Trabajador registrado exitosamente",
                "data": null
            };

        }catch(error){
            return{
                "status": 500,
                "message": "Error al registar trabajador",
                "data": null
            }
        }
    }
}