var express = require('express')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const e = require('express');
var hasher = bkfd2Password();

var app = express();
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret:'asdjfksdjfkafjk@@N$KJ#$JK',
    resave: false,
    saveUninitialized: true,
    sotre:new FileStore()
}))

app.use(passport.initialize())
app.use(passport.session())

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

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user)
    done(null, user.username);
});
//이 콜백함수는 세션에 저장된 사람들 
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id)
    for(var i=0; i<users.length; i++){
        var user = users[i]
        if(user.username === id){
            return done(null, user)
        }
    }
});
passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username
        var pwd = password
        for(var i=0; i<users.length; i++){
            var user = users[i]
            if(uname === user.username) {
                //콜백함수가 나중에 실행되는걸 방지하기 위함
                return hasher({password:pwd, salt:user.salt}, (err,pass,salt,hash) => {
                    if(hash === user.password){
                        console.log('LocalStrategy', user)
                        done(null,user)
                        //done에 user가 false가 아니라면 serializeUser 실행
                    } else {
                        done(null,false)
                        //done이 false라면 deserializeUser 실행
                    }
                })
            }
        }  
        done(null,false)  
    }
));
app.post('/auth/login',
    passport.authenticate(
        // 저 로컬이라는 값에 의해 passport에 등록된 local객체 콜백함수 실행
        'local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false 
    }
  )
);


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