module.exports = () => {
    var express = require('express')
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');
    //var FileStore = require('session-file-store')(session);

    var app = express();
    app.set('views', './views/mysql')
    app.set('view engine','pug')
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


    return app
}