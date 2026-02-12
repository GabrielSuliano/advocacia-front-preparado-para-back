/**
 * ============================================================
 * CASOS.js - Lógica da Página de Casos
 * ============================================================
 * 
 * Responsável por:
 * - Carregar e exibir casos
 * - Filtrar casos
 * - Exibir detalhes de casos
 */

// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================

let casosGlobal = [];
let caseAtualSelecionado = null;
let modoVisualizacao = 'tabela';

// ============================================================
// FUNÇÕES DE CARREGAMENTO
// ============================================================

/**
 * Carregar casos da API
 */
async function carregarCasos() {
    try {
        const resposta = await obterCasos();

        if (resposta.sucesso && resposta.dados) {
            casosGlobal = resposta.dados;
            exibirCasos(casosGlobal);
        } else {
            mostrarNotificacao('erro', 'Erro ao carregar casos');
        }
    } catch (erro) {
        console.error('Erro ao carregar casos:', erro);
        mostrarNotificacao('erro', 'Erro ao carregar casos');
    }
}

/**
 * Exibir casos de acordo com o modo de visualização
 * @param {Array} casos - Lista de casos a exibir
 */
function exibirCasos(casos) {
    if (modoVisualizacao === 'tabela') {
        exibirCasosTabela(casos);
    } else {
        exibirCasosCards(casos);
    }
}

/**
 * Exibir casos em formato de tabela
 * @param {Array} casos - Lista de casos
 */
