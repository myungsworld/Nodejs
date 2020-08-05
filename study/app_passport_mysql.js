var express = require('express')
var session = require('express-session');
//var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
var router = express.Router();
var hasher = bkfd2Password();
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
var app = express();
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret:'asdjfksdjfkafjk@@N$KJ#$JK',
    resave: false,
    saveUninitialized: true,
    sotre:new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password:'thdehdaud99',
        database:'o2'
    })
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('views', './views/mysql')
app.set('view engine','pug')

app.get('/count', (req,res) => {
    if(req.session.count){
        req.session.count++
    }else{
        req.session.count = 1;
    }
    res.send('count: '+ req.session.count)
})

app.get('/auth/logout', (req,res) => {
    req.logout()
    // 아래 코드 대신 사용
    //delete req.session.displayName
    req.session.save(function(){
        res.redirect('/welcome');
    })
})

app.get('/welcome', (req,res) => {
    if(req.user && req.user.displayName){
        res.send(`
            <h1>Hello, ${req.user.displayName} <h1>
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

app.post('/auth/register', (req,res) => {
    hasher({password:req.body.password},function(err,pass,salt,hash){
        var user = {
            'authId':'local:'+req.body.username,
            'username':req.body.username,
            'password':hash,
            'salt':salt,
            'displayName':req.body.displayName
        }
        var sql = `INSERT INTO users SET ?`
        conn.query(sql,user, (err,results) => {
            if(err){
                console.log(err)
                res.status(500);
            } else {
                req.login(user, (err) => {
                    req.session.save(function(){
                        res.redirect('/welcome')
                    })
                })
            }
        })
    })
})

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user)
    done(null, user.authId);
});
//이 콜백함수는 세션에 저장된 정보들을 콜함
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id)
    var sql = `SELECT * FROM users WHERE authId=?`
    conn.query(sql, [id], (err,results) => {
        if(err){
            console.log(err)
            done('There is no user,')
        } else {
            done(null,results[0])
        }
    })

});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username
        var pwd = password
        var sql =`SELECT * FROM users WHERE authId=?`
        conn.query(sql,['local:'+uname], (err,results) => {
            console.log(results);
            if(err){
                return done('There is no user,')
            }
            var user = results[0]
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
        }) 
    }
));

passport.use(new FacebookStrategy({
    clientID: '704951060361842',
    clientSecret: '4770ff717c7581ec83b1ea88d4937676',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','gender','link','locale',
    'name','timezone','updated_time','verified','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    var authId = 'facebook:'+profile.id
    var sql =`SELECT * FROM users WHERE authId=?`
    conn.query(sql,[authId], (err,results) => {
        //사용자가 존재한다면
        if(results.length>0){
            done(null,results[0])
        } else {
            var newuser = {
                'authId':authId,
                'displayName':profile.displayName,
                'email':profile.emails[0].value
            }
            var sql =`INSERT INTO users SET ?`
            conn.query(sql,newuser, (err,results) => {
                if(err){
                    console.log(err)
                    done('Error')
                } else {
                    done(null,newuser)
                }
            })
        }
    })
   }
));


var auth = require('./routes/mysql/auth')(passport)
app.use('/auth', auth)

app.listen(3003, ()=> {
    console.log('localhost:3003 is connected')
})