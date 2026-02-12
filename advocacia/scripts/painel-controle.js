/**
 * ============================================================
 * DASHBOARD.js - Lógica do Dashboard da Advogada
 * ============================================================
 * 
 * Responsável por:
 * - Carregar dados do dashboard
 * - Gerenciar abas
 * - Exibir estatísticas e resumos
 */

// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================

let abaAtualConsole = 'inicio';
let casosCarregados = [];
let clientesCarregados = [];

// ============================================================
// FUNÇÕES DE NAVEGAÇÃO
// ============================================================

/**
 * Mudar entre abas do console/dashboard
 * @param {string} nomeAba - ID da aba
 */
function mudarAbaConsole(nomeAba) {
    // Remover classe ativa de todas as abas
    const abas = document.querySelectorAll('.aba-dashboard');
    const itensNav = document.querySelectorAll('.item-nav');

    abas.forEach(aba => {
        aba.classList.remove('aba-ativa');
    });

    itensNav.forEach(item => {
        item.classList.remove('ativo');
    });

    // Adicionar classe ativa à aba selecionada
    const abaAtual = document.getElementById(`aba${nomeAba.charAt(0).toUpperCase() + nomeAba.slice(1)}`);
    if (abaAtual) {
        abaAtual.classList.add('aba-ativa');
    }

    // Marcar item de navegação como ativo
    const mapa = {
        'inicio': 'btnInicio',
        'casos': 'btnCasos',
        'clientes': 'btnClientes',
        'documentos': 'btnDocumentos',
        'agenda': 'btnAgenda',
        'relatorios': 'btnRelatorios'
    };

    if (mapa[nomeAba]) {
        const btn = document.getElementById(mapa[nomeAba]);
        if (btn) {
            btn.classList.add('ativo');
        }
    }

    abaAtualConsole = nomeAba;

    // Carregar dados conforme a aba
    if (nomeAba === 'casos') {
        carregarCasosDashboard();
    } else if (nomeAba === 'clientes') {
        carregarClientesDashboard();
    } else if (nomeAba === 'documentos') {
        carregarDocumentosDashboard();
    } else if (nomeAba === 'agenda') {
        carregarAgenda();
    } else if (nomeAba === 'relatorios') {
        carregarRelatorios();
    }

    // Reinicializar ícones
    lucide.createIcons();
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - INÍCIO
// ============================================================

/**
 * Carregar e exibir estatísticas do dashboard
 */
async function carregarEstatisticas() {
    try {
        const resposta = await obterEstatisticas();

        if (resposta.sucesso && resposta.dados) {
            const dados = resposta.dados;

            // Atualizar elementos
            document.getElementById('casosAndamento').textContent = dados.casosAndamento || 0;
            document.getElementById('clientesAtivos').textContent = dados.clientesAtivos || 0;
            document.getElementById('casosFinalizados').textContent = dados.casosFinalizados || 0;
            document.getElementById('audienciasSemana').textContent = dados.audienciasSemana || 0;

            // Atualizar mensagem de saudação
            const mensagemEl = document.getElementById('mensagemSaudacao');
            if (mensagemEl) {
                mensagemEl.textContent = `Você tem ${dados.casosAndamento || 0} casos em andamento`;
            }
        }
    } catch (erro) {
        console.error('Erro ao carregar estatísticas:', erro);
    }
}

/**
 * Carregar casos recentes na seção de início
 */
async function carregarCasosRecentes() {
    try {
        const resposta = await obterCasosRecentes(5);

        if (resposta.sucesso && resposta.dados) {
            const container = document.getElementById('casosRecentesContainer');
            if (!container) return;

            let html = `
                <table class="tabela-casos-compacta">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            resposta.dados.forEach(caso => {
                const statusClass = `status-${caso.status}`;
                html += `
                    <tr onclick="abrirDetalhesCase('${caso.id}')">
                        <td>${caso.numeroCaso}</td>
                        <td>${caso.cliente?.nome || '-'}</td>
                        <td>${caso.tipo}</td>
                        <td><span class="status-badge ${statusClass}">${caso.status}</span></td>
                        <td>
                            <button class="botao-acao" onclick="event.stopPropagation(); abrirDetalhesCase('${caso.id}')">
                                <i data-lucide="eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            container.innerHTML = html;
            lucide.createIcons();
        }
    } catch (erro) {
        console.error('Erro ao carregar casos recentes:', erro);
    }
}

/**
 * Carregar próximas audiências
 */
async function carregarAudienciasProximas() {
    try {
        const resposta = await obterAudienciasProximas(7);

        if (resposta.sucesso && resposta.dados) {
            const container = document.getElementById('audienciasContainer');
            if (!container) return;

            let html = `
                <table class="tabela-audiencias">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Caso</th>
                            <th>Foro</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            resposta.dados.forEach(audiencia => {
                html += `
                    <tr>
                        <td>${formatarData(audiencia.data)}</td>
                        <td>${audiencia.hora || '-'}</td>
                        <td>${audiencia.caso?.numeroCaso || '-'}</td>
                        <td>${audiencia.foro || '-'}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            container.innerHTML = html;
            lucide.createIcons();
        }
    } catch (erro) {
        console.error('Erro ao carregar audiências:', erro);
    }
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - CASOS
// ============================================================

/**
 * Carregar casos para a aba de casos
 */
async function carregarCasosDashboard() {
    try {
        const resposta = await obterCasos();

        if (resposta.sucesso && resposta.dados) {
            casosCarregados = resposta.dados;
            exibirCasosTabelaDashboard(casosCarregados);
        }
    } catch (erro) {
        console.error('Erro ao carregar casos:', erro);
        mostrarNotificacao('erro', 'Erro ao carregar casos');
    }
}

/**
 * Exibir casos em tabela no dashboard
 * @param {Array} casos - Lista de casos
 */
function exibirCasosTabelaDashboard(casos) {
    const container = document.getElementById('tabelaCasosContainer');
    if (!container) return;

    if (casos.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--cor-texto-claro);">Nenhum caso encontrado</p>';
        return;
    }

    let html = `
        <table class="tabela-completa">
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Foro</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    casos.forEach(caso => {
        const statusClass = `status-${caso.status}`;
        html += `
            <tr onclick="abrirDetalhesCase('${caso.id}')">
                <td><strong>${caso.numeroCaso}</strong></td>
                <td>${caso.cliente?.nome || '-'}</td>
                <td>${caso.tipo}</td>
                <td><span class="status-badge ${statusClass}">${caso.status}</span></td>
                <td>${caso.foro || '-'}</td>
                <td>${formatarMoeda(caso.valorCausa)}</td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao" onclick="event.stopPropagation(); abrirDetalhesCase('${caso.id}')" title="Ver detalhes">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="botao-acao" onclick="event.stopPropagation(); editarCasoDashboard('${caso.id}')" title="Editar">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="botao-acao" onclick="event.stopPropagation(); deletarCasoDashboard('${caso.id}')" title="Deletar">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
    lucide.createIcons();
}

/**
 * Aplicar filtros aos casos
 */
function aplicarFiltros() {
    const status = document.getElementById('filtroStatus')?.value || '';
    const area = document.getElementById('filtroArea')?.value || '';
    const cliente = document.getElementById('filtroCliente')?.value || '';

    const casesFiltrados = casosCarregados.filter(caso => {
        const passaStatus = !status || caso.status === status;
        const passaArea = !area || caso.tipo === area;
        const passaCliente = !cliente || 
            (caso.cliente?.nome || '').toLowerCase().includes(cliente.toLowerCase());

        return passaStatus && passaArea && passaCliente;
    });

    exibirCasosTabelaDashboard(casesFiltrados);
}

/**
 * Abrir modal de novo caso
 */
function abrirNovoCase() {
    const modal = document.getElementById('modalNovoCaso');
    if (modal) {
        modal.style.display = 'flex';
        lucide.createIcons();
    }
}

/**
 * Salvar novo caso
 */
document.addEventListener('DOMContentLoaded', function() {
    const formNovoCaso = document.getElementById('formNovoCaso');
    if (formNovoCaso) {
        formNovoCaso.addEventListener('submit', async function(e) {
            e.preventDefault();

            const dadosCase = {
                clienteId: this.querySelector('[name="clienteId"]').value,
                numeroCaso: this.querySelector('[name="numeroCaso"]').value,
                tipoSelecionado: this.querySelector('[name="tipoSelecionado"]').value,
                foro: this.querySelector('[name="foro"]').value,
                dataInicio: this.querySelector('[name="dataInicio"]').value,
                status: this.querySelector('[name="status"]').value,
                descricao: this.querySelector('[name="descricao"]').value,
                valorCausa: this.querySelector('[name="valorCausa"]').value || 0
            };

            try {
                const resposta = await criarCase(dadosCase);

                if (resposta.sucesso) {
                    mostrarNotificacao('sucesso', 'Caso criado com sucesso');
                    document.getElementById('modalNovoCaso').style.display = 'none';
                    this.reset();
                    carregarCasosDashboard();
                } else {
                    mostrarNotificacao('erro', resposta.mensagem || 'Erro ao criar caso');
                }
            } catch (erro) {
                console.error('Erro:', erro);
                mostrarNotificacao('erro', 'Erro ao criar caso');
            }
        });
    }
});

/**
 * Editar caso
 * @param {string} idCaso - ID do caso
 */
async function editarCasoDashboard(idCaso) {
    // TODO: Implementar modal de edição
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Deletar caso
 * @param {string} idCaso - ID do caso
 */
async function deletarCasoDashboard(idCaso) {
    if (confirm('Tem certeza que deseja deletar este caso?')) {
        try {
            const resposta = await deletarCase(idCaso);

            if (resposta.sucesso) {
                mostrarNotificacao('sucesso', 'Caso deletado com sucesso');
                carregarCasosDashboard();
            } else {
                mostrarNotificacao('erro', resposta.mensagem || 'Erro ao deletar caso');
            }
        } catch (erro) {
            console.error('Erro:', erro);
            mostrarNotificacao('erro', 'Erro ao deletar caso');
        }
    }
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - CLIENTES
// ============================================================

/**
 * Carregar clientes
 */
async function carregarClientesDashboard() {
    try {
        const resposta = await obterClientes();

        if (resposta.sucesso && resposta.dados) {
            clientesCarregados = resposta.dados;
            exibirClientesTabelaDashboard(clientesCarregados);
        }
    } catch (erro) {
        console.error('Erro ao carregar clientes:', erro);
    }
}

/**
 * Exibir clientes em tabela
 * @param {Array} clientes - Lista de clientes
 */
function exibirClientesTabelaDashboard(clientes) {
    const container = document.getElementById('tabelaClientesContainer');
    if (!container) return;

    if (clientes.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhum cliente encontrado</p>';
        return;
    }

    let html = `
        <div class="background-branco" style="border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <table class="tabela-completa" style="margin: 0;">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CPF/CNPJ</th>
                        <th>Casos Ativos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;

    clientes.forEach(cliente => {
        html += `
            <tr>
                <td><strong>${cliente.nome}</strong></td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.cpfCnpj || '-'}</td>
                <td><strong>${cliente.casosAtivos || 0}</strong></td>
                <td>
                    <button class="botao-acao" onclick="editarCliente('${cliente.id}')">
                        <i data-lucide="edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
}

/**
 * Abrir novo cliente
 */
function abrirNovoCliente() {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Editar cliente
 * @param {string} idCliente - ID do cliente
 */
function editarCliente(idCliente) {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - DOCUMENTOS
// ============================================================

/**
 * Carregar documentos
 */
async function carregarDocumentosDashboard() {
    try {
        mostrarNotificacao('info', 'Carregando documentos...');
    } catch (erro) {
        console.error('Erro ao carregar documentos:', erro);
    }
}

/**
 * Abrir upload de documento
 */
function abrirUploadDocumento() {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - AGENDA
// ============================================================

/**
 * Carregar agenda
 */
async function carregarAgenda() {
    try {
        mostrarNotificacao('info', 'Carregando agenda...');
    } catch (erro) {
        console.error('Erro ao carregar agenda:', erro);
    }
}

// ============================================================
// FUNÇÕES DE CARREGAMENTO - RELATÓRIOS
// ============================================================

/**
 * Carregar relatórios
 */
async function carregarRelatorios() {
    try {
        const resposta = await obterRelatorioCasesPorStatus();
        
        if (resposta.sucesso && resposta.dados) {
            // TODO: Implementar gráficos com biblioteca (Chart.js, etc)
            console.log('Relatório de casos por status:', resposta.dados);
        }
    } catch (erro) {
        console.error('Erro ao carregar relatórios:', erro);
    }
}

// ============================================================
// FUNÇÕES DE MENU DO USUÁRIO
// ============================================================

/**
 * Abrir menu do usuário
 */
function abrirMenuUsuario() {
    const menu = document.getElementById('menuDropdownUsuario');
    if (menu) {
        menu.classList.toggle('ativo');
    }
}

/**
 * Abrir perfil
 */
function abrirPerfil() {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Abrir configurações
 */
function abrirConfiguracoes() {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Abrir ajuda
 */
function abrirAjuda() {
    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Abrir notificações
 */
function abrirNotificacoes() {
    mostrarNotificacao('info', 'Você não tem novas notificações');
}

/**
 * Fechar modal caso
 */
function fecharModalCaso() {
    const modal = document.getElementById('modalDetalhesCaso');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    if (!protegerPaginaPrivada()) {
        return;
    }

    const usuario = obterUsuarioLogado();
    if (usuario) {
        const nomeUsuario = document.getElementById('nomeUsuario');
        const nomeUsuarioDash = document.getElementById('nomeUsuarioDash');
        const fotoPerfil = document.getElementById('fotoPerfilDash');
        if (nomeUsuario) nomeUsuario.textContent = usuario.nome;
        if (nomeUsuarioDash) nomeUsuarioDash.textContent = usuario.nome;
        if (fotoPerfil && usuario.fotoPerfil) fotoPerfil.src = usuario.fotoPerfil;
    }

    // Carregar dados iniciais do dashboard
    carregarEstatisticas();
    carregarCasosRecentes();
    carregarAudienciasProximas();

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('menuDropdownUsuario');
        const btnMenu = document.querySelector('.botao-menu-usuario');
        
        if (menu && !menu.contains(e.target) && !btnMenu.contains(e.target)) {
            menu.classList.remove('ativo');
        }
    });

    // Reinicializar ícones
    lucide.createIcons();
});
