var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var port = 3000;
//-----------DATABASE CONNECTION-------
var mysql = require('mysql2');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'thdehdaud99',
  database : 'o2'
});

conn.connect();
//--------------------------------------
app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views','./views_mysql');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public_file'));

app.get(['/topic/:id/edit'], (req,res) => {
    var sql = `SELECT id,title FROM topic`
    conn.query(sql, (err, topics, fields) => {
        var id = req.params.id;
        if(id){
            var sql ='SELECT * FROM topic WHERE id=?'
            conn.query(sql,[id], (err, topic, fields) => {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error')
                } else {
                    res.render('edit', {topics:topics, topic:topic[0]})
                }
            })
        } else {
            console.log('There is no id.');
            res.status(500).send('Internal Server Error')
        }
    })
})

app.post(['/topic/:id/edit'], (req,res) => {
    var title = req.body.title
    var description =req.body.description
    var author = req.body.author 
    var id =req.params.id;
    var sql = `UPDATE topic SET title=?, description=?, author=?
               WHERE id=?`
    conn.query(sql, [title,description,author, id], (err,rows,fields) =>{
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/'+id);
        }
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

app.post('/topic/add',(req,res) => {
    var title = req.body.title
    var description =req.body.description
    var author = req.body.author 
    var sql ='INSERT INTO topic(title,description,author) VALUES (?,?,?)'
    var params = [title,description,author]
    conn.query(sql,params, (err,result,fields) => {
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        } else {
            res.redirect('/topic/'+result.insertId)
        }
    })
})

app.get('/topic/:id/delete', (req,res) => {
    var sql = `SELECT id,title FROM topic`
    var id = req.params.id
    conn.query(sql, (err, topics, fields) => {
        var sql =`SELECT * FROM topic WHERE id=?`
        conn.query(sql,[id], (err, topic) => {
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error')
            } else {
            // 데이터베이스에 값이 없으면 에러 출력
                if(topic.length === 0){
                    console.log('There is no record');
                    res.status(500).send('Internal Server Error')
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
app.get(['/topic', '/topic/:id'], (req,res) => {
    var sql = `SELECT id,title FROM topic`
    conn.query(sql, (err, topics, fields) => {
        var id = req.params.id;
        if(id){
            var sql ='SELECT * FROM topic WHERE id=?'
            conn.query(sql,[id], (err, topic, fields) => {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error')
                } else {
                    res.render('view', {topics:topics, topic:topic[0]})
                }
            })
        } else {
        res.render('/topic/view', {topics:topics})
        }
    })
})

app.listen(port , () => {
    console.log('localhost:3000 is connected')
});
