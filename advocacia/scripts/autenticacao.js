/**
 * ============================================================
 * AUTH.js - Lógica da Página de Autenticação
 * ============================================================
 * 
 * Responsável por:
 * - Alternância entre abas de login e cadastro
 * - Submissão de formulários
 * - Validações do lado cliente
 */

// Elemento raiz de mensagens
const divMensagem = document.getElementById('mensagemAuth');

// ============================================================
// VALIDAÇÃO EM TEMPO REAL
// ============================================================

function obterGrupoCampo(campo) {
    return campo?.closest('.form-group') || null;
}

function obterMensagemValidacao(grupo) {
    if (!grupo) return null;
    let msg = grupo.querySelector('.mensagem-validacao');
    if (!msg) {
        msg = document.createElement('small');
        msg.className = 'mensagem-validacao';
        grupo.appendChild(msg);
    }
    return msg;
}

function definirEstadoCampo(campo, valido, mensagem) {
    const grupo = obterGrupoCampo(campo);
    if (!grupo) return;
    const msg = obterMensagemValidacao(grupo);
    if (msg) {
        msg.textContent = mensagem || '';
    }
    grupo.classList.toggle('campo-invalido', !valido);
    grupo.classList.toggle('campo-valido', valido);
}

function validarCampoEmail(campo) {
    const valido = validarEmail(campo.value.trim());
    definirEstadoCampo(campo, valido, valido ? '' : 'E-mail inválido');
    return valido;
}

function validarCampoTelefone(campo) {
    const valido = validarTelefone(campo.value.trim());
    definirEstadoCampo(campo, valido, valido ? '' : 'Telefone inválido');
    return valido;
}

function validarCampoCPF(campo) {
    const valor = campo.value.trim();
    const valido = validarCPF(valor);
    definirEstadoCampo(campo, valido, valido ? '' : 'CPF inválido');
    return valido;
}

function validarCampoSenha(campo) {
    const valido = validarSenha(campo.value);
    definirEstadoCampo(campo, valido, valido ? '' : 'Senha mínima: 8 caracteres');
    return valido;
}

function validarCampoConfirmaSenha(campo, campoSenha) {
    const valido = campo.value === campoSenha.value && campo.value.length >= 8;
    definirEstadoCampo(campo, valido, valido ? '' : 'Senhas não conferem');
    return valido;
}

function validarCampoNome(campo) {
    const valido = campo.value.trim().length >= 5;
    definirEstadoCampo(campo, valido, valido ? '' : 'Nome mínimo: 5 caracteres');
    return valido;
}

function aplicarMascaraCPF(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    const partes = [];
    if (numeros.length > 3) {
        partes.push(numeros.slice(0, 3));
        if (numeros.length > 6) {
            partes.push(numeros.slice(3, 6));
            partes.push(numeros.slice(6, 9));
            if (numeros.length > 9) {
                return `${partes[0]}.${partes[1]}.${partes[2]}-${numeros.slice(9, 11)}`;
            }
            return `${partes[0]}.${partes[1]}.${partes[2]}`;
        }
        return `${partes[0]}.${numeros.slice(3)}`;
    }
    return numeros;
}

function aplicarMascaraTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

/**
 * Mudar entre abas de login e cadastro
 * @param {string} nomeAba - 'login' ou 'cadastro'
 */
function mudarAba(nomeAba) {
    // Remover classe ativa de todas as abas
    const abas = document.querySelectorAll('.aba-conteudo');
    const botoes = document.querySelectorAll('.aba-tab');

    abas.forEach(aba => {
        aba.classList.remove('aba-ativa');
    });

    botoes.forEach(botao => {
        botao.classList.remove('aba-ativa');
    });

    // Adicionar classe ativa à aba selecionada
    const abaAtual = document.getElementById(nomeAba);
    if (abaAtual) {
        abaAtual.classList.add('aba-ativa');
    }

    // Marcar botão como ativo
    const botoesAba = document.querySelectorAll('.aba-tab');
    botoesAba.forEach(botao => {
        if (botao.textContent.toLowerCase().includes(nomeAba === 'login' ? 'login' : 'cadastro')) {
            botao.classList.add('aba-ativa');
        }
    });

    // Limpar mensagens
    divMensagem.innerHTML = '';

    // Reinicializar ícones
    lucide.createIcons();
}

/**
 * Alternar visibilidade da senha
 * @param {string} idInput - ID do input de senha
 */
function alternarVisibilidadeSenha(idInput) {
    const inputSenha = document.getElementById(idInput);
    if (inputSenha) {
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
        } else {
            inputSenha.type = 'password';
        }
    }
}

/**
 * Exibir mensagem na página de auth
 * @param {string} tipo - 'sucesso', 'erro', 'aviso'
 * @param {string} mensagem - Mensagem a exibir
 */
