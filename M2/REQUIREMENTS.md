# Web Progamming - M2

## Objetivo

O presente trabalho, que compõe a segunda média (M2) da disciplina Progamação Web, ministrada pelo professor Rafael, é separado em duas fases, sendo elas uma com foco em CSS e outra que solicita o desenvolvimento de uma aplicação completa.

## Fase 1 - CSS

Nesta fase, é solicitado criar um tema em CSS, seguindo estritamente uma série de requisitos solicitados pelo professor.

## Fase 1 - Requisitos

### Tabelas

1. [Padding](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/padding) das células td devem ser 20px.

2. Cabeçalhos th com cor de fundo a escolher.

3. Cabeçalho com [border-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-bottom) solid 3px, cor a definir.

4. [Pseudo Classe](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-classes) das linhas tr alterando a cor de fundo (a escolher) ao selecionar.

5. Texto com tamanho 0.75em

6. As celulas devem ter [vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/vertical-align) para a parte superior(top).

7. As celulas devem forçar a [word-wrap](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/overflow-wrap) automaticamente.

8. As celulas devem ter seu conteúdo [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-align) *justify*.

9. A ultima linha da tabela deve ter uma [border-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-bottom) solid 1px.

### Input, Text Area e Select

1. Fonte com tamanho fixo 0.85em.
2. Campo que estiver sendo preenchido, deve ter uma cor em destaque. [:hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover)
3. [Padding](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/padding) em 5px.
4. [Labels](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/label) em **negrito**.

### Para a toda página

1. [Padding-Left](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/padding-left) e [Padding-Right](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-right) em 15px.
2. Todo texto da página, esteja em parágrafos (p), células (td), caixas (span, div, etc) devem ter as [line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-height) de 1.6, aumentando assim o espaçamento padrão.

## Fase 2 - Web, JS e CSS

E nesta fase, utilizando o tema criado anteriormente, é solicitado criar um formulário de cadastro de obras num museu.

## Fase 2 - Requisitos

### Formulário

1. O formulário deve cadastrar obras de museu e conter os seguintes campos:
   - Nome da obra em texto livre, em uma linha, com limite de 100 caracteres.
   - Autor em texto livre, em uma linha, com limite de 100 caracteres.
   - Ano da obra em texto livre, em uma linha, com limite de 4 caracteres.
   - Período da obra com as opções vazio, d.C. e a.C.
   - Tipo com as opções vazio, quadro, escultura e outro.
   - Detalhamento em texto livre, com múltiplas linhas e limite de 2000 caracteres.

### Validação

1. Criar uma função em JavaScript para validar os dados do formulário.
2. Todos os campos são obrigatórios, exceto o detalhamento.
3. O nome da obra deve ter no mínimo 6 caracteres.
4. O nome do autor deve ter no mínimo 10 caracteres.
5. O ano da obra deve ser um número válido.
6. Os campos de seleção devem ter um valor válido selecionado; o valor vazio não é válido.
7. Após processar a validação, a função deve:
   a. Exibir uma lista (`ul`) com um item para cada campo que falhou na validação e uma mensagem explicando o motivo.
   b. Exibir cada campo que falhou na validação com as bordas vermelhas.
   c. Limpar a lista de mensagens e as bordas ao iniciar uma nova validação.

### Registro

1. O formulário deve conter um botão para ativar a validação e registrar ou salvar os dados.
2. Quando os dados estiverem validados, devem ser registrados em uma tabela.
3. A tabela deve ter uma coluna para cada campo do formulário, exceto o detalhamento.
4. Ao clicar em uma linha de dados da tabela, deve ser exibido o conteúdo do campo detalhamento.
5. Cada linha de dados da tabela deve conter um botão para excluir a linha.
   a. Antes de executar a exclusão, deve ser solicitada a confirmação do usuário.
