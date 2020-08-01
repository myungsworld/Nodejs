var express = require('express')
var session = require('express-session');
const bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret:'asdjfksdjfkafjk@@N$KJ#$JK',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password:'thdehdaud99',
        database:'o2'
    })
}))

app.get('/count', (req,res) => {
    if(req.session.count){
        req.session.count++
    }else{
        req.session.count = 1;
    }
    res.send('count: '+ req.session.count)
})

app.get('/auth/logout', (req,res) => {
    delete req.session.displayName
    //저장이 끝난후 리다이렉트
    req.session.save(function(){
        res.redirect('/welcome');
    })
})

app.get('/welcome', (req,res) => {
    if(req.session.displayName){
        res.send(`
            <h1>Hello, ${req.session.displayName} <h1>
            <a href='/auth/logout'>Logout</a>
        `)        
    } else {
        res.send(`
        <h1>Welcome</h1>
        <a href='/auth/login'>Login</a>
        `)
    }

})

app.post('/auth/login', (req,res) =>{
    var user = {
        username:'song',
        password:'111',
        displayName:'song'
    }
    var uname = req.body.username
    var pwd = req.body.password
    if(uname === user.username && pwd === user.password){
        //로그인 성공하면, 밑 코드 실행, 그 세션 아이디에 displayName
        //이라는 값으로 user의 displayName 을 저장함
        //서버에 정보 저장
        req.session.displayName = user.displayName
        res.session.save(function(){
            res.redirect(`/welcome`)
        })
    } else {
        res.send(`<a href='/auth/login'>fuck off you motherfucker</a>`)
    }
})

app.get('/auth/login', (req,res) => {
    var output =`
    <h1>Login</h1>
        <form action='/auth/login' method='post'>
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">
            </p>

        </form>
    `;
    res.send(output)
})
app.listen(3003, ()=> {
    console.log('localhost:3003 is connected')
})