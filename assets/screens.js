/* izyAether Web · 二级页（11 个子页面，渲染逐元素对齐 app 源码）
 * 入口由 assets/app.js 的路由分派：hash 形如 #library/detail/<id>
 *
 * 页头四种模式（App 实证）：
 *   ① 沉浸操作栏（detail）：返回 + 右侧文字动作（分享菜单 / 编辑 / 删除）
 *   ② 返回+标题+右侧动作（edit / cats / import）：18 Bold + 14~15 号文字动作
 *   ③ 大标题栏（addkey / calc / compare）：38×38 r19 返回圆钮独占一行 + 28 Bold + 12 副题
 *   ④ 头像+双行标题（vguide / qdetail）：38 圆钮 + 18 Bold + 11 副题；
 *      40×40 返回 + 18 Medium（trash / profile）
 */
window.SCREENS = {};

/* ══════════ 页头构建（App topBar 逐参数对齐） ══════════ */
/* 沉浸式返回钮（22 chevron + padding 8，落点在状态栏下方） */
function hdrBack() {
  return `<button class="tb-back" onclick="history.back()" aria-label="back">${IC.left()}</button>`;
}
/* 大标题版式的返回圆钮（38×38 r19 白底 1px 线） */
function hdrBackRound() {
  return `<button class="tb-round" onclick="history.back()" aria-label="back">${IC.left()}</button>`;
}
/* 40×40 返回键（无 padding，App trash/profile 同款：Stack 40×40） */
function hdrBack40() {
  return `<button class="tb-40" onclick="history.back()" aria-label="back">${IC.left()}</button>`;
}
/* 模式②：返回 + 18 Bold 标题 + 右侧文字动作 */
function hdrTitle(title, rightHtml) {
  return `<div class="subtop">${hdrBack()}<span class="subtop-t">${esc(title)}</span>${rightHtml || '<span class="subtop-blank"></span>'}</div>`;
}
/* 模式③：返回圆钮行 + 28 大标题 + 12 副题 */
function hdrBig(title, sub) {
  return `<div class="bigtop">${hdrBackRound()}</div>
  <div class="bighead"><div class="bighead-t">${esc(title)}</div>${sub ? `<div class="bighead-s">${esc(sub)}</div>` : ''}</div>`;
}
/* 模式④：38 返回圆钮 + 18 Bold 标题 + 11 副题（同行，App VendorGuidePage.topBar） */
function hdrRound(title, sub) {
  return `<div class="subtop rt">${hdrBackRound()}
    <span class="rt-txt"><b>${esc(title)}</b>${sub ? `<i>${esc(sub)}</i>` : ''}</span></div>`;
}
/* 卡片小标题：3×13 圆角色条 + 13 Medium（App sectionTitle） */
function secTitle(text) {
  return `<div class="sectitle"><i></i><span>${esc(text)}</span></div>`;
}

