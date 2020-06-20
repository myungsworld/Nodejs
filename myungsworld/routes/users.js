var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/maingame',function(req,res,next) {
  res.render('maingame');
}); // 이게 안됨;; 설정햇는데

module.exports = router;
