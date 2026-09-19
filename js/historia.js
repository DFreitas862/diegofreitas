function renderHistoria(cards = allCards) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (!cards || cards.length === 0) {
    container.innerHTML = `
      <p style="text-align:center; color:#65676b; margin-top:50px;">
        Nenhum cartão ainda.<br>Clique no botão + para criar o primeiro.
      </p>`;
    return;
  }

  const sorted = [...cards].sort((a, b) => {
    return new Date(b.start_time || b.created_at) - new Date(a.start_time || a.created_at);
  });

  sorted.forEach(card => {
    container.appendChild(createCardElement(card));
  });
}

function createCardElement(card) {
  const div = document.createElement('div');
  div.className = 'card' + (card.parent_id ? ' child' : '');

  const colors = {
    compromisso: '#1877f2',
    tarefa: '#42b72a',
    financeiro: '#f7b928',
    anotacao: '#8b5cf6',
    pedido: '#e41e3f',
    leitura: '#0ea5e9',
    sono: '#6366f1',
    trabalho: '#f97316',
    outro: '#65676b'
  };

  div.style.borderLeftColor = colors[card.type] || '#1877f2';

  // Data e hora
  let timeText = '';
  if (card.start_time) {
    const start = new Date(card.start_time);
    timeText = start.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    if (card.end_time) {
      const end = new Date(card.end_time);
      timeText += ' → ' + end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Valor
  let valueHtml = '';
  if (card.value !== null && card.value !== undefined) {
    const valorNum = Number(card.value);
    const isDespesa = valorNum < 0;
    const valorFormatado = Math.abs(valorNum).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL'
    });
    valueHtml = `<div class="card-value ${isDespesa ? 'despesa' : ''}">${isDespesa ? '- ' : '+ '}${valorFormatado}</div>`;
  }

  // Número do pedido
  let orderHtml = card.order_number 
    ? `<div style="font-size:0.84rem; color:#65676b; margin-bottom:4px;">Pedido: <strong>${card.order_number}</strong></div>` 
    : '';

  // Status
  const statusText = card.status === 'concluido' ? '✅ Concluído' : '🕓 Pendente';

  div.innerHTML = `
    <div class="card-header">
      <div class="card-title">${escapeHtml(card.title)}</div>
      <div class="card-type">${card.type}</div>
    </div>
    ${timeText ? `<div class="card-time">${timeText}</div>` : ''}
    ${orderHtml}
    ${card.description ? `<div class="card-description">${escapeHtml(card.description)}</div>` : ''}
    ${valueHtml}
    <div style="font-size:0.82rem; color:#65676b; margin-top:6px;">${statusText}</div>
    <div class="card-actions">
      <button onclick="toggleStatus('${card.id}', '${card.status}')">
        ${card.status === 'concluido' ? 'Reabrir' : 'Concluir'}
      </button>
      <button onclick="editCardById('${card.id}')">Editar</button>
      <button onclick="deleteCard('${card.id}')">Excluir</button>
      <button onclick="openNewCardModal('${card.id}')">+ Filho</button>
    </div>
  `;

  return div;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function searchCards() {
  const term = document.getElementById('search').value.toLowerCase().trim();
  
  if (!term) {
    renderHistoria();
    return;
  }

  const filtered = allCards.filter(card => {
    return (
      (card.title && card.title.toLowerCase().includes(term)) ||
      (card.description && card.description.toLowerCase().includes(term)) ||
      (card.order_number && card.order_number.toLowerCase().includes(term)) ||
      (card.type && card.type.toLowerCase().includes(term))
    );
  });

  renderHistoria(filtered);
}

function editCardById(id) {
  const card = allCards.find(c => c.id === id);
  if (card) openEditCardModal(card);
}