/* ══════════ Prompt 详情（App PromptDetailPage） ══════════ */
function findPrompt(id) {
  return allPrompts().filter(function (p) { return p.id === id; })[0] || null;
}
/* App locked()：内置 Skill 且未解锁（试用中/已购都算解锁） */
function detailLocked(p) {
  return !!p && p.builtin === true && p.type === 'skill' && !isPro();
}
SCREENS.detail = function () {
  const p = findPrompt(S.arg);
  if (!p) return `<div class="subpage"><div class="empty"><div class="e1">${esc(t('lib.deleted'))}</div></div></div>`;
  const vars = parseVars(p.content || '');
  const isSkill = p.type === 'skill';
  const locked = detailLocked(p);
  const srcLabel = p.builtin ? srcShort(p) : '';
  const srcUrl = p.builtin ? (p.sourceUrl || '') : '';
  const meta = realCatLabel(p)
    + (p.targetModel && p.targetModel !== '通用' ? ' · ' + p.targetModel : '')
    // 2026-10-18：内置条目的来源只在下方来源卡里写一次；自建条目才显示使用统计
    + (srcLabel
      ? ''
      : ' · ' + t('detail.used', p.useCount || 0) + ' · ' + daysAgoIn(p.lastUsedAt));
  return `<div class="subpage detail">
    <div class="subtop ops">
      ${hdrBack()}
      <span class="subtop-blank"></span>
      <span class="shwrap">
        <button class="topbar-act" id="dShare">${esc(t('detail.share'))}</button>
        <span class="shmenu hide" id="shMenu">
          <button data-sm="text">${esc(t('share.text'))}</button>
          <button data-sm="image">${esc(t('share.image'))}</button>
        </span>
      </span>
      <button class="topbar-act" id="dEdit">${esc(t('detail.edit'))}</button>
      <button class="topbar-act warn" id="dDel">${esc(t('detail.delete'))}</button>
    </div>
    <div class="dwrap">
      <div class="dtitle-row">
        <span class="dtitle">${esc(p.title)}</span>
        <span class="dtype ${isSkill ? 'skill' : ''}">${isSkill ? 'Skill' : 'Prompt'}</span>
        ${locked ? `<span class="dmember">${esc(t('detail.member'))}</span>` : ''}
      </div>
      <div class="dmeta">${esc(meta)}</div>
      ${(p.tags || []).length ? `<div class="dtags">${(p.tags || []).map(function (x) { return `<span class="dtag">#${esc(x)}</span>`; }).join('')}</div>` : ''}
      ${srcLabel ? `<div class="dsrc">
        <div class="dsrc-col"><span class="dsrc-l">${esc(t('detail.source'))}</span><span class="dsrc-v">${esc(srcLabel)}</span></div>
        ${srcUrl ? `<button class="dsrc-open" id="dSrcOpen">${esc(t('detail.source.open'))}${IC.arrowUR()}</button>` : ''}
      </div>` : ''}
      <div class="dbody-card">${mdLite(p.content)}</div>
      ${p.note ? `<div class="dnote-card"><span class="dnote-l">${esc(t('detail.note'))}</span><span class="dnote-v">${esc(p.note)}</span></div>` : ''}
      ${vars.length ? `<div class="dvars-card"><span class="dvars-l">${esc(t('detail.vars'))}</span>
        <div class="dvars-row">${vars.map(function (v) { return `<span class="dvar">${esc(v)}</span>`; }).join('')}</div></div>` : ''}
      <button class="dcost" id="dCost"><span>${esc(t('detail.cost'))}</span>${IC.chevRP()}</button>
    </div>
    <div class="dfoot">
      <button class="duse ${locked ? 'locked' : ''}" id="dUse">${esc(locked ? t('detail.unlock') : t('detail.use'))}</button>
      ${locked ? `<div class="dlocked-hint">${esc(t('detail.locked.hint'))}</div>` : ''}
    </div>
  </div>`;
};
function mdLite(s) {
  /* App MdLite：h(19/16/15 Bold) / code(11 等宽 #D8E4F0 on #263238) / li(• 14 primary) / quote(13 左 3px 主色边) / p(14 lh22)，块间距 6 */
  const blocks = [];
  const lines = String(s || '').split('\n');
  let inCode = false, codeBuf = [], paraBuf = [];
  const flushPara = function () {
    if (paraBuf.length) { blocks.push({ type: 'p', text: paraBuf.join('\n') }); paraBuf = []; }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().indexOf('```') === 0) {
      if (inCode) { blocks.push({ type: 'code', text: codeBuf.join('\n') }); codeBuf = []; inCode = false; }
      else { flushPara(); inCode = true; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    const tt = line.trim();
    if (tt.length === 0) { flushPara(); continue; }
    if (tt.charAt(0) === '#') {
      flushPara();
      let level = 0;
      while (level < tt.length && tt.charAt(level) === '#') level++;
      blocks.push({ type: 'h', level: Math.min(level, 4), text: tt.substring(level).trim() });
      continue;
    }
    if (tt.charAt(0) === '-' || tt.charAt(0) === '*' || tt.indexOf('•') === 0) {
      flushPara();
      blocks.push({ type: 'li', text: tt.replace(/^[-*•]\s*/, '') });
      continue;
    }
    if (tt.charAt(0) === '>') {
      flushPara();
      blocks.push({ type: 'quote', text: tt.substring(1).trim() });
      continue;
    }
    paraBuf.push(tt);
  }
  if (inCode && codeBuf.length) blocks.push({ type: 'code', text: codeBuf.join('\n') });
  flushPara();
  return blocks.map(function (b) {
    if (b.type === 'h') {
      const fs = b.level === 1 ? 19 : b.level === 2 ? 16 : 15;
      return `<div class="md-h" style="font-size:${fs}px">${esc(b.text)}</div>`;
    }
    if (b.type === 'code') return `<div class="md-code">${esc(b.text)}</div>`;
    if (b.type === 'li') return `<div class="md-li"><span>•</span><i>${esc(b.text)}</i></div>`;
    if (b.type === 'quote') return `<div class="md-quote">${esc(b.text)}</div>`;
    return `<div class="md-p">${esc(b.text)}</div>`;
  }).join('');
}
function bindDetail() {
  const p = findPrompt(S.arg);
  if (!p) return;
  const vars = parseVars(p.content || '');
  const locked = detailLocked(p);
  /* 分享菜单（App bindMenu：分享文本 / 分享长图） */
  const shBtn = document.getElementById('dShare');
  const shMenu = document.getElementById('shMenu');
  if (shBtn && shMenu) {
    shBtn.onclick = function (e) {
      e.stopPropagation();
      shMenu.classList.toggle('hide');
    };
    document.addEventListener('click', function closeSh(e) {
      if (!shMenu.contains(e.target) && e.target !== shBtn) { shMenu.classList.add('hide'); document.removeEventListener('click', closeSh); }
    });
  }
  const doShare = function (kind) {
    const code = packCode(p);
    let share = '【' + p.title + '】(' + (p.targetModel || '通用') + ')\n\n' + (p.content || '');
    if (code) share += '\n\n————\n把整段复制进 App「库」页即可一键导入：\n' + code;
    if (kind === 'image') {
      /* 分享长图依赖原生组件截图（网页做不到的 7 项之一）→ 复制文本兜底 */
      copyText(share);
      toast(t('detail.shareFail'));
      return;
    }
    if (navigator.share) navigator.share({ title: p.title, text: share }).catch(function () { copyText(share); });
    else copyText(share);
  };
  if (shMenu) shMenu.querySelectorAll('[data-sm]').forEach(function (b) {
    b.onclick = function (e) { e.stopPropagation(); shMenu.classList.add('hide'); doShare(b.dataset.sm); };
  });
  const srcOpen = document.getElementById('dSrcOpen');
  if (srcOpen) srcOpen.onclick = function () {
    const u = p.sourceUrl || '';
    if (u) window.open(u, '_blank', 'noopener');
    else toast(t('guide.fail'));
  };
  /* 用哪个模型跑最便宜：带上本条字数进成本计算器（App pushUrl CalculatorPage params.words） */
  const cost = document.getElementById('dCost');
  if (cost) cost.onclick = function () { calcPrefill((p.content || '').length); goHash('price/calc'); };
  const ed = document.getElementById('dEdit');
  if (ed) ed.onclick = function () { goHash('library/edit/' + encodeURIComponent(p.id)); };
  const dl = document.getElementById('dDel');
  if (dl) dl.onclick = function () {
    dlg(t('detail.del.title'), t('detail.del.msg', p.title), t('common.delete'), t('common.cancel'), function () {
      delPrompt(p.id);
      history.back();
    }, 'warn');
  };
  const use = document.getElementById('dUse');
  if (use) use.onclick = function () {
    if (locked) {
      dlg(t('detail.locked'), t('detail.locked.msg', p.title), t('detail.locked.cta'), t('common.cancel'), function () {
        goHash('mine'); setTimeout(openPlans, 60);
      });
      return;
    }
    if (vars.length) openFill(p, vars);
    else copyAndCount(p, p.content || '');
  };
}
/* App copyAndCount：复制 + toast + 使用统计 */
function copyAndCount(p, text) {
  copyText(text);
  toast(t('detail.copied'));
  markUsed(p);
}
/* App 变量填写弹层（showFill：86% 宽 / r16 / maxHeight 70% / 取消·生成 40 高 r20） */
function openFill(p, vars) {
  closeMask();
  const m = document.createElement('div');
  m.className = 'mask fillmask'; m.id = 'fillMask';
  m.innerHTML = `<div class="sheet fill">
    <div class="fill-t">${esc(t('detail.fill'))}</div>
    <div class="fill-scroll">
      ${vars.map(function (v) {
    return `<div class="fill-item"><span class="fill-v">${esc(v)}</span>
        <input type="text" class="fill-in" data-fv="${esc(v)}" placeholder="${esc(t('detail.fill.hint', v))}"></div>`;
  }).join('')}
    </div>
    <div class="fill-b">
      <button class="btn fill-cancel" id="fillNo">${esc(t('common.cancel'))}</button>
      <button class="btn primary" id="fillYes">${esc(t('detail.gen'))}</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  document.getElementById('fillNo').onclick = closeMask;
  document.getElementById('fillYes').onclick = function () {
    const values = {};
    m.querySelectorAll('[data-fv]').forEach(function (el) { values[el.dataset.fv] = el.value; });
    closeMask();
    copyAndCount(p, renderVars(p.content || '', values));
  };
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}

/* ══════════ 编辑 / 新建（App PromptEditPage） ══════════ */
const EDIT = { type: 'prompt', isNew: true, rec: null };
function editCats() {
  const custom = store.get(LS.cats, []);
  return custom.length ? custom.slice() : ['未分类'];
}
SCREENS.edit = function () {
  const isNew = S.arg === 'new';
  let p;
  if (isNew) p = { title: '', content: '', type: 'prompt', category: '', tags: [], targetModel: '通用', note: '' };
  else {
    p = findPrompt(S.arg);
    if (!p) return `<div class="subpage"><div class="empty"><div class="e1">${esc(t('lib.deleted'))}</div></div></div>`;
    /* App：内置条目也可进编辑页（repo.byId 能读到）；web 预填同内容，保存为用户副本 */
    p = { title: p.title || '', content: p.content || '', type: p.type === 'skill' ? 'skill' : 'prompt', category: p.category || '', tags: (p.tags || []).slice(), targetModel: p.targetModel || '通用', note: p.note || '' };
  }
  EDIT.isNew = isNew;
  EDIT.rec = isNew ? null : findPrompt(S.arg);
  EDIT.type = p.type;
  const cats = editCats();
  const curCat = cats.indexOf(p.category) >= 0 ? p.category : cats[0];
  const vars = parseVars(p.content || '');
  return `<div class="subpage edit">
    ${hdrTitle(isNew ? t('edit.new') : t('edit.edit'), `<button class="topbar-act primary" id="pSave">${esc(t('common.save'))}</button>`)}
    <div class="ewrap">
      <input type="text" id="pTitle" class="einput" value="${esc(p.title)}" placeholder="${esc(t('edit.title.hint'))}" maxlength="60">
      <div class="erow">
        <div class="etype-group">
          <button class="etchip ${p.type !== 'skill' ? 'on prompt' : ''}" data-pt="prompt">Prompt</button>
          <button class="etchip ${p.type === 'skill' ? 'on skill' : ''}" data-pt="skill">Skill</button>
        </div>
        <select id="pCat" class="esel">${cats.map(function (c) { return `<option value="${esc(c)}" ${curCat === c ? 'selected' : ''}>${esc(catLabel(c))}</option>`; }).join('')}</select>
      </div>
      <input type="text" id="pModel" class="einput" value="${esc(p.targetModel)}" placeholder="${esc(t('edit.target.hint'))}">
      <textarea id="pBody" class="einput earea" rows="7" placeholder="${esc(t('edit.content.hint'))}">${esc(p.content)}</textarea>
      <div id="eVarsBox">${vars.length ? `<div class="evars-n">${esc(t('edit.vars', vars.length))}</div>
        <div class="evars-row">${vars.map(function (v) { return `<span class="evar">${esc(v)}</span>`; }).join('')}</div>` : ''}</div>
      <input type="text" id="pTags" class="einput" value="${esc((p.tags || []).join(', '))}" placeholder="${esc(t('edit.tags.hint'))}">
      <div id="eSuggestBox"></div>
      <textarea id="pNote" class="einput earea short" rows="3" placeholder="${esc(t('edit.note.hint'))}">${esc(p.note || '')}</textarea>
      <div class="epaste-row"><button class="epaste" id="pPaste">${esc(t('edit.paste'))}</button></div>
    </div>
  </div>`;
};
/* 智能标签推荐（App TagSuggester：分类优先 + 8 组关键词规则，最多 5 个） */
const TAG_RULES = [
  ['编程', '代码', '函数', '编译', 'python', 'java', 'bug', '报错', '调试'],
  ['写作', '论文', '润色', '学术', '摘要', '文案', '投稿'],
  ['翻译', 'translate', '英文', '互译'],
  ['图像', '图', '画', 'image', 'logo', '海报', '插画'],
  ['摘要', '总结', '提取', '要点', '归纳'],
  ['API', 'api', 'token', '接口', 'curl', '请求'],
  ['结构化', 'markdown', '##', '步骤', '流程'],
  ['角色扮演', '你是', '扮演', '系统提示', 'system']
];
function tagSuggest(title, content, category) {
  const text = (title + ' ' + content).toLowerCase();
  const out = [];
  if (category && category !== '未分类' && out.indexOf(category) < 0) out.push(category);
  for (let i = 0; i < TAG_RULES.length; i++) {
    const rule = TAG_RULES[i];
    for (let j = 1; j < rule.length; j++) {
      if (text.indexOf(rule[j].toLowerCase()) >= 0) { if (out.indexOf(rule[0]) < 0) out.push(rule[0]); break; }
    }
    if (out.length >= 5) break;
  }
  return out;
}
function paintEditVars() {
  const box = document.getElementById('eVarsBox');
  if (!box) return;
  const body = document.getElementById('pBody');
  const vars = parseVars(body ? body.value : '');
  box.innerHTML = vars.length
    ? `<div class="evars-n">${esc(t('edit.vars', vars.length))}</div><div class="evars-row">${vars.map(function (v) { return `<span class="evar">${esc(v)}</span>`; }).join('')}</div>`
    : '';
}
function paintEditSuggest() {
  const box = document.getElementById('eSuggestBox');
  if (!box) return;
  const title = document.getElementById('pTitle');
  const body = document.getElementById('pBody');
  const cat = document.getElementById('pCat');
  /* App TagSuggester.suggest：只按标题/正文/分类推荐，不过滤已选标签（appendTag 自带去重） */
  const sg = tagSuggest(title ? title.value : '', body ? body.value : '', cat ? cat.value : '');
  box.innerHTML = sg.length
    ? `<div class="esug-l">${esc(t('edit.tags.suggest'))}</div><div class="esug-row">${sg.map(function (s) {
      return `<button class="esug" data-tag="${esc(s)}">+ ${esc(s)}</button>`;
    }).join('')}</div>`
    : '';
  box.querySelectorAll('[data-tag]').forEach(function (b) {
    b.onclick = function () {
      const el = document.getElementById('pTags');
      const parts = el.value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (parts.indexOf(b.dataset.tag) < 0) parts.push(b.dataset.tag);
      el.value = parts.join(', ');
      paintEditSuggest();
    };
  });
}
function bindEdit() {
  document.querySelectorAll('[data-pt]').forEach(function (b) {
    b.onclick = function () {
      EDIT.type = b.dataset.pt;
      document.querySelectorAll('[data-pt]').forEach(function (x) {
        x.classList.toggle('on', x === b);
        x.classList.toggle('prompt', x === b && b.dataset.pt === 'prompt');
        x.classList.toggle('skill', x === b && b.dataset.pt === 'skill');
      });
    };
  });
  const body = document.getElementById('pBody');
  if (body) body.oninput = function () { paintEditVars(); paintEditSuggest(); };
  const title = document.getElementById('pTitle');
  if (title) title.oninput = paintEditSuggest;
  const cat = document.getElementById('pCat');
  if (cat) cat.onchange = paintEditSuggest;
  paintEditVars();
  paintEditSuggest();
  const paste = document.getElementById('pPaste');
  if (paste) paste.onclick = function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) return toast(t('edit.clipEmpty'));
    navigator.clipboard.readText().then(function (txt) {
      if (txt && txt.length) { document.getElementById('pBody').value = txt; paintEditVars(); paintEditSuggest(); }
      else toast(t('edit.clipEmpty'));
    }, function () { toast(t('edit.clipEmpty')); });
  };
  const save = document.getElementById('pSave');
  if (save) save.onclick = function () {
    const titleV = document.getElementById('pTitle').value.trim();
    const bodyV = document.getElementById('pBody').value;
    if (!titleV) return toast(t('edit.needTitle'));
    if (!bodyV.trim()) return toast(t('edit.needContent'));
    const tags = document.getElementById('pTags').value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
    const mine = selfPrompts();
    if (EDIT.isNew) {
      if (!isPro() && mine.length >= LIMIT_PROMPT) return toast(t('edit.limit', LIMIT_PROMPT));
      mine.unshift({
        id: 'p' + Date.now(), title: titleV, content: bodyV, type: EDIT.type,
        category: document.getElementById('pCat').value, tags: tags,
        targetModel: document.getElementById('pModel').value.trim() || '通用',
        note: document.getElementById('pNote').value.trim(),
        createdAt: Date.now(), useCount: 0, lastUsedAt: 0, fav: false
      });
    } else {
      /* App doSave：同 id 落库（内置条目据此转为用户条目）；web 保存为用户副本 */
      const src = EDIT.rec || {};
      const rec = {
        id: 'p' + Date.now(), title: titleV, content: bodyV, type: EDIT.type,
        category: document.getElementById('pCat').value, tags: tags,
        targetModel: document.getElementById('pModel').value.trim() || '通用',
        note: document.getElementById('pNote').value.trim(),
        createdAt: src.createdAt || Date.now(), useCount: src.useCount || 0,
        lastUsedAt: src.lastUsedAt || 0, fav: !!src.fav
      };
      const i = mine.findIndex(function (x) { return x.id === src.id; });
      if (i >= 0) mine[i] = rec; else mine.unshift(rec);
    }
    store.set(LS.prompts, mine);
    toast(t('edit.saved'));
    history.back();
  };
}

/* ══════════ 分类管理（App CategoryPage） ══════════ */
const CATS = { inline: false, renameFrom: '', newName: '' };
SCREENS.cats = function () {
  const cats = store.get(LS.cats, []);
  return `<div class="subpage cats">
    ${hdrTitle(t('cat.title'), `<button class="topbar-act primary" id="catNew">${esc(t('cat.new'))}</button>`)}
    ${CATS.inline ? `<div class="catinline">
      <input type="text" id="catName" class="einput" value="${esc(CATS.newName)}" placeholder="${esc(CATS.renameFrom ? t('cat.renamePh', CATS.renameFrom) : t('cat.ph'))}">
      <button class="topbar-act primary" id="catOk">${esc(CATS.renameFrom ? t('common.save') : t('cat.add'))}</button>
    </div>` : ''}
    <div class="catlist">
      ${cats.map(function (c) {
    return `<div class="catrow-card"><span class="catrow-name">${esc(catLabel(c))}</span>
        <button class="catrow-act" data-rn="${esc(c)}">${esc(t('cat.rename'))}</button>
        <button class="catrow-act warn" data-dl="${esc(c)}">${esc(t('common.delete'))}</button></div>`;
  }).join('')}
    </div>
    <div class="catfoot">${esc(trialActive() ? t('cat.foot.trial') : t('cat.foot.free'))}</div>
  </div>`;
};
function bindCats() {
  const nw = document.getElementById('catNew');
  if (nw) nw.onclick = function () { CATS.inline = true; CATS.renameFrom = ''; CATS.newName = ''; render(); };
  const ok = document.getElementById('catOk');
  if (ok) ok.onclick = function () {
    const name = (document.getElementById('catName').value || '').trim();
    if (CATS.renameFrom) {
      if (name && name !== CATS.renameFrom) {
        const cats = store.get(LS.cats, []).map(function (x) { return x === CATS.renameFrom ? name : x; });
        store.set(LS.cats, cats);
        const mine = selfPrompts().map(function (p) { if (p.category === CATS.renameFrom) p.category = name; return p; });
        store.set(LS.prompts, mine);
      }
    } else if (name) {
      const cats = store.get(LS.cats, []);
      if (cats.indexOf(name) >= 0) { toast(t('cat.limit')); return; }
      if (!isPro() && cats.length >= LIMIT_CAT) { toast(t('cat.limit')); return; }
      cats.push(name);
      store.set(LS.cats, cats);
    }
    CATS.inline = false; CATS.renameFrom = ''; CATS.newName = '';
    render();
  };
  document.querySelectorAll('[data-rn]').forEach(function (b) {
    b.onclick = function () { CATS.inline = true; CATS.renameFrom = b.dataset.rn; CATS.newName = b.dataset.rn; render(); };
  });
  document.querySelectorAll('[data-dl]').forEach(function (b) {
    b.onclick = function () {
      const c = b.dataset.dl;
      dlg(t('cat.del.title'), t('cat.del.msg', catLabel(c)), t('common.delete'), t('common.cancel'), function () {
        store.set(LS.cats, store.get(LS.cats, []).filter(function (x) { return x !== c; }));
        const mine = selfPrompts().map(function (p) { if (p.category === c) p.category = ''; return p; });
        store.set(LS.prompts, mine);
        render();
      }, 'warn');
    };
  });
}

/* ══════════ 回收站（App TrashPage） ══════════ */
const TRASH_KEEP_DAYS = 7, TRASH_DAY_MS = 864e5;
function trashLive() {
  const now = Date.now();
  return store.get(LS.trash, []).filter(function (p) { return now - (p.deletedAt || 0) < TRASH_KEEP_DAYS * TRASH_DAY_MS; });
}
function trashDaysLeft(p) {
  const left = TRASH_KEEP_DAYS * TRASH_DAY_MS - (Date.now() - (p.deletedAt || 0));
  return left <= 0 ? 0 : Math.ceil(left / TRASH_DAY_MS);
}
function trashMeta(p) {
  let s = realCatLabel(p);
  if (p.targetModel && p.targetModel !== '通用') s += ' · ' + p.targetModel;
  return s;
}
SCREENS.trash = function () {
  /* App aboutToAppear：进页面先清过期（purgeExpired），清了几条给 toast */
  const all = store.get(LS.trash, []);
  const now = Date.now();
  const expired = all.filter(function (p) { return now - (p.deletedAt || 0) >= TRASH_KEEP_DAYS * TRASH_DAY_MS; });
  if (expired.length) {
    store.set(LS.trash, all.filter(function (p) { return now - (p.deletedAt || 0) < TRASH_KEEP_DAYS * TRASH_DAY_MS; }));
    setTimeout(function () { toast(t('trash.swept', expired.length)); }, 30);
  }
  const items = trashLive();
  const has = items.length > 0;
  return `<div class="subpage trash">
    <div class="trtop">
      ${hdrBack40()}
      <span class="trtop-t">${esc(t('trash.title'))}</span>
      <button class="trtop-act ${has ? '' : 'dim'}" id="trAll">${esc(t('trash.restore.all'))}</button>
      <button class="trtop-act warn ${has ? '' : 'dim'}" id="trClear">${esc(t('trash.clear.short'))}</button>
    </div>
    <div class="trhint">${esc(t('trash.hint', TRASH_KEEP_DAYS))}</div>
    ${has ? `<div class="trlist">${items.map(function (p) {
    const days = trashDaysLeft(p);
    const isSkill = p.type === 'skill';
    return `<div class="trcard">
        <div class="trcard-row">
          <span class="trbadge ${isSkill ? 'skill' : ''}">${isSkill ? IC.zapW(17) : IC.promptW(17)}</span>
          <div class="trcard-txt">
            <div class="trcard-title">${esc(p.title)}</div>
            <div class="trcard-meta">${esc(trashMeta(p))}</div>
          </div>
        </div>
        <div class="trcard-act">
          <span class="trleft ${days <= 1 ? 'warn' : ''}">${esc(t('trash.left', days))}</span>
          <button class="trpill primary" data-rs="${esc(p.id)}">${esc(t('trash.restore'))}</button>
          <button class="trpill warn" data-kill="${esc(p.id)}">${esc(t('trash.remove'))}</button>
        </div>
      </div>`;
  }).join('')}</div>` : `<div class="trempty">
      <div class="trempty-badge">${IC.trashBig()}</div>
      <div class="trempty-t">${esc(t('trash.empty'))}</div>
      <div class="trempty-s">${esc(t('trash.empty.sub'))}</div>
    </div>`}
  </div>`;
};
function bindTrash() {
  const all = document.getElementById('trAll');
  if (all) all.onclick = function () {
    const items = trashLive();
    if (!items.length) return;
    dlg(t('trash.restore.all'), t('trash.restore.all.msg', items.length), t('trash.restore.all'), t('common.cancel'), function () {
      const trash = store.get(LS.trash, []);
      const hidden = hiddenBuilt();
      const mine = selfPrompts();
      let ok = 0, skip = 0;
      items.forEach(function (p) {
        if (p.builtin) {
          const hi = hidden.indexOf(p.id);
          if (hi >= 0) hidden.splice(hi, 1);
        } else {
          if (!isPro() && mine.length >= LIMIT_PROMPT) { skip++; return; }
          delete p.deletedAt;
          mine.unshift(p);
        }
        ok++;
      });
      store.set(LS.hidden, hidden);
      store.set(LS.prompts, mine);
      store.set(LS.trash, trash.filter(function (x) { return items.indexOf(x) < 0; }));
      toast(skip > 0 ? t('trash.restore.partial', ok, skip) : t('trash.restore.all.done', ok));
      render();
    });
  };
  const cl = document.getElementById('trClear');
  if (cl) cl.onclick = function () {
    const items = trashLive();
    if (!items.length) return;
    dlg(t('trash.clear'), t('trash.clear.msg', items.length), t('trash.clear'), t('common.cancel'), function () {
      store.set(LS.trash, []);
      toast(t('trash.cleared'));
      render();
    }, 'warn');
  };
  document.querySelectorAll('[data-rs]').forEach(function (b) {
    b.onclick = function () {
      const id = b.dataset.rs;
      const trash = store.get(LS.trash, []);
      const p = trash.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      if (p.builtin) {
        const hidden = hiddenBuilt().filter(function (x) { return x !== id; });
        store.set(LS.hidden, hidden);
      } else {
        const mine = selfPrompts();
        if (!isPro() && mine.length >= LIMIT_PROMPT) return toast(t('lib.paste.limit'));
        delete p.deletedAt;
        mine.unshift(p);
        store.set(LS.prompts, mine);
      }
      store.set(LS.trash, trash.filter(function (x) { return x.id !== id; }));
      toast(t('trash.restored'));
      render();
    };
  });
  document.querySelectorAll('[data-kill]').forEach(function (b) {
    b.onclick = function () {
      const id = b.dataset.kill;
      const p = store.get(LS.trash, []).filter(function (x) { return x.id === id; })[0];
      dlg(t('trash.purge.title'), t('trash.purge.msg', p ? p.title : ''), t('trash.remove'), t('common.cancel'), function () {
        store.set(LS.trash, store.get(LS.trash, []).filter(function (x) { return x.id !== id; }));
        toast(t('trash.purged'));
        render();
      }, 'warn');
    };
  });
}

/* ══════════ 导入（App ImportPage） ══════════ */
const IMP = { text: '', split: true, items: [], busy: false };
function impSummary(s) {
  let t2 = String(s || '').split('\n').join(' ');
  t2 = t2.split('  ').join(' ').trim();
  return t2.length > 90 ? t2.substring(0, 90) + '…' : t2;
}
/* ══════════ 导入解析（逐行对齐 app utils/ImportParser.ets） ══════════ */
const IMP_TITLE_MAX = 26, IMP_MIN_BLOCK = 12;
function impNormalize(t) {
  return String(t || '').split('\r\n').join('\n').split('\r').join('\n').trim();
}
function impIsHeading(line) {
  const s = String(line).trim();
  if (s.length < 2 || s.charAt(0) !== '#') return false;
  let i = 0;
  while (i < s.length && s.charAt(i) === '#') i++;
  if (i > 6 || i >= s.length) return false;
  const c = s.charAt(i);
  return c === ' ' || c === '\t';
}
function impHeadingText(line) {
  const s = String(line).trim();
  let i = 0;
  while (i < s.length && s.charAt(i) === '#') i++;
  return s.substring(i).trim();
}
function impIsDivider(line) {
  const s = String(line).trim();
  if (s.length < 3) return false;
  const c0 = s.charAt(0);
  if (c0 !== '-' && c0 !== '=' && c0 !== '*' && c0 !== '_') return false;
  for (let i = 1; i < s.length; i++) if (s.charAt(i) !== c0) return false;
  return true;
}
function impCleanTitle(t) {
  let s = String(t || '').trim();
  let g = 0;
  while (g < 8) {
    g++;
    const c = s.charAt(0);
    if (c === '#' || c === '*' || c === '-' || c === '>' || c === '`' || c === '=') { s = s.substring(1).trim(); continue; }
    if (s.indexOf('【') === 0 || s.indexOf('「') === 0 || s.indexOf('《') === 0 || s.indexOf('"') === 0) { s = s.substring(1).trim(); continue; }
    break;
  }
  let g2 = 0;
  while (g2 < 6 && s.length > 0) {
    g2++;
    const last = s.charAt(s.length - 1);
    if (last === '】' || last === '」' || last === '》' || last === '"' || last === ':' || last === '：') { s = s.substring(0, s.length - 1).trim(); continue; }
    break;
  }
  if (s.length === 0) return '未命名';
  if (s.length > IMP_TITLE_MAX) return s.substring(0, IMP_TITLE_MAX) + '…';
  return s;
}
function impTitleFromBody(body) {
  const lines = String(body).split('\n');
  for (let i = 0; i < lines.length && i < 8; i++) {
    const s = lines[i].trim();
    if (s.length === 0) continue;
    const colon = s.indexOf('：');
    const half = s.indexOf(':');
    const at = colon >= 0 ? colon : half;
    if (at > 0 && at <= 6) {
      const key = s.substring(0, at);
      if (key === '标题' || key === '题目' || key === '名称' || key.toLowerCase() === 'title') {
        const v = s.substring(at + 1).trim();
        if (v.length > 0) return v;
      }
    }
    return s;
  }
  return '';
}
function impGuessType(body, hint) {
  if (hint !== undefined && hint !== null && String(hint).length > 0) {
    return String(hint).toLowerCase().indexOf('skill') >= 0 ? 'skill' : 'prompt';
  }
  const keys = ['阶段', '步骤', '工作流', '流程', 'SOP', 'Step 1', 'STEP 1', 'Phase'];
  for (let i = 0; i < keys.length; i++) if (String(body).indexOf(keys[i]) >= 0) return 'skill';
  return 'prompt';
}
function impMake(titleHint, block) {
  const body = String(block).trim();
  let title = titleHint;
  if (!title) title = impTitleFromBody(body);
  return { title: impCleanTitle(title), content: body, type: impGuessType(body, undefined) };
}
function impPick(a, b, c) {
  if (a !== undefined && a !== null && String(a).length > 0) return a;
  if (b !== undefined && b !== null && String(b).length > 0) return b;
  if (c !== undefined && c !== null && String(c).length > 0) return c;
  return '';
}
function impFromJsonItem(j) {
  if (j === undefined || j === null) return null;
  const body = impPick(j.content, j.prompt, j.text);
  if (String(body).length === 0) return null;
  let title = impPick(j.title, j.name, j.act);
  if (String(title).length === 0) title = impTitleFromBody(body);
  return { title: impCleanTitle(title), content: String(body).trim(), type: impGuessType(body, j.type) };
}
function impFromJson(raw) {
  const c = raw.charAt(0);
  if (c !== '[' && c !== '{') return [];
  const out = [];
  if (c === '[') {
    let arr = null;
    try { arr = JSON.parse(raw); } catch (e) { return []; }
    if (arr === null || !Array.isArray(arr)) return [];
    for (let i = 0; i < arr.length; i++) {
      const it = impFromJsonItem(arr[i]);
      if (it !== null) out.push(it);
    }
    return out;
  }
  let bag = null;
  try { bag = JSON.parse(raw); } catch (e) { return []; }
  const lists = [];
  if (bag.items !== undefined) lists.push(bag.items);
  if (bag.prompts !== undefined) lists.push(bag.prompts);
  if (bag.data !== undefined) lists.push(bag.data);
  for (let i = 0; i < lists.length; i++) {
    for (let j = 0; j < lists[i].length; j++) {
      const it = impFromJsonItem(lists[i][j]);
      if (it !== null) out.push(it);
    }
  }
  if (out.length === 0) {
    const one = impFromJsonItem(bag);
    if (one !== null) out.push(one);
  }
  return out;
}
function impByHeading(raw) {
  const lines = raw.split('\n');
  const heads = [];
  for (let i = 0; i < lines.length; i++) if (impIsHeading(lines[i])) heads.push(i);
  if (heads.length < 2) return [];
  const out = [];
  /* 第一个标题之前的内容（前言）也当成一条 */
  if (heads[0] > 0) {
    const pre = lines.slice(0, heads[0]).join('\n').trim();
    if (pre.length >= IMP_MIN_BLOCK) out.push(impMake('', pre));
  }
  for (let k = 0; k < heads.length; k++) {
    const start = heads[k];
    const end = (k + 1 < heads.length) ? heads[k + 1] : lines.length;
    const body = lines.slice(start, end).join('\n').trim();
    if (body.length >= IMP_MIN_BLOCK) out.push(impMake(impHeadingText(lines[start]), body));
  }
  return out;
}
function impBySeparator(raw) {
  const lines = raw.split('\n');
  const out = [];
  let buf = [], hits = 0;
  for (let i = 0; i < lines.length; i++) {
    if (impIsDivider(lines[i])) {
      hits++;
      const block = buf.join('\n').trim();
      if (block.length >= IMP_MIN_BLOCK) out.push(impMake('', block));
      buf = [];
    } else buf.push(lines[i]);
  }
  const last = buf.join('\n').trim();
  if (last.length >= IMP_MIN_BLOCK) out.push(impMake('', last));
  if (hits === 0) return [];
  return out;
}
/* App ImportParser.split：JSON → 多标题 → 分隔线 → 单条 */
function impSplit(text) {
  const raw = impNormalize(text);
  if (raw.length === 0) return [];
  const fromJson = impFromJson(raw);
  if (fromJson.length > 0) return fromJson;
  const fromHead = impByHeading(raw);
  if (fromHead.length > 1) return fromHead;
  const fromSep = impBySeparator(raw);
  if (fromSep.length > 1) return fromSep;
  return [impMake('', raw)];
}
function splitText(txt, on) {
  if (!on) return [impMake('', impNormalize(txt))];
  return impSplit(txt);
}
SCREENS.import = function () {
  const srcCard = function (icon, title, sub, id) {
    return `<button class="imp-src" id="${id}"><span class="imp-src-ic">${icon}</span>
      <span class="imp-src-txt"><b>${esc(title)}</b><i>${esc(sub)}</i></span></button>`;
  };
  return `<div class="subpage imp">
    ${hdrTitle(t('imp.title'), `<button class="topbar-act sub" id="impManual">${esc(t('imp.manual'))}</button>`)}
    <div class="iwrap">
      <div class="imp-lead">
        <div class="imp-lead-t">${esc(t('imp.lead'))}</div>
        <div class="imp-lead-s">${esc(t('imp.lead.sub'))}</div>
      </div>
      <div class="imp-srcs">
        ${srcCard(IC.more(), t('imp.clip'), t('imp.clip.sub'), 'impClip')}
        ${srcCard(IC.searchW(), t('imp.img'), t('imp.img.sub'), 'impImg')}
      </div>
      <div class="imp-srcs">
        ${srcCard(IC.plusBig(), t('imp.file'), t('imp.file.sub'), 'impFile')}
        ${srcCard(IC.arrowUR(), t('imp.share'), t('imp.share.sub'), 'impShare')}
      </div>
      <input type="file" id="imFile" hidden accept=".md,.txt,.json,.csv">
      ${IMP.busy ? `<div class="imp-busy"><span>${esc(t('imp.readingFile'))}</span><i class="spin"></i></div>` : ''}
      <div class="imp-editor">
        <div class="imp-editor-h"><span>${esc(t('imp.raw'))}</span><span class="imp-found ${IMP.items.length ? 'ok' : ''}">${esc(t('imp.found', IMP.items.length))}</span></div>
        <textarea id="imText" class="einput earea" placeholder="${esc(t('imp.raw.hint'))}">${esc(IMP.text)}</textarea>
        <div class="imp-split">
          <span class="imp-split-txt"><b>${esc(t('imp.split'))}</b><i>${esc(t('imp.split.sub'))}</i></span>
          <button class="tsw ${IMP.split ? 'on' : ''}" id="imSplit" role="switch" aria-checked="${IMP.split ? 'true' : 'false'}"><i></i></button>
        </div>
      </div>
      <div id="imItems">${IMP.items.length ? `<div class="imp-list-l">${esc(t('imp.list'))}</div>` + IMP.items.map(function (it, i) {
    return `<div class="imp-item">
          <div class="imp-item-h"><span class="imp-item-no">${i + 1}</span><span class="imp-item-t">${esc(it.title)}</span>
            <button class="imp-item-x" data-rm="${i}">${IC.close()}</button></div>
          <div class="imp-item-s">${esc(impSummary(it.content))}</div>
          <div class="imp-item-ty"><button class="tychip ${it.type === 'prompt' ? 'on prompt' : ''}" data-ty="${i}">Prompt</button>
            <button class="tychip ${it.type === 'skill' ? 'on skill' : ''}" data-ty="${i}">Skill</button></div>
        </div>`;
  }).join('') : ''}</div>
      <button class="imp-go ${IMP.items.length ? '' : 'dim'}" id="imGo">${esc(IMP.items.length ? t('imp.go', IMP.items.length) : t('imp.empty'))}</button>
    </div>
  </div>`;
};
function paintImportItems() {
  const box = document.getElementById('imItems');
  if (!box) return;
  box.innerHTML = IMP.items.length
    ? `<div class="imp-list-l">${esc(t('imp.list'))}</div>` + IMP.items.map(function (it, i) {
      return `<div class="imp-item">
          <div class="imp-item-h"><span class="imp-item-no">${i + 1}</span><span class="imp-item-t">${esc(it.title)}</span>
            <button class="imp-item-x" data-rm="${i}">${IC.close()}</button></div>
          <div class="imp-item-s">${esc(impSummary(it.content))}</div>
          <div class="imp-item-ty"><button class="tychip ${it.type === 'prompt' ? 'on prompt' : ''}" data-ty="${i}">Prompt</button>
            <button class="tychip ${it.type === 'skill' ? 'on skill' : ''}" data-ty="${i}">Skill</button></div>
        </div>`;
    }).join('')
    : '';
  box.querySelectorAll('[data-rm]').forEach(function (b) {
    b.onclick = function () { IMP.items.splice(Number(b.dataset.rm), 1); paintImportItems(); refreshImportFoot(); };
  });
  box.querySelectorAll('[data-ty]').forEach(function (b) {
    b.onclick = function () {
      const i = Number(b.dataset.ty);
      IMP.items[i].type = IMP.items[i].type === 'skill' ? 'prompt' : 'skill';
      paintImportItems();
    };
  });
}
function refreshImportFoot() {
  const go = document.getElementById('imGo');
  if (!go) return;
  go.textContent = IMP.items.length ? t('imp.go', IMP.items.length) : t('imp.empty');
  go.classList.toggle('dim', !IMP.items.length);
  const found = document.querySelector('.imp-found');
  if (found) {
    found.textContent = t('imp.found', IMP.items.length);
    found.classList.toggle('ok', IMP.items.length > 0);
  }
}
function bindImport() {
  const ta = document.getElementById('imText');
  if (ta) ta.oninput = function () {
    IMP.text = ta.value;
    IMP.items = ta.value.trim() ? splitText(ta.value, IMP.split) : [];
    paintImportItems();
    refreshImportFoot();
  };
  const sp = document.getElementById('imSplit');
  if (sp) sp.onclick = function () {
    IMP.split = !IMP.split;
    sp.classList.toggle('on', IMP.split);
    sp.setAttribute('aria-checked', IMP.split ? 'true' : 'false');
    IMP.items = IMP.text.trim() ? splitText(IMP.text, IMP.split) : [];
    paintImportItems();
    refreshImportFoot();
  };
  const clip = document.getElementById('impClip');
  if (clip) clip.onclick = function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) return toast(t('imp.clipEmpty'));
    navigator.clipboard.readText().then(function (txt) {
      if (txt && txt.trim()) {
        IMP.text = IMP.text.trim() ? IMP.text.trim() + '\n\n---\n\n' + txt.trim() : txt.trim();
        document.getElementById('imText').value = IMP.text;
        IMP.items = splitText(IMP.text, IMP.split);
        paintImportItems(); refreshImportFoot();
      } else toast(t('imp.clipEmpty'));
    }, function () { toast(t('imp.clipEmpty')); });
  };
  /* 图片识字 = 端侧 OCR（网页做不到的 7 项之一）→ App 同款失败提示 */
  const img = document.getElementById('impImg');
  if (img) img.onclick = function () { toast(t('imp.ocrFail')); };
  const fl = document.getElementById('imFile');
  if (fl) fl.onchange = function () {
    const f = fl.files && fl.files[0];
    if (!f) return;
    IMP.busy = true; render();
    const rd = new FileReader();
    rd.onload = function () {
      IMP.busy = false;
      IMP.text = IMP.text.trim() ? IMP.text.trim() + '\n\n---\n\n' + String(rd.result).trim() : String(rd.result).trim();
      IMP.items = splitText(IMP.text, IMP.split);
      render();
    };
    rd.onerror = function () { IMP.busy = false; toast(t('imp.fileFail')); render(); };
    rd.readAsText(f);
  };
  /* 系统分享接收（网页做不到的 7 项之一）→ App 同款说明对话框 */
  const sh = document.getElementById('impShare');
  if (sh) sh.onclick = function () { dlg(t('imp.share'), t('imp.share.tip'), t('common.ok')); };
  const manual = document.getElementById('impManual');
  if (manual) manual.onclick = function () { goHash('library/edit/new'); };
  paintImportItems();
  const go = document.getElementById('imGo');
  if (go) go.onclick = function () {
    if (!IMP.items.length) return;
    const mine = selfPrompts();
    const left = isPro() ? 999 : Math.max(0, LIMIT_PROMPT - mine.length);
    const can = Math.min(IMP.items.length, left);
    if (can <= 0) return toast(t('imp.limit', LIMIT_PROMPT));
    let ok = 0;
    for (let i = 0; i < can; i++) {
      const it = IMP.items[i];
      mine.unshift({
        id: 'p' + Date.now() + '_' + i, title: it.title, content: it.content, type: it.type,
        tags: it.tags || [], category: '未分类', targetModel: '通用', note: '',
        createdAt: Date.now(), useCount: 0, lastUsedAt: 0, fav: false
      });
      ok++;
    }
    store.set(LS.prompts, mine);
    toast(ok < IMP.items.length ? t('imp.partial', ok, IMP.items.length) : t('imp.done', ok));
    IMP.items = []; IMP.text = '';
    history.back();
  };
}

