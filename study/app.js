const express = require('express')
const fs = require('fs')
const app = express();
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views','./views')

app.get('/topic', (req,res) => {
    var topics = [
        'Javascript is ...',
        'Nodejs is...',
        'Express is...'
    ]
    var output = topics[req.query.id]
    res.render('topic', {topics : output})
})

app.get('/', (req,res) => {
    res.render('index', 
    {title: 'Hey',
    message: "Hello there!",
    coding: "coding", 
    time : Date()
    })
})

app.get('/login',(req,res) =>{
    res.send('<h1>login plz</h1>')
})


//정적파일 디렉토리 public을 쓴다고 했으니 
//그 안으로 들어가서 경로를 지정할 필요가 없음
app.use(express.static('public'));

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


app.get('/a',(req,res) =>{
    res.send('/a로 옴')
})
//a를 포함하면 모든 페이지가 이쪽으로옴
// app.get(/a/,(req,res) => {
//     res.send('/a/로 옴')
// })

app.listen(3000, () => {
    console.log('listening is completed')
});