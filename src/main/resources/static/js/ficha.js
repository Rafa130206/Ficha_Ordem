function updateTestValues(input) {
    const value = parseInt(input.value) || 0;
    const attrContainer = input.closest('.attr');
    const dots = attrContainer.querySelectorAll('.dot');

    const testTable = {
        1: { normal: 20, bom: null, extremo: null },
        2: { normal: 19, bom: 20, extremo: null },
        3: { normal: 18, bom: 20, extremo: null },
        4: { normal: 17, bom: 19, extremo: null },
        5: { normal: 16, bom: 19, extremo: 20 },
        6: { normal: 15, bom: 18, extremo: 20 },
        7: { normal: 14, bom: 18, extremo: 20 },
        8: { normal: 13, bom: 17, extremo: 20 },
        9: { normal: 12, bom: 17, extremo: 20 },
        10: { normal: 11, bom: 16, extremo: 19 },
        11: { normal: 10, bom: 16, extremo: 19 },
        12: { normal: 9, bom: 15, extremo: 19 },
        13: { normal: 8, bom: 15, extremo: 19 },
        14: { normal: 7, bom: 14, extremo: 19 },
        15: { normal: 6, bom: 14, extremo: 18 },
        16: { normal: 5, bom: 13, extremo: 18 },
        17: { normal: 4, bom: 13, extremo: 18 },
        18: { normal: 3, bom: 12, extremo: 18 },
        19: { normal: 2, bom: 12, extremo: 18 },
        20: { normal: 1, bom: 11, extremo: 17 },
    };

    // Busca os valores na tabela ou usa valores padrão para valores fora do range
    let normal, bom, extremo;

    if (value >= 1 && value <= 40) {
        const entry = testTable[value];
        normal = entry.normal;
        bom = entry.bom;
        extremo = entry.extremo;
    } else {
        // Para valores fora do range (0 ou >20), não mostra valores
        normal = bom = extremo = null;
    }

    // Atualiza os quadradinhos
    dots.forEach(dot => {
        const testType = dot.getAttribute('data-test');
        let displayValue = '-';

        if (testType === 'normal') {
            displayValue = normal !== null ? normal : '-';
        } else if (testType === 'bom') {
            displayValue = bom !== null ? bom : '-';
        } else if (testType === 'extremo') {
            displayValue = extremo !== null ? extremo : '-';
        }

        dot.textContent = displayValue;
    });
}

// Inicializa valores quando a página carrega
function initializeTestValues() {
    const inputs = document.querySelectorAll('.attr input[type="number"]');
    inputs.forEach(input => {
        updateTestValues(input);
    });
}

// Avatar upload
(function () {
    const input = document.getElementById('avatarInput');
    const avatar = document.querySelector('.avatar');
    if (!input || !avatar) return;

    input.addEventListener('change', function (ev) {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const existing = avatar.querySelector('img');
            if (existing) {
                existing.src = e.target.result;
            } else {
                const img = document.createElement('img');
                img.src = e.target.result;
                avatar.appendChild(img);
            }
            const hint = avatar.querySelector('.hint');
            if (hint) hint.remove();
        };
        reader.readAsDataURL(file);

        // Envia para o servidor
        const form = new FormData();
        form.append('file', file);
        fetch('/ficha/upload-avatar', { method: 'POST', body: form })
            .then(r => r.json())
            .then(json => {
                if (json && json.url) {
                    // Atualiza imagem para URL servida pelo backend
                    const existing = avatar.querySelector('img');
                    if (existing) {
                        existing.src = json.url;
                    }
                }
            })
            .catch(() => {});
    });
})();

// D20 Roll functionality
function rollD20() {
    const d20Button = document.getElementById('d20Button');
    const modal = document.getElementById('d20RollModal');
    const resultDiv = document.getElementById('d20RollResult');

    // Adiciona animação de rolagem
    d20Button.classList.add('d20-rolling');

    // Simula tempo de rolagem
    setTimeout(() => {
        // Remove animação
        d20Button.classList.remove('d20-rolling');

        // Gera resultado aleatório de 1 a 20
        const result = Math.floor(Math.random() * 20) + 1;

        // Mostra o resultado
        resultDiv.textContent = result;
        modal.classList.add('show');

        // Adiciona efeito sonoro visual baseado no resultado
        if (result === 20) {
            resultDiv.style.color = '#10b981'; // Verde para crítico
            resultDiv.style.textShadow = '0 0 30px rgba(16, 185, 129, 0.8)';
        } else if (result === 1) {
            resultDiv.style.color = '#ef4444'; // Vermelho para falha crítica
            resultDiv.style.textShadow = '0 0 30px rgba(239, 68, 68, 0.8)';
        } else {
            resultDiv.style.color = '#3b82f6'; // Azul para resultado normal
            resultDiv.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        }
    }, 1500); // 1.5 segundos de animação
}

function closeD20Modal() {
    const modal = document.getElementById('d20RollModal');
    const resultDiv = document.getElementById('d20RollResult');

    modal.classList.remove('show');

    // Reset das cores
    setTimeout(() => {
        resultDiv.style.color = '#3b82f6';
        resultDiv.style.textShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
    }, 300);
}

// Adiciona evento de clique ao D20
document.addEventListener('DOMContentLoaded', function () {
    const d20Button = document.getElementById('d20Button');
    if (d20Button) {
        d20Button.addEventListener('click', rollD20);
    }

    // Fecha modal ao clicar fora dele
    const modal = document.getElementById('d20RollModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeD20Modal();
            }
        });
    }

    // Fecha modal com tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeD20Modal();
        }
    });
});

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', initializeTestValues);
