import mysql2 from 'mysql2';

const con = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "david",
    database: "zebs",
})

con.connect(function(err) {
    if(err) {
        console.log("connection error")
    } else {
        console.log("connected")
    }
})

export { con };