/* ══════════ 添加 Key（App AddKeyPage） ══════════ */
const AK = { vendor: 'deepseek', verified: null, msg: '', key: '', org: '', alias: '', testing: false };
/* 2026-10-18：OpenAI / Anthropic 改为「未开放」，移入 manualVendors（与 app 一致） */
const AK_VENDORS = ['deepseek', 'moonshot', 'zhipu'];
/** App AddKeyPage：验证钮 .enabled(!testing && keyText.trim().length > 0) */
function akSyncVerify() {
  const ver = document.getElementById('akVerify');
  if (ver && !AK.testing) ver.disabled = !AK.key.trim();
}
function akLabel(id) { return vendorLabel(id); }
SCREENS.addkey = function () {
  const needOrg = false;
  return `<div class="subpage addkey">
    ${hdrBig(t('addkey.title'), t('addkey.sub'))}
    <div class="awrap">
      <div class="acard">
        ${secTitle(t('addkey.vendor'))}
        <div class="achips">
          ${AK_VENDORS.map(function (v) {
    return `<button class="achip ${AK.vendor === v ? 'on' : ''}" data-av="${v}">${brandMark(v, 18)}<span>${esc(akLabel(v))}</span></button>`;
  }).join('')}
        </div>
        <div class="amanual">
          <span>${esc(t('quota.manual'))} · ${(DATA.manualVendors || []).length}</span>
          <button class="amanual-go" id="akGuide">${esc(t('guide.title'))}${IC.chevR()}</button>
        </div>
      </div>
      <div class="acard">
        <textarea id="akKey" class="einput earea key" placeholder="${esc(t('addkey.key.hint'))}">${esc(AK.key)}</textarea>
        ${needOrg ? `<input type="text" id="akOrg" class="einput mt11" placeholder="${esc(t('addkey.org.hint'))}" value="${esc(AK.org)}">` : ''}
        <input type="text" id="akName" class="einput mt11" placeholder="${esc(t('addkey.alias.hint'))}" value="${esc(AK.alias)}">
        <div class="asecure">${IC.lock()}<span>${esc(t('web.key.local'))}</span></div>
      </div>
      <div class="averify">
        <button class="abtn-verify" id="akVerify" ${AK.testing || !AK.key.trim() ? 'disabled' : ''}>${esc(AK.testing ? t('addkey.verifying') : t('addkey.verify'))}</button>
        ${AK.verified ? `<div class="ares ${AK.verified.ok ? 'ok' : 'fail'}">
          ${AK.verified.ok
      ? `<div class="ares-h">${IC.checkOk()}<span>${esc(t('addkey.ok'))}</span></div>${AK.verified.balance !== null && AK.verified.balance !== undefined ? `<div class="ares-bal">${esc(t('addkey.balance', (AK.verified.currency === 'USD' ? '$' : '¥') + Number(AK.verified.balance).toFixed(2)))}</div>` : (AK.verified.message ? `<div class="ares-msg">${esc(AK.verified.message)}</div>` : '')}`
      : `<div class="ares-h warn">${IC.closeWarn()}<span>${esc(t('addkey.fail'))}</span></div><div class="ares-msg">${esc(AK.verified.message || t('addkey.netError'))}</div>`}
        </div>` : (AK.msg ? `<div class="ares fail"><div class="ares-msg">${esc(AK.msg)}</div></div>` : '')}
        <button class="abtn-save" id="akSave" ${AK.verified && AK.verified.ok ? '' : 'disabled'}>${esc(t('addkey.save'))}</button>
      </div>
    </div>
  </div>`;
};
function bindAddKey() {
  const keyEl = document.getElementById('akKey');
  if (keyEl) keyEl.oninput = function () { AK.key = keyEl.value; akSyncVerify(); };
  const orgEl = document.getElementById('akOrg');
  if (orgEl) orgEl.oninput = function () { AK.org = orgEl.value; };
  const nameEl = document.getElementById('akName');
  if (nameEl) nameEl.oninput = function () { AK.alias = nameEl.value; };
  document.querySelectorAll('[data-av]').forEach(function (b) {
    b.onclick = function () { AK.vendor = b.dataset.av; AK.verified = null; AK.msg = ''; render(); };
  });
  const gd = document.getElementById('akGuide');
  if (gd) gd.onclick = function () { goHash('quota/vguide'); };
  const ver = document.getElementById('akVerify');
  if (ver) ver.onclick = async function () {
    const key = document.getElementById('akKey').value.trim();
    const org = document.getElementById('akOrg');
    AK.testing = true;
    render();
    try {
      const o = await queryBalance(AK.vendor, key);
      if (o && o.ok && typeof o.balance === 'number') {
        AK.verified = { ok: true, balance: o.balance, currency: o.currency || 'CNY', message: o.detail || '' };
        AK.msg = '';
      } else {
        AK.verified = { ok: false, message: (o && o.detail) || t('addkey.netError') };
      }
    } catch (e) { AK.verified = { ok: false, message: t('addkey.netError') }; }
    AK.testing = false;
    render();
  };
  const save = document.getElementById('akSave');
  if (save) save.onclick = function () {
    const key = document.getElementById('akKey').value;
    const org = document.getElementById('akOrg');
    const alias = document.getElementById('akName').value.trim();
    const k = {
      id: 'k' + Date.now(), vendorId: AK.vendor, key: key,
      name: alias.length > 0 ? alias : '默认', alias: alias.length > 0 ? alias : '默认',
      org: org ? org.value.trim() : '',
      bal: AK.verified.balance, cur: AK.verified.currency, ts: Date.now(), msg: '',
      hist: [{ t: Date.now(), bal: AK.verified.balance }]
    };
    const keys = store.get(LS.keys, []);
    keys.push(k);
    store.set(LS.keys, keys);
    toast(t('addkey.saved'));
    history.back();
  };
}

