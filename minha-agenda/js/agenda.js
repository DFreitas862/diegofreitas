function renderAgenda() {
  const container = document.getElementById('agenda-container');
  container.innerHTML = '';

  // Filtra só compromissos e tarefas
  const agendaCards = allCards.filter(c => 
    c.type === 'compromisso' || c.type === 'tarefa'
  );

  if (agendaCards.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#65676b;margin-top:40px;">Nenhum compromisso ou tarefa ainda.</p>';
    return;
  }

  // Ordena por data de início
  const sorted = [...agendaCards].sort((a, b) => {
    return new Date(a.start_time || a.created_at) - new Date(b.start_time || b.created_at);
  });

  sorted.forEach(card => {
    container.appendChild(createCardElement(card));
  });
}

function renderHoje() {
  const container = document.getElementById('hoje-container');
  container.innerHTML = '';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const cardsHoje = allCards.filter(card => {
    if (!card.start_time) return false;
    const data = new Date(card.start_time);
    return data >= hoje && data < amanha;
  });

  if (cardsHoje.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#65676b;margin-top:40px;">Nada agendado para hoje.</p>';
    return;
  }

  // Ordena por horário
  const sorted = [...cardsHoje].sort((a, b) => {
    return new Date(a.start_time) - new Date(b.start_time);
  });

  sorted.forEach(card => {
    container.appendChild(createCardElement(card));
  });
}
