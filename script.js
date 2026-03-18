
// ── Estado global ──
const state = {
  gourmet: { sabor: null, adics: [], qty: 1, obs: '' },
  trad:    { adics: [], qty: 1, obs: '' },
  cart:    [],
  pgto:    null,
  troco:   '',
  endereco: '',
  nome:    ''
};

// ── Utils modal ──
function openModal(id) {
  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('open'));
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  el.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { el.style.display = 'none'; }, 320);
}
function closeIfOverlay(e) {
  if (e.target === e.currentTarget) closeModal(e.currentTarget.id);
}

// ── Reset modais produto ──
function resetGourmet() {
  state.gourmet = { sabor: null, adics: [], qty: 1, obs: '' };
  document.querySelectorAll('#mgourmet .sabor-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#mgourmet .adic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('gQty').textContent = '1';
  document.getElementById('gObs').value = '';
  atualizarResumoG();
  document.getElementById('btnAddG').disabled = true;
}
function resetTrad() {
  state.trad = { adics: [], qty: 1, obs: '' };
  document.querySelectorAll('#mtrad .adic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tQty').textContent = '1';
  document.getElementById('tObs').value = '';
  atualizarResumoT();
}

// ── GOURMET ──
function selectSabor(sabor) {
  state.gourmet.sabor = sabor;
  document.querySelectorAll('#mgourmet .sabor-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('s_' + sabor).classList.add('active');
  atualizarResumoG();
  document.getElementById('btnAddG').disabled = false;
}
function toggleAdicG(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.gourmet.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.gourmet.adics.splice(idx, 1);
  else state.gourmet.adics.push({ nome, preco: parseFloat(preco) });
  atualizarResumoG();
}
function changeQtyG(d) {
  state.gourmet.qty = Math.max(1, state.gourmet.qty + d);
  document.getElementById('gQty').textContent = state.gourmet.qty;
  atualizarResumoG();
}
function atualizarResumoG() {
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  const unit  = 20 + extra;
  const total = unit * state.gourmet.qty;
  let html = state.gourmet.adics.map(a =>
    `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`).join('');
  if (state.gourmet.qty > 1)
    html += `<div class="resumo-linha"><span>Qtd</span><span>x${state.gourmet.qty}</span></div>`;
  document.getElementById('resumoG').innerHTML = html;
  document.getElementById('totalG').textContent = 'R$ ' + total.toFixed(2);
}
function addGourmetCart() {
  if (!state.gourmet.sabor) return;
  const saboresMap = { nutella: 'Nutella (Nutella + Ninho + Paçoca)', maracuja: 'Maracujá (Mousse de Maracujá + Ninho)' };
  const extra = state.gourmet.adics.reduce((s, a) => s + a.preco, 0);
  state.cart.push({
    id: Date.now(), tipo: 'Gourmet',
    detalhe: saboresMap[state.gourmet.sabor],
    adics: [...state.gourmet.adics],
    unitario: 20 + extra,
    qty: state.gourmet.qty,
    obs: document.getElementById('gObs').value.trim()
  });
  closeModal('mgourmet');
  updateFab();
}

// ── TRADICIONAL ──
function toggleAdicT(el, nome, preco) {
  el.classList.toggle('active');
  const idx = state.trad.adics.findIndex(a => a.nome === nome);
  if (idx >= 0) state.trad.adics.splice(idx, 1);
  else state.trad.adics.push({ nome, preco: parseFloat(preco) });
  atualizarResumoT();
}
function changeQtyT(d) {
  state.trad.qty = Math.max(1, state.trad.qty + d);
  document.getElementById('tQty').textContent = state.trad.qty;
  atualizarResumoT();
}
function atualizarResumoT() {
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  const unit  = 15 + extra;
  const total = unit * state.trad.qty;
  let html = state.trad.adics.map(a =>
    `<div class="resumo-linha"><span>+ ${a.nome}</span><span>R$ ${a.preco.toFixed(2)}</span></div>`).join('');
  if (state.trad.qty > 1)
    html += `<div class="resumo-linha"><span>Qtd</span><span>x${state.trad.qty}</span></div>`;
  document.getElementById('resumoT').innerHTML = html;
  document.getElementById('totalT').textContent = 'R$ ' + total.toFixed(2);
}
function addTradCart() {
  const extra = state.trad.adics.reduce((s, a) => s + a.preco, 0);
  state.cart.push({
    id: Date.now(), tipo: 'Tradicional',
    detalhe: 'Leite condensado + Ninho + Paçoca',
    adics: [...state.trad.adics],
    unitario: 15 + extra,
    qty: state.trad.qty,
    obs: document.getElementById('tObs').value.trim()
  });
  closeModal('mtrad');
  updateFab();
}

// ── FAB ──
function updateFab() {
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  const qtd   = state.cart.reduce((s, i) => s + i.qty, 0);
  const fab   = document.getElementById('cartFab');
  if (state.cart.length > 0) {
    fab.classList.remove('hidden');
    document.getElementById('fabCount').textContent = qtd + (qtd === 1 ? ' item' : ' itens');
    document.getElementById('fabTotal').textContent = 'R$ ' + total.toFixed(2);
  } else {
    fab.classList.add('hidden');
  }
}

// ── CARRINHO ──
function openCarrinho() {
  renderCart();
  openModal('mcart');
}
function renderCart() {
  const lista = document.getElementById('cartLista');
  const totalEl = document.getElementById('cartTotalVal');
  if (state.cart.length === 0) {
    lista.innerHTML = '<div class="cart-empty">🛒 Seu carrinho está vazio</div>';
    totalEl.textContent = 'R$ 0,00';
    return;
  }
  lista.innerHTML = state.cart.map(item => {
    const sub = (item.unitario * item.qty).toFixed(2);
    const adicsStr = item.adics.length > 0 ? item.adics.map(a => a.nome).join(', ') : '';
    const obsHtml = item.obs ? `<div class="ci-obs">📝 ${item.obs}</div>` : '';
    return `
      <div class="cart-item">
        <div class="ci-header">
          <div class="ci-nome">🍇 ${item.tipo}</div>
          <button class="ci-remove" onclick="removeItem(${item.id})">✕</button>
        </div>
        <div class="ci-detail">${item.detalhe}${adicsStr ? '<br>+' + adicsStr : ''}</div>
        ${obsHtml}
        <div class="ci-footer">
          <div class="ci-qty">
            <button class="ci-qbtn" onclick="changeCartQty(${item.id},-1)">−</button>
            <span class="ci-qnum">${item.qty}</span>
            <button class="ci-qbtn" onclick="changeCartQty(${item.id},1)">+</button>
          </div>
          <div class="ci-preco">R$ ${sub}</div>
        </div>
      </div>`;
  }).join('');
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  totalEl.textContent = 'R$ ' + total.toFixed(2);
}
function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
  updateFab();
}
function changeCartQty(id, d) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + d);
  renderCart();
  updateFab();
}

