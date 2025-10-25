const senhaInput = document.getElementById('senha');
const confirmSenhaInput = document.getElementById('confirmSenha');
const passwordRequirements = document.getElementById('passwordRequirements');
const registerButton = document.getElementById('registerButton');
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const emailValidation = document.getElementById('emailValidation');

function validatePassword() {
    const senha = senhaInput.value;
    const confirmSenha = confirmSenhaInput.value;

    if (senha.length >= 6) {
        passwordRequirements.textContent = '✅ Mínimo 6 caracteres';
        passwordRequirements.className = 'password-requirements valid';
    } else {
        passwordRequirements.textContent = '❌ Mínimo 6 caracteres';
        passwordRequirements.className = 'password-requirements invalid';
    }

    if (confirmSenha && senha !== confirmSenha) {
        confirmSenhaInput.classList.add('error');
        return false;
    } else {
        confirmSenhaInput.classList.remove('error');
    }

    return senha.length >= 6 && senha === confirmSenha;
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function updateButtonState() {
    const senhaValida = validatePassword();
    const nome = document.getElementById('nome').value.trim();
    const email = emailInput.value.trim();
    const emailValido = validateEmail(email);

    if (email === '') {
        emailValidation.textContent = 'Digite um e-mail válido';
        emailValidation.className = 'email-validation';
        emailInput.classList.remove('error');
    } else if (emailValido) {
        emailValidation.textContent = '✅ E-mail válido';
        emailValidation.className = 'email-validation valid';
        emailInput.classList.remove('error');
    } else {
        emailValidation.textContent = '❌ E-mail inválido';
        emailValidation.className = 'email-validation invalid';
        emailInput.classList.add('error');
    }

    const isValid = senhaValida && nome !== '' && emailValido;
    registerButton.disabled = !isValid;
}

registerForm.addEventListener('submit', function (e) {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        e.preventDefault();
        showError('Por favor, insira um e-mail válido');
        return;
    }

    if (!validatePassword()) {
        e.preventDefault();
        showError('As senhas não coincidem ou são muito curtas');
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = 'Criando conta...';
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

senhaInput.addEventListener('input', updateButtonState);
confirmSenhaInput.addEventListener('input', updateButtonState);
document.getElementById('nome').addEventListener('input', updateButtonState);
emailInput.addEventListener('input', updateButtonState);

document.addEventListener('DOMContentLoaded', function () {
    const nomeField = document.getElementById('nome');
    if (nomeField) nomeField.focus();
    updateButtonState();
});
