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

// Inventory Management System
class InventoryManager {
    constructor() {
        this.items = [];
        this.moneyInput = document.getElementById('moneyInput');
        this.totalWeightDisplay = document.getElementById('totalWeight');
        this.itemsList = document.getElementById('inventoryItemsList');
        this.addItemBtn = document.getElementById('addItemBtn');

        this.initializeInventory();
        this.bindEvents();
    }

    initializeInventory() {
        // Carrega dados salvos do localStorage se existirem
        const savedData = localStorage.getItem('fichaInventory');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.items = data.items || [];
            if (data.money !== undefined) {
                this.moneyInput.value = data.money;
            }
        }

        this.renderItems();
        this.updateTotalWeight();
    }

    bindEvents() {
        // Evento para adicionar item
        this.addItemBtn.addEventListener('click', () => {
            this.addItem();
        });

        // Evento para salvar dinheiro
        this.moneyInput.addEventListener('input', () => {
            this.saveToLocalStorage();
        });
    }

    addItem() {
        const newItem = {
            id: Date.now(),
            name: '',
            weight: 0
        };

        this.items.push(newItem);
        this.renderItems();
        this.updateTotalWeight();
        this.saveToLocalStorage();

        // Foca no campo de nome do novo item
        const newItemElement = this.itemsList.querySelector(`[data-item-id="${newItem.id}"]`);
        const nameInput = newItemElement.querySelector('.item-name');
        nameInput.focus();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.renderItems();
        this.updateTotalWeight();
        this.saveToLocalStorage();
    }

    updateItem(itemId, field, value) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (field === 'weight') {
                item[field] = parseFloat(value) || 0;
            } else {
                item[field] = value;
            }
            this.updateTotalWeight();
            this.saveToLocalStorage();
        }
    }

    updateTotalWeight() {
        const totalWeight = this.items.reduce((sum, item) => {
            return sum + (parseFloat(item.weight) || 0);
        }, 0);

        this.totalWeightDisplay.textContent = `${totalWeight.toFixed(1)} kg`;
    }

    renderItems() {
        if (this.items.length === 0) {
            this.itemsList.innerHTML = `
                <div class="inventory-empty">
                    Nenhum item no inventário. Clique em "Adicionar Item" para começar.
                </div>
            `;
            return;
        }

        this.itemsList.innerHTML = this.items.map(item => `
            <div class="inventory-item" data-item-id="${item.id}">
                <input
                    type="text"
                    class="item-name"
                    placeholder="Nome do item"
                    value="${item.name}"
                    onchange="inventoryManager.updateItem(${item.id}, 'name', this.value)"
                />
                <input
                    type="number"
                    class="item-weight"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    value="${item.weight}"
                    onchange="inventoryManager.updateItem(${item.id}, 'weight', this.value)"
                />
                <span style="color: #94a3b8; font-size: 12px; min-width: 20px;">kg</span>
                <button
                    type="button"
                    class="btn-remove-item"
                    onclick="inventoryManager.removeItem(${item.id})"
                    title="Remover item"
                >
                    ✕
                </button>
            </div>
        `).join('');
    }

    saveToLocalStorage() {
        const data = {
            items: this.items,
            money: this.moneyInput.value
        };
        localStorage.setItem('fichaInventory', JSON.stringify(data));
    }

    // Método para exportar dados (útil para salvar no backend)
    exportData() {
        return {
            money: parseFloat(this.moneyInput.value) || 0,
            items: this.items.map(item => ({
                nome: item.name,
                peso: parseFloat(item.weight) || 0
            }))
        };
    }

    // Método para importar dados (útil para carregar do backend)
    importData(data) {
        if (data.money !== undefined) {
            this.moneyInput.value = data.money;
        }

        if (data.items && Array.isArray(data.items)) {
            this.items = data.items.map((item, index) => ({
                id: Date.now() + index,
                name: item.nome || '',
                weight: parseFloat(item.peso) || 0
            }));
        }

        this.renderItems();
        this.updateTotalWeight();
        this.saveToLocalStorage();
    }
}

// Inicializa o gerenciador de inventário quando a página carrega
let inventoryManager;
document.addEventListener('DOMContentLoaded', function() {
    inventoryManager = new InventoryManager();
});

// Test System for Attributes and Skills
class TestSystem {
    constructor() {
        this.testModal = document.getElementById('testModal');
        this.testModalTitle = document.getElementById('testModalTitle');
        this.testDiceResult = document.getElementById('testDiceResult');
        this.testAttributeValue = document.getElementById('testAttributeValue');
        this.classificationResult = document.getElementById('classificationResult');
        this.classificationDescription = document.getElementById('classificationDescription');

        this.initializeTestSystem();
    }

