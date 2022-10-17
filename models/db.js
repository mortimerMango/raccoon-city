const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "ralph",
    password: "H0tD@wWg5",
    database: "rc_db"
    
});

pool.getConnection(function (err, connection) {
    if (err) throw err.stack;
    console.log("connected to raccoon city db (models)");

});

module.exports = pool;