/* ══════════ 账户详情（App QuotaDetailPage） ══════════ */
SCREENS.qdetail = function () {
  // App QuotaDetailPage 以 params 渲染；web 深链缺 key 时按空记录渲染（vendorName 空 + 空趋势卡）
  const k = store.get(LS.keys, []).filter(function (x) { return x.id === S.arg; })[0] || { vendorId: '', alias: '', hist: [] };
  const hist = (k.hist || []).slice();
  const empty = hist.length < 2;
  const w = 320, h = 200, padL = 44, padR = 10, padT = 10, padB = 22;
  let chart = '';
  if (!empty) {
    const vals = hist.map(function (x) { return x.bal; });
    let max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    if (max - min < 0.01) max = min + 1;
    const plotW = w - padL - padR, plotH = h - padT - padB;
    const X = function (i) { return padL + plotW * i / (hist.length - 1); };
    const Y = function (v) { return padT + plotH * (1 - (v - min) / (max - min)); };
    let grid = '', labels = '';
    for (let g = 0; g <= 3; g++) {
      const gy = padT + plotH * g / 3;
      const gv = max - (max - min) * g / 3;
      grid += `<line class="gline" x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}"/>`;
      labels += `<text class="glabel" x="4" y="${gy + 3}">${gv.toFixed(1)}</text>`;
    }
    const pts = hist.map(function (x, i) { return X(i).toFixed(1) + ',' + Y(x.bal).toFixed(1); }).join(' ');
    const dots = hist.map(function (x, i) { return `<circle class="dot" cx="${X(i).toFixed(1)}" cy="${Y(x.bal).toFixed(1)}" r="2.5"/>`; }).join('');
    chart = `<svg viewBox="0 0 ${w} ${h}" class="qdchart" preserveAspectRatio="none">${grid}${labels}<polyline class="dline" points="${pts}"/>${dots}</svg>
      <div class="qdcount">${esc(t('qd.count', hist.length))}</div>`;
  }
  return `<div class="subpage qdetail">
    <div class="subtop">${hdrBack()}
      <span class="qdtop-txt"><b>${esc(akLabel(k.vendorId))}</b><i>${esc(k.alias)}</i></span>
    </div>
    <div class="qwrap">
      <div class="qcard2">
        <div class="qcard2-t">${esc(t('qd.trend'))}</div>
        ${empty ? `<div class="qdempty">${esc(hist.length === 0 ? t('qd.empty') : t('qd.few'))}</div>` : chart}
      </div>
      ${hist.length ? `<div class="qcard2">
        <div class="qcard2-t">${esc(t('qd.records'))}</div>
        ${hist.slice().reverse().slice(0, 30).map(function (x) {
    return `<div class="qdrec"><span>${esc(timeShort(x.t))}</span><b>${Number(x.bal).toFixed(2)}</b></div>`;
  }).join('')}
      </div>` : ''}
      <div class="qdnote">${esc(t('qd.note'))}</div>
    </div>
  </div>`;
};
function bindQDetail() { }

