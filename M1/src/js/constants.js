const SESSION_MAX_AGE = 3 * 24 * 60 * 60 * 1000;

const buildHtml = (req) => {
    const user = req.session.user;
    const account = users.find(
        currentUser => currentUser.username === user.username
    );
    const history = account.loginHistory;
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

const users = [
    {
        username: 'Joao',
        password: '1234',
        loginHistory: []
    },

    {
        username: 'Maria',
        password: '5678',
        loginHistory: []
    }
];

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(302).redirect('/login');
    }

    return next();
};

module.exports = {
    SESSION_MAX_AGE,
    buildHtml,
    users,
    requireAuth
};