// Exibe mensagem de erro se houver parâmetro ?error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 5000);
    }
}

// Verifica erro na URL
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');
if (error) showError('Usuário ou senha inválidos');

// Foca no campo de email ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const usernameField = document.getElementById('username');
    if (usernameField) usernameField.focus();
});