/* ══════════ 厂商接入指引（App VendorGuidePage） ══════════ */
const VG = { id: '', fromList: true };
function vgIsManual(v) { return (v.noteKey || '') === 'quota.err.manualHint'; }
SCREENS.vguide = function () {
  const list = DATA.manualVendors || [];
  const links = EXTRA.consoleLinks || {};
  if (!VG.id) {
    return `<div class="subpage vguide">
      ${hdrRound(t('guide.title'), t('guide.sub'))}
      <div class="vgwrap">
        ${list.map(function (v) {
    return `<button class="vgrow" data-vg="${esc(v.id)}">${brandMark(v.id, 36)}
          <span class="vgrow-txt"><b>${esc(vendorLabel(v.id) || v.name || v.id)}</b><i>${esc(t(v.noteKey) || '')}</i></span>
          ${IC.chevR()}</button>`;
  }).join('')}
        <div class="vgfoot">${esc(t('guide.foot'))}</div>
      </div>
    </div>`;
  }
  const v = list.filter(function (x) { return x.id === VG.id; })[0];
  if (!v) {
    return `<div class="subpage vguide"><div class="vgunknown">${esc(t('guide.unknown'))}</div></div>`;
  }
  const manual = vgIsManual(v);
  const steps = manual
    ? ['guide.steps.manual.1', 'guide.steps.manual.2', 'guide.steps.manual.3', 'guide.steps.manual.4']
    : ['guide.steps.noApi.1', 'guide.steps.noApi.2', 'guide.steps.noApi.3'];
  const url = links[v.id] || '';
  const nm = vendorLabel(v.id) || v.name || v.id;
  return `<div class="subpage vguide">
    ${hdrRound(nm, '')}
    <div class="vgwrap">
      <div class="vgcard">
        <div class="vgcard-h">${brandMark(v.id, 44)}
          <span class="vgcard-txt"><b>${esc(nm)}</b>
          <i class="${manual ? 'ok' : 'warn'}">${esc(t(manual ? 'guide.note.manual' : 'guide.note.noApi'))}</i></span>
        </div>
      </div>
      <div class="vgcard">
        <div class="vgcard-t">${esc(t('guide.steps'))}</div>
        ${steps.map(function (k2, i) {
    return `<div class="vgstep"><span class="vgstep-no">${i + 1}</span><span class="vgstep-t">${esc(t(k2))}</span></div>`;
  }).join('')}
      </div>
      ${url ? `<button class="vggobtn" id="vgOpen">${esc(t('guide.url.open', nm))}</button>` : ''}
      <button class="vgmanual" id="vgManual">${esc(t('manual.entry'))}</button>
      <div class="vgfoot">${esc(t('guide.foot'))}</div>
    </div>
  </div>`;
};
function bindVGuide() {
  document.querySelectorAll('[data-vg]').forEach(function (b) {
    b.onclick = function () { VG.id = b.dataset.vg; VG.fromList = true; render(); };
  });
  const mn = document.getElementById('vgManual');
  if (mn) mn.onclick = function () { goHash('quota/manual/' + encodeURIComponent(VG.id)); };
  const op = document.getElementById('vgOpen');
  if (op) op.onclick = function () {
    const v = (DATA.manualVendors || []).filter(function (x) { return x.id === VG.id; })[0];
    const url = v ? ((EXTRA.consoleLinks || {})[v.id] || '') : '';
    if (url) window.open(url, '_blank', 'noopener');
    else toast(t('guide.fail'));
  };
  /* App goBack：从列表点进来的先回列表 */
  const back = document.querySelector('.vguide .tb-round');
  if (back && VG.id && VG.fromList) {
    back.onclick = function () { VG.id = ''; render(); };
  }
}

