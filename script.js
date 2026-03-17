// ── Estado ──
const state = {
  gourmet: { sabor: null, adics: [], qty: 1 },
  trad:    { adics: [], qty: 1 },
  cart:    []
};

// ── Modais ──
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
  // reset estado ao abrir
  if (id === 'modalGourmet') resetGourmet();
  if (id === 'modalTradicional') resetTrad();
}
function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function fecharSeOverlay(e) {
  if (e.target === e.currentTarget) fecharModal(e.currentTarget.id);
}

// ── Reset ──
function resetGourmet() {
  state.gourmet = { sabor: null, adics: [], qty: 1 };
  document.querySelectorAll('#modalGourmet .sabor-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#modalGourmet .adic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('qtyGourmet').textContent = '1';
  atualizarResumoGourmet();
  atualizarBtnGourmet();
}
function resetTrad() {
  state.trad = { adics: [], qty: 1 };
  document.querySelectorAll('#modalTradicional .adic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('qtyTrad').textContent = '1';
  atualizarResumoTrad();
}

// ── GOURMET sabor ──
function selecionarSabor(sabor) {
  state.gourmet.sabor = sabor;
  document.querySelectorAll('#modalGourmet .sabor-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sabor' + sabor.charAt(0).toUpperCase() + sabor.slice(1)).classList.add('active');
  atualizarResumoGourmet();
  atualizarBtnGourmet();
}

// ── GOURMET adicionais ──
function toggleAdic(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.gourmet.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.gourmet.adics.splice(idx, 1);
  else state.gourmet.adics.push({ nome, preco: parseFloat(preco) });
  atualizarResumoGourmet();
}

// ── GOURMET quantidade ──
function changeQtyGourmet(d) {
  state.gourmet.qty = Math.max(1, state.gourmet.qty + d);
  document.getElementById('qtyGourmet').textContent = state.gourmet.qty;
  atualizarResumoGourmet();
}

function atualizarResumoGourmet() {
  const base = 20;
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  const unitario = base + extra;
  const total = unitario * state.gourmet.qty;
  const div = document.getElementById('resumoAdics');
  div.innerHTML = state.gourmet.adics
    .map(a => `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`)
    .join('');
  if (state.gourmet.qty > 1) {
    div.innerHTML += `<div class="resumo-linha"><span>Quantidade</span><span>x${state.gourmet.qty}</span></div>`;
  }
  document.getElementById('totalGourmet').textContent = 'R$ ' + total.toFixed(2);
}

function atualizarBtnGourmet() {
  document.getElementById('btnConfirmarGourmet').disabled = !state.gourmet.sabor;
}

// ── TRAD adicionais ──
function toggleAdicTrad(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.trad.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.trad.adics.splice(idx, 1);
  else state.trad.adics.push({ nome, preco: parseFloat(preco) });
  atualizarResumoTrad();
}

// ── TRAD quantidade ──
function changeQtyTrad(d) {
  state.trad.qty = Math.max(1, state.trad.qty + d);
  document.getElementById('qtyTrad').textContent = state.trad.qty;
  atualizarResumoTrad();
}

function atualizarResumoTrad() {
  const base = 15;
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  const unitario = base + extra;
  const total = unitario * state.trad.qty;
  const div = document.getElementById('resumoAdicsTrad');
  div.innerHTML = state.trad.adics
    .map(a => `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`)
    .join('');
  if (state.trad.qty > 1) {
    div.innerHTML += `<div class="resumo-linha"><span>Quantidade</span><span>x${state.trad.qty}</span></div>`;
  }
  document.getElementById('totalTradicional').textContent = 'R$ ' + total.toFixed(2);
}

// ── ADICIONAR AO CARRINHO ──
function adicionarGourmetCarrinho() {
  if (!state.gourmet.sabor) return;
  const sabores = { nutella: 'Nutella (Nutella + Ninho + Paçoca)', maracuja: 'Maracujá (Mousse de Maracujá + Ninho)' };
  const base = 20;
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  const unitario = base + extra;
  state.cart.push({
    id: Date.now(),
    tipo: 'Gourmet',
    detalhe: sabores[state.gourmet.sabor],
    adics: [...state.gourmet.adics],
    unitario,
    qty: state.gourmet.qty
  });
  fecharModal('modalGourmet');
  atualizarCarrinho();
}

function adicionarTradCarrinho() {
  const base = 15;
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  const unitario = base + extra;
  state.cart.push({
    id: Date.now(),
    tipo: 'Tradicional',
    detalhe: 'Leite condensado + Ninho + Paçoca',
    adics: [...state.trad.adics],
    unitario,
    qty: state.trad.qty
  });
  fecharModal('modalTradicional');
  atualizarCarrinho();
}

// ── CARRINHO ──
function atualizarCarrinho() {
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  const qtdTotal = state.cart.reduce((s, i) => s + i.qty, 0);
  const fab = document.getElementById('cartFab');
  if (state.cart.length > 0) {
    fab.classList.add('visible');
    document.getElementById('cartBadge').textContent = qtdTotal;
    document.getElementById('cartTotalFab').textContent = 'R$ ' + total.toFixed(2);
  } else {
    fab.classList.remove('visible');
  }
}

function removerItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderizarCarrinho();
  atualizarCarrinho();
}

function mudarQtyItem(id, d) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + d);
  renderizarCarrinho();
  atualizarCarrinho();
}

