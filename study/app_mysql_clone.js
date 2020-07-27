const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

var mysql = require('mysql2')
const e = require('express')
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

app.get('/topic/:id/edit', (req,res) => {
    var sql =`SELECT id,title FROM topic`
    conn.query(sql, (err, topics, fields) => {
        var id= req.params.id
        if(id){
            var sql = `SELECT * FROM topic WHERE id=?`
            conn.query(sql,[id],(err,topic,fields) => {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error')
                } else {
                    res.render('edit',{topics:topics, topic:topic[0]})
                }
            })
        } else {
            console.log('There is no id.');
            res.status(500).send('Internal Server Error')
        }
    })
})

app.post('/topic/:id/edit', (req,res) => {
    var title = req.body.title
    var description = req.body.description
    var author = req.body.author
    var id = req.params.id
    var sql = `UPDATE topic set title=?,description=?,author=? where id=?`
    conn.query(sql,[title,description,author,id], (err,topic) =>{
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/'+id)
        }
    })
})

app.get('/topic/:id/delete', (req,res) => {
    var sql = `SELECT id,title FROM topic`
    var id = req.params.id
    conn.query(sql, (err,topics,fields) => {
        var sql = `SELECT * FROM topic WHERE id=?`
        conn.query(sql, [id], (err,topic) =>{
            if(err){
                console.log(err)
                res.status(500).send('Internal Server Error')
            }else{
                if(topic.length === 0){
                    console.log('There is no record');
                    res.status(500).send('Internal Server error')
                } else {
                    res.render('delete',{topics:topics, topic:topic[0]})
                }
            }
        })        
    })

})

app.post('/topic/:id/delete', (req,res) => {
    var sql = 'DELETE FROM topic WHERE id=?'
    var id = req.params.id;
    conn.query(sql, [id], (err,result) => {
        res.redirect('/topic/')
    })
})


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
            res.redirect('/topic/'+result.insertId)
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