/* ══════════ 手动记账（App ManualBalancePage，2026-10-18） ══════════
 * 路由：#quota/manual/<vendorId>（指引页「手动记录余额」→ 新建）· #quota/manual/key/<id>（卡片菜单「更新余额」）
 *       · #quota/manual（无参：从 22 家里选）。
 * 记录与 Key 同存 localStorage（LS.keys，manual:true、无 key 字段），不进云同步（cloud.js 只同步会员与自建 Prompt）。
 * 每记一笔写入 hist：额度详情趋势、卡片「约 N 天后用完」、余额预警都靠它。 */
const MB_USD = ['openai', 'anthropic', 'gemini', 'grok', 'muse', 'amazon', 'nvidia', 'perplexity', 'mistral', 'cohere'];
const MB = { route: null, vendorId: '', keyId: '', fixed: false, balanceText: '', currency: 'CNY', alias: '', saving: false };
function mbInit() {
  if (MB.route === S.arg) return;
  MB.route = S.arg;
  MB.vendorId = ''; MB.keyId = ''; MB.fixed = false; MB.balanceText = ''; MB.currency = 'CNY'; MB.alias = ''; MB.saving = false;
  const arg = S.arg || '';
  if (arg.indexOf('key/') === 0) {
    MB.keyId = arg.substring(4);
    const k = store.get(LS.keys, []).filter(function (x) { return x.id === MB.keyId; })[0];
    if (k) { MB.fixed = true; MB.vendorId = k.vendorId; MB.alias = k.alias || ''; MB.currency = k.cur || 'CNY'; }
  } else if (arg) {
    MB.vendorId = arg;
    MB.fixed = MB.vendorId.length > 0;
    MB.currency = MB_USD.indexOf(MB.vendorId) >= 0 ? 'USD' : 'CNY';
  }
}
function mbAmount() {
  const tx = MB.balanceText.trim();
  const n = Number(tx);
  return tx.length > 0 && !isNaN(n) && isFinite(n) && n >= 0 ? n : -1;
}
function mbValid() { return MB.vendorId.length > 0 && mbAmount() >= 0; }
SCREENS.manual = function () {
  mbInit();
  const vendors = DATA.manualVendors || [];
  return `<div class="subpage manualbal">
    ${hdrBig(t(MB.keyId ? 'manual.title.update' : 'manual.title'), t('manual.sub'))}
    <div class="mbwrap">
      ${!MB.fixed ? `<div class="mbcard first">
        ${secTitle(t('addkey.vendor'))}
        <div class="achips">${vendors.map(function (v) {
    return `<button class="achip mbchip ${MB.vendorId === v.id ? 'on' : ''}" data-mv="${esc(v.id)}">${brandMark(v.id, 18)}<span>${esc(vendorLabel(v.id) || v.name || v.id)}</span></button>`;
  }).join('')}</div>
      </div>` : `<div class="mbbadge">${brandMark(MB.vendorId, 36)}
        <span class="mbbadge-t"><b>${esc(vendorLabel(MB.vendorId) || MB.vendorId)}</b>${MB.alias ? `<i>${esc(MB.alias)}</i>` : ''}</span>
      </div>`}
      <div class="mbcard">
        ${secTitle(t('manual.balance'))}
        <div class="mbrow">
          <input type="text" inputmode="decimal" id="mbBal" class="einput mbin" placeholder="${esc(t('manual.balance.hint'))}" value="${esc(MB.balanceText)}">
          <span class="mbcur">
            <button data-cur="CNY" class="${MB.currency === 'CNY' ? 'on' : ''}">¥</button>
            <button data-cur="USD" class="${MB.currency === 'USD' ? 'on' : ''}">$</button>
          </span>
        </div>
        ${!MB.keyId ? `<input type="text" id="mbAlias" class="einput mbin mt11" placeholder="${esc(t('addkey.alias.hint'))}" value="${esc(MB.alias)}">` : ''}
      </div>
      <button class="abtn-save" id="mbSave" ${mbValid() && !MB.saving ? '' : 'disabled'}>${esc(t('manual.save'))}</button>
      <div class="mbhow">${esc(t('manual.how'))}</div>
    </div>
  </div>`;
};
function bindManual() {
  const bal = document.getElementById('mbBal');
  const save = document.getElementById('mbSave');
  if (bal) bal.oninput = function () {
    MB.balanceText = bal.value;
    if (save) save.disabled = !(mbValid() && !MB.saving);
  };
  const al = document.getElementById('mbAlias');
  if (al) al.oninput = function () { MB.alias = al.value; };
  document.querySelectorAll('[data-mv]').forEach(function (b) {
    b.onclick = function () {
      MB.vendorId = b.dataset.mv;
      MB.currency = MB_USD.indexOf(MB.vendorId) >= 0 ? 'USD' : 'CNY';
      render();
    };
  });
  document.querySelectorAll('[data-cur]').forEach(function (b) {
    b.onclick = function () { MB.currency = b.dataset.cur; render(); };
  });
  if (save) save.onclick = function () {
    if (!mbValid() || MB.saving) return;
    MB.saving = true;
    try {
      const keys = store.get(LS.keys, []);
      const now = Date.now();
      let k = MB.keyId ? keys.filter(function (x) { return x.id === MB.keyId; })[0] : null;
      if (!k) {
        /* App KeyRepo.addManual：不含任何密钥；alias 空 → 默认 */
        const alias = MB.alias.trim();
        k = { id: 'm' + now, vendorId: MB.vendorId, manual: true, key: '', name: vendorLabel(MB.vendorId) || MB.vendorId,
          alias: alias.length > 0 ? alias : '默认', hist: [] };
        keys.push(k);
      }
      /* App QuotaService.recordManual：快照 + 历史同一条落库链路 */
      k.bal = mbAmount(); k.cur = MB.currency; k.ts = now; k.msg = '';
      k.hist = (k.hist || []).concat([{ t: now, bal: k.bal }]).slice(-400);
      store.set(LS.keys, keys);
      MB.route = null;
      toast(t('manual.saved'));
      history.back();
    } catch (e) {
      MB.saving = false;
      toast(t('manual.fail'));
    }
  };
}

/* ══════════ 成本计算器（App CalculatorPage + TokenEstimator） ══════════ */
const CALC = { taskText: '', docs: '100', words: '2000', typeIdx: 0, outWords: '500', results: null, picks: [] };
const CALC_TASK_KEYS = ['calc.t.sum', 'calc.t.trans', 'calc.t.create'];
/* App TokenEstimator：中文 1.2 token/字 + 每篇 200 系统提示开销 */
function calcParseTask(text, fb) {
  const spec = { docs: fb.docs, words: fb.words, typeIdx: fb.typeIdx, outWords: fb.outWords };
  const mDocs = text.match(/(\d+)\s*篇/);
  if (mDocs) spec.docs = parseInt(mDocs[1]);
  const mWords = text.match(/(\d+)\s*(?:个)?字/);
  if (mWords) {
    const mWan = text.match(/(\d+)\s*万字/);
    spec.words = mWan ? Math.floor(parseInt(mWan[1]) * 10000 / Math.max(1, spec.docs)) : parseInt(mWords[1]);
  }
  if (text.indexOf('翻译') >= 0) spec.typeIdx = 1;
  else if (text.indexOf('提取') >= 0 || text.indexOf('摘要') >= 0 || text.indexOf('总结') >= 0) spec.typeIdx = 0;
  else if (text.indexOf('写') >= 0 || text.indexOf('创作') >= 0 || text.indexOf('生成') >= 0) spec.typeIdx = 2;
  return spec;
}
function calcLiveSpec() {
  let spec = {
    docs: parseInt(CALC.docs) > 0 ? parseInt(CALC.docs) : 1,
    words: parseInt(CALC.words) > 0 ? parseInt(CALC.words) : 1000,
    typeIdx: CALC.typeIdx,
    outWords: parseInt(CALC.outWords) > 0 ? parseInt(CALC.outWords) : 500
  };
  const tx = CALC.taskText.trim();
  if (tx) spec = calcParseTask(tx, spec);
  return spec;
}
function calcInputTokens(spec) {
  return Math.ceil(spec.docs * spec.words * 1.2) + spec.docs * 200;
}
function calcOutputTokens(spec) {
  const inputWords = spec.docs * spec.words;
  let outWords = 0;
  if (spec.typeIdx === 0) outWords = Math.floor(inputWords * 0.2);
  else if (spec.typeIdx === 1) outWords = inputWords;
  else outWords = spec.docs * spec.outWords;
  return Math.ceil(outWords * 1.2);
}
function calcFmtTokens(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return '' + n;
}
function calcFmtCny(v) {
  if (v >= 100) return '¥' + v.toFixed(0);
  if (v >= 1) return '¥' + v.toFixed(2);
  return '¥' + v.toFixed(4);
}
/* App TokenEstimator.compare：全模型费用升序 */
function calcCompare(spec) {
  const inT = calcInputTokens(spec), outT = calcOutputTokens(spec);
  return (DATA.apiPrices || []).map(function (m) {
    const cost = inT / 1e6 * Number(m.priceIn) + outT / 1e6 * Number(m.priceOut);
    return { m: m, cost: isNaN(cost) ? Infinity : cost };
  }).filter(function (r) { return r.cost !== Infinity; })
    .sort(function (a, b) { return a.cost - b.cost; });
}
/* App TokenEstimator.picks（2026-10-18）：最省 ≥3 / 均衡 ≥4 / 最好 =5，各取该档最便宜；
 * 仅国内直连（vendorOrder.region=cn）、排除 note 含 legacy；按任务匹配场景，无匹配退通用场景；
 * 同一模型命中多档合并成一张，extra = 比「最省」多花的钱 */