function abrirCarrinho() {
  renderizarCarrinho();
  abrirModalDireto('modalCarrinho');
}

function abrirModalDireto(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderizarCarrinho() {
  const lista = document.getElementById('cartLista');
  const totalEl = document.getElementById('cartTotalVal');
  if (state.cart.length === 0) {
    lista.innerHTML = '<div class="cart-empty">🛒 Carrinho vazio</div>';
    totalEl.textContent = 'R$ 0,00';
    return;
  }
  let html = '';
  state.cart.forEach(item => {
    const subtotal = (item.unitario * item.qty).toFixed(2);
    const adicsStr = item.adics.length > 0 ? ' + ' + item.adics.map(a => a.nome).join(', ') : '';
    html += `
      <div class="cart-item">
        <div class="cart-item-header">
          <div class="cart-item-nome">🍇 ${item.tipo}</div>
          <button class="cart-item-remove" onclick="removerItem(${item.id})">✕</button>
        </div>
        <div class="cart-item-detail">${item.detalhe}${adicsStr}</div>
        <div class="cart-item-footer">
          <div class="cart-item-qty">
            <button class="cart-item-qbtn" onclick="mudarQtyItem(${item.id},-1)">−</button>
            <span class="cart-item-qnum">${item.qty}</span>
            <button class="cart-item-qbtn" onclick="mudarQtyItem(${item.id},1)">+</button>
          </div>
          <div class="cart-item-preco">R$ ${subtotal}</div>
        </div>
      </div>`;
  });
  lista.innerHTML = html;
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  totalEl.textContent = 'R$ ' + total.toFixed(2);
}

// ── FINALIZAR PEDIDO ──
function finalizarPedido() {
  if (state.cart.length === 0) return;
  let msg = 'Olá! Quero fazer um pedido 🍇\n\n';
  state.cart.forEach((item, idx) => {
    const adicsStr = item.adics.length > 0 ? '\n   Adicionais: ' + item.adics.map(a => a.nome).join(', ') : '';
    msg += `*${idx+1}. ${item.tipo} (x${item.qty}) – R$ ${(item.unitario * item.qty).toFixed(2)}*\n`;
    msg += `   ${item.detalhe}${adicsStr}\n\n`;
  });
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  msg += `*Total do pedido: R$ ${total.toFixed(2)}*`;
  window.open('https://wa.me/5527996900904?text=' + encodeURIComponent(msg), '_blank');
}