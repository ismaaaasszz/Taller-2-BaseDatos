import mysql2 from "mysql2/promise";

const connection = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "taller2"
});

export default connection;