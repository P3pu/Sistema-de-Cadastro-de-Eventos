/* ===============================
   ELEMENTOS PRINCIPAIS
================================ */
const btnModal = document.querySelector('.btnModal');
const modal = document.querySelector('.modalContent');
const btnSave = document.querySelector('.btnSave');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

/* ===============================
   UTILITÁRIOS
================================ */
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const getValue = (id, type = 'string') => {
    const el = document.getElementById(id);
    if (!el) return type === 'number' ? 0 : '';
    return type === 'number' ? Number(el.value || 0) : el.value.trim();
};

const getInputValue = (name, type = 'string') => {
    const el = qs(`input[name="${name}"]`);
    if (!el) return type === 'number' ? 0 : '';
    return type === 'number' ? Number(el.value || 0) : el.value.trim();
};

/* ===============================
   TABS
================================ */
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        qs(`.tab-content[data-content="${target}"]`)?.classList.add('active');
    });
});

/* ===============================
   MODAL
================================ */
const openModal = () => modal.classList.add('active');
const closeModal = () => {
    modal.classList.remove('active');
    modal.dataset.editingId = '';
    limparFormulario();
};

btnModal?.addEventListener('click', () => {
    limparFormulario();
    qs('.modal-header h2').textContent = 'Adicionar Evento';
    modal.dataset.editingId = '';
    openModal();
});

qs('.closeModal')?.addEventListener('click', closeModal);

modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

