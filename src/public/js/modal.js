const btnModal = document.querySelector('.btnModal');
const modalContent = document.querySelector('.modalContent');
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document
      .querySelector(`.tab-content[data-content="${target}"]`)
      .classList.add('active');
  });
});

// Abrir modal
function openModal() {
  modalContent.classList.add('active');
  const closeBtn = document.querySelector('.closeModal');
  closeBtn.addEventListener('click', closeModal);
  
  modalContent.addEventListener('click', (e) => {
    if (e.target === modalContent) {
      closeModal();
    }
  });
  
}

function closeModal() {
  modalContent.classList.remove('active');
}

btnModal.addEventListener('click', openModal);

// Event listeners

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalContent.classList.contains('active')) {
    closeModal();
  }
});