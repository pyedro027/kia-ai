// ── Estado ──
const state = {
  gourmet: { sabor: null, adics: [] },
  trad:    { adics: [] }
};

// ── Abrir / fechar modais ──
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function fecharSeOverlay(e) {
  if (e.target === e.currentTarget) fecharModal(e.currentTarget.id);
}

// ── GOURMET: selecionar sabor ──
function selecionarSabor(sabor) {
  state.gourmet.sabor = sabor;

  document.querySelectorAll('.sabor-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sabor' + sabor.charAt(0).toUpperCase() + sabor.slice(1)).classList.add('active');

  atualizarResumoGourmet();
  atualizarBtnGourmet();
}

// ── GOURMET: toggles adicionais ──
function toggleAdic(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.gourmet.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.gourmet.adics.splice(idx, 1);
  else state.gourmet.adics.push({ nome, preco: parseFloat(preco) });

  atualizarResumoGourmet();
}

function atualizarResumoGourmet() {
  const base = 20;
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  const total = base + extra;

  const div = document.getElementById('resumoAdics');
  div.innerHTML = state.gourmet.adics
    .map(a => `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`)
    .join('');

  document.getElementById('totalGourmet').textContent = 'R$ ' + total.toFixed(2);
}

function atualizarBtnGourmet() {
  const btn = document.getElementById('btnConfirmarGourmet');
  btn.disabled = !state.gourmet.sabor;
}

// ── GOURMET: confirmar pedido ──
function confirmarPedidoGourmet() {
  if (!state.gourmet.sabor) return;

  const sabores = { nutella: 'Nutella (Nutella + Ninho + Paçoca)', maracuja: 'Maracujá (Mousse de Maracujá + Ninho)' };
  const base = 20;
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  const total = base + extra;

  let msg = `Olá! Quero fazer um pedido 🍇\n\n`;
  msg += `*🍫 Gourmet – R$ 20,00*\n`;
  msg += `Sabor: ${sabores[state.gourmet.sabor]}\n`;

  if (state.gourmet.adics.length > 0) {
    msg += `\nAdicionais:\n`;
    state.gourmet.adics.forEach(a => { msg += `• ${a.nome} (+R$ ${a.preco.toFixed(2)})\n`; });
  }

  msg += `\n*Total: R$ ${total.toFixed(2)}*`;

  window.open('https://wa.me/5527996900904?text=' + encodeURIComponent(msg), '_blank');
}

// ── TRADICIONAL: toggles adicionais ──
function toggleAdicTrad(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.trad.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.trad.adics.splice(idx, 1);
  else state.trad.adics.push({ nome, preco: parseFloat(preco) });

  atualizarResumoTrad();
}

function atualizarResumoTrad() {
  const base = 15;
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  const total = base + extra;

  const div = document.getElementById('resumoAdicsTrad');
  div.innerHTML = state.trad.adics
    .map(a => `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`)
    .join('');

  document.getElementById('totalTradicional').textContent = 'R$ ' + total.toFixed(2);
}

// ── TRADICIONAL: confirmar pedido ──
function confirmarPedidoTradicional() {
  const base = 15;
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  const total = base + extra;

  let msg = `Olá! Quero fazer um pedido 🍇\n\n`;
  msg += `*🥛 Tradicional – R$ 15,00*\n`;
  msg += `Composição: Leite condensado + Ninho + Paçoca\n`;

  if (state.trad.adics.length > 0) {
    msg += `\nAdicionais:\n`;
    state.trad.adics.forEach(a => { msg += `• ${a.nome} (+R$ ${a.preco.toFixed(2)})\n`; });
  }

  msg += `\n*Total: R$ ${total.toFixed(2)}*`;

  window.open('https://wa.me/5527996900904?text=' + encodeURIComponent(msg), '_blank');
}