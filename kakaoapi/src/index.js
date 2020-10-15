const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const request = require("request");
const rp = require("request-promise")
require('dotenv').config({ path: path.join(__dirname, '/.env') });

const {
    PORT : port,
} = process.env;

app.use(express.static(__dirname + "/views"));
app.set("view engine", "pug");

app.get("/", (req,res) => {
    
    const { KAKAO_KEY } = process.env;
    res.render("index", {apikey : KAKAO_KEY})
    
})

app.get("/auth/callback", async (req,res) => {
    const {KAKAO_KEY : apikey} = process.env; 
    const { code } = req.query;
    //console.log(code)

    const options = {
        uri: "https://kauth.kakao.com/oauth/token",
        method: "POST",
        form: {
            grant_type: "authorization_code",
            client_id: apikey,
            redirect_uri: "http://localhost:8080/auth/callback",
            code: code,
            client_secret: "kmvYJ74iULgxPxLXSSU1I6Me2VwqmXUE"
        },
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
        json: true
    }

    const cb = await rp(options);
    
    if (cb["access_token"]) {
        res.render("home", { result : 0 });
    } else {
        res.render("callback", { result : 1 });
    }

})

//카카오 페이
app.post("/kakao/pay", async (req,res) => {
    const {ADMIN_KEY : adminkey} = process.env;

    const options = {
        uri: "https://kapi.kakao.com/v1/payment/ready",
        method : "POST",
        form : {
            cid : "TC0ONETIME",
            partner_order_id : "partner_order_id",
            partner_user_id : "partner_user_id" ,
            item_name: "초코파이" ,
            quantity: "1" ,
            total_amount: "2200" ,
            vat_amount: "200" ,
            tax_free_amount: "0" ,
            approval_url : "https://developers.kakao.com/success",
            fail_url : "https://developers.kakao.com/fail",
            cancel_url : "https://developers.kakao.com/cancel"
        },
        headers: {
            "content-type" : "application/x-www-form-urlencoded;charset=utf-8",
            "Authorization" : `KakaoAK ${adminkey}`
        },
        json: true
    }

    function callback(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log(body);
        }
        
    }

    request.post(options, callback) 


    res.render('kakaopay')
    
})


http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})