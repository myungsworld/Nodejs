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
        res.render("callback", { result : 0 });
    } else {
        res.render("callback", { result : 1 });
    }

})




http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})