function renderFinanceiro() {
  const container = document.getElementById('financeiro-container');
  const resumo = document.getElementById('financeiro-resumo');

  const financeiros = allCards.filter(c => {
    if (c.value === null || c.value === undefined) return false;
    return c.type === 'financeiro' || c.type === 'pedido' || c.include_in_finance === true;
  });

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
    <h3 style="margin-bottom:16px;">Resumo do Mês</h3>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-bottom:8px;">
      
      <div style="background:#e8f5e9; border-radius:10px; padding:14px; text-align:center;">
        <div style="font-size:0.8rem; color:#2e7d32; margin-bottom:4px;">Receitas</div>
        <div style="font-size:1.15rem; font-weight:700; color:#2e7d32;">
          ${receitas.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}
        </div>
      </div>

      <div style="background:#ffebee; border-radius:10px; padding:14px; text-align:center;">
        <div style="font-size:0.8rem; color:#c62828; margin-bottom:4px;">Despesas</div>
        <div style="font-size:1.15rem; font-weight:700; color:#c62828;">
          ${despesas.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}
        </div>
      </div>

      <div style="background:${saldo >= 0 ? '#e3f2fd' : '#fff3e0'}; border-radius:10px; padding:14px; text-align:center;">
        <div style="font-size:0.8rem; color:${saldo >= 0 ? '#1565c0' : '#ef6c00'}; margin-bottom:4px;">Saldo</div>
        <div style="font-size:1.15rem; font-weight:700; color:${saldo >= 0 ? '#1565c0' : '#ef6c00'};">
          ${saldo.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}
        </div>
      </div>

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