/* ===============================
   NOTIFICAÇÃO
================================ */
function showNotification(message, type = 'success') {
    qs('.notification')?.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 14px 22px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: #fff;
    border-radius: 8px;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    font-weight: 500;
  `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

/* ===============================
   COLETA DE DADOS
================================ */
function collectFormData() {
    return {
        eventInfo: {
            eventName: getValue('eventName'),
            eventLink: getValue('eventLink'),
            eventCity: getValue('eventCity'),
            eventModality: getValue('eventModality'),
            eventSKU: getValue('eventSKU'),
            eventTaxa: getValue('eventTaxa'),
            eventDate: getValue('eventDate'),
            cartOpenDate: getValue('cartOpenDate'),
            eventLimit: getValue('eventLimit', 'number')
        },

        estimativa: {
            company: {
                kitPlus: getValue('kitPlusCompany', 'number'),
                kitVip: getValue('kitVipCompany', 'number'),
                kitSuper: getValue('KitSuperCompany', 'number'),
                kitParticipacao: getValue('KitPaticupacaoCompany', 'number'),
                kitCompleto: getValue('KitCompletoCompany', 'number')
            },
            site: {
                kitPlus: getValue('kitPlusSite', 'number'),
                kitVip: getValue('kitVipSite', 'number'),
                kitSuper: getValue('KitSuperSite', 'number'),
                kitParticipacao: getValue('KitPaticipacaoSite', 'number'),
                kitCompleto: getValue('KitCompletoSite', 'number')
            },
            cortesia: {
                kitPlus: getValue('kitPlusCortesia', 'number'),
                kitVip: getValue('kitVipCortesia', 'number'),
                kitSuper: getValue('KitSuperCortesia', 'number'),
                kitParticipacao: getValue('KitParticipacaoCortesia', 'number'),
                kitCompleto: getValue('KitCompletoCortesia', 'number')
            }
        },

        camisetas: ['bl', 'p', 'm', 'g', 'gg'].reduce((acc, size) => {
            acc[size] = {
                site: getInputValue(`${size}_site`, 'number'),
                company: getInputValue(`${size}_company`, 'number'),
                cortesia: getInputValue(`${size}_cortesia`, 'number')
            };
            return acc;
        }, {}),

        lotes: {
            valorInicial: getValue('valorInicial'),
            viradaCada: getValue('viradaCada', 'number'),
            valores: [1, 2, 3, 4].map(i => getInputValue(`loteValor${i}`))
        },

        assinaturas: {
            site: getInputValue('sig_site'),
            company: getInputValue('sig_company'),
            cortesias: getInputValue('sig_cortesias'),
            producao: getInputValue('sig_producao'),
            merchandising: getInputValue('sig_merchandising'),
            limitacao: getInputValue('sig_limitacao'),
            taxa: getInputValue('sig_taxa'),
            sku: getInputValue('sig_sku'),
            servidor: getInputValue('sig_servidor'),
            cadastro: getInputValue('sig_cadastro'),
            validacao: getInputValue('sig_validacao'),
            dataAssinatura: getValue('dataAssinatura')
        }
    };
}

/* ===============================
   VALIDAÇÃO
================================ */
function validateForm() {
    const required = [
        { id: 'eventName', label: 'Nome do evento' },
        { id: 'eventCity', label: 'Cidade' },
        { id: 'eventDate', label: 'Data do evento' }
    ];

    const errors = [];

    required.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
            errors.push(label);
            el && (el.style.borderColor = '#ef4444');
        } else {
            el.style.borderColor = '';
        }
    });

    if (errors.length) {
        alert(`Preencha os campos obrigatórios:\n- ${errors.join('\n- ')}`);
        return false;
    }

    return true;
}

/* ===============================
   LIMPAR FORMULÁRIO
================================ */
function limparFormulario() {
    const inputs = qsa('.modal-dialog input');
    inputs.forEach(input => {
        if (['text', 'url', 'number', 'date'].includes(input.type)) {
            input.value = '';
            input.style.borderColor = '';
        }
    });

    // Voltar para primeira aba
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tabs[0]?.classList.add('active');
    tabContents[0]?.classList.add('active');
}

/* ===============================
   PREENCHER FORMULÁRIO (EDIÇÃO)
================================ */
function preencherFormulario(evento) {
    if (!evento) {
        console.error('Evento está vazio ou undefined');
        return;
    }

    console.log('Preenchendo formulário com:', evento);

    // Aba 1: Informações do Evento
    if (evento.eventInfo) {
        console.log('Preenchendo eventInfo:', evento.eventInfo);
        Object.keys(evento.eventInfo).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
                el.value = evento.eventInfo[key] || '';
                console.log(`Preencheu ${key} com:`, evento.eventInfo[key]);
            } else {
                console.warn(`Elemento ${key} não encontrado`);
            }
        });
    } else {
        console.warn('evento.eventInfo não existe');
    }

    // Aba 2: Estimativa de Inscrições
    if (evento.estimativa) {
        console.log('Preenchendo estimativa:', evento.estimativa);
        ['company', 'site', 'cortesia'].forEach(area => {
            if (evento.estimativa[area]) {
                Object.keys(evento.estimativa[area]).forEach(kit => {
                    const idMap = {
                        company: {
                            kitPlus: 'kitPlusCompany',
                            kitVip: 'kitVipCompany',
                            kitSuper: 'KitSuperCompany',
                            kitParticipacao: 'KitPaticupacaoCompany',
                            kitCompleto: 'KitCompletoCompany'
                        },
                        site: {
                            kitPlus: 'kitPlusSite',
                            kitVip: 'kitVipSite',
                            kitSuper: 'KitSuperSite',
                            kitParticipacao: 'KitPaticipacaoSite',
                            kitCompleto: 'KitCompletoSite'
                        },
                        cortesia: {
                            kitPlus: 'kitPlusCortesia',
                            kitVip: 'kitVipCortesia',
                            kitSuper: 'KitSuperCortesia',
                            kitParticipacao: 'KitParticipacaoCortesia',
                            kitCompleto: 'KitCompletoCortesia'
                        }
                    };

                    const inputId = idMap[area]?.[kit];
                    const el = document.getElementById(inputId);
                    if (el) {
                        el.value = evento.estimativa[area][kit] || '';
                    }
                });
            }
        });
    } else {
        console.warn('evento.estimativa não existe');
    }

    // Aba 3: Grade de Camisetas
    if (evento.camisetas) {
        console.log('Preenchendo camisetas:', evento.camisetas);
        ['bl', 'p', 'm', 'g', 'gg'].forEach(size => {
            if (evento.camisetas[size]) {
                ['site', 'company', 'cortesia'].forEach(type => {
                    const input = qs(`input[name="${size}_${type}"]`);
                    if (input) input.value = evento.camisetas[size][type] || '';
                });
            }
        });
    } else {
        console.warn('evento.camisetas não existe');
    }

    // Aba 4: Virada de Lote
    if (evento.lotes) {
        console.log('Preenchendo lotes:', evento.lotes);
        const valorInicialEl = document.getElementById('valorInicial');
        const viradaCadaEl = document.getElementById('viradaCada');

        if (valorInicialEl) valorInicialEl.value = evento.lotes.valorInicial || '';
        if (viradaCadaEl) viradaCadaEl.value = evento.lotes.viradaCada || '';

        if (evento.lotes.valores && Array.isArray(evento.lotes.valores)) {
            evento.lotes.valores.forEach((valor, i) => {
                const input = qs(`input[name="loteValor${i + 1}"]`);
                if (input) input.value = valor || '';
            });
        }
    } else {
        console.warn('evento.lotes não existe');
    }

    // Aba 5: Assinaturas
    if (evento.assinaturas) {
        console.log('Preenchendo assinaturas:', evento.assinaturas);
        Object.keys(evento.assinaturas).forEach(key => {
            if (key === 'dataAssinatura') {
                const el = document.getElementById(key);
                if (el) el.value = evento.assinaturas[key] || '';
            } else {
                const input = qs(`input[name="sig_${key}"]`);
                if (input) input.value = evento.assinaturas[key] || '';
            }
        });
    } else {
        console.warn('evento.assinaturas não existe');
    }
}

/* ===============================
   API - BUSCAR EVENTOS
================================ */
async function buscarEventos() {
    try {
        const response = await fetch('http://localhost:4000/dados/eventos', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Erro ao buscar dados");

        const results = await response.json();
        console.log(`${results.Data.length} Eventos recebidos`);
        return results.Data;

    } catch (error) {
        console.error(error.message);
        showNotification('Erro ao carregar eventos', 'error');
        throw error;
    }
}

/* ===============================
   API - BUSCAR EVENTO POR ID
================================ */
async function buscarEventoPorId(id) {
    try {
        const response = await fetch(`http://localhost:4000/eventos/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Erro ao buscar evento");

        const results = await response.json();
        console.log('Resposta da API buscarEventoPorId:', results);

        // Retornar o evento (a API retorna { message, evento })
        return results.evento || results;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/* ===============================
   API - DELETAR EVENTO
================================ */
async function deletarEventos(id) {
    try {
        const response = await fetch(`http://localhost:4000/eventos/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Erro ao deletar dados");

        const results = await response.json();
        console.log('Evento deletado:', results);
        return results;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/* ===============================
   API - ATUALIZAR EVENTO
================================ */
async function atualizarEvento(id, dadosEvento) {
    try {
        const response = await fetch(`http://localhost:4000/eventos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dadosEvento)
        });

        if (!response.ok) throw new Error("Erro ao atualizar evento");

        const results = await response.json();
        console.log('Evento atualizado:', results);
        return results;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/* ===============================
   API - CRIAR EVENTO
================================ */
async function criarEvento(dadosEvento) {
    try {
        const response = await fetch('http://localhost:4000/eventos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dadosEvento)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Erro ao salvar');

        console.log('Evento criado:', result);
        return result;

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/* ===============================
   CRIAR CARDS
================================ */
const createCards = async (eventName, id) => {
    const container = document.querySelector('.container-section');
    const card = document.createElement('div');
    const icons = document.createElement('div');
    const iconEdit = document.createElement('div');
    const iconTrash = document.createElement('div');
    const imgEdit = document.createElement('img');
    const imgTrash = document.createElement('img');
    const title = document.createElement('h1');

    card.classList.add('card');
    icons.classList.add('icons');
    iconEdit.classList.add('icon', 'edit');
    iconTrash.classList.add('icon', 'delete');
    imgTrash.classList.add('delete');

    imgEdit.src = 'img/edit.svg';
    imgTrash.src = 'img/trash.svg';
    title.textContent = eventName;

    imgTrash.dataset.id = id;
    iconTrash.dataset.id = id;
    iconEdit.dataset.id = id;
    card.dataset.id = id;

    iconEdit.appendChild(imgEdit);
    iconTrash.appendChild(imgTrash);
    icons.appendChild(iconEdit);
    icons.appendChild(iconTrash);
    card.appendChild(title);
    card.appendChild(icons);
    container.appendChild(card);
};

/* ===============================
   ABRIR MODAL DE EDIÇÃO
================================ */
async function abrirModalEdicao(id) {
    try {
        const response = await buscarEventoPorId(id);

        // DEBUG: Verificar estrutura dos dados
        console.log('Dados recebidos da API:', response);

        // A API retorna { message, evento }, então pegar o evento
        const evento = response.evento || response;

        console.log('Evento a ser preenchido:', evento);

        preencherFormulario(evento);

        const modalTitle = qs('.modal-header h2');
        modalTitle.textContent = 'Editar Evento';

        modal.dataset.editingId = id;
        openModal();

    } catch (error) {
        console.error('Erro ao abrir modal de edição:', error);
        showNotification('Erro ao carregar dados do evento', 'error');
    }
}

/* ===============================
   SALVAR EVENTO (CRIAR OU EDITAR)
================================ */
async function handleSaveEvent(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const button = e.currentTarget;
    const originalText = button.textContent;
    const editingId = modal.dataset.editingId;

    button.disabled = true;
    button.textContent = editingId ? 'Atualizando...' : 'Salvando...';

    try {
        const dadosEvento = collectFormData();

        if (editingId) {
            // EDITAR
            await atualizarEvento(editingId, dadosEvento);
            showNotification('Evento atualizado com sucesso!');
        } else {
            // CRIAR
            await criarEvento(dadosEvento);
            showNotification('Evento criado com sucesso!');
        }

        setTimeout(() => {
            closeModal();
            window.location.reload();
        }, 800);

    } catch (err) {
        showNotification(err.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

/* ===============================
   CARREGAR EVENTOS NA PÁGINA
================================ */
async function carregarEventos() {
    try {
        const eventos = await buscarEventos();

        for (const evento of eventos) {
            await createCards(evento.eventInfo.eventName, evento._id);
        }

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
    }
}

/* ===============================
   EVENT LISTENERS
================================ */
btnSave?.addEventListener('click', handleSaveEvent);

document.addEventListener('click', async (e) => {
    const el = e.target;

    // DELETAR EVENTO
    if (el.classList.contains('delete')) {
        const confirmValue = confirm('Tem certeza que deseja deletar esse evento?');
        if (!confirmValue) return;

        const id = el.dataset.id;

        try {
            await deletarEventos(id);
            showNotification('Evento deletado com sucesso!');

            // Remover card da tela
            const card = qs(`.card[data-id="${id}"]`);
            if (card) card.remove();

        } catch (error) {
            showNotification('Erro ao deletar evento', 'error');
        }
    }

    // EDITAR EVENTO
    else if (el.closest('.icon.edit')) {
        const iconEdit = el.closest('.icon.edit');
        const id = iconEdit.dataset.id;

        if (id) {
            await abrirModalEdicao(id);
        }
    }
});

/* ===============================
   INICIALIZAR
================================ */
carregarEventos();