const express = require('express')
const app = express()
const bodyParse = require('body-parser')
const port = 3000

var mysql = require('mysql2')
var conn = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    database: 'o2',
    password: 'thdehdaud99'
})

conn.connect();
app.locals.pretty = true;

app.set('view engine', 'pug')
app.set('views','./views_mysql')

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log('local host 3000 is connected')
})