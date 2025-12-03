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
function initializeAvatarUpload() {
    const input = document.getElementById('avatarInput');
    const avatar = document.querySelector('.avatar');

    if (!input || !avatar) {
        console.error('Avatar input or avatar element not found');
        return;
    }

    console.log('Avatar upload initialized');

    // Garante que o clique no label acione o input
    avatar.addEventListener('click', function(e) {
        // Previne comportamento padrão e aciona o input
        e.preventDefault();
        e.stopPropagation();
        console.log('Avatar clicked, triggering file input');
        input.click();
    });

    input.addEventListener('change', function (ev) {
        const file = ev.target.files && ev.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File selected:', file.name);

        const reader = new FileReader();
        reader.onload = function (e) {
            // Remove a hint se existir
            const hint = avatar.querySelector('.hint');
            if (hint) hint.remove();

            // Verifica se já existe uma imagem
            let existing = avatar.querySelector('img');
            if (existing) {
                existing.src = e.target.result;
            } else {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Avatar';
                avatar.appendChild(img);
            }
        };
        reader.onerror = function() {
            console.error('Error reading file');
        };
        reader.readAsDataURL(file);

        // Envia para o servidor com o ID da ficha
        const container = document.querySelector('.container');
        const fichaId = container && container.dataset.fichaId ? container.dataset.fichaId : null;

        if (!fichaId) {
            console.error('ID da ficha não encontrado');
            alert('Erro: ID da ficha não encontrado. Recarregue a página.');
            return;
        }

        const form = new FormData();
        form.append('file', file);
        form.append('fichaId', fichaId);

        fetch('/ficha/upload-avatar', { method: 'POST', body: form })
            .then(r => {
                if (!r.ok) {
                    return r.json().then(err => {
                        throw new Error(err.error || 'Upload failed');
                    });
                }
                return r.json();
            })
            .then(json => {
                if (json && json.url) {
                    // Atualiza imagem para URL servida pelo backend
                    const existing = avatar.querySelector('img');
                    if (existing) {
                        existing.src = json.url;
                    }
                }
            })
            .catch(err => {
                console.error('Error uploading avatar:', err);
                alert('Erro ao fazer upload do avatar: ' + err.message);
            });
    });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeAvatarUpload);

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
        this.maxWeightInput = document.getElementById('maxWeightInput');
        this.itemsList = document.getElementById('inventoryItemsList');
        this.addItemBtn = document.getElementById('addItemBtn');

        this.initializeInventory();
        this.bindEvents();
    }

    initializeInventory() {
        // Carregar dados do backend (passados via script no template HTML)
        if (window.fichaInventoryData) {
            this.importData(window.fichaInventoryData);
            // Limpa os dados após importar para não usar novamente
            window.fichaInventoryData = null;
        } else {
            // Se não houver dados do backend, inicializa vazio
            this.items = [];
            this.renderItems();
            this.updateTotalWeight();
        }
    }

    bindEvents() {
        // Evento para adicionar item
        this.addItemBtn.addEventListener('click', () => {
            this.addItem();
        });

        // Evento para atualizar peso quando o peso máximo mudar
        if (this.maxWeightInput) {
            this.maxWeightInput.addEventListener('input', () => {
                this.updateTotalWeight();
            });
        }
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

        // Foca no campo de nome do novo item
        const newItemElement = this.itemsList.querySelector(`[data-item-id="${newItem.id}"]`);
        const nameInput = newItemElement.querySelector('.item-name');
        nameInput.focus();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.renderItems();
        this.updateTotalWeight();
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
        }
    }

    updateTotalWeight() {
        const totalWeight = this.items.reduce((sum, item) => {
            return sum + (parseFloat(item.weight) || 0);
        }, 0);

        this.totalWeightDisplay.textContent = `${totalWeight.toFixed(1)} kg`;

        // Verifica se o peso total excede o peso máximo
        if (this.maxWeightInput) {
            const maxWeight = parseFloat(this.maxWeightInput.value) || 0;
            if (maxWeight > 0 && totalWeight > maxWeight) {
                this.totalWeightDisplay.classList.add('overweight');
            } else {
                this.totalWeightDisplay.classList.remove('overweight');
            }
        }
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

    // Removido saveToLocalStorage - dados são salvos apenas no backend

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
    }
}

// Inicializa o gerenciador de inventário quando a página carrega
let inventoryManager;
document.addEventListener('DOMContentLoaded', function() {
    inventoryManager = new InventoryManager();
    window.inventoryManager = inventoryManager; // Expor globalmente
});

