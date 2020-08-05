module.exports = (passport) => {
    var express = require('express')
    var route = express.Router()
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../../config/mysql/db')()
    route.post('/login',
        passport.authenticate(
            // 저 로컬이라는 값에 의해 passport에 등록된 local객체 콜백함수 실행
            'local', {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false 
        }
    )
    );

    route.get('/facebook',
        passport.authenticate('facebook',
            { scope: 'email' })
    );

    route.get('/facebook/callback',
        passport.authenticate(
            'facebook',{ 
                successRedirect: '/welcome',
                failureRedirect: '/auth/login' 
            }
        )
    );

    route.post('/register', (req,res) => {
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

    route.get('/register', (req,res) => {
        res.render('auth/register')
    })

    route.get('/login', (req,res) => {
        res.render('auth/login')
    })
    route.get('/logout', (req,res) => {
        req.logout()
        req.session.save(function(){
            res.redirect('/welcome');
        })
    })
    return route
}