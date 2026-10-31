/* izyAether 网页版 · 比价长条与额度月消耗（2026-10-31，与 App PriceBarsPage / QuotaPage 同一设计）
 * 在 app.js 之后加载，覆盖 viewPrice / bindPrice / viewQuota / bindQuota。 */
const BAR_COLORS = { GPT: '#3C9E73', Claude: '#C9714F', DeepSeek: '#4A6FCB', Kimi: '#7B62C4', GLM: '#2B93A6', Gemini: '#B95C8C', Grok: '#6F7787' };
const BAR_OTHER = '#6E6C82';
const BAR_FILES = { GPT: 'openai', Claude: 'claude', Gemini: 'gemini', Grok: 'grok', DeepSeek: 'deepseek', Kimi: 'kimi', GLM: 'glm', Qwen: 'qwen', '豆包': 'doubao', '混元': 'hunyuan', ERNIE: 'ernie', MiniMax: 'minimax', '星火': 'spark', MiMo: 'mimo', Muse: 'meta', '阶跃星辰': 'stepfun', '商汤': 'sensetime', '百川': 'baichuan', Mistral: 'mistral', Cohere: 'cohere', Amazon: 'amazon', NVIDIA: 'nvidia', Perplexity: 'perplexity' };
const BAR_COMMON = ['GPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Kimi', 'GLM'];
const LS_BARS = { pins: 'izy.pb_pins', sort: 'izy.pb_sort', recent: 'izy.pb_recent', subs: 'izy.my_subs', months: 'izy.spend_months' };
const USD_CNY = 7.2;
const BAR_MIN = 78;
const PB = { task: null, sort: null, searching: false, query: '', win: null, cmp: [], openId: '' };

