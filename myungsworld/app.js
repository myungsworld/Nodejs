var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

app.use('/', indexRouter);
//app.use('/users', usersRouter);

//user 미들웨어 작성 , 라우팅 경로 잡아주는거 
// var users = require('./routes/users.js');
// app.use('/users',users)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// /app.set('layout','layout');
// app.set("layout extractScripts", true);

app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
