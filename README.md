# Programação Web - M1 e M2

Projeto acadêmico da disciplina de Programação Web, dividido em duas etapas:

- **M1:** sistema simples de login com Node.js, Express e sessões. Possui área protegida, opção de manter a sessão por três dias, logout e histórico de acessos em memória.
- **M2:** formulário HTML e CSS para cadastro de obras de museu. Esta etapa ainda está em desenvolvimento; o registro das obras e a validação do formulário não estão concluídos. Os requisitos estão em [M2/REQUIREMENTS.md](M2/REQUIREMENTS.md).

## Como executar o M1

É necessário ter Node.js e npm instalados. Na raiz do projeto, instale as dependências:

```bash
npm install
```

Depois, inicie o servidor a partir da pasta `M1`:

```bash
cd M1
node src/js/index.js
```

Acesse <http://localhost:3000/login> no navegador. Os usuários de exemplo estão definidos em `M1/src/js/constants.js`. O histórico de acessos é perdido quando o servidor é reiniciado.
