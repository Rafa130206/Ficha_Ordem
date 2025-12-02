// Função para mostrar toast de erro de login
function mostrarErroLogin(mensagem) {
    // Tentar múltiplas vezes para garantir que o toast.js foi carregado
    let tentativas = 0;
    const maxTentativas = 10;

    const tentarMostrar = () => {
        tentativas++;
        if (typeof toastManager !== 'undefined' && toastManager.container) {
            // ToastManager está pronto
            toastManager.error(mensagem || 'E-mail ou senha inválidos', 'Erro no Login');
            return true;
        } else if (typeof showError !== 'undefined') {
            // Função showError está disponível
            showError(mensagem || 'E-mail ou senha inválidos', 'Erro no Login');
            return true;
        } else if (tentativas < maxTentativas) {
            // Ainda não carregou, tentar novamente
            setTimeout(tentarMostrar, 100);
            return false;
        } else {
            // Fallback: alert se o toast não carregar
            console.error('Sistema de toast não disponível após', maxTentativas, 'tentativas');
            alert(mensagem || 'E-mail ou senha inválidos');
            return false;
        }
    };

    setTimeout(tentarMostrar, 100);
}

// Aguardar carregamento completo da página e do toast.js
document.addEventListener('DOMContentLoaded', function() {
    // Verificar mensagens do servidor via URL params
    const urlParams = new URLSearchParams(window.location.search);

    // Verificar erro na URL (Spring Security adiciona ?error quando a autenticação falha)
    // O Spring Security pode adicionar ?error sem valor ou ?error=true
    // A mensagem flash será verificada primeiro no script inline do HTML
    // Aqui fazemos fallback caso não haja mensagem flash
    const error = urlParams.has('error');
    if (error) {
        // Aguardar um pouco para ver se o script inline já exibiu o erro
        setTimeout(() => {
            // Verificar se já foi exibido um toast de erro
            const toastContainer = document.getElementById('toast-container');
            const hasErrorToast = toastContainer && toastContainer.querySelector('.toast-error');

            // Se não houver toast de erro exibido, mostrar erro padrão
            if (!hasErrorToast) {
                mostrarErroLogin('E-mail ou senha inválidos');
            }

            // Limpar parâmetro da URL após mostrar o toast
            setTimeout(() => {
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }, 2000);
        }, 800);
    }

    // Verificar logout bem-sucedido
    const logout = urlParams.get('logout');
    if (logout === 'true') {
        setTimeout(() => {
            if (typeof toastManager !== 'undefined') {
                toastManager.success('Logout realizado com sucesso!', 'Até logo!');
            } else if (typeof showSuccess !== 'undefined') {
                showSuccess('Logout realizado com sucesso!', 'Até logo!');
            }
            // Limpar parâmetro da URL
            setTimeout(() => {
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }, 2000);
        }, 300);
    }

    // Foca no campo de email ao carregar a página
    const usernameField = document.getElementById('username');
    if (usernameField) usernameField.focus();
});
