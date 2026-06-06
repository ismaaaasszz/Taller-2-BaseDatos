import z from "zod";

//Shema para la estructura basica de un trabajador 
const TrabajadorSchema = z.object({
    //Forma de validar un bono con max y minimo
    bono: z.number({
        error:(iss) => {
            return iss.input === "" || iss.input == undefined
            ? "El precio es obligatorio":"El precio debe ser un numero";
        }
    }).min(0, "El precio debe ser como minimo 0").max(250000, "El precio debe ser como maximo $250000"),

    //Forma de validar un string de email
    correo: z.string().email({
        required_error: 'El email es valido',
        invalid_type_error: 'El email es invalido'
        })

});

//Validacion completa Schema
export const ValidatorTrabajador = (data) =>{
    return TrabajadorSchema.safeParse(data);
}

//Validacioon parcial del Schema
export const validateTrabajadorSafeParse =(data)=> {
    return TrabajadorSchema.partial().safeParse(data);
}

