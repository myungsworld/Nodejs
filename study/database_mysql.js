var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'thdehdaud99',
  database : 'o2'
});

connection.connect();