function barColor(v) { return BAR_COLORS[v] || BAR_OTHER; }
function barIcon(v, size) {
  const f = BAR_FILES[v];
  return f ? `<img class="pbicon" src="assets/img/brand/${f}.png" alt="${esc(v)}" style="width:${size}px;height:${size}px">` : brandMark(v, size);
}
function barTint(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const f = function (c) { return Math.round(a < 0 ? c * (1 + a) : c + (255 - c) * a); };
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
function barHTML(o) {
  return `<div class="pbbar ${o.cls || ''}" ${o.attrs || ''} style="width:${o.pct}%;background:linear-gradient(90deg,${barTint(o.color, o.bright ? -0.22 : -0.5)},${barTint(o.color, o.bright ? 0.1 : -0.28)})">
    ${barIcon(o.vendor, 36)}
    <span class="pbtxt"><b>${esc(o.title)}${o.pinned ? ' 📌' : ''}</b><strong>${esc(o.big)}</strong></span>
  </div>`;
}
/* “我要”：和 App utils/TaskParse.ets 同一套规则，纯本地计算 */
function pbParse(raw) {
  const s = raw.trim();
  const ok = function (i, o, mon) { return { ok: true, label: s, inTok: Math.round(i), outTok: Math.round(o), monthly: !!mon }; };
  const fail = { ok: false, label: s, inTok: 0, outTok: 0, monthly: false };
  if (!s) return fail;
  const m = s.match(/([0-9]+(?:\.[0-9]+)?)\s*(万)?\s*(?:个)?\s*(字|页|行|次|篇)/);
  if (!m) {
    if (s.indexOf('论文') >= 0) return ok(24000, 2400);
    if (s.indexOf('公众号') >= 0) return ok(500, 3750);
    if (s.indexOf('小红书') >= 0) return ok(300, 750);
    return fail;
  }
  const n = parseFloat(m[1]) * (m[2] === '万' ? 10000 : 1), u = m[3];
  if (u === '次') { const d = s.indexOf('每天') >= 0 ? 30 : 1; return ok(n * d * 1000, n * d * 500, d > 1); }
  if (u === '页') return ok(n * 1200, n * 120);
  if (u === '行') return ok(n * 12, n * 12);
  if (u === '篇') return ok(n * 500, n * (s.indexOf('小红书') >= 0 ? 500 : 2500) * 1.5);
  const k = n * 1.5;
  if (s.indexOf('翻译') >= 0) return ok(k, k);
  if (s.indexOf('总结') >= 0 || s.indexOf('摘要') >= 0) return ok(k, k * 0.2);
  if (s.indexOf('读') >= 0) return ok(k, k * 0.1);
  return ok(500, k);
}
function pbTok(v) { return v >= 10000 ? (Math.round(v / 1000) / 10) + ' 万' : String(Math.round(v)); }
function pbCost(m) { return (PB.task.inTok * Number(m.priceIn) + PB.task.outTok * Number(m.priceOut)) / 1e6; }
function pbMetric(m) { return PB.task ? pbCost(m) : Number(m.priceOut); }
function pbLabel(m) {
  if (!PB.task) return '¥' + m.priceIn + ' / ¥' + m.priceOut;
  return pbCost(m) < 0.01 ? '< ¥0.01' : '¥' + pbCost(m).toFixed(2);
}
function pbMax() {
  return (DATA.apiPrices || []).reduce(function (v, m) { return Math.max(v, Math.min(pbMetric(m), PB.task ? 1e6 : 144)); }, 1);
}
function pbPct(v) { return Math.round(BAR_MIN + (100 - BAR_MIN) * Math.sqrt(Math.min(1, v / pbMax()))); }
function pbCheapest(g) { return g.models.slice().sort(function (a, b) { return pbMetric(a) - pbMetric(b); })[0]; }
function pbGroups() {
  let list = apiGroups();
  if (S.cnOnly) list = list.filter(function (g) { return regionOf(g.vendor); });
  const sort = store.get(LS_BARS.sort, 0);
  if (sort === 1) list = list.slice().sort(function (a, b) { return pbMetric(pbCheapest(a)) - pbMetric(pbCheapest(b)); });
  if (sort === 2) {
    const c = function (g) { return Math.max.apply(null, g.models.map(function (m) { return Number(m.contextK); })); };
    list = list.slice().sort(function (a, b) { return c(b) - c(a); });
  }
  return list;
}
function tierNum(t0) { const m = String(t0.month).match(/[0-9]+(\.[0-9]+)?/); return m ? parseFloat(m[0]) : 0; }
function minTier(s) { return (s.tiers || []).filter(function (x) { return tierNum(x) > 0; })[0]; }
function pbSubs() {
  return orderedSubs().filter(function (s) { return minTier(s) && (!S.cnOnly || s.cnAvailable === '直连'); });
}
function subPct(s) {
  const x = minTier(s);
  const cny = tierNum(x) * (x.month.indexOf('$') >= 0 ? USD_CNY : 1);
  return Math.round(BAR_MIN + (100 - BAR_MIN) * Math.sqrt(Math.min(1, cny / 144)));
}
function pbPins() { return store.get(LS_BARS.pins, []); }
function pbPinned() {
  return pbPins().map(function (id) { return (DATA.apiPrices || []).filter(function (m) { return m.id === id; })[0]; })
    .filter(function (m) { return m && (!S.cnOnly || regionOf(m.vendor)); });
}
function viewPrice() {
  const meta = DATA.meta || {};
  const api = S.priceTab !== 'sub';
  const sub = t(api ? 'pb.models' : 'pb.subsN', (api ? DATA.apiPrices : DATA.subscriptions).length) + ' · ' + String(meta.priceUpdatedAt || PRICE_UPDATED_AT).slice(5);
  return coverHTML(t('price.title'), sub) + `<div class="page pricepage pbpage">
    <button class="pbsearch" id="pbSearch" aria-label="${esc(t('pb.searchPh'))}">${IC.search()}</button>
    <div class="pbseg">${['api', 'sub'].map(function (k) { return `<button data-tab="${k}" class="${(k === 'api') === api ? 'on' : ''}">${esc(t(k === 'api' ? 'pb.api' : 'pb.sub'))}</button>`; }).join('')}</div>
    ${api ? `<button class="pbwant" id="pbWant"><b>${esc(t('pb.want'))}</b><span>${esc(PB.task ? PB.task.label : t('pb.unit'))}</span></button>
      ${PB.task ? `<div class="pbbasis">${esc(t('pb.basis', pbTok(PB.task.inTok), pbTok(PB.task.outTok)))}</div>` : ''}` : ''}
    <div class="pbfilter">
      <button data-cn="0" class="${S.cnOnly ? '' : 'on'}">${esc(t('pb.all'))}</button>
      <button data-cn="1" class="${S.cnOnly ? 'on' : ''}">${esc(t('pb.cn'))}</button>
      <i></i>${api ? `<button class="pbsort" id="pbSort">${esc(t('pb.sortT'))} ›</button>` : ''}
    </div>
    ${api ? `<div class="pbunit">${esc(t(PB.task ? 'pb.est' : 'pb.perM'))}</div>` : ''}
    <div id="pbPinned" class="pblist"></div>
    <div id="pbList" class="pblist"></div>
    <div id="pbCmp"></div>
  </div>`;
}
function pbPaint() {
  const box = document.getElementById('pbList');
  if (!box) return;
  const api = S.priceTab !== 'sub';
  const pins = pbPins();
  const pb = document.getElementById('pbPinned');
  pb.innerHTML = api ? pbPinned().map(function (m) {
    return barHTML({ vendor: m.vendor, title: m.name, big: pbLabel(m), color: barColor(m.vendor), pct: pbPct(pbMetric(m)), bright: true, pinned: true, attrs: `data-fam="${esc(m.vendor)}" data-key="${esc(m.id)}"` });
  }).join('') : '';
  pb.style.marginBottom = pb.innerHTML ? '14px' : '0';
  box.innerHTML = api ? pbGroups().map(function (g) {
    const c = pbCheapest(g);
    return barHTML({ vendor: g.vendor, title: g.vendor + ' · ' + t('pb.models', g.models.length), big: pbLabel(c) + ' ' + t('pb.from'), color: barColor(g.vendor), pct: pbPct(pbMetric(c)), bright: false, attrs: `data-fam="${esc(g.vendor)}" data-key="${esc(g.vendor)}"` });
  }).join('') : pbSubs().map(function (s) {
    return barHTML({ vendor: s.vendor, title: s.product, big: minTier(s).month + ' ' + t('pb.from'), color: barColor(s.vendor), pct: subPct(s), bright: true, attrs: `data-sub="${esc(subKey(s))}" data-key="${esc(subKey(s))}"` });
  }).join('');
  const go = function (e) {
    if (DRAG.on || Date.now() - DRAG.endedAt < 300) return;
    const el = e.currentTarget;
    PB.win = el.dataset.fam ? { fam: el.dataset.fam } : { sub: el.dataset.sub };
    PB.win.y = e.clientY; PB.openId = '';
    pbWin();
  };
  document.querySelectorAll('.pbbar').forEach(function (b) { b.onclick = go; });
  const commit = function (key, all) {
    return function (vis) {
      let k = 0;
      store.set(key, all.map(function (id) { return vis.indexOf(id) >= 0 ? vis[k++] : id; }));
      if (key === LS_PRICE.api) store.set(LS_BARS.sort, 0);
      pbPaint();
    };
  };
  const all = api ? apiGroups().map(function (g) { return g.vendor; }) : orderedSubs().map(subKey);
  attachDrag(box, '.pbbar', commit(api ? LS_PRICE.api : LS_PRICE.sub, all));
  attachDrag(pb, '.pbbar', commit(LS_BARS.pins, pins));
  const cb = document.getElementById('pbCmp');
  cb.innerHTML = PB.cmp.length ? `<div class="pbcmp"><span id="pbCmpClear">${esc(t('pb.picked', PB.cmp.length))}</span><button id="pbCmpGo">${esc(t('pb.cmp'))}</button></div>` : '';
  if (PB.cmp.length) {
    document.getElementById('pbCmpClear').onclick = function () { PB.cmp = []; pbPaint(); };
    document.getElementById('pbCmpGo').onclick = function () {
      if (PB.cmp.length < 2) return toast(t('cmp.need2'));
      goHash('price/compare/' + encodeURIComponent(PB.cmp.join(',')));
    };
  }
}
function pbLayer(html, cls) {
  pbClose();
  const d = document.createElement('div');
  d.id = 'pbLayer'; d.className = 'pblayer ' + (cls || '');
  d.innerHTML = html;
  document.body.appendChild(d);
  return d;
}
function pbClose() { const d = document.getElementById('pbLayer'); if (d) d.remove(); }
function pbWin() {
  const w = PB.win;
  const h = window.innerHeight;
  let head = '', rows = '', foot = '';
  if (w.fam) {
    const g = apiGroups().filter(function (x) { return x.vendor === w.fam; })[0];
    head = `<div class="pbwh" style="background:linear-gradient(135deg,${barTint(barColor(g.vendor), -0.15)},${barTint(barColor(g.vendor), 0.14)})">${barIcon(g.vendor, 50)}<span><b>${esc(g.vendor)}</b><i>${esc(t('pb.models', g.models.length))}</i></span><button class="pbx" aria-label="close">${IC.close()}</button><strong>${esc(pbLabel(pbCheapest(g)))} ${esc(t('pb.from'))}</strong></div>`;
    rows = g.models.map(function (m) {
      const open = PB.openId === m.id, inCmp = PB.cmp.indexOf(m.id) >= 0;
      return `<div class="pbrow" data-id="${esc(m.id)}"><div class="pbrh"><span><b>${esc(m.name)}</b><i>${Number(m.contextK) >= 1000 ? (Number(m.contextK) / 1000) + 'M' : m.contextK + 'K'}</i></span><strong>${esc(pbLabel(m))}</strong><button class="pbpin ${pbPins().indexOf(m.id) >= 0 ? 'on' : ''}" data-pin="${esc(m.id)}">📌</button></div>
        ${open ? `<div class="pbnote">${esc(m.note || '')}</div><button class="pbadd ${inCmp ? 'on' : ''}" data-cmp="${esc(m.id)}">${esc(t(inCmp ? 'pb.inCmp' : 'pb.addCmp'))}</button>` : ''}</div>`;
    }).join('');
  } else {
    const s = (DATA.subscriptions || []).filter(function (x) { return subKey(x) === w.sub; })[0];
    head = `<div class="pbwh" style="background:linear-gradient(135deg,${barTint(barColor(s.vendor), -0.15)},${barTint(barColor(s.vendor), 0.14)})">${barIcon(s.vendor, 50)}<span><b>${esc(s.product)}</b><i>${esc(s.cnAvailable || '')}</i></span><button class="pbx" aria-label="close">${IC.close()}</button><strong>${esc(minTier(s).month)} ${esc(t('pb.from'))}</strong></div>`;
    rows = s.tiers.map(function (x, i) {
      return `<div class="pbrow"><div class="pbrh"><span><b>${esc(x.name)}</b><i>${esc(x.benefits || '')}</i></span><strong>${esc(String(x.month).replace('/月', '') + (tierNum(x) > 0 ? '/月' : ''))}</strong>${tierNum(x) > 0 ? `<button class="pbpin" data-tier="${i}">＋</button>` : ''}</div></div>`;
    }).join('');
    foot = `<div class="pbwf">${esc(t('pb.subHint'))}</div>`;
  }
  const again = !!document.getElementById('pbLayer');
  const d = pbLayer(`<div class="pbshade"></div><div class="pbwin ${again ? 'still' : ''}" style="--oy:${Math.round((w.y || h / 2) - h / 2)}px">${head}<div class="pbrows">${rows}</div>${foot}</div>`, 'center');
  d.querySelector('.pbshade').onclick = pbClose;
  d.querySelector('.pbx').onclick = pbClose;
  d.querySelectorAll('.pbrow[data-id]').forEach(function (r) {
    r.onclick = function () { PB.openId = PB.openId === r.dataset.id ? '' : r.dataset.id; pbWin(); };
  });
  d.querySelectorAll('[data-pin]').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      const p = pbPins(), id = b.dataset.pin;
      store.set(LS_BARS.pins, p.indexOf(id) >= 0 ? p.filter(function (x) { return x !== id; }) : p.concat([id]));
      pbWin(); pbPaint();
    };
  });
  d.querySelectorAll('[data-cmp]').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      const id = b.dataset.cmp;
      if (PB.cmp.indexOf(id) >= 0) PB.cmp = PB.cmp.filter(function (x) { return x !== id; });
      else if (PB.cmp.length >= 4) return toast(t('cmp.max'));
      else PB.cmp = PB.cmp.concat([id]);
      pbWin(); pbPaint();
    };
  });
  d.querySelectorAll('[data-tier]').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      const s = (DATA.subscriptions || []).filter(function (x) { return subKey(x) === w.sub; })[0];
      const x = s.tiers[Number(b.dataset.tier)];
      const list = store.get(LS_BARS.subs, []);
      list.push({ id: 's' + Date.now(), brand: s.vendor, name: s.product.split('（')[0] + ' ' + x.name, price: tierNum(x), currency: x.month.indexOf('$') >= 0 ? 'USD' : 'CNY', day: new Date().getDate() });
      store.set(LS_BARS.subs, list);
      toast(t('pb.added'));
    };
  });
}
function pbSearch() {
  PB.query = '';
  const d = pbLayer(`<div class="pbsr"><div class="pbsh"><button class="pbback" aria-label="back">‹</button><input type="search" id="pbQ" placeholder="${esc(t('pb.searchPh'))}"></div><div id="pbRes"></div></div>`, 'full');
  d.querySelector('.pbback').onclick = pbClose;
  const q = d.querySelector('#pbQ');
  const paint = function () {
    PB.query = q.value;
    const s = q.value.trim().toLowerCase(), res = d.querySelector('#pbRes');
    if (!s) {
      res.innerHTML = `<div class="pbhot">${BAR_COMMON.map(function (v) { return `<button data-hot="${v}">${v}</button>`; }).join('')}</div>`;
      res.querySelectorAll('[data-hot]').forEach(function (b) { b.onclick = function () { q.value = b.dataset.hot; paint(); q.focus(); }; });
      return;
    }
    const ms = (DATA.apiPrices || []).filter(function (m) { return (m.name + ' ' + m.vendor).toLowerCase().indexOf(s) >= 0; }).slice(0, 30);
    const ss = (DATA.subscriptions || []).filter(function (x) { return minTier(x) && hitSub(x, s); }).slice(0, 30);
    res.innerHTML = (!ms.length && !ss.length) ? `<div class="pbnone">${esc(t('pb.none', q.value))}</div>` :
      (ms.length ? `<div class="pbgl">${esc(t('pb.api'))}</div><div class="pblist">${ms.map(function (m) { return barHTML({ vendor: m.vendor, title: m.name, big: pbLabel(m), color: barColor(m.vendor), pct: pbPct(pbMetric(m)), bright: true, attrs: `data-fam="${esc(m.vendor)}"` }); }).join('')}</div>` : '') +
      (ss.length ? `<div class="pbgl">${esc(t('pb.sub'))}</div><div class="pblist">${ss.map(function (x) { return barHTML({ vendor: x.vendor, title: x.product, big: minTier(x).month + ' ' + t('pb.from'), color: barColor(x.vendor), pct: subPct(x), bright: true, attrs: `data-sub="${esc(subKey(x))}"` }); }).join('')}</div>` : '');
    res.querySelectorAll('.pbbar').forEach(function (b) {
      b.onclick = function (e) {
        PB.win = b.dataset.fam ? { fam: b.dataset.fam } : { sub: b.dataset.sub };
        PB.win.y = e.clientY; PB.openId = ''; pbClose(); pbWin();
      };
    });
  };
  q.oninput = paint; paint(); q.focus();
}
function pbSortPanel() {
  const cur = store.get(LS_BARS.sort, 0);
  const d = pbLayer(`<div class="pbshade"></div><div class="pbsheet"><h3>${esc(t('pb.sortT'))}</h3>${[0, 1, 2].map(function (i) { return `<button data-s="${i}" class="${cur === i ? 'on' : ''}">${esc(t('pb.sort' + i))}${cur === i ? '<i>✓</i>' : ''}</button>`; }).join('')}</div>`, 'bottom');
  d.querySelector('.pbshade').onclick = pbClose;
  d.querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { store.set(LS_BARS.sort, Number(b.dataset.s)); pbClose(); pbPaint(); }; });
}
const PB_GROUPS = [['pb.g.write', ['写 1 万字', '公众号一篇', '小红书一篇']], ['pb.g.read', ['读 100 页 PDF', '读一篇论文', '翻译 1 万字']], ['pb.g.code', ['改 1000 行代码', '每天聊 20 次']]];
function pbAsk() {
  const st = { tab: 0, text: '', paste: '', out: 1, inW: '', outW: '', calls: 1, daily: false };
  const recent = store.get(LS_BARS.recent, []);
  const d = pbLayer(`<div class="pbshade"></div><div class="pbask"><h3>${esc(t('pb.askT'))}</h3><div class="pbseg dark" id="pbTabs"></div><div id="pbAskB" class="pbaskb"></div><button class="pbgo" id="pbGo">${esc(t('pb.go'))}</button><button class="pbun" id="pbUnit">${esc(t('pb.backUnit'))}</button></div>`, 'bottom');
  d.querySelector('.pbshade').onclick = pbClose;
  const cur = function () {
    if (st.tab === 0) return pbParse(st.text);
    if (st.tab === 1) {
      const tok = Math.ceil(st.paste.length * 1.5);
      return tok > 0 ? { ok: true, label: t('pb.tab.paste'), inTok: tok, outTok: Math.round(tok * [0.3, 1, 2][st.out]), monthly: false } : { ok: false };
    }
    const i = parseFloat(st.inW) || 0, o = parseFloat(st.outW) || 0, c = Math.max(1, parseFloat(st.calls) || 1) * (st.daily ? 30 : 1);
    return i + o > 0 ? { ok: true, label: i + ' / ' + o + ' 万 token', inTok: i * 1e4 * c, outTok: o * 1e4 * c, monthly: st.daily } : { ok: false };
  };
  const foot = function () {
    const k = cur(), g = d.querySelector('#pbGo');
    g.disabled = !k.ok;
    const r = d.querySelector('#pbRec');
    if (r) r.innerHTML = k.ok ? `<div class="pbrec">${esc(t('pb.recog'))}${esc(k.label)}<br>${esc(t('pb.basis', pbTok(k.inTok), pbTok(k.outTok)))}</div>` :
      (st.tab === 0 && st.text.trim() ? `<div class="pbfail"><b>${esc(t('pb.failT'))}</b><br>${esc(t('pb.failS'))}</div>` : '');
  };
  const paint = function () {
    d.querySelector('#pbTabs').innerHTML = ['pb.tab.say', 'pb.tab.paste', 'pb.tab.nums'].map(function (k, i) { return `<button data-t="${i}" class="${st.tab === i ? 'on' : ''}">${esc(t(k))}</button>`; }).join('');
    d.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { st.tab = Number(b.dataset.t); paint(); }; });
    const chips = function (key, arr) { return arr.length ? `<div class="pblb">${esc(t(key))}</div><div class="pbchips">${arr.map(function (x) { return `<button data-q="${esc(x)}">${esc(x)}</button>`; }).join('')}</div>` : ''; };
    const b = d.querySelector('#pbAskB');
    if (st.tab === 0) {
      b.innerHTML = `<input id="pbA" placeholder="${esc(t('pb.askPh'))}" value="${esc(st.text)}"><div id="pbRec"></div>${chips('pb.recent', recent)}${PB_GROUPS.map(function (g) { return chips(g[0], g[1]); }).join('')}`;
      b.querySelector('#pbA').oninput = function (e) { st.text = e.target.value; foot(); };
      b.querySelectorAll('[data-q]').forEach(function (x) { x.onclick = function () { st.text = x.dataset.q; paint(); }; });
    } else if (st.tab === 1) {
      b.innerHTML = `<textarea id="pbP" placeholder="${esc(t('pb.pastePh'))}">${esc(st.paste)}</textarea><div id="pbRec"></div><div class="pblb">${esc(t('pb.outLen'))}</div><div class="pbchips">${['pb.shorter', 'pb.same', 'pb.longer'].map(function (k, i) { return `<button data-o="${i}" class="${st.out === i ? 'on' : ''}">${esc(t(k))}</button>`; }).join('')}</div>`;
      b.querySelector('#pbP').oninput = function (e) { st.paste = e.target.value; foot(); };
      b.querySelectorAll('[data-o]').forEach(function (x) { x.onclick = function () { st.out = Number(x.dataset.o); paint(); }; });
    } else {
      b.innerHTML = [['inW', 'pb.in', '0'], ['outW', 'pb.out', '0'], ['calls', 'pb.calls', '1']].map(function (f) { return `<label class="pbfield"><span>${esc(t(f[1]))}</span><input inputmode="decimal" data-f="${f[0]}" placeholder="${f[2]}" value="${esc(String(st[f[0]]))}"></label>`; }).join('') +
        `<div id="pbRec"></div><div class="pbchips"><button data-d="0" class="${st.daily ? '' : 'on'}">${esc(t('pb.once'))}</button><button data-d="1" class="${st.daily ? 'on' : ''}">${esc(t('pb.daily'))}</button></div>`;
      b.querySelectorAll('[data-f]').forEach(function (x) { x.oninput = function () { st[x.dataset.f] = x.value; foot(); }; });
      b.querySelectorAll('[data-d]').forEach(function (x) { x.onclick = function () { st.daily = x.dataset.d === '1'; paint(); }; });
    }
    foot();
  };
  d.querySelector('#pbGo').onclick = function () {
    const k = cur();
    if (!k.ok) return;
    PB.task = k;
    if (st.tab === 0) store.set(LS_BARS.recent, [k.label].concat(recent.filter(function (x) { return x !== k.label; })).slice(0, 4));
    pbClose(); render();
  };
  d.querySelector('#pbUnit').onclick = function () { PB.task = null; pbClose(); render(); };
  paint();
}
function bindPrice() {
  document.querySelectorAll('.pbseg button[data-tab]').forEach(function (b) { b.onclick = function () { S.priceTab = b.dataset.tab; render(); }; });
  document.querySelectorAll('[data-cn]').forEach(function (b) { b.onclick = function () { S.cnOnly = b.dataset.cn === '1'; render(); }; });
  document.getElementById('pbSearch').onclick = pbSearch;
  const w = document.getElementById('pbWant'); if (w) w.onclick = pbAsk;
  const s = document.getElementById('pbSort'); if (s) s.onclick = pbSortPanel;
  pbPaint();
}
/* ══════════ 额度：圆环 + 会员 + 月消耗 ══════════ */
function mySubs() { return store.get(LS_BARS.subs, []); }
function subCny(s) { return s.currency === 'USD' ? s.price * USD_CNY : s.price; }
function subNext(day) {
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const at = function (y, m) { return new Date(y, m, Math.min(day, new Date(y, m + 1, 0).getDate())); };
  const d = at(now.getFullYear(), now.getMonth());
  return d >= today ? d : at(now.getFullYear(), now.getMonth() + 1);
}
function subDays(d) { const n = new Date(); return Math.round((d - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5); }
function spendSegs() {
  const m = {};
  mySubs().forEach(function (s) { m[s.brand] = (m[s.brand] || 0) + subCny(s); });
  store.get(LS.keys, []).forEach(function (k) {
    const v = monthUse(k) * (k.cur === 'USD' ? USD_CNY : 1), b = brandOf(k.vendor || k.vendorId);
    if (v > 0) m[b] = (m[b] || 0) + v;
  });
  return Object.keys(m).map(function (k) { return { label: k, value: m[k] }; }).sort(function (a, b) { return b.value - a.value; });
}
function ringSVG(segs) {
  const R = 110, r = 64, c = 120, total = segs.reduce(function (a, s) { return a + s.value; }, 0);
  if (!total) return `<circle cx="120" cy="120" r="87" fill="none" stroke="var(--pbtrack)" stroke-width="46"/>`;
  if (segs.length === 1) return `<circle cx="120" cy="120" r="87" fill="none" stroke="${barColor(segs[0].label)}" stroke-width="46"/>`;
  let a = -Math.PI / 2;
  const P = function (rad, ang) { return (c + rad * Math.cos(ang)).toFixed(2) + ' ' + (c + rad * Math.sin(ang)).toFixed(2); };
  return segs.map(function (s) {
    const sw = s.value / total * Math.PI * 2, gapO = Math.min(0.03, sw * 0.3), gapI = Math.min(0.05, sw * 0.3);
    const a1 = a + gapO, a2 = a + sw - gapO, b1 = a + gapI, b2 = a + sw - gapI, big = sw > Math.PI ? 1 : 0;
    a += sw;
    return `<path d="M${P(R, a1)}A${R} ${R} 0 ${big} 1 ${P(R, a2)}L${P(r, b2)}A${r} ${r} 0 ${big} 0 ${P(r, b1)}Z" fill="${barColor(s.label)}" stroke="${barColor(s.label)}" stroke-width="5" stroke-linejoin="round"/>`;
  }).join('');
}
function spendMonths(api, sub) {
  const now = new Date(), ym = function (y, m) { return y + '-' + (m + 1 < 10 ? '0' : '') + (m + 1); };
  const rec = store.get(LS_BARS.months, {});
  rec[ym(now.getFullYear(), now.getMonth())] = [api, sub];
  store.set(LS_BARS.months, rec);
  const first = Object.keys(rec).sort()[0].split('-');
  const span = (now.getFullYear() - Number(first[0])) * 12 + now.getMonth() + 1 - Number(first[1]);
  const out = [];
  for (let i = Math.max(6, span); i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1), v = rec[ym(d.getFullYear(), d.getMonth())];
    out.push({ y: d.getFullYear(), m: d.getMonth() + 1, api: v ? v[0] : 0, sub: v ? v[1] : 0 });
  }
  return out;
}
function spendChart() {
  const sub = mySubs().reduce(function (a, s) { return a + subCny(s); }, 0);
  const api = store.get(LS.keys, []).reduce(function (a, k) { return a + monthUse(k) * (k.cur === 'USD' ? USD_CNY : 1); }, 0);
  const ms = spendMonths(api, sub);
  if (S.spendPos === undefined || S.spendPos >= ms.length) S.spendPos = ms.length - 1;
  const end = Math.max(S.spendPos, 6), win = ms.slice(end - 6, end + 1), cur = ms[S.spendPos];
  const max = Math.max.apply(null, win.map(function (x) { return x.api + x.sub; }).concat([1]));
  return `<div class="spcard" id="spCard">
    <div class="sph"><b>${esc(t('spend.trend'))}</b><span><i class="a"></i>API<i class="s"></i>${esc(t('spend.sub'))}</span></div>
    <div class="spn"><div><em>${esc(t('spend.ym', cur.y, cur.m))}</em><strong>¥${money(cur.api + cur.sub)}</strong></div>
      <p><span>API<b>¥${money(cur.api)}</b></span><span>${esc(t('spend.sub'))}<b>¥${money(cur.sub)}</b></span></p></div>
    <div class="spbars">${win.map(function (x, i) {
    const on = ms.indexOf(x) === S.spendPos;
    return `<button data-mi="${end - 6 + i}" class="${on ? 'on' : ''}"><i><u class="a" style="height:${x.api / max * 100}%"></u><u class="s" style="height:${x.sub / max * 100}%"></u></i>${x.m}月</button>`;
  }).join('')}</div></div>`;
}
const viewQuotaOld = window.viewQuota;
function spendTop() {
  const segs = spendSegs(), total = segs.reduce(function (a, s) { return a + s.value; }, 0), subs = mySubs();
  const tickets = subs.slice().sort(function (a, b) { return subNext(a.day) - subNext(b.day); }).map(function (s) {
    const d = subDays(subNext(s.day)), n = subNext(s.day);
    return `<div class="sptk" data-sid="${esc(s.id)}" style="background:linear-gradient(100deg,${barTint(barColor(s.brand), -0.25)},${barTint(barColor(s.brand), 0.12)})">
      ${barIcon(s.brand, 44)}<span class="spti"><b>${esc(s.name)}</b><i>${esc(t('spend.next'))} · ${n.getMonth() + 1}/${n.getDate()}</i><strong>${s.currency === 'USD' ? '$' : '¥'}${s.price.toFixed(2)}</strong></span>
      <span class="sptd">${d === 0 ? `<b>${esc(t('spend.today'))}</b>` : `<strong>${d}</strong><i>${esc(t('spend.days'))}</i>`}</span></div>`;
  }).join('');
  return `<div class="spring"><svg viewBox="0 0 240 240">${ringSVG(segs)}</svg><div><i>${esc(t('spend.month', new Date().getMonth() + 1))}</i><b>¥${money(total)}</b></div></div>
    ${segs.length ? `<div class="splg">${segs.map(function (s) { return `<span><i style="background:${barColor(s.label)}"></i>${esc(s.label)}</span>`; }).join('')}</div>` : ''}
    <div class="sptitle">${esc(t('spend.sub'))}</div>${tickets}
    <button class="spadd" id="spAdd">＋ ${esc(t('spend.add'))}</button>${spendChart()}`;
}
window.viewQuota = function () {
  return viewQuotaOld().replace('<div class="page">', '<div class="page">' + spendTop());
};
const bindQuotaOld = window.bindQuota;
window.bindQuota = function () {
  bindQuotaOld();
  const a = document.getElementById('spAdd');
  if (a) a.onclick = function () { S.priceTab = 'sub'; goHash('price'); };
  document.querySelectorAll('[data-mi]').forEach(function (b) { b.onclick = function () { S.spendPos = Number(b.dataset.mi); render(); }; });
  document.querySelectorAll('.sptk').forEach(function (el) {
    let tm = 0;
    el.onpointerdown = function () {
      tm = setTimeout(function () {
        const s = mySubs().filter(function (x) { return x.id === el.dataset.sid; })[0];
        if (s && confirm(t('spend.del') + '\n' + s.name)) { store.set(LS_BARS.subs, mySubs().filter(function (x) { return x.id !== s.id; })); render(); }
      }, 500);
    };
    el.onpointerup = el.onpointerleave = el.onpointercancel = function () { clearTimeout(tm); };
  });
  const c = document.getElementById('spCard');
  if (c) {
    let sx = 0, on = false;
    c.onpointerdown = function (e) { sx = e.clientX; on = true; };
    c.onpointerup = function (e) {
      if (!on) return; on = false;
      const dx = e.clientX - sx, n = spendMonths(0, 0).length;
      if (Math.abs(dx) > 40) { const p = S.spendPos + (dx > 0 ? -1 : 1); if (p >= 0 && p < n) { S.spendPos = p; render(); } }
    };
  }
};
/* 浏览器返回：先关浮层 */
window.addEventListener('hashchange', pbClose);
