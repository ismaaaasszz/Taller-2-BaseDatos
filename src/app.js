import express from 'express';
import trabajadorRouter from './router/Trabajador.js'; 
import libroRouter from './router/Libro.js';           
import transaccionRouter from './router/Transaccion.js';
import usuarioRouter from './router/Usuario.js';

const app = express();
const PORT = 3000;

//Middleware obligatorio para leer formato JSON
app.use(express.json());

//1. Ruta de prueba rápida en el propio app.js para verificar que el puerto funciona
app.get('/test-api', (req, res) => {
    return res.json({ message: "¡El servidor Express de la UCN está vivo!" });
});

//2. Conectamos los enrutadores modulares de tus archivos
app.use('/trabajador', trabajadorRouter);
app.use('/libros', libroRouter); 
app.use('/transaccion', transaccionRouter);
app.use('/usuario', usuarioRouter);

//Levantamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});