    initializeTestSystem() {
        // Adiciona eventos de clique aos atributos e perícias
        this.bindTestEvents();

        // Fecha modal ao clicar fora dele
        this.testModal.addEventListener('click', (e) => {
            if (e.target === this.testModal) {
                this.closeTestModal();
            }
        });

        // Fecha modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.testModal.classList.contains('show')) {
                this.closeTestModal();
            }
        });
    }

    bindTestEvents() {
        // Adiciona eventos de clique apenas nos nomes dos atributos e perícias
        const nameElements = document.querySelectorAll('.attr .name');
        nameElements.forEach(nameElement => {
            const name = nameElement.textContent.trim();

            // Pula Movimento e Tamanho - não devem ter testes
            if (name === 'Movimento' || name === 'Tamanho') {
                return;
            }

            nameElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const attr = nameElement.closest('.attr');
                const input = attr.querySelector('input[type="number"]');

                if (input) {
                    const value = parseInt(input.value) || 0;
                    this.performTest(name, value, 'atributo');
                }
            });
        });

        // Adiciona evento de clique na Sanidade (seção Condição)
        this.bindSanityTest();
    }

    bindSanityTest() {
        // Procura especificamente pelo label "Sanidade"
        const labels = document.querySelectorAll('.label');
        labels.forEach(label => {
            if (label.textContent.trim() === 'Sanidade') {
                label.style.cursor = 'pointer';
                label.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.performSanityTest();
                });
            }
        });
    }

    performTest(testName, attributeValue, type) {
        // Gera resultado aleatório de 1 a 20
        const diceResult = Math.floor(Math.random() * 20) + 1;

        // Classifica o resultado
        const classification = this.classifyResult(diceResult, attributeValue);

        // Atualiza o modal
        this.testModalTitle.textContent = `Teste de ${testName}`;
        this.testDiceResult.textContent = diceResult;
        this.testAttributeValue.textContent = attributeValue;

        // Atualiza classificação
        this.classificationResult.textContent = classification.result;
        this.classificationResult.className = `classification-result classification-${classification.type}`;
        this.classificationDescription.textContent = classification.description;

        // Mostra o modal
        this.showTestModal();
    }

    performSanityTest() {
        // Gera resultado aleatório de 1 a 100
        const diceResult = Math.floor(Math.random() * 100) + 1;

        // Pega o valor atual da sanidade
        const sanityInputs = document.querySelectorAll('.bar-blue input[type="number"]');
        let currentSanity = 0;
        if (sanityInputs.length > 0) {
            currentSanity = parseInt(sanityInputs[0].value) || 0;
        }

        // Classifica o resultado
        const classification = this.classifySanityResult(diceResult, currentSanity);

        // Atualiza o modal
        this.testModalTitle.textContent = 'Teste de Sanidade';
        this.testDiceResult.textContent = diceResult;
        this.testAttributeValue.textContent = currentSanity;

        // Atualiza classificação
        this.classificationResult.textContent = classification.result;
        this.classificationResult.className = `classification-result classification-${classification.type}`;
        this.classificationDescription.textContent = classification.description;

        // Mostra o modal
        this.showTestModal();
    }

    classifySanityResult(diceResult, sanityValue) {
        // Lógica específica para teste de sanidade
        if (diceResult <= sanityValue) {
            return {
                result: 'SUCESSO',
                type: 'bom',
                description: 'Você manteve sua sanidade!'
            };
        } else {
            return {
                result: 'FRACASSO',
                type: 'fracasso',
                description: 'Sua sanidade foi abalada...'
            };
        }
    }

    classifyResult(diceResult, attributeValue) {
        // Usa a mesma testTable do sistema de atributos
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

        // Busca os valores na tabela
        let normal, bom, extremo;

        if (attributeValue >= 1 && attributeValue <= 20) {
            const entry = testTable[attributeValue];
            normal = entry.normal;
            bom = entry.bom;
            extremo = entry.extremo;
        } else {
            // Para valores fora do range, não há sucesso possível
            normal = bom = extremo = null;
        }

        // Debug: console.log para verificar os valores
        console.log(`Teste: D20=${diceResult}, Atributo=${attributeValue}, Normal=${normal}, Bom=${bom}, Extremo=${extremo}`);

        // 1 no dado é sempre DESASTRE
        if (diceResult === 1) {
            return {
                result: 'DESASTRE',
                type: 'desastre',
                description: 'Falha catastrófica! O pior resultado possível.'
            };
        }

        // Verifica se é EXTREMO (só se extremo não for null)
        if (extremo !== null && diceResult >= extremo) {
            return {
                result: 'EXTREMO',
                type: 'extremo',
                description: 'Sucesso extremo! O melhor resultado possível.'
            };
        }

        // Verifica se é BOM (só se bom não for null)
        if (bom !== null && diceResult >= bom) {
            return {
                result: 'BOM',
                type: 'bom',
                description: 'Sucesso bom! Resultado acima da média.'
            };
        }

        // Verifica se é NORMAL (só se normal não for null)
        if (normal !== null && diceResult >= normal) {
            return {
                result: 'NORMAL',
                type: 'normal',
                description: 'Sucesso normal. Objetivo alcançado.'
            };
        }

        // Se não se encaixou em nenhuma categoria de sucesso, é FRACASSO
        return {
            result: 'FRACASSO',
            type: 'fracasso',
            description: 'Falha. O objetivo não foi alcançado.'
        };
    }

    showTestModal() {
        this.testModal.classList.add('show');

        // Adiciona animação de entrada
        const content = this.testModal.querySelector('.test-modal-content');
        content.style.transform = 'scale(0.8)';
        content.style.opacity = '0';

        setTimeout(() => {
            content.style.transform = 'scale(1)';
            content.style.opacity = '1';
        }, 10);
    }

    closeTestModal() {
        const content = this.testModal.querySelector('.test-modal-content');
        content.style.transform = 'scale(0.8)';
        content.style.opacity = '0';

        setTimeout(() => {
            this.testModal.classList.remove('show');
            content.style.transform = '';
            content.style.opacity = '';
        }, 200);
    }
}

// Função global para fechar o modal (chamada pelo HTML)
function closeTestModal() {
    if (window.testSystem) {
        window.testSystem.closeTestModal();
    }
}

// Inicializa o sistema de testes quando a página carrega
let testSystem;
document.addEventListener('DOMContentLoaded', function() {
    testSystem = new TestSystem();
    window.testSystem = testSystem; // Torna acessível globalmente
});