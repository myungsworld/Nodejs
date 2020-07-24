var mysql      = require('mysql2');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'thdehdaud99',
  database : 'o2'
});

conn.connect();

// conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
/*
var sql ='SELECT * FROM topic'
conn.query(sql,(err ,rows, fields) => {
  if(err){
    console.log(err);
  } else {
    for(var i=0; i<rows.length; i++){
      console.log(rows[i].author);
    }
  }
});
*/
/*
var sql = `INSERT INTO topic (title, description, author) 
           VALUES(?,?,?)`
var params = ['Supervisor', 'Watcher', 'graphittie'];

conn.query(sql, params, (err,rows,fields) => {
  if(err) {
    console.log(err);
  } else {
    console.log(rows.insertId);
  }
})
*/
/*
var sql = `UPDATE topic SET title=?, author=? WHERE id=?`
var params = ['NPM', 'leezche', 1];

conn.query(sql, params, (err,rows,fields) => {
  if(err) {
    console.log(err);
  } else {
    console.log(rows);
  }
})
*/

var sql = `DELETE FROM topic WHERE id=?`
var params = [1];

conn.query(sql, params, (err,rows,fields) => {
  if(err) {
    console.log(err);
  } else {
    console.log(rows);
  }
})
conn.end();