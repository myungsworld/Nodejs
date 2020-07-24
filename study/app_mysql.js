var express = require('express')
var app = express()
var fs = require('fs')
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
        res.render('view', {topics:topics})
        }
    })
    /*
    fs.readdir('data', (err,files) => {
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
    var id = req.params.id
    if(id){
        //id 값이 있을 때 
        fs.readFile('data/'+id, 'utf8', (err,data) => {
        if(err) {
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
        res.render('view',{topics:files, title:id , description : data});
      })
    } else {
        // id 값이 없을 떄
        res.render('view', {topics:files, title:'Welcome', description:'Hello, Javascript for server.'})
    }
    })
    */
})
// app.get('/topic/:id', (req,res) => {
//     var id = req.params.id;
//     fs.readdir('data',(err,files) => {
//         if(err){
//             console.log(err);
//             res.status(500).send("Internal Server Error")
//         }
//         fs.readFile('data/'+id, 'utf8', (err,data) => {
//             if(err) {
//                 console.log(err);
//                 res.status(500).send("Internal Server Error")
//             }
//             res.render('view',{topics:files, title:id , description : data});
//         })
//     }) 
// })

app.get('/' ,(req,res) => {
    res.render('index')
})

app.listen(port , () => {
    console.log('localhost:3000 is connected')
});
