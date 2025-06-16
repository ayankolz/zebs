import mysql2 from 'mysql2';

const con = mysql2.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "david",
    database: process.env.DB_NAME || "zebs",
});

con.connect(function(err) {
    if (err) {
        console.error("Connection error:", err.message);
    } else {
        console.log("Database connected");
    }
});

export { con };
