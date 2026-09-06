const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const users = [
    {
        username: 'Joao',
        password: '1234'
    }
];

const SESSION_MAX_AGE = 3 * 24 * 60 * 60 * 1000;

const buildHtml = (req) => {
    const user = req.session.user;
    const history = req.cookies.loginHistory || [];
    const lastLogin = history.at(-1);

    return `
        <html>
            <body>
                <h1>Bem vindo, ${user.username}.</h1>

                <p>
                    O seu login foi realizado às
                    ${new Date(lastLogin.loginAt).toLocaleString()}.
                </p>

                <p>
                    Você acessou esta pagina utilizando o navegador:
                    ${lastLogin.userAgent}
                </p>

                <p>
                    Sua sessão é válida
                    ${user.maintainLogin
                        ? `até ${new Date(Date.now() + SESSION_MAX_AGE).toLocaleString()}`
                        : 'até fechar o navegador'
                    }.
                </p>

                <h2>Histórico de acessos</h2>

                <table border="1">
                    <thead>
                        <tr>
                            <th>Data e horário</th>
                            <th>Navegador</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${history.map(login => `
                            <tr>
                                <td>${new Date(login.loginAt).toLocaleString()}</td>
                                <td>${login.userAgent}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <br>

                <a href="/logout">
                    Clique aqui para deslogar
                </a>
            </body>
        </html>
    `;
};

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'op>',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(302).redirect('/login');
    }

    return res.status(302).redirect('/home');
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.status(302).redirect('/home');
    }

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

    const history = req.cookies.loginHistory || [];

    history.push({
        loginAt: new Date().toISOString(),
        userAgent: req.headers['user-agent']
    });

    if (keepLogin) {
        req.session.cookie.maxAge = SESSION_MAX_AGE;
    } else {
        req.session.cookie.maxAge = null;
    }

    const cookieOptions = {
        httpOnly: true
    };

    if (keepLogin) {
        cookieOptions.maxAge = SESSION_MAX_AGE;
    }

    res.cookie('loginHistory', history, cookieOptions);

    return res.status(302).redirect('/home');
});

app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.status(302).redirect('/login');
    }

    return res.status(200).send(buildHtml(req));
});

app.post('/home', (req, res) => {
    if (!req.session.user) {
        return res.status(302).redirect('/login');
    }

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