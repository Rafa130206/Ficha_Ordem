// Aguardar carregamento completo da página e do toast.js
document.addEventListener('DOMContentLoaded', function() {
    // Verificar mensagens do servidor via URL params
    const urlParams = new URLSearchParams(window.location.search);

    // Verificar erro na URL (Spring Security adiciona ?error quando a autenticação falha)
    const error = urlParams.get('error');
    if (error) {
        // Aguardar um pouco para garantir que toast.js foi carregado
        setTimeout(() => {
            if (typeof showError !== 'undefined') {
                showError('E-mail ou senha inválidos', 'Erro no Login');
            } else if (typeof toastManager !== 'undefined') {
                toastManager.error('E-mail ou senha inválidos', 'Erro no Login');
            } else {
                console.error('Sistema de toast não disponível');
            }
        }, 200);
    }

    // Verificar logout bem-sucedido
    const logout = urlParams.get('logout');
    if (logout === 'true') {
        setTimeout(() => {
            if (typeof showSuccess !== 'undefined') {
                showSuccess('Logout realizado com sucesso!', 'Até logo!');
            } else if (typeof toastManager !== 'undefined') {
                toastManager.success('Logout realizado com sucesso!', 'Até logo!');
            }
            // Limpar parâmetro da URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }, 300);
    }

    // Foca no campo de email ao carregar a página
    const usernameField = document.getElementById('username');
    if (usernameField) usernameField.focus();
});