// Skills Management System
class SkillsManager {
    constructor() {
        this.skills = [];
        this.skillsList = document.getElementById('skillsItemsList');
        this.addSkillBtn = document.getElementById('addSkillBtn');

        this.initializeSkills();
        this.bindEvents();
    }

    initializeSkills() {
        // Carregar dados do backend (passados via script no template HTML)
        if (window.fichaSkillsData) {
            this.importData(window.fichaSkillsData);
            // Limpa os dados após importar para não usar novamente
            window.fichaSkillsData = null;
        } else {
            // Se não houver dados do backend, inicializa vazio
            this.skills = [];
            this.renderSkills();
        }
    }

    bindEvents() {
        // Evento para adicionar habilidade
        this.addSkillBtn.addEventListener('click', () => {
            this.addSkill();
        });
    }

    addSkill() {
        const newSkill = {
            id: Date.now(),
            nome: '',
            descricao: '',
            custoPO: 0,
            custoSAN: 0
        };

        this.skills.push(newSkill);
        this.renderSkills();

        // Foca no campo de nome da nova habilidade
        const newSkillElement = this.skillsList.querySelector(`[data-skill-id="${newSkill.id}"]`);
        const nameInput = newSkillElement.querySelector('.skill-name');
        nameInput.focus();
    }

    removeSkill(skillId) {
        this.skills = this.skills.filter(skill => skill.id !== skillId);
        this.renderSkills();
    }

    updateSkill(skillId, field, value) {
        const skill = this.skills.find(skill => skill.id === skillId);
        if (skill) {
            if (field === 'custoPO' || field === 'custoSAN') {
                skill[field] = parseInt(value) || 0;
            } else {
                skill[field] = value;
            }
        }
    }

    renderSkills() {
        if (this.skills.length === 0) {
            this.skillsList.innerHTML = `
                <div class="skills-empty">
                    Nenhuma habilidade registrada. Clique em "Adicionar Habilidade" para começar.
                </div>
            `;
            return;
        }

        this.skillsList.innerHTML = this.skills.map(skill => `
            <div class="skill-item" data-skill-id="${skill.id}">
                <input
                    type="text"
                    class="skill-name"
                    placeholder="Nome da habilidade"
                    value="${skill.nome}"
                    onchange="skillsManager.updateSkill(${skill.id}, 'nome', this.value)"
                />
                <textarea
                    class="skill-description"
                    placeholder="Descrição da habilidade"
                    rows="2"
                    onchange="skillsManager.updateSkill(${skill.id}, 'descricao', this.value)"
                >${skill.descricao}</textarea>
                <div class="skill-costs">
                    <div class="cost-group">
                        <label>PO:</label>
                        <input
                            type="number"
                            class="skill-po"
                            placeholder="0"
                            min="0"
                            value="${skill.custoPO}"
                            onchange="skillsManager.updateSkill(${skill.id}, 'custoPO', this.value)"
                        />
                    </div>
                    <div class="cost-group">
                        <label>SAN:</label>
                        <input
                            class="skill-san"
                            placeholder="0"
                            min="0"
                            value="${skill.custoSAN}"
                            onchange="skillsManager.updateSkill(${skill.id}, 'custoSAN', this.value)"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    class="btn-remove-skill"
                    onclick="skillsManager.removeSkill(${skill.id})"
                    title="Remover habilidade"
                >
                    ✕
                </button>
            </div>
        `).join('');
    }

    // Removido saveToLocalStorage - dados são salvos apenas no backend

    // Método para exportar dados (útil para salvar no backend)
    exportData() {
        return {
            skills: this.skills.map(skill => ({
                nome: skill.nome,
                descricao: skill.descricao,
                custoPO: parseInt(skill.custoPO) || 0,
                custoSAN: parseInt(skill.custoSAN) || 0
            }))
        };
    }

    // Método para importar dados (útil para carregar do backend)
    importData(data) {
        if (data.skills && Array.isArray(data.skills)) {
            this.skills = data.skills.map((skill, index) => ({
                id: Date.now() + index,
                nome: skill.nome || '',
                descricao: skill.descricao || '',
                custoPO: parseInt(skill.custoPO) || 0,
                custoSAN: parseInt(skill.custoSAN) || 0
            }));
        }

        this.renderSkills();
    }
}

