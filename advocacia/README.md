# 📋 Advocacia Premium - Site Profissional

Um site moderno e completo para um escritório de advocacia, desenvolvido com HTML5, CSS3 e JavaScript puro.

---

## 📁 Estrutura de Arquivos

```
advocacia/
├── index.html                    # Página inicial
├── sobre-empresa.html            # Sobre o escritório
├── faq.html                      # Perguntas frequentes
├── autenticacao.html             # Login e cadastro (admin)
├── painel-controle.html          # Dashboard do advogado
├── meus-casos.html               # Gerenciamento de casos
├── style.css                     # Estilos principais
├── estilo-novo.css               # Estilos das páginas de admin
├── script.js                     # Scripts da página pública
├── autenticacao.js               # Lógica de login
├── painel-controle.js            # Lógica do dashboard
└── meus-casos.js                 # Lógica de casos
```

---

## 🎯 Páginas Disponíveis

### Públicas (Para Visitantes)
- **index.html** - Página inicial com apresentação do escritório
- **sobre-empresa.html** - Missão, visão, valores e história
- **faq.html** - Perguntas e respostas frequentes

### Privadas (Área do Advogado)
- **autenticacao.html** - Login/Cadastro
- **painel-controle.html** - Dashboard principal
- **meus-casos.html** - Visualização e gerenciamento de casos

---

## 🚀 Como Usar

### 1. Instalação Básica
- Coloque todos os arquivos em um servidor web
- Nenhuma compilação necessária
- Funciona em qualquer navegador moderno

### 2. Customizar Dados
Edite os seguintes elementos nos arquivos HTML:

**Em todos os arquivos:**
- `Av. Paulista, 1500` → Endereço do seu escritório
- `(11) 3456-7890` → Telefone
- `contato@advocaciapremium.com.br` → Email
- `2026` → Ano correto

**Em index.html:**
- Fotos da equipe (URLs das imagens)
- Nomes dos advogados
- Descrição das áreas de atuação

---

## 🔌 Integração com Backend

### Estrutura de Dados Esperada

O código está preparado para trabalhar com qualquer backend. Para integrar, você precisará fazer requisições HTTP para:

#### Autenticação
- **POST** `/login` → Email e senha
- **POST** `/cadastro` → Dados do novo usuário
- **POST** `/logout` → Finalizar sessão

#### Casos
- **GET** `/casos` → Listar todos os casos
- **GET** `/casos/:id` → Obter um caso específico
- **POST** `/casos` → Criar novo caso
- **PUT** `/casos/:id` → Atualizar caso
- **DELETE** `/casos/:id` → Deletar caso

#### Clientes
- **GET** `/clientes` → Listar clientes
- **POST** `/clientes` → Novo cliente
- **PUT** `/clientes/:id` → Atualizar cliente

### Modelos de Dados Sugeridos

**Usuário/Advogado:**
```
{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  senha: string (hasheada),
  fotoPerfil: string (URL),
  especialidades: array
}
```

**Cliente:**
```
{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  cpfCnpj: string,
  endereco: string,
  dataCadastro: date
}
```

**Caso:**
```
{
  id: string,
  numeroCaso: string,
  clienteId: string,
  tipo: string (trabalhista, imobiliario, familia, etc),
  status: string (andamento, pendente, pausado, finalizado),
  foro: string,
  dataInicio: date,
  dataTermino: date (ou null),
  descricao: string,
  valorCausa: number,
  documentos: array,
  movimentacoes: array
}
```

### Exemplo de Requisição

Em `autenticacao.js`, você verá chamadas como:

```javascript
fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha })
})
```

Configure a URL base conforme necessário.

---

## 🔧 O que o backend precisa fazer (PHP ou Node)

O frontend já espera uma API REST com os endpoints listados acima. Seu amigo pode escolher PHP ou Node, mas precisa garantir:

