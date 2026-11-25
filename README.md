# Advocacia Front

Protótipo de frontend para um escritorio de advocacia, preparado para integracao com backend. O projeto inclui paginas publicas, area autenticada, painel de controle, gestao de casos e uma API local simulada com `localStorage`.

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

A área de demonstração usa dados locais; cadastre usuário fictício no protótipo.

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

Protótipo de frontend com persistência simulada; integração de backend é trabalho futuro.

## Fluxo real e segurança

As páginas chamam funções globais de `advocacia/scripts/api-local.js`. Usuários, sessão, clientes, casos e audiências são dados simulados no navegador. Não há controllers de servidor, banco ou endpoints HTTP implementados. As rotas da seção de integração são **propostas futuras**.

A proteção das páginas é uma verificação JavaScript; o visitante pode ler/alterar o localStorage. Não use dados reais de clientes ou interprete o login como autenticação segura. O cadastro permite criar usuário fictício local para explorar a interface; credenciais fixas não são reproduzidas aqui.

Com Python instalado, uma opção para origem consistente é `python -m http.server 8000 --bind 127.0.0.1 --directory advocacia`; abra `http://127.0.0.1:8000/`. Não há dependências npm, build, `.env` ou migrations. Recursos CDN referenciados pelo HTML dependem de rede.

## Testes e evolução

Não há testes automatizados ou deploy confirmado. Prioridades: especificar contrato a partir das funções locais, implementar autenticação/persistência no servidor e testar antes de receber dados reais. O README interno distingue simulação de arquitetura proposta. Não há LICENSE; a indicação de uso exclusivo no README interno deve ser esclarecida pelo titular antes de redistribuição.
