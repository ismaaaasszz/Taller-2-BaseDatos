import express from 'express';
import connection from './database/DataBase.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());
//controlador para la ruta /LibrosInsertar que inserta libros en la base de datos
app.post("/librosInsertar", async (req, res) => {
    const libros =[
        {
        "id": 1,
        "Nombre": "Cien años de soledad",
        "Genero": "1",
        "Autor": "Gabriel García Márquez",
        "fecha_recepcion": "2026-03-15",
        "cantidad_copias": 3,
        "edad_sugerida": 15,
        "editorial": "Sudamericana",
        "precio": 18990,
        "estado": "1"
         
        }
    ];

    const query = "INSERT INTO Libro (id, Nombre, Genero, Autor, fecha_recepcion, cantidad_copias, edad_sugerida, editorial, precio, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    let LibrosInsertados;
    for (const libro of libros) {
        const [respuesta] = await connection.query(query, [
            libro.id,
            libro.Nombre,
            libro.Genero,
            libro.Autor,
            libro.fecha_recepcion,
            libro.cantidad_copias,
            libro.edad_sugerida,
            libro.editorial,
            libro.precio,
            libro.estado
        ]);
        LibrosInsertados = respuesta.affectedRows > 0 ? true : false;
        }
    if (LibrosInsertados) {
        res.status(201).json({ message: "Libros insertados correctamente", data: libros });
    } else {
        res.status(500).json({ message: "Error al insertar los libros" });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});