function exibirCasosTabela(casos) {
    const container = document.getElementById('tabelaCasosGrande');
    if (!container) return;

    if (casos.length === 0) {
        container.innerHTML = `
            <div style="padding: 60px 20px; text-align: center; background: white; border-radius: 12px;">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 16px; color: var(--cor-texto-claro);"></i>
                <p style="color: var(--cor-texto-claro); font-size: 16px;">Nenhum caso encontrado</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let html = `
        <table class="tabela-casos-grande">
            <thead>
                <tr>
                    <th>Número do Caso</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Foro</th>
                    <th>Data de Início</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
    `;

    casos.forEach(caso => {
        const statusClass = `status-${caso.status}`;
        const statusTexto = {
            'andamento': 'Em Andamento',
            'pendente': 'Pendente',
            'pausado': 'Pausado',
            'finalizado': 'Finalizado'
        }[caso.status] || caso.status;

        const tipoTexto = {
            'trabalhista': 'Trabalhista',
            'imobiliario': 'Imobiliário',
            'familia': 'Família',
            'empresarial': 'Empresarial',
            'civil': 'Civil',
            'tributario': 'Tributário'
        }[caso.tipo] || caso.tipo;

        html += `
            <tr onclick="abrirDetalhesCase('${caso.id}')">
                <td><strong>${caso.numeroCaso}</strong></td>
                <td>${caso.cliente?.nome || '-'}</td>
                <td>${tipoTexto}</td>
                <td><span class="status-badge ${statusClass}">${statusTexto}</span></td>
                <td>${caso.foro || '-'}</td>
                <td>${formatarData(caso.dataInicio)}</td>
                <td>${formatarMoeda(caso.valorCausa)}</td>
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
 * Exibir casos em formato de cards
 * @param {Array} casos - Lista de casos
 */
function exibirCasosCards(casos) {
    const container = document.getElementById('cardsCasosContainer');
    if (!container) return;

    if (casos.length === 0) {
        container.innerHTML = `
            <div style="padding: 60px 20px; text-align: center; grid-column: 1/-1; background: white; border-radius: 12px;">
                <p style="color: var(--cor-texto-claro);">Nenhum caso encontrado</p>
            </div>
        `;
        return;
    }

    let html = '';

    casos.forEach(caso => {
        const statusClass = `status-${caso.status}`;
        const statusTexto = {
            'andamento': 'Em Andamento',
            'pendente': 'Pendente',
            'pausado': 'Pausado',
            'finalizado': 'Finalizado'
        }[caso.status] || caso.status;

        const tipoTexto = {
            'trabalhista': 'Trabalhista',
            'imobiliario': 'Imobiliário',
            'familia': 'Família',
            'empresarial': 'Empresarial',
            'civil': 'Civil',
            'tributario': 'Tributário'
        }[caso.tipo] || caso.tipo;

        html += `
            <div class="caso-card" onclick="abrirDetalhesCase('${caso.id}')">
                <h3>${caso.numeroCaso}</h3>
                <p><strong>Cliente:</strong> ${caso.cliente?.nome || '-'}</p>
                <p><strong>Tipo:</strong> ${tipoTexto}</p>
                <p><strong>Foro:</strong> ${caso.foro || '-'}</p>
                <p><strong>Data:</strong> ${formatarData(caso.dataInicio)}</p>
                <p><strong>Valor:</strong> ${formatarMoeda(caso.valorCausa)}</p>
                <div style="margin-top: 12px;">
                    <span class="status-badge ${statusClass}">${statusTexto}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

// ============================================================
// FUNÇÕES DE FILTRO
// ============================================================

/**
 * Aplicar filtros aos casos
 */
function aplicarFiltrosCasos() {
    const status = document.getElementById('filtroStatusCasos')?.value || '';
    const area = document.getElementById('filtroAreaCasos')?.value || '';
    const cliente = document.getElementById('filtroClienteCasos')?.value || '';
    const numero = document.getElementById('filtroCasoCasos')?.value || '';

    const casesFiltrados = casosGlobal.filter(caso => {
        const passaStatus = !status || caso.status === status;
        const passaArea = !area || caso.tipo === area;
        const passaCliente = !cliente || 
            (caso.cliente?.nome || '').toLowerCase().includes(cliente.toLowerCase());
        const passaNumero = !numero || 
            (caso.numeroCaso || '').toLowerCase().includes(numero.toLowerCase());

        return passaStatus && passaArea && passaCliente && passaNumero;
    });

    exibirCasos(casesFiltrados);
}

// ============================================================
// FUNÇÕES DE VISUALIZAÇÃO
// ============================================================

/**
 * Mudar modo de visualização (tabela/cards)
 * @param {string} modo - 'tabela' ou 'cards'
 */
function mudarVisualizacao(modo) {
    modoVisualizacao = modo;

    // Atualizar botões
    const botoes = document.querySelectorAll('.botao-visualizacao');
    botoes.forEach(botao => {
        botao.classList.remove('ativo');
    });

    const botaoAtivo = document.querySelector(`[onclick="mudarVisualizacao('${modo}')"]`);
    if (botaoAtivo) {
        botaoAtivo.classList.add('ativo');
    }

    // Mostrar/ocultar containers
    const tabelaContainer = document.getElementById('tabelaCasosGrande');
    const cardsContainer = document.getElementById('cardsCasosContainer');

    if (modo === 'tabela') {
        tabelaContainer.style.display = 'block';
        cardsContainer.style.display = 'none';
        exibirCasosTabela(casosGlobal);
    } else {
        tabelaContainer.style.display = 'none';
        cardsContainer.style.display = 'grid';
        exibirCasosCards(casosGlobal);
    }

    lucide.createIcons();
}

// ============================================================
// FUNÇÕES DE DETALHES DO CASO
// ============================================================

/**
 * Abrir modal com detalhes do caso
 * @param {string} idCaso - ID do caso
 */
async function abrirDetalhesCase(idCaso) {
    try {
        const resposta = await obterDetalhesCase(idCaso);

        if (resposta.sucesso && resposta.dados) {
            caseAtualSelecionado = resposta.dados;
            exibirDetalhesCase(resposta.dados);
        } else {
            mostrarNotificacao('erro', 'Erro ao carregar detalhes do caso');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarNotificacao('erro', 'Erro ao carregar detalhes do caso');
    }
}

/**
 * Exibir detalhes do caso no modal
 * @param {Object} caso - Dados do caso
 */
function exibirDetalhesCase(caso) {
    // Atualizar título
    document.getElementById('tituloDetalhes').textContent = `Caso: ${caso.numeroCaso}`;

    // Informações principais
    document.getElementById('numeroCasoDetalhes').textContent = caso.numeroCaso;
    document.getElementById('statusDetalhes').innerHTML = 
        `<span class="status-badge status-${caso.status}">${caso.status}</span>`;
    document.getElementById('areaDetalhes').textContent = caso.tipo;
    document.getElementById('clienteDetalhes').textContent = caso.cliente?.nome || '-';
    document.getElementById('foroDetalhes').textContent = caso.foro || '-';
    document.getElementById('valorDetalhes').textContent = formatarMoeda(caso.valorCausa);
    document.getElementById('dataInicioDetalhes').textContent = formatarData(caso.dataInicio);
    document.getElementById('dataTerminoDetalhes').textContent = 
        caso.dataTermino ? formatarData(caso.dataTermino) : 'Em andamento';

    // Descrição
    document.getElementById('descricaoCasoDetalhes').textContent = caso.descricao || '-';

    // Observações
    document.getElementById('observacoesCaso').value = caso.observacoes || '';

    // Histórico/Movimentações
    exibirHistoricoCaso(caso.movimentacoes || []);

    // Documentos
    exibirDocumentosCaso(caso.documentos || []);

    // Abrir modal
    const modal = document.getElementById('modalDetalhesCaso');
    if (modal) {
        modal.style.display = 'flex';
        lucide.createIcons();
    }
}

/**
 * Exibir histórico de movimentações
 * @param {Array} movimentacoes - Lista de movimentações
 */
function exibirHistoricoCaso(movimentacoes) {
    const container = document.getElementById('historicoDetalhes');
    if (!container) return;

    if (movimentacoes.length === 0) {
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center;">Sem movimentações registradas</p>';
        return;
    }

    let html = '';

    movimentacoes.forEach(mov => {
        html += `
            <div class="evento-timeline">
                <div class="evento-data">${formatarDataHora(mov.data)}</div>
                <div class="evento-descricao">${mov.descricao}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Exibir documentos do caso
 * @param {Array} documentos - Lista de documentos
 */
function exibirDocumentosCaso(documentos) {
    const container = document.getElementById('documentosCasoDetalhes');
    if (!container) return;

    if (documentos.length === 0) {
        container.innerHTML = '<p style="color: var(--cor-texto-claro); text-align: center;">Nenhum documento anexado</p>';
        return;
    }

    let html = '';

    documentos.forEach(doc => {
        html += `
            <div class="documento-item">
                <div class="documento-icon">
                    <i data-lucide="file-text"></i>
                </div>
                <div class="documento-info">
                    <div class="documento-nome">${doc.nome}</div>
                    <div class="documento-data">${formatarData(doc.dataCriacao)}</div>
                </div>
                <div class="documento-acao">
                    <button onclick="downloadDocumento('${doc.id}')" title="Download">
                        <i data-lucide="download"></i>
                    </button>
                    <button onclick="deletarDocumentoCaso('${doc.id}')" title="Deletar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    lucide.createIcons();
}

/**
 * Fechar modal de detalhes
 */
function fecharModalCaso() {
    const modal = document.getElementById('modalDetalhesCaso');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================================
// FUNÇÕES DE AÇÕES
// ============================================================

/**
 * Editar caso
 */
function editarCaso() {
    if (!caseAtualSelecionado) return;

    mostrarNotificacao('info', 'Funcionalidade em desenvolvimento');
}

/**
 * Exportar caso para PDF
 */
function exportarCaso() {
    if (!caseAtualSelecionado) return;

    mostrarNotificacao('info', 'Gerando PDF... Funcionalidade em desenvolvimento');
}

/**
 * Download de documento
 * @param {string} idDocumento - ID do documento
 */
function downloadDocumento(idDocumento) {
    // TODO: Implementar download
    mostrarNotificacao('info', 'Download em desenvolvimento');
}

/**
 * Deletar documento do caso
 * @param {string} idDocumento - ID do documento
 */
async function deletarDocumentoCaso(idDocumento) {
    if (!confirm('Tem certeza que deseja deletar este documento?')) {
        return;
    }

    try {
        const resposta = await deletarDocumento(idDocumento);

        if (resposta.sucesso) {
            mostrarNotificacao('sucesso', 'Documento deletado com sucesso');
            // Recarregar detalhes do caso
            if (caseAtualSelecionado) {
                abrirDetalhesCase(caseAtualSelecionado.id);
            }
        } else {
            mostrarNotificacao('erro', resposta.mensagem || 'Erro ao deletar documento');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarNotificacao('erro', 'Erro ao deletar documento');
    }
}

/**
 * Abrir novo caso (redireciona para dashboard)
 */
function abrirNovoCase() {
    redirecionarParaDashboard();
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    if (!protegerPaginaPrivada()) {
        return;
    }

    // Inicializar ícones
    lucide.createIcons();

    // Carregar casos
    carregarCasos();

    // Marcar botão de tabela como ativo por padrão
    const botaoTabela = document.querySelector('[onclick="mudarVisualizacao(\'tabela\')"]');
    if (botaoTabela) {
        botaoTabela.classList.add('ativo');
    }
});
