// Inicializar ícones Lucide
lucide.createIcons();

// Variáveis globais
const header = document.getElementById('header');
const navMobile = document.getElementById('nav-mobile');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

// Função para rolar suavemente para uma seção
function rolarParaSecao(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
        
        // Fechar menu mobile se estiver aberto
        if (navMobile.classList.contains('active')) {
            toggleMenuMobile();
        }
    }
}

// Função para alternar menu mobile
function toggleMenuMobile() {
    navMobile.classList.toggle('active');
    
    if (navMobile.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
    
    // Reinicializar ícones
    lucide.createIcons();
}

// Adicionar classe 'scrolled' ao header quando rolar a página
window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Manipular envio do formulário
document.getElementById('form-contato').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pegar dados do formulário
    const nome = this.querySelector('[name="nome"]').value;
    const email = this.querySelector('[name="email"]').value;
    const telefone = this.querySelector('[name="telefone"]').value;
    const assunto = this.querySelector('[name="assunto"]').value;
    const mensagem = this.querySelector('[name="mensagem"]').value;
    
    // Exibir mensagem de sucesso
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
    // Limpar formulário
    this.reset();
});

// Animação de entrada para elementos quando aparecem na tela
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    // Elementos para animar
    const elementosAnimados = document.querySelectorAll('.area-card, .membro-card, .depoimento-card, .stat-card');
    
    elementosAnimados.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'all 0.6s ease';
        observador.observe(elemento);
    });
    
    // Inicializar ícones Lucide
    lucide.createIcons();
});

// Reinicializar ícones quando necessário
setInterval(() => {
    lucide.createIcons();
}, 1000);