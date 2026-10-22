# Programação Web — M1 e M2

Projeto acadêmico de Programação Web com duas etapas, usando Node.js e Express. A M1 usa sessões para o login; a M2 mantém os cadastros no navegador.

## Requisitos

- Node.js 18 ou superior
- npm

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação

Na raiz do repositório, instale as dependências listadas em `package-lock.json`:

```bash
npm ci
```

Use `npm install` se quiser instalar ou atualizar as dependências com base em `package.json`.

## M2 — Cadastro de obras do museu

Inicie o servidor na raiz do projeto:

```bash
npm run M2
```

Abra <http://localhost:3000/register>. A página permite cadastrar obras, validar os campos, consultar o detalhamento ao selecionar uma linha e excluir uma obra após confirmação. O cadastro feito pelo formulário fica na página e é perdido ao recarregá-la.

O servidor também oferece `POST /register`, que recebe os dados como JSON, valida a obra e devolve o resultado. Esse endpoint não persiste dados. Não há banco de dados. Os requisitos completos estão em [M2/REQUIREMENTS.md](M2/REQUIREMENTS.md).

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## M1 — Login e sessões

Depois de instalar as dependências, inicie a M1 a partir da pasta `M1`:

```bash
cd M1
node src/js/index.js
```

Abra <http://localhost:3000/login>. Contas de exemplo, definidas em `M1/src/js/constants.js`:

| Usuário | Senha |
| --- | --- |
| `Joao` | `1234` |
| `Maria` | `5678` |

A aplicação inclui uma área protegida, opção de manter a sessão por três dias, logout e histórico de acessos em memória. O histórico é apagado quando o processo do servidor termina.

M1 e M2 usam a porta `3000`; encerre um servidor antes de iniciar o outro.

## Testes

Na raiz do repositório, execute:

```bash
npm test
```

Os testes verificam os requisitos de M2 no formulário, na validação, no cadastro e no tema CSS.

## Estrutura

```text
M1/src/html/       Página de login
M1/src/js/         Servidor e lógica da M1
M2/src/public/     HTML, CSS e JavaScript do formulário
M2/src/shared/     Validação compartilhada pelo navegador e servidor da M2
M2/src/js/         Servidor Express da M2
index.js           Testes da M2
```
