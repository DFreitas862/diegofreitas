let allCards = [];

async function loadCards() {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('start_time', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  allCards = data || [];
  renderHistoria();
  renderHoje();
  renderFinanceiro();
}

function openNewCardModal() {
  document.getElementById('modal').classList.remove('hidden');
  
  // Preenche data/hora atual
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('card-start').value = now.toISOString().slice(0, 16);
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  // Limpa campos
  document.getElementById('card-title').value = '';
  document.getElementById('card-description').value = '';
  document.getElementById('card-value').value = '';
  document.getElementById('card-order').value = '';
}

async function saveCard() {
  const title = document.getElementById('card-title').value.trim();
  if (!title) {
    alert('Título é obrigatório');
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const card = {
    user_id: user.id,
    title: title,
    description: document.getElementById('card-description').value.trim(),
    type: document.getElementById('card-type').value,
    start_time: document.getElementById('card-start').value || null,
    end_time: document.getElementById('card-end').value || null,
    value: document.getElementById('card-value').value || null,
    order_number: document.getElementById('card-order').value || null,
    status: 'pendente'
  };

  const { error } = await supabase.from('cards').insert([card]);

  if (error) {
    alert('Erro ao salvar: ' + error.message);
    return;
  }

  closeModal();
  loadCards();
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(sectionId).classList.add('active');
  event.target.classList.add('active');
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}
