var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
var port = 3000;

app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views','./views_file');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public_file'));

app.get('/topic/new', (req,res) => {
    res.render('new')
})

app.get('/topic', (req,res) => {
    fs.readdir('data',(err,files) => {
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
        res.render('view', {topics:files})
    })
})
app.get('/topic/:id', (req,res) => {
    var id = req.params.id;
    fs.readdir('data',(err,files) => {
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
        fs.readFile('data/'+id, 'utf8', (err,data) => {
            if(err) {
                console.log(err);
                res.status(500).send("Internal Server Error")
            }
            res.render('view',{topics:files, title:id , description : data});
        })
    }) 
})

app.post('/topic',(req,res) => {
    var title = req.body.title
    var description =req.body.description
    fs.writeFile('data/'+title,description ,(err) => {
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
        res.send('Success!')
    })
})

app.get('/' ,(req,res) => {
    res.render('index')
})

app.listen(port , () => {
    console.log('localhost:3000 is connected')
});
