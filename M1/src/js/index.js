const express = require('express');
const session = require('express-session');
const path = require('path');
const { SESSION_MAX_AGE, buildHtml, users, requireAuth } = require('./constants.js');

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'webm1',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

app.get('/', (req, res) => {
    if(!req.session.user) { return res.status(302).redirect('/login'); }
    return res.status(302).redirect('/home');
});

app.get('/login', (req, res) => {
    if (req.session.user) { return res.status(302).redirect('/home'); }

    return res.sendFile(
        path.join(process.cwd(), 'src', 'html', 'login.html')
    );
});

app.post('/login', (req, res) => {

    const { username, password, connected } = req.body;

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) {
        return res.status(401).sendFile(
            path.join(process.cwd(), 'src', 'html', 'login.html')
        );
    }

    const keepLogin = connected === '1';

    req.session.user = {
        username: user.username,
        maintainLogin: keepLogin
    };

    user.loginHistory.push({
        loginAt: new Date().toISOString(),
        userAgent: req.headers['user-agent']
    });

    req.session.cookie.maxAge = keepLogin ? SESSION_MAX_AGE : null;

    return res.status(302).redirect('/home');
});

app.get('/home', requireAuth, (req, res) => {
    return res.status(200).send(buildHtml(req));
});

app.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).redirect('/home');
        }
        res.clearCookie('connect.sid');

        return res.status(302).redirect('/login');
    });
});

app.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});