let allCards = [];
let editingCardId = null;
let tempParentId = null;

async function loadCards() {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Erro ao carregar cartões:', error);
    return;
  }

  allCards = data || [];
  renderHistoria();
  renderAgenda();
  renderFinanceiro();
  renderHoje();
}

function openNewCardModal(parentId = null) {
  editingCardId = null;
  tempParentId = parentId;

  document.getElementById('modal-title').textContent = parentId ? 'Novo Cartão Filho' : 'Novo Cartão';
  document.getElementById('card-title').value = '';
  document.getElementById('card-description').value = '';
  document.getElementById('card-type').value = 'compromisso';
  document.getElementById('card-value').value = '';
  document.getElementById('card-order').value = '';
  document.getElementById('card-end').value = '';

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('card-start').value = now.toISOString().slice(0, 16);

  document.getElementById('modal').classList.remove('hidden');
}

function openEditCardModal(card) {
  editingCardId = card.id;
  tempParentId = card.parent_id;

  document.getElementById('modal-title').textContent = 'Editar Cartão';
  document.getElementById('card-title').value = card.title || '';
  document.getElementById('card-description').value = card.description || '';
  document.getElementById('card-type').value = card.type || 'compromisso';
  document.getElementById('card-value').value = card.value || '';
  document.getElementById('card-order').value = card.order_number || '';

  if (card.start_time) {
    const start = new Date(card.start_time);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    document.getElementById('card-start').value = start.toISOString().slice(0, 16);
  } else {
    document.getElementById('card-start').value = '';
  }

  if (card.end_time) {
    const end = new Date(card.end_time);
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
    document.getElementById('card-end').value = end.toISOString().slice(0, 16);
  } else {
    document.getElementById('card-end').value = '';
  }

  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editingCardId = null;
  tempParentId = null;
}

async function saveCard() {
  const title = document.getElementById('card-title').value.trim();
  if (!title) {
    alert('O título é obrigatório');
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const cardData = {
    user_id: user.id,
    title: title,
    description: document.getElementById('card-description').value.trim() || null,
    type: document.getElementById('card-type').value,
    start_time: document.getElementById('card-start').value || null,
    end_time: document.getElementById('card-end').value || null,
    value: document.getElementById('card-value').value ? Number(document.getElementById('card-value').value) : null,
    order_number: document.getElementById('card-order').value.trim() || null,
    parent_id: tempParentId || null,
    status: 'pendente'
  };

  let error;

  if (editingCardId) {
    const { error: updateError } = await supabase
      .from('cards')
      .update(cardData)
      .eq('id', editingCardId);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('cards')
      .insert([cardData]);
    error = insertError;
  }

  if (error) {
    alert('Erro ao salvar: ' + error.message);
    return;
  }

  closeModal();
  loadCards();
}

async function deleteCard(id) {
  if (!confirm('Tem certeza que deseja excluir este cartão?')) return;

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Erro ao excluir: ' + error.message);
    return;
  }

  loadCards();
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'concluido' ? 'pendente' : 'concluido';

  const { error } = await supabase
    .from('cards')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    alert('Erro ao atualizar status');
    return;
  }

  loadCards();
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');

  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(sectionId)) {
      btn.classList.add('active');
    }
  });
}
