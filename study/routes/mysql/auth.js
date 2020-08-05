module.exports = (passport) => {
    var express = require('express')
    var route = express.Router()


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