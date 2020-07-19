const express = require('express')
const fs = require('fs')

const app = express();

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views','./views')
app.use(express.static('public'));

//post 방식 쓸때 필요 npm install body-parser
//미들웨어
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/form', (req,res) => {
    res.render('form')
})
//이거든
app.get('/form_receiver', (req,res) => {
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+','+description)
})
//이거든 둘다 보안이 뛰어나진 않음 
//대규모 전송방식에 유리함
app.post('/form_receiver', (req,res) => {
    var title = req.body.title;
    var description =req.body.description;
    res.send(title+','+description)
})
app.get('/topic/:id', (req,res) => {
    var topics = [
        'Javascript is ...',
        'Nodejs is...',
        'Express is...'
    ]
    var output = topics[req.params.id]
    res.render('topic',{output:output})
})

app.get('/topic/:id/:mode', (req,res) => {
    res.send(req.params.id+','+req.params.mode)
})

app.get('/', (req,res) => {
    res.render('index', 
    {title: 'Hey',
    message: "Hello there!",
    coding: "coding", 
    time : Date()
    })
})

app.get('/login',(req,res) => {
    res.send('<h1>login plz</h1>')
})


//정적파일 디렉토리 public을 쓴다고 했으니 
//그 안으로 들어가서 경로를 지정할 필요가 없음


app.get('/file',(req,res) => {
    res.send('<img src="/ddong/JS.png">')
})
//이건 노드가 한번만 잡기 때문에 node app.js 를 계속 실행해줘야 함
//코드를 짤땐 정적파일이 편리할 수 있음
app.get('/dynamic', function(req,res){
    let time = Date();
    let lis = '';
    for (let i = 0 ; i<25 ; i++){
        lis = lis + '<li>coding</li>';
    }
    let output = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Document</title>
        </head>
        <body>
            Hello Dynamic!
           <ul> 
            ${lis}
           </ul> 
           ${time}
        </body>
        </html>
    `
    res.send(output)
})


app.get('/a',(req,res) => {
    res.send('/a로 옴')
})
//a를 포함하면 모든 페이지가 이쪽으로옴
// app.get(/a/,(req,res) => {
//     res.send('/a/로 옴')
// })

app.listen(3000, () => {
    console.log('listening is completed')
});