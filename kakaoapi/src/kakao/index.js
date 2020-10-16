const express = require('express')
const router = express.Router()
const kakao = require('./kakao')
module.exports = router;

router.get('/login', kakao.login)