function exibirMensagem(tipo, mensagem) {
    const classes = {
        'sucesso': 'mensagem-sucesso',
        'erro': 'mensagem-erro',
        'aviso': 'mensagem-aviso'
    };

    const classeCSS = classes[tipo] || 'mensagem-info';

    divMensagem.innerHTML = `
        <div class="mensagem-auth-conteudo ${classeCSS}">
            <i data-lucide="${tipo === 'erro' ? 'alert-circle' : tipo === 'sucesso' ? 'check-circle' : 'info'}"></i>
            <span>${mensagem}</span>
        </div>
    `;

    lucide.createIcons();
}

/**
 * Validar formulário de login
 * @param {HTMLFormElement} formulario - Formulário a validar
 * @returns {boolean} True se válido
 */
function validarFormularioLogin(formulario) {
    const email = formulario.querySelector('[name="email"]').value.trim();
    const senha = formulario.querySelector('[name="senha"]').value.trim();

    // Verificar campos vazios
    if (!email || !senha) {
        exibirMensagem('erro', 'Preencha todos os campos');
        return false;
    }

    // Validar email
    if (!validarEmail(email)) {
        exibirMensagem('erro', 'Email inválido');
        return false;
    }

    // Validar senha
    if (!validarSenha(senha)) {
        exibirMensagem('erro', 'Senha inválida');
        return false;
    }

    return true;
}

/**
 * Validar formulário de cadastro
 * @param {HTMLFormElement} formulario - Formulário a validar
 * @returns {boolean} True se válido
 */
function validarFormularioCadastro(formulario) {
    const nomeCompleto = formulario.querySelector('[name="nomeCompleto"]').value.trim();
    const email = formulario.querySelector('[name="email"]').value.trim();
    const telefone = formulario.querySelector('[name="telefone"]').value.trim();
    const cpf = formulario.querySelector('[name="cpf"]')?.value.trim();
    const senha = formulario.querySelector('[name="senha"]').value.trim();
    const confirmaSenha = formulario.querySelector('[name="confirmaSenha"]').value.trim();
    const termos = formulario.querySelector('[name="termos"]').checked;

    // Verificar campos vazios
    if (!nomeCompleto || !email || !telefone || !cpf || !senha || !confirmaSenha) {
        exibirMensagem('erro', 'Preencha todos os campos');
        return false;
    }

    // Validar nome (mínimo 5 caracteres)
    if (nomeCompleto.length < 5) {
        exibirMensagem('erro', 'Nome deve ter no mínimo 5 caracteres');
        return false;
    }

    // Validar email
    if (!validarEmail(email)) {
        exibirMensagem('erro', 'Email inválido');
        return false;
    }

    // Validar telefone
    if (!validarTelefone(telefone)) {
        exibirMensagem('erro', 'Telefone deve estar no formato: (11) 9999-9999');
        return false;
    }

    // Validar CPF
    if (!validarCPF(cpf)) {
        exibirMensagem('erro', 'CPF inválido');
        return false;
    }

    // Validar senha
    if (!validarSenha(senha)) {
        exibirMensagem('erro', 'Senha deve ter no mínimo 8 caracteres');
        return false;
    }

    // Verificar se as senhas coincidem
    if (senha !== confirmaSenha) {
        exibirMensagem('erro', 'As senhas não coincidem');
        return false;
    }

    // Verificar aceitar termos
    if (!termos) {
        exibirMensagem('erro', 'Você deve concordar com os termos de uso');
        return false;
    }

    return true;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Formulário de Login
if (document.getElementById('formLogin')) {
    document.getElementById('formLogin').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar formulário
        if (!validarFormularioLogin(this)) {
            return;
        }

        const email = this.querySelector('[name="email"]').value;
        const senha = this.querySelector('[name="senha"]').value;

        // Desabilitar botão
        const botaoEnviar = this.querySelector('button[type="submit"]');
        const textoBotao = botaoEnviar.innerHTML;
        botaoEnviar.disabled = true;
        botaoEnviar.innerHTML = '<i data-lucide="loader"></i> Entrando...';
        lucide.createIcons();

        try {
            // Fazer login
            const resposta = await loginUsuario(email, senha);

            if (resposta.sucesso) {
                exibirMensagem('sucesso', 'Login realizado com sucesso!');
                
                // Aguardar um pouco e redirecionar
                setTimeout(() => {
                    redirecionarParaDashboard();
                }, 1500);
            } else {
                exibirMensagem('erro', resposta.mensagem || 'Erro ao fazer login');
            }
        } catch (erro) {
            exibirMensagem('erro', 'Erro ao conectar ao servidor');
            console.error('Erro:', erro);
        } finally {
            // Reabilitar botão
            botaoEnviar.disabled = false;
            botaoEnviar.innerHTML = textoBotao;
            lucide.createIcons();
        }
    });
}