function calcPicks(spec) {
  const cn = (DATA.vendorOrder || []).filter(function (v) { return v.region === 'cn'; }).map(function (v) { return v.vendor; });
  const all = calcCompare(spec).filter(function (r) {
    return cn.indexOf(r.m.vendor) >= 0 && String(r.m.note || '').toLowerCase().indexOf('legacy') < 0;
  });
  let want = ['写作'];
  if (spec.typeIdx === 0) want = ['长文档', '办公'];
  else if (spec.typeIdx === 1) want = ['翻译'];
  const general = ['写作', '办公', '长文档'];
  const hit = function (m, tags) { return (m.scenarios || []).some(function (x) { return tags.indexOf(x) >= 0; }); };
  const tiers = [3, 4, 5];
  const keys = ['calc.pick.cheap', 'calc.pick.balance', 'calc.pick.best'];
  const out = [];
  for (let ti = 0; ti < tiers.length; ti++) {
    let r = all.find(function (x) { return (x.m.quality || 0) >= tiers[ti] && hit(x.m, want); });
    if (r === undefined) r = all.find(function (x) { return (x.m.quality || 0) >= tiers[ti] && hit(x.m, general); });
    if (r === undefined) continue;
    const same = out.find(function (p) { return p.r.m.id === r.m.id; });
    if (same) { same.keys.push(keys[ti]); continue; }
    const base = out.length > 0 ? out[0].r.cost : r.cost;
    out.push({ keys: [keys[ti]], r: r, extra: Math.max(0, r.cost - base) });
  }
  return out;
}
/* 从 Prompt 详情「用哪个模型跑最便宜」进来（App CalculatorPage.aboutToAppear params.words）：
 * 新页口径 = 其余参数回默认，按 1 篇创作、该 Prompt 字数预填并直接算 */
function calcPrefill(words) {
  CALC.taskText = ''; CALC.outWords = '500';
  CALC.docs = '1'; CALC.words = '' + Math.round(Number(words)); CALC.typeIdx = 2;
  const spec = calcLiveSpec();
  CALC.results = calcCompare(spec);
  CALC.picks = calcPicks(spec);
}
const CALC_PICK_TONE = { 'calc.pick.cheap': 'ok', 'calc.pick.balance': 'pri', 'calc.pick.best': 'pur' };
/* App pickCard：标签行 + 名称 15 Bold / vendor·note 10（2 行）+ 右侧费用 18 Bold（首张 ok 色）/「比最省多」10 */
function calcPickCard(p, idx) {
  const m = p.r.m;
  return `<div class="cpick ${idx === 0 ? 'first' : ''}">
    <div class="cpick-tags">${p.keys.map(function (k) { return `<em class="cpick-tag ${CALC_PICK_TONE[k]}">${esc(t(k))}</em>`; }).join('')}</div>
    <div class="cpick-row">
      <span class="cpick-txt">
        <span class="cpick-name">${esc(m.name || m.id)}</span>
        <span class="cpick-vendor">${esc(m.vendor)}${m.note ? ' · ' + esc(m.note) : ''}</span>
      </span>
      <span class="cpick-cost">
        <b class="${idx === 0 ? 'top' : ''}">${calcFmtCny(p.r.cost)}</b>
        ${idx > 0 ? `<i>${esc(t('calc.pick.more', calcFmtCny(p.extra)))}</i>` : ''}
      </span>
    </div>
    <button class="ccopy" data-code="${esc(m.id)}">${esc(t('calc.copy'))}</button>
  </div>`;
}
function calcSnippet(m) {
  return 'from openai import OpenAI\n\n'
    + 'client = OpenAI(api_key="YOUR_API_KEY", base_url="' + (m.baseUrl || '') + '")\n\n'
    + 'resp = client.chat.completions.create(\n'
    + '    model="' + m.id + '",\n'
    + '    messages=[{"role": "user", "content": "..."}],\n'
    + ')\n'
    + 'print(resp.choices[0].message.content)';
}
SCREENS.calc = function () {
  const spec = calcLiveSpec();
  const inT = calcInputTokens(spec), outT = calcOutputTokens(spec);
  const results = CALC.results || [];
  return `<div class="subpage calcpage">
    ${hdrBig(t('calc.title'), t('calc.sub'))}
    <div class="cwrap">
      <div class="ccard">
        <div class="ccard-h">${secTitle(t('calc.task'))}<span class="copt">${esc(t('calc.task.opt'))}</span></div>
        <textarea id="cTask" class="einput earea" placeholder="${esc(t('calc.task.hint'))}">${esc(CALC.taskText)}</textarea>
      </div>
      <div class="ccard">
        ${secTitle(t('calc.params'))}
        <div class="cparams">
          <div class="cparam"><span>${esc(t('calc.docs'))}</span><input type="number" id="cDocs" class="einput" value="${esc(CALC.docs)}" min="1"></div>
          <div class="cparam"><span>${esc(t('calc.words'))}</span><input type="number" id="cWords" class="einput" value="${esc(CALC.words)}" min="1"></div>
        </div>
        <div class="ctype-l">${esc(t('calc.type'))}</div>
        <div class="ctypes">
          ${CALC_TASK_KEYS.map(function (k, i) {
    return `<button class="ctype ${CALC.typeIdx === i ? 'on' : ''}" data-tk="${i}">${esc(t(k))}</button>`;
  }).join('')}
        </div>
        ${CALC.typeIdx === 2 ? `<div class="cparam full mt14"><span>${esc(t('calc.outWords'))}</span><input type="number" id="cOut" class="einput" value="${esc(CALC.outWords)}" min="1"></div>` : ''}
      </div>
      <div class="cest">
        <div class="cest-t">${esc(t('calc.tokens', calcFmtTokens(inT), calcFmtTokens(outT)))}</div>
        <div class="cest-s">${esc(t('calc.coef'))}</div>
      </div>
      <button class="crun" id="cRun">${esc(t('calc.run'))}</button>
      ${results.length ? `<div class="cresults">
        ${(CALC.picks || []).length ? `<div class="cpick-h">${secTitle(t('calc.pick.title'))}<span>${esc(t('calc.pick.scope'))}</span></div>
        ${CALC.picks.map(calcPickCard).join('')}` : ''}
        <div class="cres-l">${esc(t('calc.result', results.length))}</div>
        ${results.map(function (r, idx) {
    return `<div class="cres">
            <div class="cres-row">
              <span class="cres-rank">${idx + 1}</span>
              <span class="cres-txt">
                <span class="cres-name">${esc(r.m.name || r.m.id)}${idx === 0 ? `<em class="cres-badge low">${esc(t('calc.best.value'))}</em>` : ''}${(r.m.quality || 0) >= 5 ? `<em class="cres-badge quality">${esc(t('calc.best.quality'))}</em>` : ''}</span>
                <span class="cres-vendor">${esc(r.m.vendor)}${r.m.note ? ' · ' + esc(r.m.note) : ''}</span>
              </span>
              <span class="cres-cost">${calcFmtCny(r.cost)}</span>
            </div>
            <button class="ccopy" data-code="${esc(r.m.id)}">${esc(t('calc.copy'))}</button>
          </div>`;
  }).join('')}
        <div class="cfoot">${esc(t('calc.foot'))}</div>
      </div>` : `<div class="cempty">
        <div class="cempty-t">${esc(t('calc.empty.title'))}</div>
        <div class="cempty-s">${esc(t('calc.empty.sub'))}</div>
      </div>`}
    </div>
  </div>`;
};
function paintCalcEstimate() {
  const spec = calcLiveSpec();
  const box = document.querySelector('.cest-t');
  if (box) box.textContent = t('calc.tokens', calcFmtTokens(calcInputTokens(spec)), calcFmtTokens(calcOutputTokens(spec)));
}
function bindCalc() {
  const sync = function () {
    const d = document.getElementById('cDocs'); if (d) CALC.docs = d.value || '1';
    const w = document.getElementById('cWords'); if (w) CALC.words = w.value || '1000';
    const o = document.getElementById('cOut'); if (o) CALC.outWords = o.value || '500';
    const tk = document.getElementById('cTask'); if (tk) CALC.taskText = tk.value;
    paintCalcEstimate();
  };
  ['cDocs', 'cWords', 'cOut', 'cTask'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.oninput = sync;
  });
  document.querySelectorAll('[data-tk]').forEach(function (b) {
    b.onclick = function () { CALC.typeIdx = Number(b.dataset.tk); render(); };
  });
  const run = document.getElementById('cRun');
  if (run) run.onclick = function () {
    sync();
    const spec = calcLiveSpec();
    CALC.results = calcCompare(spec);
    CALC.picks = calcPicks(spec);
    render();
  };
  /* 复制代码：结果卡与推荐卡共用（每次 render 后都要重新挂） */
  document.querySelectorAll('[data-code]').forEach(function (b) {
    b.onclick = function () {
      const m = (DATA.apiPrices || []).filter(function (x) { return x.id === b.dataset.code; })[0];
      if (m) { copyText(calcSnippet(m)); toast(t('calc.copied', m.name || m.id)); }
    };
  });
}

