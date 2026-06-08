import { Trabajador } from "../models/Trabajador.js";
import { ValidatorTrabajador, validateTrabajadorSafeParse } from "../utils/TrabajadorValidator.js";

export class TrabajadorController{
    //Metodo para manejar la soli de inicio de sesion, recibe la soli y la respuesta como parametros
    static async IniciarSesion(req, res){
        try{
            //obtener los datos de inicio de sesion del cuerpo de la solitud
            const Data = req.body;

            const validator = validateTrabajadorSafeParse(Data);
            if (!validator.success) {
                return res.status(400).json({
                    message: "Datos de entrada mal",
                    error: validator.error.errors
                });
            }

            console.log(Data);

            //Llamar al metodo IniciarSesion del modelo Trabajdor para verificar las crdenciales del trabajador 
            const respuesta = await Trabajador.IniciarSesion(Data);

            if (respuesta.data == null) {
                return res.status(401).json(respuesta);
            }

            console.log(respuesta);

            res.cookie('token', respuesta.data.token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3600000
            });

            return res.status(respuesta.status).json(respuesta);

        } catch (error) {
            res.status(500).json({
                "status" : "500",
                "message" : "Error al iniciar sesion " + error.message,
                "data" : null
            });
        } 
    
    } 

    static async RegistrarTrabajador(req,res){
        try{
            const Data = req.body;
            console.log(Data);

            const respuesta = await Trabajador.RegistrarTrabajador(Data);
            return res.status(parseInt(respuesta.status)).json(respuesta);

        }catch(error){

            return res.status(500).json({
                "status": 500,
                "message": "Error al registrar trabajador" + error.message,
                "data": null
            });
        }
    }
}