//Este archivo se encarga de firmar los tokens de autetificacion cuando
//se logra iniciar sesion con exito

import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import {randomUUID} from 'crypto';

dotenv.config();

export const generateToken = (trabajador)=>{
    //Genera un token JWT para el trabajador proporcionado, incluyendo su id y correo en el payload
    return jsonwebtoken.sign({
        id: trabajador.id,
        correo: trabajador.correo,
        jti: randomUUID()
    },
    
    //La clave secreta para firmar el token, se obtinene de las variables de entorno
    process.env.JWT_SECRET,
    //Opciones del tpken, como el tiempo de expiracion y el algrotimo de firma
    {
        expiresIn: '1h',
        algorithm: 'HS256'
    });
}