/* ══════════ 模型对比（App ComparePage） ══════════ */
SCREENS.compare = function () {
  const ids = String(S.arg || '').split(',').filter(Boolean).slice(0, 4);
  const ms = (DATA.apiPrices || []).filter(function (m) { return ids.indexOf(m.id) >= 0; });
  if (ms.length < 2) {
    return `<div class="subpage compare">${hdrBig(t('cmp.title'), t('cmp.sub', 0, PRICE_UPDATED_AT))}
      <div class="cmpwrap"><div class="cmpempty">${esc(t('cmp.empty'))}</div></div></div>`;
  }
  const fieldOf = function (m, f) {
    if (f === 'priceIn') return Number(m.priceIn);
    if (f === 'priceOut') return Number(m.priceOut);
    if (f === 'contextK') return Number(m.contextK) || 0;
    return Number(m.quality) || 0;
  };
  const bestIdx = function (f, lower) {
    let best = 0;
    for (let i = 1; i < ms.length; i++) {
      const a = fieldOf(ms[i], f), b = fieldOf(ms[best], f);
      if (lower ? a < b : a > b) best = i;
    }
    return best;
  };
  const num = function (v) { return String(v); };
  const ctxText = function (k) { return k >= 1000 ? (k / 1000) + 'M' : k + 'K'; };
  const bi = bestIdx('priceIn', true), bo = bestIdx('priceOut', true), bc = bestIdx('contextK', true), bq = bestIdx('quality', true);
  const priceLine = function (labelKey, field, best) {
    return `<div class="cmpline"><span class="cmplabel">${esc(t(labelKey))}</span>
      ${ms.map(function (m, mi) {
    return `<span class="cmpcell ${mi === best ? 'hl' : ''}"><b>¥${num(field === 'priceIn' ? m.priceIn : m.priceOut)}</b>${mi === best ? `<i>${esc(t('cmp.best'))}</i>` : ''}</span>`;
  }).join('')}</div>`;
  };
  const attrRow = function (labelKey, cellFn) {
    return `<div class="cmpattr"><span class="cmplabel">${esc(t(labelKey))}</span>
      ${ms.map(function (m, mi) {
    const v = cellFn(m, mi);
    return `<span class="cmpcell ${v.cls || ''}"><b>${v.text}</b>${v.mark ? `<i>${esc(v.mark)}</i>` : ''}</span>`;
  }).join('')}</div>`;
  };
  return `<div class="subpage compare">
    ${hdrBig(t('cmp.title'), t('cmp.sub', ms.length, PRICE_UPDATED_AT))}
    <div class="cmpwrap">
      <div class="cmphead">
        <span class="cmpattrcol"></span>
        ${ms.map(function (m) {
    return `<span class="cmpcol">${brandMark(m.vendor, 32)}<b>${esc(m.name || m.id)}</b><i>${esc(m.vendor)}</i></span>`;
  }).join('')}
      </div>
      <div class="cmpprice">
        ${priceLine('cmp.row.in', 'priceIn', bi)}
        <div class="cmpdiv"></div>
        ${priceLine('cmp.row.out', 'priceOut', bo)}
      </div>
      ${attrRow('cmp.row.ctx', function (m, mi) {
    const isBest = mi === bc;
    return { text: ctxText(Number(m.contextK) || 0), cls: isBest ? 'hl-blue' : '', mark: isBest ? t('cmp.longest') : '' };
  })}
      ${attrRow('cmp.row.caps', function (m) {
    return { text: (m.caps || []).map(capLabel).join(' / ') || '—', cls: 'sub' };
  })}
      ${attrRow('cmp.row.quality', function (m, mi) {
    const isBest = mi === bq;
    return { text: stars(m.quality || 0), cls: isBest ? 'hl-star' : 'ter', mark: isBest ? t('cmp.top') : '' };
  })}
      ${attrRow('cmp.row.scenario', function (m) {
    return { text: (m.scenarios || []).join(' · ') || '—', cls: 'sub' };
  })}
      ${attrRow('cmp.row.region', function (m) {
    const cn = regionOf(m.vendor);
    return { text: t(cn ? 'price.region.cn' : 'price.region.global'), cls: cn ? 'ok' : 'amber' };
  })}
      <div class="cmpsummary">
        <div class="cmpsummary-t">${esc(t('cmp.summary'))}</div>
        <div class="cmpsum-row"><span>${esc(t('cmp.best.in'))}</span><b>${esc(ms[bi].name)}</b><em>¥${num(ms[bi].priceIn)}</em></div>
        <div class="cmpsum-row"><span>${esc(t('cmp.best.out'))}</span><b>${esc(ms[bo].name)}</b><em>¥${num(ms[bo].priceOut)}</em></div>
        <div class="cmpsum-row"><span>${esc(t('cmp.longest'))}</span><b>${esc(ms[bc].name)}</b><em>${ctxText(Number(ms[bc].contextK) || 0)}</em></div>
        <div class="cmpsum-row"><span>${esc(t('cmp.top'))}</span><b>${esc(ms[bq].name)}</b><em>${stars(ms[bq].quality || 0)}</em></div>
      </div>
      <div class="cmpnotes">
        ${ms.map(function (m) {
    return `<div class="cmpnote">
          <div class="cmpnote-h">${brandMark(m.vendor, 20)}<b>${esc(m.name || m.id)}</b></div>
          <div class="cmpnote-b">${esc(m.note || '')}</div>
          <div class="cmpnote-u">${esc(m.baseUrl || '')}</div>
        </div>`;
  }).join('')}
      </div>
    </div>
  </div>`;
};
function bindCompare() { }

/* ══════════ 个人资料（App ProfilePage） ══════════ */
const PR = { showRegion: false };
function prGenderLabel(v) {
  if (v === 'male') return t('profile.gender.male');
  if (v === 'female') return t('profile.gender.female');
  if (v === 'secret') return t('profile.gender.secret');
  if (v === 'm') return t('profile.gender.male');
  if (v === 'f') return t('profile.gender.female');
  if (v === 's') return t('profile.gender.secret');
  return '';
}
function prRegionSheet() {
  const p = store.get(LS.profile, {});
  const regions = EXTRA.regions || [];
  const m = document.createElement('div');
  m.className = 'mask'; m.id = 'regionMask';
  m.innerHTML = `<div class="sheet regsheet">
    <div class="regsheet-t">${esc(t('profile.region.sheet'))}</div>
    <div class="regsheet-s">${esc(t('profile.region.desc'))}</div>
    <div class="regsheet-row">
      <button class="regauto" id="regAuto">${IC.refresh()}<span>${esc(t('profile.region.auto'))}</span></button>
      <button class="regnone ${!p.region ? 'on' : ''}" id="regNone">${esc(t('profile.region.none'))}</button>
    </div>
    <div class="reglist">
      ${regions.map(function (r) {
    return `<button class="regchip ${p.region === r.cn ? 'on' : ''}" data-reg="${esc(r.cn)}">${esc(S.lang === 'zh-CN' || S.lang === 'zh-TW' ? r.cn : r.en)}</button>`;
  }).join('')}
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-reg]').forEach(function (b) {
    b.onclick = function () {
      const pp = store.get(LS.profile, {});
      pp.region = b.dataset.reg;
      store.set(LS.profile, pp);
      closeMask(); render();
    };
  });
  document.getElementById('regNone').onclick = function () {
    const pp = store.get(LS.profile, {});
    pp.region = '';
    store.set(LS.profile, pp);
    closeMask(); render();
  };
  /* 网页无 IP 推断服务 → 自动获取失败，走 App 同款提示 */
  document.getElementById('regAuto').onclick = function () { toast(t('profile.region.autofail')); };
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}
SCREENS.profile = function () {
  const p = store.get(LS.profile, {});
  const curAvatar = (typeof p.avatar === 'number' && p.avatar >= 1 && p.avatar <= 6) ? p.avatar : 0;
  const regionText = p.region ? (S.lang === 'zh-CN' || S.lang === 'zh-TW' ? p.region : ((EXTRA.regions || []).filter(function (r) { return r.cn === p.region; })[0] || {}).en || p.region) : t('profile.region.unset');
  return `<div class="subpage profile">
    <div class="prtop">${hdrBack40()}<span class="prtop-t">${esc(t('mine.editProfile'))}</span></div>
    <div class="prwrap">
      <img class="pravatar" src="${esc(avatarSrc())}" alt="">
      <div class="pravatar-l">${esc(t('profile.avatar'))}</div>
      <div class="avatarow">
        ${[1, 2, 3, 4, 5, 6].map(function (i) {
    return `<button class="prav ${!p.avatarCustom && curAvatar === i ? 'on' : ''}" data-pav="${i}"><img src="assets/img/avatar_${i}.png" alt=""></button>`;
  }).join('')}
        <button class="pralbum ${p.avatarCustom ? 'on' : ''}" id="prAlbum">${IC.plusBig()}</button>
      </div>
      <div class="pravatar-hint">${esc(p.avatarCustom ? t('profile.avatar.picked') : t('profile.avatar.pick'))}</div>
      <input type="file" id="prFile" accept="image/*" hidden>
      <div class="prcard">
        <div class="prcard-h"><span>${esc(t('profile.nickname'))}</span><i>${esc(t('profile.nickname.rule'))}</i></div>
        <input type="text" id="prNick" class="prinput" value="${esc(p.nick || '')}" maxlength="16" placeholder="${esc(t('profile.nickname.hint'))}">
      </div>
      <div class="prcard">
        <div class="prcard-h"><span>${esc(t('profile.bio'))}</span><i>${esc(t('profile.bio.rule', 60))}</i></div>
        <textarea id="prBio" class="prinput prarea" rows="3" maxlength="60" placeholder="${esc(t('profile.bio.hint'))}">${esc(p.bio || '')}</textarea>
      </div>
      <div class="prcard">
        <div class="prcard-h"><span>${esc(t('profile.more'))}</span><i>${esc(t('profile.optional'))}</i></div>
        <div class="prrow">
          <span class="prrow-l">${esc(t('profile.age'))}</span>
          <input type="number" id="prAge" class="prinput row" value="${esc(p.age || '')}" min="0" max="150" placeholder="${esc(t('profile.age.hint'))}">
          <span class="prrow-u">${esc(t('profile.age.unit'))}</span>
        </div>
        <div class="prrow">
          <span class="prrow-l">${esc(t('profile.region'))}</span>
          <button class="prregion ${p.region ? '' : 'unset'}" id="prRegion"><span>${esc(regionText)}</span>${IC.chevR()}</button>
        </div>
        <div class="prrow gender">
          <span class="prrow-l">${esc(t('profile.gender'))}</span>
          ${['male', 'female', 'secret'].map(function (g) {
    const on = (p.gender === g) || (p.gender === 'm' && g === 'male') || (p.gender === 'f' && g === 'female') || (p.gender === 's' && g === 'secret');
    return `<button class="prgender ${on ? 'on' : ''}" data-gd="${g}">${esc(prGenderLabel(g))}</button>`;
  }).join('')}
        </div>
      </div>
      <button class="prsave" id="prSave">${esc(t('common.save'))}</button>
      
      <div class="prbottom"></div>
    </div>
  </div>`;
};
function bindProfile() {
  document.querySelectorAll('[data-pav]').forEach(function (b) {
    b.onclick = function () {
      const p = store.get(LS.profile, {});
      p.avatar = Number(b.dataset.pav);
      p.avatarCustom = '';
      store.set(LS.profile, p);
      render();
    };
  });
  document.querySelectorAll('[data-gd]').forEach(function (b) {
    b.onclick = function () {
      const p = store.get(LS.profile, {});
      p.gender = p.gender === b.dataset.gd ? '' : b.dataset.gd;
      store.set(LS.profile, p);
      render();
    };
  });
  const album = document.getElementById('prAlbum');
  if (album) album.onclick = function () { document.getElementById('prFile').click(); };
  const pf = document.getElementById('prFile');
  if (pf) pf.onchange = function () {
    const f = pf.files && pf.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = function () {
      const p = store.get(LS.profile, {});
      p.avatarCustom = rd.result;
      store.set(LS.profile, p);
      render();
    };
    rd.readAsDataURL(f);
  };
  const rg = document.getElementById('prRegion');
  if (rg) rg.onclick = prRegionSheet;
  const sv = document.getElementById('prSave');
  if (sv) sv.onclick = function () {
    const p = store.get(LS.profile, {});
    p.nick = document.getElementById('prNick').value.trim();
    p.bio = document.getElementById('prBio').value.trim();
    const a = parseInt(document.getElementById('prAge').value, 10);
    p.age = (isNaN(a) || a <= 0) ? 0 : (a > 150 ? 150 : a);
    store.set(LS.profile, p);
    toast(t('profile.saved'));
    history.back();
  };
  const out = document.getElementById('prOut');
  if (out) out.onclick = function () { if (window.Cloud) Cloud.signOut(); history.back(); };
}
