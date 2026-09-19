function renderAgenda() {
  const container = document.getElementById('agenda-container');
  container.innerHTML = '';

  const agendaCards = allCards.filter(c => 
    c.type === 'compromisso' || c.type === 'tarefa'
  );

  if (agendaCards.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#65676b; margin-top:40px;">Nenhum compromisso ou tarefa.</p>`;
    return;
  }

  const sorted = [...agendaCards].sort((a, b) => 
    new Date(a.start_time || a.created_at) - new Date(b.start_time || b.created_at)
  );

  sorted.forEach(card => container.appendChild(createCardElement(card)));
}

function renderHoje() {
  const container = document.getElementById('hoje-container');
  container.innerHTML = '';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const cardsHoje = allCards.filter(card => {
    if (!card.start_time) return false;
    const data = new Date(card.start_time);
    return data >= hoje && data < amanha;
  });

  if (cardsHoje.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#65676b; margin-top:40px;">Nada para hoje.</p>`;
    return;
  }

  const sorted = [...cardsHoje].sort((a, b) => 
    new Date(a.start_time) - new Date(b.start_time)
  );

  sorted.forEach(card => container.appendChild(createCardElement(card)));
}
