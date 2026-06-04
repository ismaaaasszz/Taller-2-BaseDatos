import mysql2 from "mysql2/promise";
import 'dotenv/config';

const connection = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "taller2"
});

export default connection;