function renderFinanceiro() {
  const container = document.getElementById('financeiro-container');
  const resumo = document.getElementById('financeiro-resumo');

  const financeiros = allCards.filter(c => 
    c.type === 'financeiro' || (c.type === 'pedido' && c.value !== null)
  );

  // Mês atual
  const agora = new Date();
  const mes = agora.getMonth();
  const ano = agora.getFullYear();

  let receitas = 0;
  let despesas = 0;

  financeiros.forEach(card => {
    const data = new Date(card.start_time || card.created_at);
    if (data.getMonth() === mes && data.getFullYear() === ano) {
      const valor = Number(card.value) || 0;
      if (valor >= 0) receitas += valor;
      else despesas += Math.abs(valor);
    }
  });

  const saldo = receitas - despesas;

  resumo.innerHTML = `
    <h3 style="margin-bottom:14px;">Resumo do Mês</h3>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
      <span>Receitas</span>
      <strong style="color:#42b72a;">${receitas.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
      <span>Despesas</span>
      <strong style="color:#e41e3f;">${despesas.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; border-top:1px solid #eee; padding-top:10px; margin-top:6px;">
      <span><strong>Saldo</strong></span>
      <strong style="color:${saldo >= 0 ? '#42b72a' : '#e41e3f'}">
        ${saldo.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}
      </strong>
    </div>
  `;

  container.innerHTML = '';

  if (financeiros.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#65676b; margin-top:30px;">Nenhum lançamento financeiro ainda.</p>`;
    return;
  }

  const sorted = [...financeiros].sort((a, b) => 
    new Date(b.start_time || b.created_at) - new Date(a.start_time || a.created_at)
  );

  sorted.forEach(card => container.appendChild(createCardElement(card)));
}