// Formulário de Cadastro
if (document.getElementById('formCadastro')) {
    document.getElementById('formCadastro').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar formulário
        if (!validarFormularioCadastro(this)) {
            return;
        }

        const nomeCompleto = this.querySelector('[name="nomeCompleto"]').value;
        const email = this.querySelector('[name="email"]').value;
        const telefone = this.querySelector('[name="telefone"]').value;
        const cpf = this.querySelector('[name="cpf"]').value;
        const senha = this.querySelector('[name="senha"]').value;

        // Desabilitar botão
        const botaoEnviar = this.querySelector('button[type="submit"]');
        const textoBotao = botaoEnviar.innerHTML;
        botaoEnviar.disabled = true;
        botaoEnviar.innerHTML = '<i data-lucide="loader"></i> Criando conta...';
        lucide.createIcons();

        try {
            // Fazer cadastro
            const resposta = await cadastroUsuario(nomeCompleto, email, telefone, senha, cpf);

            if (resposta.sucesso) {
                exibirMensagem('sucesso', 'Cadastro realizado com sucesso! Redirecionando...');
                
                // Limpar formulário
                this.reset();

                // Aguardar um pouco e voltar para login
                setTimeout(() => {
                    mudarAba('login');
                }, 2000);
            } else {
                exibirMensagem('erro', resposta.mensagem || 'Erro ao criar conta');
            }
        } catch (erro) {
            exibirMensagem('erro', 'Erro ao conectar ao servidor');
            console.error('Erro:', erro);
        } finally {
            // Reabilitar botão
            botaoEnviar.disabled = false;
            botaoEnviar.innerHTML = textoBotao;
            lucide.createIcons();
        }
    });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones
    lucide.createIcons();

    // Focar no campo de email
    const emailLogin = document.getElementById('emailLogin');
    if (emailLogin) {
        setTimeout(() => {
            emailLogin.focus();
        }, 100);
    }

    // Validação em tempo real - Login
    const senhaLogin = document.getElementById('senhaLogin');
    if (emailLogin) {
        emailLogin.addEventListener('input', () => validarCampoEmail(emailLogin));
        emailLogin.addEventListener('blur', () => validarCampoEmail(emailLogin));
    }
    if (senhaLogin) {
        senhaLogin.addEventListener('input', () => validarCampoSenha(senhaLogin));
        senhaLogin.addEventListener('blur', () => validarCampoSenha(senhaLogin));
    }

    // Validação em tempo real - Cadastro
    const nomeCadastro = document.getElementById('nomeCompleto');
    const emailCadastro = document.getElementById('emailCadastro');
    const telefoneCadastro = document.getElementById('telefoneCadastro');
    const cpfCadastro = document.getElementById('cpfCadastro');
    const senhaCadastro = document.getElementById('senhaCadastro');
    const confirmaSenha = document.getElementById('confirmaSenha');

    if (nomeCadastro) {
        nomeCadastro.addEventListener('input', () => validarCampoNome(nomeCadastro));
        nomeCadastro.addEventListener('blur', () => validarCampoNome(nomeCadastro));
    }
    if (emailCadastro) {
        emailCadastro.addEventListener('input', () => validarCampoEmail(emailCadastro));
        emailCadastro.addEventListener('blur', () => validarCampoEmail(emailCadastro));
    }
    if (telefoneCadastro) {
        telefoneCadastro.addEventListener('input', () => {
            telefoneCadastro.value = aplicarMascaraTelefone(telefoneCadastro.value);
            validarCampoTelefone(telefoneCadastro);
        });
        telefoneCadastro.addEventListener('blur', () => validarCampoTelefone(telefoneCadastro));
    }
    if (cpfCadastro) {
        cpfCadastro.addEventListener('input', () => {
            cpfCadastro.value = aplicarMascaraCPF(cpfCadastro.value);
            validarCampoCPF(cpfCadastro);
        });
        cpfCadastro.addEventListener('blur', () => validarCampoCPF(cpfCadastro));
    }
    if (senhaCadastro) {
        senhaCadastro.addEventListener('input', () => {
            validarCampoSenha(senhaCadastro);
            if (confirmaSenha?.value) {
                validarCampoConfirmaSenha(confirmaSenha, senhaCadastro);
            }
        });
        senhaCadastro.addEventListener('blur', () => validarCampoSenha(senhaCadastro));
    }
    if (confirmaSenha && senhaCadastro) {
        confirmaSenha.addEventListener('input', () => validarCampoConfirmaSenha(confirmaSenha, senhaCadastro));
        confirmaSenha.addEventListener('blur', () => validarCampoConfirmaSenha(confirmaSenha, senhaCadastro));
    }
});
