const models = require('../../database/models')

function signin(req,res) {
    models.User.create({
        email: req.body.email,
        name: req.body.name,
        pw : req.body.pw
    }).then((result) => {
        console.log(result);
        res.send("회원가입을 했습니다")
    }).catch((error) => {
        console.log(error);
        res.send("회원가입을 실패했습니다")
    });
}

module.exports = {
    signin
}