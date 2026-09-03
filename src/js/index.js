const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser'); 

const app = express();
const users = [{
    username: "Joao",
    password: "1234",
    keepIn: false
}];
const urlencodedParser = bodyParser.urlencoded({ extended: false }); 

app.use(express.static("src"))
app.use(session({
    secret: 'op>',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3 * 24 * 60 * 60 * 1000}
})); 

app.get('/', function(req, res){
    if (!req.session.username)
        return res.redirect("/login")
    
    return res.redirect("/home")
});

app.get('/login', (req, res) => {
    const { username, password, connected } = req.query;

    for (const user of users) {
        if (user.username == username && user.password == password){
            if(connected){
                req.session.username = username;
                req.session.keepIn = true;
            }

            return res.redirect("/home")
        }
    }
    return res.sendFile(path.join(process.cwd(), "\\html\\login.html"));
});

app.post('/login', urlencodedParser, function(req, res){
    const {username, password, connected} = req.body;

    for (const user of users) {
        if (user.username == username && user.password == password){
            if(connected){
                req.session.username = username;
                req.session.keepIn = true;
            }

            return res.redirect("/home")
        }
    }

    users.push({name: username, password: password, keepIn: connected});
    if(connected){
        req.session.username = username;
        req.session.password = password;
        req.session.keepIn = true;
    }
    return res.redirect("/home")

});

app.get('/home', (req, res) => {
    if(!req.session.username)
        return res.redirect('/login')

    res.sendFile(path.join(process.cwd(), "\\html\\index.html"));
});

app.listen(3000, () =>{
    console.log("Running!");
});