// ── CHECKOUT ──
function openCheckout() {
  if (state.cart.length === 0) return;
  state.pgto = null;
  document.querySelectorAll('.pgto-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pixBox').classList.remove('show');
  document.getElementById('trocoBox').classList.remove('show');
  document.getElementById('endInput').value = '';
  document.getElementById('nomeInput').value = '';
  closeModal('mcart');
  renderCheckoutResumo();
  openModal('mcheckout');
}
function selectPgto(tipo) {
  state.pgto = tipo;
  document.querySelectorAll('.pgto-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pgto_' + tipo).classList.add('active');
  document.getElementById('pixBox').classList.toggle('show', tipo === 'pix');
  document.getElementById('trocoBox').classList.toggle('show', tipo === 'dinheiro');
  if (tipo === 'pix') gerarPix();
}
function gerarPix() {
  const total  = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  const chave  = '+5527996900904';
  const nome   = 'KIACAIGARRA';
  const cidade = 'VILAVELHA';
  const valor  = total.toFixed(2);

  function tlv(id, v) {
    v = String(v);
    return id + v.length.toString().padStart(2,'0') + v;
  }

  function crc16(s) {
    let c = 0xFFFF;
    for (let i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) c = (c & 0x8000) ? (c << 1) ^ 0x1021 : c << 1;
    }
    return (c & 0xFFFF).toString(16).toUpperCase().padStart(4,'0');
  }

  const c26 = tlv('00','BR.GOV.BCB.PIX') + tlv('01', chave);
  const c62 = tlv('05','***');

  const body =
    tlv('00','01')   +
    tlv('01','12')   +
    tlv('26', c26)   +
    tlv('52','0000') +
    tlv('53','986')  +
    tlv('54', valor) +
    tlv('58','BR')   +
    tlv('59', nome)  +
    tlv('60', cidade)+
    tlv('62', c62)   +
    '6304';

  const fullPayload = body + crc16(body);

  document.getElementById('pixChave').textContent = fullPayload;
  document.getElementById('pixQrImg').src =
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(fullPayload);
}
function copiarPix() {
  const txt = document.getElementById('pixChave').textContent;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = document.getElementById('btnCopiar');
    btn.textContent = '✅ Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar código Pix', 2000);
  });
}
function renderCheckoutResumo() {
  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  let html = state.cart.map(item => {
    const sub = (item.unitario * item.qty).toFixed(2);
    return `<div class="pr-linha"><span>🍇 ${item.tipo} x${item.qty}</span><span>R$ ${sub}</span></div>`;
  }).join('');
  document.getElementById('checkoutResumo').innerHTML = html;
  document.getElementById('checkoutTotal').textContent = 'R$ ' + total.toFixed(2);
}
function finalizarPedido() {
  const nome = document.getElementById('nomeInput').value.trim();
  const end  = document.getElementById('endInput').value.trim();
  if (!end) { alert('Por favor, preencha o endereço de entrega!'); return; }
  if (!state.pgto) { alert('Escolha a forma de pagamento!'); return; }

  const total = state.cart.reduce((s, i) => s + i.unitario * i.qty, 0);
  let msg = '🍇 *PEDIDO KIAÇAÍ NA GARRAFA*\n\n';
  msg += '📋 *ITENS DO PEDIDO:*\n';
  state.cart.forEach((item, idx) => {
    msg += `${idx+1}. *${item.tipo} x${item.qty}* — R$ ${(item.unitario * item.qty).toFixed(2)}\n`;
    msg += `   ${item.detalhe}\n`;
    if (item.adics.length > 0)
      msg += `   ➕ Adicionais: ${item.adics.map(a => a.nome).join(', ')}\n`;
    if (item.obs)
      msg += `   📝 Obs: ${item.obs}\n`;
    msg += '\n';
  });
  msg += `💰 *SUBTOTAL PRODUTOS: R$ ${total.toFixed(2)}*\n`;
  msg += `🛵 *FRETE: a calcular (Uber Flash / 99 Entregas)*\n\n`;
  msg += `📍 *ENDEREÇO DE ENTREGA:*\n${end}\n\n`;
  const pgtoNomes = { pix: '📲 Pix', cartao: '💳 Cartão na entrega', dinheiro: '💵 Dinheiro' };
  msg += `💳 *PAGAMENTO:* ${pgtoNomes[state.pgto]}\n`;
  if (state.pgto === 'dinheiro') {
    const troco = document.getElementById('trocoInput').value.trim();
    if (troco) msg += `   💵 Vai pagar com: R$ ${troco} (troco para calcular)\n`;
  }
  if (nome) msg += `\n👤 *Nome:* ${nome}`;
  msg += '\n\n_Aguardo confirmação do frete antes de finalizar o pedido!_ 🙏';
  window.open('https://wa.me/5527996900904?text=' + encodeURIComponent(msg), '_blank');
}