- Respostas em JSON consistentes (status HTTP corretos).
- Autenticação por sessão ou token (JWT).
- CORS configurado para o domínio do site.
- Persistência em banco (MySQL/Postgres/SQLite/Mongo).
- Validação de entrada e mensagens de erro claras.
- No frontend, está usando LocalStorage para simular o backend enquanto não existe servidor real.
- Para zerar os dados simulados, basta limpar o LocalStorage do navegador.

### Opção A: PHP (puro ou framework)

O que implementar:
- Rotas para `/login`, `/cadastro`, `/logout`, `/casos`, `/clientes`.
- Conexão com banco e CRUD das tabelas.
- Hash de senha com `password_hash()` e validação com `password_verify()`.
- Se for PHP, o ambiente esperado é o **XAMPP** (Apache + PHP + MySQL).

Estrutura sugerida (PHP puro):
- `api/index.php` como front controller.
- `api/routes/*.php` para separar rotas.
- `api/db.php` para conexão.

Exemplo de resposta:
```json
{ "ok": true, "data": { ... } }
```

### Opção B: Node.js (Express)

O que implementar:
- `express.json()` para receber JSON.
- Rotas para `/login`, `/cadastro`, `/logout`, `/casos`, `/clientes`.
- Middleware de autenticação (JWT ou sessão).

Estrutura sugerida:
- `server.js` (ou `app.js`) para iniciar o servidor.
- `routes/` para endpoints.
- `controllers/` para lógica.
- `db/` para conexão com o banco.

Libs comuns:
- `express`, `cors`, `bcrypt`, `jsonwebtoken`, `dotenv`.

---

## 🎨 Personalização

### Cores
As cores principais estão definidas em `style.css`:

```css
:root {
    --cor-primaria: #d97706;        /* Laranja */
    --cor-primaria-escura: #b45309; /* Laranja escuro */
    --cor-texto: #1f2937;           /* Cinza escuro */
    --cor-texto-claro: #6b7280;     /* Cinza claro */
    --cor-fundo: #ffffff;           /* Branco */
    --cor-fundo-claro: #f9fafb;     /* Cinza muito claro */
}
```

Altere esses valores para mudar o esquema de cores.

### Tipografia
As fontes estão definidas em `style.css`. Você pode adicionar Google Fonts ou outras.

### Imagens
- Banner/Hero images nas páginas
- Fotos da equipe
- Logo do escritório

---

## 📱 Responsividade

O site é totalmente responsivo para:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (até 767px)

---

## 🔐 Segurança

### Frontend
- Validações básicas em formulários
- Verificação de autenticação antes de páginas privadas
- Armazenamento seguro de tokens (localStorage)

### Backend (Sua Responsabilidade)
- Usar HTTPS/SSL em produção
- Fazer hash de senhas
- Implementar CORS apropriado
- Validar todas as requisições
- Proteger dados sensíveis
- Implementar rate limiting
- Seguir LGPD/GDPR conforme necessário

---

## 📝 Variáveis em Português

Todo o código usa nomes em português para melhor compreensão:

- `loginUsuario()` - Fazer login
- `obterCasos()` - Buscar casos
- `criarCase()` - Criar novo caso
- `validarEmail()` - Validar email
- `formatarData()` - Formatar datas
- `mostrarNotificacao()` - Exibir mensagem

---

## 🐛 Troubleshooting

### "Página em branco"
- Verifique o console do navegador (F12)
- Certifique-se que todos os arquivos estão no mesmo diretório
- Verifique se os caminhos dos arquivos estão corretos

### "Ícones não aparecem"
- A biblioteca Lucide está carregando via CDN
- Verifique a conexão com a internet
- Ou baixe os SVGs localmente

### "Formulários não funcionam"
- Configure o endpoint do backend correto
- Verifique CORS no backend
- Use o console (F12) para ver erros de rede

---

## 📄 Licença

Este projeto é exclusivo para Advocacia Premium.

---

## 📞 Suporte

Para dúvidas sobre o site:
- Verifique o console do navegador (F12 → Console)
- Consulte a documentação HTML/CSS/JavaScript
- Revise os comentários no código

**Última atualização:** Janeiro de 2026

