/**
 * ============================================================
 * API-LOCAL.js - Simula um backend com LocalStorage
 * ============================================================
 * 
 * Responsável por:
 * - Autenticação (cadastro/login/logout)
 * - CRUD básico de casos/clientes
 * - Utilidades comuns (formatação/validações)
 */

// ============================================================
// CHAVES DO STORAGE
// ============================================================

const CHAVE_USUARIOS = 'advocacia_usuarios';
const CHAVE_SESSAO = 'advocacia_sessao';
const CHAVE_CASOS = 'advocacia_casos';
const CHAVE_CLIENTES = 'advocacia_clientes';
const CHAVE_AUDIENCIAS = 'advocacia_audiencias';

// ============================================================
// HELPERS
// ============================================================

function lerStorage(chave, padrao) {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return padrao;
    try {
        return JSON.parse(bruto);
    } catch {
        return padrao;
    }
}

function salvarStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function gerarId() {
    return `id_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function normalizarTexto(texto) {
    return (texto || '').toString().trim().toLowerCase();
}

// ============================================================
// DADOS MOCK
// ============================================================

function inicializarDadosMock() {
    const usuarios = lerStorage(CHAVE_USUARIOS, []);
    if (usuarios.length === 0) {
        usuarios.push({
            id: gerarId(),
            nome: 'Dra. Mariana Souza',
            email: 'admin@advocaciapremium.com.br',
            telefone: '(11) 99999-9999',
            cpf: '52998224725',
            senha: '12345678',
            fotoPerfil: '',
            especialidades: ['civil', 'empresarial']
        });
        salvarStorage(CHAVE_USUARIOS, usuarios);
    }

    const clientes = lerStorage(CHAVE_CLIENTES, []);
    if (clientes.length === 0) {
        const c1 = { id: gerarId(), nome: 'João Pedro Santos', email: 'joao@email.com', telefone: '(11) 98888-1111', cpfCnpj: '12345678909', dataCadastro: '2026-01-10' };
        const c2 = { id: gerarId(), nome: 'Ana Carolina Oliveira', email: 'ana@email.com', telefone: '(11) 97777-2222', cpfCnpj: '98765432100', dataCadastro: '2026-01-15' };
        const c3 = { id: gerarId(), nome: 'Ricardo Mendes', email: 'ricardo@email.com', telefone: '(11) 96666-3333', cpfCnpj: '11122233344', dataCadastro: '2026-01-20' };
        clientes.push(c1, c2, c3);
        salvarStorage(CHAVE_CLIENTES, clientes);
    }

    const casos = lerStorage(CHAVE_CASOS, []);
    if (casos.length === 0) {
        const listaClientes = lerStorage(CHAVE_CLIENTES, []);
        casos.push(
            {
                id: gerarId(),
                numeroCaso: '0001234-56.2025.1.23.0000',
                clienteId: listaClientes[0]?.id,
                tipo: 'empresarial',
                status: 'andamento',
                foro: '1ª Vara Cível',
                dataInicio: '2026-01-05',
                dataTermino: null,
                descricao: 'Ação de cobrança contratual.',
                valorCausa: 150000,
                documentos: [
                    { id: gerarId(), nome: 'Contrato.pdf', dataCriacao: '2026-01-05' }
                ],
                movimentacoes: [
                    { id: gerarId(), data: '2026-01-12T10:30:00', descricao: 'Distribuição do processo.' }
                ],
                observacoes: ''
            },
            {
                id: gerarId(),
                numeroCaso: '0009876-12.2025.1.23.0000',
                clienteId: listaClientes[1]?.id,
                tipo: 'familia',
                status: 'pendente',
                foro: '2ª Vara de Família',
                dataInicio: '2026-01-18',
                dataTermino: null,
                descricao: 'Ação de guarda e alimentos.',
                valorCausa: 35000,
                documentos: [],
                movimentacoes: [],
                observacoes: ''
            }
        );
        salvarStorage(CHAVE_CASOS, casos);
    }

    const audiencias = lerStorage(CHAVE_AUDIENCIAS, []);
    if (audiencias.length === 0) {
        const listaCasos = lerStorage(CHAVE_CASOS, []);
        audiencias.push(
            { id: gerarId(), data: '2026-02-02', hora: '14:00', casoId: listaCasos[0]?.id, foro: '1ª Vara Cível' },
            { id: gerarId(), data: '2026-02-10', hora: '09:30', casoId: listaCasos[1]?.id, foro: '2ª Vara de Família' }
        );
        salvarStorage(CHAVE_AUDIENCIAS, audiencias);
    }
}

inicializarDadosMock();

// ============================================================
// AUTENTICAÇÃO
// ============================================================

function obterUsuarioLogado() {
    const sessao = lerStorage(CHAVE_SESSAO, null);
    if (!sessao?.usuarioId) return null;
    const usuarios = lerStorage(CHAVE_USUARIOS, []);
    return usuarios.find(u => u.id === sessao.usuarioId) || null;
}

function loginUsuario(email, senha) {
    const usuarios = lerStorage(CHAVE_USUARIOS, []);
    const usuario = usuarios.find(u => normalizarTexto(u.email) === normalizarTexto(email));

    if (!usuario || usuario.senha !== senha) {
        return Promise.resolve({ sucesso: false, mensagem: 'Email ou senha inválidos' });
    }

    salvarStorage(CHAVE_SESSAO, { usuarioId: usuario.id, dataLogin: new Date().toISOString() });
    return Promise.resolve({ sucesso: true, dados: { usuario } });
}

function cadastroUsuario(nome, email, telefone, senha, cpf) {
    const usuarios = lerStorage(CHAVE_USUARIOS, []);
    const emailExiste = usuarios.some(u => normalizarTexto(u.email) === normalizarTexto(email));
    const cpfExiste = usuarios.some(u => normalizarTexto(u.cpf) === normalizarTexto(cpf));

    if (emailExiste) {
        return Promise.resolve({ sucesso: false, mensagem: 'E-mail já cadastrado' });
    }

    if (cpfExiste) {
        return Promise.resolve({ sucesso: false, mensagem: 'CPF já cadastrado' });
    }

    const novoUsuario = {
        id: gerarId(),
        nome,
        email,
        telefone,
        cpf: (cpf || '').replace(/\D/g, ''),
        senha,
        fotoPerfil: '',
        especialidades: []
    };

    usuarios.push(novoUsuario);
    salvarStorage(CHAVE_USUARIOS, usuarios);

    return Promise.resolve({ sucesso: true, dados: { usuario: novoUsuario } });
}

function fazerLogout() {
    localStorage.removeItem(CHAVE_SESSAO);
    redirecionarParaLogin();
}

function redirecionarParaLogin() {
    window.location.href = 'autenticacao.html';
}

function redirecionarParaHome() {
    window.location.href = 'index.html';
}

function redirecionarParaDashboard() {
    window.location.href = 'painel-controle.html';
}

function protegerPaginaPrivada() {
    const usuario = obterUsuarioLogado();
    if (!usuario) {
        redirecionarParaLogin();
        return false;
    }
    return true;
}

// ============================================================
// CASOS / CLIENTES
// ============================================================

function obterCasos() {
    const casos = lerStorage(CHAVE_CASOS, []);
    const clientes = lerStorage(CHAVE_CLIENTES, []);
    const casosComCliente = casos.map(c => ({
        ...c,
        cliente: clientes.find(cl => cl.id === c.clienteId) || null
    }));
    return Promise.resolve({ sucesso: true, dados: casosComCliente });
}

function obterDetalhesCase(idCaso) {
    const casos = lerStorage(CHAVE_CASOS, []);
    const clientes = lerStorage(CHAVE_CLIENTES, []);
    const caso = casos.find(c => c.id === idCaso);
    if (!caso) return Promise.resolve({ sucesso: false, mensagem: 'Caso não encontrado' });
    const cliente = clientes.find(c => c.id === caso.clienteId) || null;
    return Promise.resolve({ sucesso: true, dados: { ...caso, cliente } });
}

function criarCase(dadosCase) {
    const casos = lerStorage(CHAVE_CASOS, []);
    const novoCaso = {
        id: gerarId(),
        numeroCaso: dadosCase.numeroCaso,
        clienteId: dadosCase.clienteId,
        tipo: dadosCase.tipoSelecionado,
        status: dadosCase.status,
        foro: dadosCase.foro,
        dataInicio: dadosCase.dataInicio,
        dataTermino: null,
        descricao: dadosCase.descricao || '',
        valorCausa: Number(dadosCase.valorCausa || 0),
        documentos: [],
        movimentacoes: [],
        observacoes: ''
    };
    casos.push(novoCaso);
    salvarStorage(CHAVE_CASOS, casos);
    return Promise.resolve({ sucesso: true, dados: novoCaso });
}

function deletarCase(idCaso) {
    const casos = lerStorage(CHAVE_CASOS, []);
    const atualizados = casos.filter(c => c.id !== idCaso);
    salvarStorage(CHAVE_CASOS, atualizados);
    return Promise.resolve({ sucesso: true });
}

function obterCasosRecentes(limite) {
    return obterCasos().then(resposta => {
        if (!resposta.sucesso) return resposta;
        const ordenados = resposta.dados
            .slice()
            .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio))
            .slice(0, limite);
        return { sucesso: true, dados: ordenados };
    });
}

function obterClientes() {
    const clientes = lerStorage(CHAVE_CLIENTES, []);
    return Promise.resolve({ sucesso: true, dados: clientes });
}

function deletarDocumento(idDocumento) {
    const casos = lerStorage(CHAVE_CASOS, []);
    casos.forEach(caso => {
        caso.documentos = (caso.documentos || []).filter(doc => doc.id !== idDocumento);
    });
    salvarStorage(CHAVE_CASOS, casos);
    return Promise.resolve({ sucesso: true });
}

function obterEstatisticas() {
    const casos = lerStorage(CHAVE_CASOS, []);
    const clientes = lerStorage(CHAVE_CLIENTES, []);
    const casosAndamento = casos.filter(c => c.status === 'andamento').length;
    const casosFinalizados = casos.filter(c => c.status === 'finalizado').length;
    const audienciasSemana = lerStorage(CHAVE_AUDIENCIAS, []).length;
    return Promise.resolve({
        sucesso: true,
        dados: {
            casosAndamento,
            clientesAtivos: clientes.length,
            casosFinalizados,
            audienciasSemana
        }
    });
}

function obterAudienciasProximas() {
    const audiencias = lerStorage(CHAVE_AUDIENCIAS, []);
    const casos = lerStorage(CHAVE_CASOS, []);
    const lista = audiencias.map(a => ({
        ...a,
        caso: casos.find(c => c.id === a.casoId) || null
    }));
    return Promise.resolve({ sucesso: true, dados: lista });
}

function obterRelatorioCasesPorStatus() {
    const casos = lerStorage(CHAVE_CASOS, []);
    const contagem = casos.reduce((acc, caso) => {
        acc[caso.status] = (acc[caso.status] || 0) + 1;
        return acc;
    }, {});
    return Promise.resolve({ sucesso: true, dados: contagem });
}

// ============================================================
// UTILITÁRIOS
// ============================================================

function mostrarNotificacao(tipo, mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <i data-lucide="${tipo === 'sucesso' ? 'check-circle' : tipo === 'erro' ? 'alert-circle' : 'info'}"></i>
            <span>${mensagem}</span>
            <button class="botao-fechar-notif" onclick="this.closest('.notificacao').remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    document.body.appendChild(notificacao);
    lucide.createIcons();
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, 3500);
}

function formatarMoeda(valor) {
    const numero = Number(valor || 0);
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleString('pt-BR');
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function validarTelefone(telefone) {
    return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(telefone || '');
}

function validarSenha(senha) {
    return (senha || '').length >= 8;
}

function validarCPF(cpf) {
    const valor = (cpf || '').replace(/\D/g, '');
    if (valor.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(valor)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(valor.charAt(i), 10) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(valor.charAt(9), 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(valor.charAt(i), 10) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(valor.charAt(10), 10)) return false;

    return true;
}

