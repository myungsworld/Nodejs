var express = require('express')
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser('sadfjkdsafnjkasfnk@!#ensfjk'));

var products = {
    1:{title:'The histroy of web 1 '},
    2:{title:'The next web'},
    3:{title:'This is example'}
}

app.get('/products', (req,res)=> {
    output =''
    for(var name in products){
        output +=`
            <li>
                <a href="/cart/${name}">${products[name].title}</a>
            </li>`
    }
    res.send(`<h1>Prodcuts</h1><ul>${output}</ul><a href='/cart/'>Cart</a>`);
    
})



app.get('/cart/:id/', (req,res) =>{
    var id = req.params.id
    if(req.signedCookies.cart){
        var cart = req.signedCookies.cart
    } else {
        var cart = {};
    }
    if (!cart[id]) {
        cart[id] = 0
    }
    cart[id] = parseInt(cart[id]) + 1
    res.cookie('cart' , cart, {signed:true})
    res.redirect('/cart')
})
app.get('/cart', (req,res) => {
    // 쿠키에 저장된 값 가져오는 것
    var cart = req.signedCookies.cart
    if(!cart){
        res.send('Empty')
    }else{
        var output= ''
        for(var id in cart){
            output += `<li>${products[id].title} (${cart[id]})</li>`
        }
    }
    res.send(`<h1>Cart</h1><ul>${output}</ul><a href='/products'>go back to shopping</a>`);
})

app.get('/count', (req,res) => {
    if(req.signedCookies.count){
        var count = parseInt(req.signedCookies.count)
    } else {
        var count = 0;
    }
    count += 1
    res.cookie('count', count ,{signed:true});
    res.send('count : ' + count)
})

app.listen(3003, ()=> {
    console.log('localhost:3003 is connected')
})