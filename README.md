# Advocacia Front

Frontend completo para um escritorio de advocacia, preparado para integracao com backend. O projeto inclui paginas publicas, area autenticada, painel de controle, gestao de casos e uma API local simulada com `localStorage`.

O codigo principal esta em:

```text
advocacia/
```

## Recursos

- Pagina inicial institucional.
- Pagina sobre o escritorio.
- FAQ.
- Tela de autenticacao.
- Dashboard do advogado.
- Tela de meus casos.
- Simulacao de backend com `localStorage`.
- Dados mockados de usuarios, clientes, casos e audiencias.
- Validacoes de email, telefone, CPF e senha.
- Estrutura pronta para trocar o mock por API real.

## Stack

- HTML5
- CSS3
- JavaScript puro
- LocalStorage para simulacao de dados
- Lucide Icons via CDN

## Estrutura

```text
advocacia/
├── index.html
├── sobre-empresa.html
├── faq.html
├── autenticacao.html
├── painel-controle.html
├── meus-casos.html
├── estilos/
└── scripts/
```

## Como rodar

Abra `advocacia/index.html` no navegador ou use Live Server no VS Code.

Para acessar a area autenticada, use o usuario mock criado pelo projeto:

```text
admin@advocaciapremium.com.br
12345678
```

## Integracao com backend

O arquivo abaixo concentra a simulacao local:

```text
advocacia/scripts/api-local.js
```

Ele pode ser substituido por chamadas HTTP reais para rotas como:

```text
POST /login
POST /cadastro
POST /logout
GET  /casos
POST /casos
PUT  /casos/:id
DELETE /casos/:id
GET  /clientes
POST /clientes
PUT  /clientes/:id
```

## Status

Frontend funcional, pronto para apresentacao e preparado para receber backend em PHP, Node.js ou outra stack.
