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
const closeModal = () => modal.classList.remove('active');

btnModal?.addEventListener('click', openModal);
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
        kitSuper: getValue('kitSuperCompany', 'number'),
        kitParticipacao: getValue('kitParticipacaoCompany', 'number'),
        kitCompleto: getValue('kitCompletoCompany', 'number')
      },
      site: {
        kitPlus: getValue('kitPlusSite', 'number'),
        kitVip: getValue('kitVipSite', 'number'),
        kitSuper: getValue('kitSuperSite', 'number'),
        kitParticipacao: getValue('kitParticipacaoSite', 'number'),
        kitCompleto: getValue('kitCompletoSite', 'number')
      },
      cortesia: {
        kitPlus: getValue('kitPlusCortesia', 'number'),
        kitVip: getValue('kitVipCortesia', 'number'),
        kitSuper: getValue('kitSuperCortesia', 'number'),
        kitParticipacao: getValue('kitParticipacaoCortesia', 'number'),
        kitCompleto: getValue('kitCompletoCortesia', 'number')
      }
    },

    camisetas: ['bl', 'p', 'm', 'g', 'gg'].reduce((acc, size) => {
      acc[size] = {
        site: Number(qs(`input[name="${size}_site"]`)?.value || 0),
        company: Number(qs(`input[name="${size}_company"]`)?.value || 0),
        cortesia: Number(qs(`input[name="${size}_cortesia"]`)?.value || 0)
      };
      return acc;
    }, {}),

    lotes: {
      valorInicial: getValue('valorInicial'),
      viradaCada: getValue('viradaCada'),
      valores: [1, 2, 3, 4].map(i =>
        qs(`input[name="loteValor${i}"]`)?.value || ''
      )
    },

    assinaturas: {
      site: getValue('sig_site'),
      company: getValue('sig_company'),
      cortesias: getValue('sig_cortesias'),
      producao: getValue('sig_producao'),
      merchandising: getValue('sig_merchandising'),
      limitacao: getValue('sig_limitacao'),
      taxa: getValue('sig_taxa'),
      sku: getValue('sig_sku'),
      servidor: getValue('sig_servidor'),
      cadastro: getValue('sig_cadastro'),
      validacao: getValue('sig_validacao'),
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
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

/* ===============================
   ENVIO
================================ */
async function handleSaveEvent(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const button = e.currentTarget;
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = 'Salvando...';

  try {
    const response = await fetch('http://localhost:4000/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(collectFormData())
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erro ao salvar');

    showNotification('Evento salvo com sucesso!');
    setTimeout(closeModal, 800);

  } catch (err) {
    showNotification(err.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

btnSave?.addEventListener('click', handleSaveEvent);
