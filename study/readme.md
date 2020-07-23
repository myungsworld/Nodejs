## 더 이상 지원하지 않는 orientDB sql 형식

``` javascript
const orientDb = require("orientjs")

var server = orientDb({
    host: 'localhost',
    port: '2424',
    username:'root',
    password: 'thdehdaud99'
})

var db = server.use('o2');
console.log('Using database +' + db.name);

var sql = 'SELECT * FROM topic'

db.query(sql,'#35:0').then(function (results){
    console.log(reuslts);
})
```

 