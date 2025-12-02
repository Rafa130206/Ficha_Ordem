// Sistema de salvamento da ficha
(function() {
    'use strict';

    let fichaId = null;
    let saveInProgress = false;

    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.querySelector('.container');
        if (container && container.dataset.fichaId) {
            const idValue = container.dataset.fichaId;
            if (idValue && idValue.trim() !== '') {
                fichaId = parseInt(idValue);
                if (!isNaN(fichaId)) {
                    console.log('Ficha ID carregado:', fichaId);
                } else {
                    console.error('Ficha ID inválido:', idValue);
                }
            } else {
                console.error('Ficha ID está vazio no data attribute');
            }
        } else {
            console.error('Ficha ID não encontrado no container');
            console.log('Container encontrado:', container);
            if (container) {
                console.log('Dataset do container:', container.dataset);
            }
        }

        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            console.log('Botão de salvar encontrado, adicionando event listener');
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão salvar clicado');
                salvarFicha(false);
            });
        } else {
            console.error('Botão de salvar não encontrado');
        }

        // Auto-save a cada 30 segundos
        setInterval(() => {
            if (!saveInProgress && fichaId) {
                salvarFicha(true); // true = auto-save silencioso
            }
        }, 30000);
    });

    // Função principal de salvamento
    async function salvarFicha(isAutoSave = false) {
        // Tentar obter o ID novamente se não estiver definido
        if (!fichaId || isNaN(fichaId)) {
            const container = document.querySelector('.container');
            if (container && container.dataset.fichaId) {
                const idValue = container.dataset.fichaId;
                if (idValue && idValue.trim() !== '') {
                    fichaId = parseInt(idValue);
                    console.log('Ficha ID obtido do container:', fichaId);
                }
            }
        }

        if (!fichaId || isNaN(fichaId)) {
            console.error('ID da ficha não encontrado ou inválido. fichaId:', fichaId);
            console.log('Container:', document.querySelector('.container'));
            console.log('Dataset:', document.querySelector('.container')?.dataset);
            mostrarMensagemErro('ID da ficha não encontrado. Recarregue a página.');
            return;
        }

        if (saveInProgress) {
            console.log('Salvamento já em progresso, ignorando...');
            return;
        }

        saveInProgress = true;
        const saveButton = document.getElementById('saveButton');
        const originalText = saveButton ? saveButton.innerHTML : '';

        try {
            if (saveButton && !isAutoSave) {
                saveButton.disabled = true;
                saveButton.innerHTML = '<span>💾</span> <span>Salvando...</span>';
            }

            console.log('Coletando dados da ficha...');
            const dadosFicha = coletarDadosFicha();
            dadosFicha.id = fichaId;

            console.log('Dados coletados:', dadosFicha);
            console.log('Enviando para /api/ficha/salvar...');

            // Obter token CSRF
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

            const headers = {
                'Content-Type': 'application/json',
            };

            // Adicionar token CSRF se disponível
            if (csrfToken && csrfHeader) {
                headers[csrfHeader] = csrfToken;
            }

            const response = await fetch('/api/ficha/salvar', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dadosFicha)
            });

            console.log('Resposta recebida:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                let errorMessage = 'Erro ao salvar ficha';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || `Erro HTTP ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Resultado do salvamento:', result);

            if (result.success) {
                if (!isAutoSave) {
                    mostrarMensagemSucesso('Ficha salva com sucesso!');
                }
            } else {
                throw new Error(result.error || 'Erro ao salvar ficha');
            }
        } catch (error) {
            console.error('Erro ao salvar ficha:', error);
            mostrarMensagemErro('Erro ao salvar ficha: ' + error.message);
        } finally {
            saveInProgress = false;
            if (saveButton && !isAutoSave) {
                saveButton.disabled = false;
                saveButton.innerHTML = originalText;
            }
        }
    }

    // Coletar todos os dados da ficha
    function coletarDadosFicha() {
        try {
            const dados = {
                detalhesPessoais: coletarDetalhesPessoais(),
                atributos: coletarAtributos(),
                subAtributos: coletarSubAtributos(),
                periciais: coletarPericias(),
                antecedentes: coletarAntecedentes(),
                inventario: coletarInventario(),
                habilidades: coletarHabilidades()
            };

            // Validar que pelo menos alguns dados foram coletados
            if (!dados.detalhesPessoais && !dados.atributos && !dados.subAtributos) {
                console.warn('Nenhum dado foi coletado da ficha');
            }

            return dados;
        } catch (error) {
            console.error('Erro ao coletar dados da ficha:', error);
            throw error;
        }
    }

    // Coletar detalhes pessoais
    function coletarDetalhesPessoais() {
        // Buscar seção de detalhes pessoais - procurar pela seção que tem avatar e campos pessoais
        const container = document.querySelector('.container');
        if (!container) return null;

        // Buscar campos dentro da seção personal-info ou similar
        const personalSection = container.querySelector('.personal-info-section, .col-6.section');
        let cols = personalSection ? personalSection.querySelectorAll('.col-6, .col-3') : [];

        // Se não encontrou, buscar todos os inputs com labels que contenham essas palavras
        if (cols.length === 0) {
            cols = container.querySelectorAll('.col-6, .col-3');
        }

        let nome = '', jogador = '', ocupacao = '', idade = 0, sexo = '';
        let localNascimento = '', localResidencia = '';

        // Coletar campos usando labels
        cols.forEach(col => {
            const label = col.querySelector('.label');
            const input = col.querySelector('input');
            if (!label || !input) return;

            const labelText = label.textContent.trim().toLowerCase();
            if (labelText.includes('nome') && !nome) {
                nome = input.value || '';
            } else if (labelText.includes('jogador') && !jogador) {
                jogador = input.value || '';
            } else if (labelText.includes('ocupação') || labelText.includes('ocupacao')) {
                ocupacao = input.value || '';
            } else if (labelText.includes('idade') && idade === 0) {
                idade = parseInt(input.value || '0');
            } else if (labelText.includes('sexo') && !sexo) {
                sexo = input.value || '';
            } else if (labelText.includes('nascimento') && !localNascimento) {
                localNascimento = input.value || '';
            } else if (labelText.includes('residência') || labelText.includes('residencia')) {
                localResidencia = input.value || '';
            }
        });

        // Buscar imagem do avatar
        const avatarImg = document.querySelector('.avatar img');
        let imagemUrl = null;
        if (avatarImg) {
            imagemUrl = avatarImg.src.replace(window.location.origin, '');
            // Garantir que a URL comece com /
            if (!imagemUrl.startsWith('/')) {
                imagemUrl = '/' + imagemUrl;
            }
        }

        return {
            nome: nome || '',
            jogador: jogador || '',
            ocupacao: ocupacao || '',
            idade: idade || 0,
            sexo: sexo || '',
            localNascimento: localNascimento || '',
            localResidencia: localResidencia || '',
            imagemUrl: imagemUrl
        };
    }

    // Coletar atributos
    function coletarAtributos() {
        const attributesContainer = document.querySelector('.attributes-container');
        if (!attributesContainer) return null;

        const inputs = attributesContainer.querySelectorAll('.attr input[type="number"]');
        if (inputs.length < 10) return null;

        return {
            aparencia: parseInt(inputs[0]?.value || '0'),
            constituicao: parseInt(inputs[1]?.value || '0'),
            destreza: parseInt(inputs[2]?.value || '0'),
            educacao: parseInt(inputs[3]?.value || '0'),
            forca: parseInt(inputs[4]?.value || '0'),
            inteligencia: parseInt(inputs[5]?.value || '0'),
            poder: parseInt(inputs[6]?.value || '0'),
            sorte: parseInt(inputs[7]?.value || '0'),
            tamanho: parseInt(inputs[8]?.value || '0'),
            movimento: parseInt(inputs[9]?.value || '0')
        };
    }

    // Coletar sub-atributos
    function coletarSubAtributos() {
        // Buscar campos de sub-atributos (vida, sanidade, etc)
        const barInputs = document.querySelectorAll('.bar-input');
        const miniInputs = document.querySelectorAll('.col-4.mini input[type="number"], .col-4.mini input');
        const exposicaoInput = document.querySelector('.col-12.mini input[type="number"]');

        let vidaAtual = 0, vidaMaxima = 0;
        let sanidadeAtual = 0, sanidadeMaxima = 0;
        let ocultismoAtual = 0, ocultismoMaximo = 0;
        let danoExtra = 0, corpo = 0, exposicaoParanormal = 0;

        // Coletar barras de progresso
        barInputs.forEach((input, index) => {
            const bar = input.closest('.bar');
            if (!bar) return;
            const label = bar.previousElementSibling;
            if (!label) return;

            const labelText = label.textContent.trim().toLowerCase();
            const inputs = bar.querySelectorAll('.bar-input');

            if (labelText.includes('vida') && inputs.length >= 2) {
                vidaAtual = parseInt(inputs[0].value || '0');
                vidaMaxima = parseInt(inputs[1].value || '0');
            } else if (labelText.includes('sanidade') && inputs.length >= 2) {
                sanidadeAtual = parseInt(inputs[0].value || '0');
                sanidadeMaxima = parseInt(inputs[1].value || '0');
            } else if (labelText.includes('ocultismo') && inputs.length >= 2) {
                ocultismoAtual = parseInt(inputs[0].value || '0');
                ocultismoMaximo = parseInt(inputs[1].value || '0');
            }
        });

        // Coletar campos mini
        miniInputs.forEach(input => {
            const lbl = input.nextElementSibling;
            if (!lbl) return;
            const lblText = lbl.textContent.trim().toLowerCase();
            if (lblText.includes('dano')) {
                danoExtra = parseInt(input.value || '0');
            } else if (lblText.includes('corpo')) {
                corpo = parseInt(input.value || '0');
            }
        });

        if (exposicaoInput) {
            exposicaoParanormal = parseInt(exposicaoInput.value || '0');
        }

        return {
            vidaAtual: vidaAtual,
            vidaMaxima: vidaMaxima,
            sanidadeAtual: sanidadeAtual,
            sanidadeMaxima: sanidadeMaxima,
            ocultismoAtual: ocultismoAtual,
            ocultismoMaximo: ocultismoMaximo,
            danoExtra: danoExtra,
            corpo: corpo,
            exposicaoParanormal: exposicaoParanormal
        };
    }

    // Coletar perícias
    function coletarPericias() {
        const skillsContainer = document.querySelector('.skills-container');
        if (!skillsContainer) return null;

        const inputs = skillsContainer.querySelectorAll('.attr input[type="number"]');
        if (inputs.length === 0) return null;

        // Mapear os inputs para os campos de perícia
        const periciaNames = [
            'antropologia', 'atirarPistolas', 'atirarRifles', 'atirarEspingardas', 'atirarArcos',
            'arqueologia', 'arremessar', 'arteOficio', 'avaliacao', 'charme',
            'chaveiro', 'ciencia', 'consertosEletricos', 'consertosMecanicos', 'contabilidade',
            'direito', 'dirigirAuto', 'disfarce', 'encontrar', 'escutar',
            'escalar', 'esquivar', 'labia', 'intimidacao', 'historia',
            'furtividade', 'linguaNatural', 'lutar', 'medicina', 'mundoNatural',
            'natacao', 'nivelDeCredito', 'ocultismo', 'persuasao', 'prestidigitacao',
            'primeirosSocorros', 'psicanalise', 'psicologia', 'saltar', 'rastrear',
            'sobrevivencia', 'usarComputadores'
        ];

        const pericia = {};
        periciaNames.forEach((name, index) => {
            if (inputs[index]) {
                pericia[name] = parseInt(inputs[index].value || '0');
            } else {
                pericia[name] = 0;
            }
        });

        return pericia;
    }

    // Coletar antecedentes
    function coletarAntecedentes() {
        // Buscar seção de antecedentes
        const sections = document.querySelectorAll('.section');
        let section = null;
        sections.forEach(sec => {
            const h2 = sec.querySelector('h2');
            if (h2 && h2.textContent.trim().includes('Antecedentes')) {
                section = sec;
            }
        });
        const textareas = section ? section.querySelectorAll('textarea') : [];

        let descricaoPessoal = '', ideologias = '', pessoasSignificativas = '';
        let locaisImportantes = '', pertencesQueridos = '', fobias = '', passado = '';

        textareas.forEach(textarea => {
            const label = textarea.previousElementSibling;
            if (!label) return;
            const labelText = label.textContent.trim().toLowerCase();

            if (labelText.includes('descrição pessoal')) {
                descricaoPessoal = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('ideologias')) {
                ideologias = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('pessoas significativas')) {
                pessoasSignificativas = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('locais importantes')) {
                locaisImportantes = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('pertences queridos')) {
                pertencesQueridos = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('fobias')) {
                fobias = textarea.value || textarea.textContent || '';
            } else if (labelText.includes('passado')) {
                passado = textarea.value || textarea.textContent || '';
            }
        });

        return {
            descricaoPessoal: descricaoPessoal,
            ideologias: ideologias,
            pessoasSignificativas: pessoasSignificativas,
            locaisImportantes: locaisImportantes,
            pertencesQueridos: pertencesQueridos,
            fobias: fobias,
            passado: passado
        };
    }

    // Coletar inventário
    function coletarInventario() {
        // Usar os dados do InventoryManager se disponível
        if (typeof window.inventoryManager !== 'undefined' && window.inventoryManager.exportData) {
            const data = window.inventoryManager.exportData();
            return data.items.map(item => ({
                nome: item.name || '',
                peso: parseFloat(item.weight || 0)
            }));
        }
        return [];
    }

    // Coletar habilidades
    function coletarHabilidades() {
        // Usar os dados do SkillsManager se disponível
        if (typeof window.skillsManager !== 'undefined' && window.skillsManager.exportData) {
            const data = window.skillsManager.exportData();
            return data.skills.map(skill => ({
                nome: skill.nome || '',
                descricao: skill.descricao || '',
                custoPO: parseInt(skill.custoPO || 0),
                custoSAN: parseInt(skill.custoSAN || 0)
            }));
        }
        return [];
    }

    // Mostrar mensagem de sucesso
    function mostrarMensagemSucesso(mensagem) {
        if (typeof toastManager !== 'undefined') {
            toastManager.success(mensagem, 'Sucesso');
        } else if (typeof showSuccess !== 'undefined') {
            showSuccess(mensagem, 'Sucesso');
        } else {
            alert(mensagem);
        }
    }

    // Mostrar mensagem de erro
    function mostrarMensagemErro(mensagem) {
        if (typeof toastManager !== 'undefined') {
            toastManager.error(mensagem, 'Erro');
        } else if (typeof showError !== 'undefined') {
            showError(mensagem, 'Erro');
        } else {
            alert(mensagem);
        }
    }

    // Expor função globalmente para acesso externo
    window.salvarFicha = salvarFicha;
})();