// Inicializa o gerenciador de habilidades quando a página carrega
let skillsManager;
document.addEventListener('DOMContentLoaded', function() {
    skillsManager = new SkillsManager();
    window.skillsManager = skillsManager; // Expor globalmente
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
        this.testDiceLabel = document.querySelector('.test-dice-result .test-label');
        this.testAttributeLabel = document.querySelector('.test-attribute-value .test-label');

        if (!this.testModal) {
            console.error('TestSystem: Modal de teste não encontrado');
            return;
        }

        this.initializeTestSystem();
    }

    // Método para reinicializar os eventos (útil após renderização dinâmica)
    reinitialize() {
        this.bindTestEvents();
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
        // Adiciona eventos de clique na caixa inteira dos atributos e perícias
        const attrElements = document.querySelectorAll('.attr');
        attrElements.forEach(attrElement => {
            const nameElement = attrElement.querySelector('.name');
            if (!nameElement) return;

            const name = nameElement.textContent.trim();

            // Pula Movimento e Tamanho - não devem ter testes
            if (name === 'Movimento' || name === 'Tamanho') {
                attrElement.style.cursor = 'default';
                return;
            }

            // Adiciona cursor pointer para indicar que é clicável
            attrElement.style.cursor = 'pointer';

            attrElement.addEventListener('click', (e) => {
                // Previne clique se o usuário clicou em um input ou botão dentro do attr
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('dot')) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                const input = attrElement.querySelector('input[type="number"]');

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
        if (this.testDiceLabel) {
            this.testDiceLabel.textContent = 'Resultado do D20:';
        }
        if (this.testAttributeLabel) {
            this.testAttributeLabel.textContent = 'Valor:';
        }
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

        // Pega o valor da Exposição Paranormal
        let exposicaoParanormal = 0;
        const miniInputs = document.querySelectorAll('.mini input');
        miniInputs.forEach(input => {
            const miniDiv = input.closest('.mini');
            if (miniDiv) {
                const label = miniDiv.querySelector('.lbl');
                if (label && label.textContent.trim() === 'Exposição Paranormal') {
                    exposicaoParanormal = parseInt(input.value) || 0;
                }
            }
        });

        // Classifica o resultado
        const classification = this.classifySanityResult(diceResult, exposicaoParanormal);

        // Atualiza o modal
        this.testModalTitle.textContent = 'Teste de Sanidade';
        if (this.testDiceLabel) {
            this.testDiceLabel.textContent = 'Resultado do D100:';
        }
        if (this.testAttributeLabel) {
            this.testAttributeLabel.textContent = 'Exposição Paranormal:';
        }
        this.testDiceResult.textContent = diceResult;
        this.testAttributeValue.textContent = exposicaoParanormal;

        // Atualiza classificação
        this.classificationResult.textContent = classification.result;
        this.classificationResult.className = `classification-result classification-${classification.type}`;
        this.classificationDescription.textContent = classification.description;

        // Mostra o modal
        this.showTestModal();
    }

    classifySanityResult(diceResult, exposicaoParanormal) {
        // Lógica específica para teste de sanidade
        // Se d100 <= Exposição Paranormal = SUCESSO
        // Se d100 > Exposição Paranormal = FRACASSO
        if (diceResult <= exposicaoParanormal) {
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

// Sistema de atualização das barras de progresso
function updateProgressBars() {
    const bars = document.querySelectorAll('.bar');

    bars.forEach(bar => {
        const inputs = bar.querySelectorAll('.bar-input');
        if (inputs.length >= 2) {
            const currentInput = inputs[0];
            const maxInput = inputs[1];
            const fillElement = bar.querySelector('.fill');

            if (fillElement) {
                const current = parseFloat(currentInput.value) || 0;
                const max = parseFloat(maxInput.value) || 0;
                const percentage = max > 0 ? (current / max) * 100 : 0;

                fillElement.style.width = percentage + '%';
            }
        }
    });
}

// Adiciona listeners para atualizar as barras quando os valores mudarem
function initializeProgressBars() {
    const barInputs = document.querySelectorAll('.bar-input');

    barInputs.forEach(input => {
        input.addEventListener('input', updateProgressBars);
        input.addEventListener('change', updateProgressBars);
    });

    // Atualiza as barras na inicialização
    updateProgressBars();
}

// Inicializa o sistema de testes quando a página carrega
let testSystem;
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam renderizados
    setTimeout(() => {
        testSystem = new TestSystem();
        window.testSystem = testSystem; // Torna acessível globalmente

        // Inicializa as barras de progresso
        initializeProgressBars();
    }, 100);
});