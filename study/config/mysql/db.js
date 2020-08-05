
module.exports = () => {
    var mysql = require('mysql2');
    var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'thdehdaud99',
    database : 'o2'
    });
    conn.connect();
    return conn;
}