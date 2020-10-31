const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({path: path.join(__dirname, '/../.env')});

var sequelize = require('./database/models/index').sequelize;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/', require('./routes/index'))

const { PORT : port } = process.env;
const { HOST : host } = process.env;

//DB
sequelize.sync().then((res)=> {
    console.log("DB connect success!!");
}).catch((error) => {
    console.log(error);
})

console.log(port)

app.listen(port,host);
console.log(`http://${host}:${port} has been connected`)

