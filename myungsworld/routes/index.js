var express = require('express');
var router = express.Router();

//routing
var usersRouter = require('./users');
router.use('/users',usersRouter);
// ./ same folder path ../ previous folder path

/* GET home page. */
router.get('/myungsworld', function(req, res, next) {
  //res.render('index', { title: 'Express' }) 서버가 클라이언트에게 index.ejs를 렌더링하여 보내겠다는 의미
  res.render('index', { title: 'Myungsworld' });
});





module.exports = router;
