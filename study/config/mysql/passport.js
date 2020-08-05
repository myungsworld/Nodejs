module.exports = (app) => {
    var bkfd2Password = require("pbkdf2-password");
    var passport = require('passport')
    var FacebookStrategy = require('passport-facebook').Strategy;
    var LocalStrategy = require('passport-local').Strategy;
    var hasher = bkfd2Password();
    var conn = require('./db')()
    app.use(passport.initialize())
    app.use(passport.session())

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
    return passport
}