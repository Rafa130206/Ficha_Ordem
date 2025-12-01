/**
 * Sistema de Toast para notificações
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Criar container de toasts se não existir
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    /**
     * Mostra um toast de sucesso
     * @param {string} message - Mensagem a ser exibida
     * @param {string} title - Título (opcional)
     * @param {number} duration - Duração em ms (padrão: 4000)
     */
    success(message, title = 'Sucesso', duration = 4000) {
        return this.show('success', message, title, duration);
    }

    /**
     * Mostra um toast de erro
     * @param {string} message - Mensagem a ser exibida
     * @param {string} title - Título (opcional)
     * @param {number} duration - Duração em ms (padrão: 5000)
     */
    error(message, title = 'Erro', duration = 5000) {
        return this.show('error', message, title, duration);
    }

    /**
     * Mostra um toast de informação
     * @param {string} message - Mensagem a ser exibida
     * @param {string} title - Título (opcional)
     * @param {number} duration - Duração em ms (padrão: 4000)
     */
    info(message, title = 'Informação', duration = 4000) {
        return this.show('info', message, title, duration);
    }

    /**
     * Cria e exibe um toast
     * @param {string} type - Tipo do toast (success, error, info)
     * @param {string} message - Mensagem a ser exibida
     * @param {string} title - Título (opcional)
     * @param {number} duration - Duração em ms
     */
    show(type, message, title = '', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Ícone baseado no tipo
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        // Criar estrutura do toast
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Fechar">×</button>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="width: 100%;"></div>
            </div>
        `;

        // Adicionar ao container
        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Configurar progress bar
        const progressBar = toast.querySelector('.toast-progress-bar');
        if (progressBar && duration > 0) {
            progressBar.style.transitionDuration = `${duration}ms`;
            requestAnimationFrame(() => {
                progressBar.style.width = '0%';
            });
        }

        // Auto-remover após duração
        let timeoutId;
        if (duration > 0) {
            timeoutId = setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        // Fechar ao clicar no botão
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.remove(toast);
        });

        return toast;
    }

    /**
     * Remove um toast
     * @param {HTMLElement} toast - Elemento do toast a ser removido
     */
    remove(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Remove todos os toasts
     */
    clear() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => this.remove(toast));
    }
}

// Criar instância global
const toastManager = new ToastManager();

// Funções de conveniência para uso global
function showToast(type, message, title, duration) {
    return toastManager.show(type, message, title, duration);
}

function showSuccess(message, title, duration) {
    return toastManager.success(message, title, duration);
}

function showError(message, title, duration) {
    return toastManager.error(message, title, duration);
}

function showInfo(message, title, duration) {
    return toastManager.info(message, title, duration);
}

