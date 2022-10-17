const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "your username here",
    password: "your password here",
    database: "your database name here"
    
});

pool.getConnection(function (err, connection) {
    if (err) throw err.stack;
    console.log("connected to raccoon city db (models)");

});

module.exports = pool;
