const express = require('express');
const router = express.Router();
const user = require('./user')
module.exports = router;

router.post('/signin', (req,res) => {
    user.signin(req,res);
})