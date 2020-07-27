const express = require('express')
const app = express()
const bodyParser = require('body-parser')
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

app.get('/topic/add', (req,res) => {
    var sql = `SELECT id,title FROM topic`
    conn.query(sql, (err, topics, fields) => {
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error')
        } else {
            res.render('add',{topics:topics})
        }
    })
})

app.post('/topic/add', (req,res) => {
    var title = req.body.title
    var description = req.body.description
    var author = req.body.author
    var sql = `INSERT INTO topic (title,description,author) VALUES (?,?,?)`
    conn.query(sql, [title,description,author], (err, result) => {
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.redirect('/topic')
        }
    })
})

app.get(['/topic','/topic/:id'], (req,res) => {
    var sql = `SELECT id,title FROM topic`
    conn.query(sql, (err, topics, fields) => {
        var id = req.params.id
        if(id){
            var sql =`SELECT * FROM topic WHERE id=?`
            conn.query(sql, [id], (err, topic, fields) => {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error')
                }else{
                    res.render('view' ,{topics:topics , topic:topic[0]})
                }
            })
        }else{
            res.render('view', {topics:topics})
        }
    })
})

app.listen(port, () => {
    console.log('local host 3000 is connected')
})