var express = require('express')
var session = require('express-session');
var bkfd2Password = require("pbkdf2-password");
const bodyParser = require('body-parser');
const e = require('express');
var app = express();
var hasher = bkfd2Password();

app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret:'asdjfksdjfkafjk@@N$KJ#$JK',
    resave: false,
    saveUninitialized: true
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
    res.redirect('/welcome');
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
        <ul>
        <li><a href='/auth/login'>Login</a></li>
        <li><a href='/auth/register'>Register</a></li>
        </ul>    
        `)
    }

})

var users = [
    {
        username:'song',
        password:'qqs8M5dX3+xmZJ3/2+hWnVivSbMvWqIlOruzj5Qn5R9N2S1TRIC0dgJRKA04YT4HBacTB3lhclZCQJ6rIQLWfsMpNCPYJcVYspYDlDCJkG3ciky1hCfnvjTflhbTpaitLymDIHKWU0xApmNEDiM//MYmmzbEQQiCqXeqRUXeVos=',
        salt:'5E87M9IJjfl+MZsGn9VIj51VGeLmCHT2NDWOf8Gnc+hTRJ98lkEIFjam8tOYibLFiyjcujR8vPTVlkhUceTnLw==',
        displayName:'song'
    },
    {
        username:'egoing',
        password:'75feb543611a07d828c82d308e81a759e95f5cc51fe5fbfe3a27bbddb51bcdd4',
        salt:'@$#$njkrsf',
        displayName:'egoing'
    }

]
app.post('/auth/register', (req,res) => {
    return hasher({password:req.body.password},function(err,pass,salt,hash){
        var user = {
            username:req.body.username,
            password:hash,
            displayName:req.body.displayName
        }
        users.push(user);
        req.session.displayName = req.body.displayName
        req.session.save(function(){
            res.redirect('/welcome')
        })
    })
})

app.get('/auth/register', (req,res) => {
    var output = `
    <h1>Register</h1>
    <form action='/auth/register' method ='post'>
        <p>
            <input type = 'text' name ='username' placeholder='username'>
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type='text' name='displayName' placeholder="displayName">
        </p>
        <p>
            <input type='submit'>
    </form>     
    `
    res.send(output)
})


app.post('/auth/login', (req,res) => {
    var uname = req.body.username
    var pwd = req.body.password
    for(var i=0; i<users.length; i++){
        var user = users[i]
        if(uname === user.username) {
            //콜백함수가 나중에 실행되는걸 방지하기 위함
            return hasher({password:pwd, salt:user.salt}, (err,pass,salt,hash) => {
                if(hash === user.password){
                    req.session.displayName = user.displayName;
                    req.session.save(function(){
                        res.redirect('/welcome');
                    })
                } else {
                    res.send(`<a href='/auth/login'>fuck off you motherfucker</a>`)
                }
            })
        }
    //    if(uname === user.username && sha256(user.salt+pwd) === user.password){
    //         //로그인 성공하면, 밑 코드 실행, 그 세션 아이디에 displayName
    //         //이라는 값으로 user의 displayName 을 저장함
    //         //서버에 정보 저장
    //          req.session.displayName = user.displayName
    //         return req.session.save(function(){
    //             res.redirect(`/welcome`)
    //         })
    //     } 
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