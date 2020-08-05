var app = require('./config/mysql/express')()
var passport = require('./config/mysql/passport')(app)
var auth = require('./routes/mysql/auth')(passport)

app.set('views', './views/mysql')
app.set('view engine','pug')

app.use('/auth', auth)

app.get('/welcome', (req,res) => {
    if(req.user && req.user.displayName){
        res.send(`
            <h1>Hello, ${req.user.displayName} <h1>
            <a href='/auth/logout'>Logout</a>
        `)        
    } else {
        res.send(`
        <h1>Welcome</h1>
        <ul>
        <li><a href='/auth/login'>Login</a></li>
        <li><a href='/auth/register'>Register</a></li>
        </ul>    
        `)
    }

})

app.listen(3003, ()=> {
    console.log('localhost:3003 is connected')
})