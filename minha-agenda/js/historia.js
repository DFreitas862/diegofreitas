function renderHistoria(cards = allCards) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (cards.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#65676b;margin-top:40px;">Nenhum cartão ainda. Clique no + para criar o primeiro.</p>';
    return;
  }

  // Ordena por data (mais recente primeiro)
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

  // Cor da borda por tipo
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

  // Formata data/hora
  let timeText = '';
  if (card.start_time) {
    const start = new Date(card.start_time);
    timeText = start.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (card.end_time) {
      const end = new Date(card.end_time);
      timeText += ' → ' + end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Valor formatado
  let valueHtml = '';
  if (card.value) {
    const isDespesa = card.type === 'financeiro' && Number(card.value) < 0;
    const valor = Math.abs(Number(card.value)).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    valueHtml = `<div class="card-value ${isDespesa ? 'despesa' : ''}">${valor}</div>`;
  }

  // Número do pedido
  let orderHtml = '';
  if (card.order_number) {
    orderHtml = `<div style="font-size:0.85rem;color:#65676b;">Pedido: ${card.order_number}</div>`;
  }

  div.innerHTML = `
    <div class="card-header">
      <div class="card-title">${card.title}</div>
      <div class="card-type">${card.type}</div>
    </div>
    ${timeText ? `<div class="card-time">${timeText}</div>` : ''}
    ${orderHtml}
    ${card.description ? `<div class="card-description">${card.description}</div>` : ''}
    ${valueHtml}
    <div class="card-actions">
      <button onclick="editCard('${card.id}')">Editar</button>
      <button onclick="deleteCard('${card.id}')">Excluir</button>
      <button onclick="addChildCard('${card.id}')">+ Filho</button>
    </div>
  `;

  return div;
}

function searchCards() {
  const term = document.getElementById('search').value.toLowerCase();
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

function editCard(id) {
  alert('Edição será implementada na próxima etapa. ID: ' + id);
}

function addChildCard(parentId) {
  openNewCardModal();
  // Depois vamos guardar o parentId para salvar como filho
  window.tempParentId = parentId;
}
