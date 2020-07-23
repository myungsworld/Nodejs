var OrientDB = require('orientjs')

var server = OrientDB({
    host : 'localhost' , 
    port : 2424,
    username : 'root',
    password: 'thdehdaud99'
})

var db = server.use('o2')

/*
//저 고유번호를 가진 데이터를 가져오면 콜백 함수를 실행
db.record.get('#35:0').then(function (record) {
    console.log('Loaded record', record.title)
})
*/

//CREATE
var sql = 'SELECT FROM topic';
db.query(sql).then((results) => {
    console.log(results)
})

