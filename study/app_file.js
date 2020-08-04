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
    fs.readdir('data', (err,files) => {
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
        res.render('new',{topics:files})
    })
    
})

app.get(['/topic', '/topic/:id'], (req,res) => {
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

app.post('/topic',(req,res) => {
    var title = req.body.title
    var description =req.body.description
    fs.writeFile('data/'+title,description ,(err) => {
        if(err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
    
        res.redirect('/topic/'+title)
    })
})

app.get('/' ,(req,res) => {
    res.render('index')
})

app.listen(port , () => {
    console.log('localhost:3000 is connected')
});
