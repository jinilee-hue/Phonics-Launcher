/* Phonics Games launcher: game cards (intro, play, TRD), the set-wide check table and the fix list. Data = js/data.js
   (tools/build.py). Selected fixes are kept in this browser only (a convenience) and copied as text to paste in chat. */
(function () {
  'use strict';
  const D = window.LAUNCHER, G = D.games, A = D.audit;
  const $ = s => document.querySelector(s);
  const byId = Object.fromEntries(G.map(g => [g.id, g]));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  };
  const cell = (gid, cid) => (A.criteria.find(c => c.id === cid) || { cells: {} }).cells[gid] || ['na', ''];
  $('#sub').textContent = `FPR K · 파닉스 게임 ${G.length}개 · TRD ${G.filter(g => g.has_trd).length}/${G.length} · 점검 ${A.updated}`;

  // ── tabs ─────────────────────────────────────────────────────────────────────────────────────────
  function showTab(t) {
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === 'p-' + t));
    try { localStorage.setItem('launcher.tab', t); } catch (e) { /* storage off */ }
  }
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  try { const t = localStorage.getItem('launcher.tab'); if (t) showTab(t); } catch (e) { /* storage off */ }

  // ── game cards ───────────────────────────────────────────────────────────────────────────────────
  const facts = g => {
    const p = g.players || '';
    return { solo: /1/.test(p) || cell(g.id, 'solo')[0] === 'ok', duo: /2/.test(p), speak: ['ok', 'part'].includes(cell(g.id, 'speak')[0]), pack: cell(g.id, 'content')[0] === 'ok', grammar: /^문법/.test(g.scope || '') };
  };
  function cards(filter) {
    $('#grid').innerHTML = G.map((g, i) => {
      const f = facts(g);
      if (filter !== 'all' && !f[filter]) return '';
      const CR = A.criteria.filter(c => !c.info);          // info rows (학습 단위) are for reading, not scored
      const okN = CR.filter(c => (c.cells[g.id] || [])[0] === 'ok').length, all = CR.filter(c => (c.cells[g.id] || [])[0] !== 'na').length;
      return `<article class="card">
        <div class="shot"><img src="${esc(g.img)}" alt="${esc(g.title)} 타이틀 화면" loading="lazy"><span class="num">${String(i + 1).padStart(2, '0')}</span></div>
        <div class="card-body">
          <h3>${esc(g.title)}<small>${esc(g.title_ko)}</small></h3>
          <p class="tagline">${esc(g.tagline || '')}</p>
          <div class="tags">
            ${g.players ? `<span class="tag ${f.duo && !/1/.test(g.players) ? 't-duo' : 't-solo'}">${esc(g.players)}</span>` : ''}
            ${f.speak ? '<span class="tag t-speak">말하기</span>' : ''}
            ${g.stack ? `<span class="tag">${esc(g.stack.split(/[+(]/)[0].trim())}</span>` : ''}
          </div>
          ${g.skill ? `<div class="dots" title="학습 목표">${esc(g.skill)}</div>` : ''}
          ${g.scope ? `<p class="scope" title="학습 범위"><b>범위</b>${esc(g.scope)}</p>` : ''}
          <div class="dots" title="점검표 '있음' 항목 수">${CR.map(c => `<i class="st ${(c.cells[g.id] || ['na'])[0]}" title="${esc(c.name)}: ${esc((c.cells[g.id] || [])[1] || '')}"></i>`).join('')}<span>&nbsp;${okN}/${all}</span></div>
          <div class="card-actions">
            <a class="btn primary" href="${esc(g.url)}" target="_blank" rel="noopener">${ICON.play}플레이</a>
            <button class="btn teal" data-trd="${g.id}" ${g.has_trd ? '' : 'disabled'}>${ICON.doc}TRD</button>
          </div>
        </div></article>`;
    }).join('');
    $('#grid').querySelectorAll('[data-trd]').forEach(b => b.addEventListener('click', () => openTrd(b.dataset.trd)));
  }
  $('#filters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $('#filters').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
    cards(c.dataset.f);
  });
  cards('all');

  // ── TRD reader ───────────────────────────────────────────────────────────────────────────────────
  function openTrd(id) {
    const g = byId[id]; if (!g) return;
    $('#rImg').src = g.img; $('#rImg').alt = g.title;
    $('#rTitle').textContent = g.title; $('#rKo').textContent = g.title_ko;
    $('#rPlay').href = g.url; $('#rRepo').href = g.repo || '#'; $('#rRepo').style.display = g.repo ? '' : 'none';
    $('#rToc').innerHTML = g.toc.map((t, i) => `<a href="#s${i + 1}" data-s="s${i + 1}"><b>${i + 1}</b>${esc(t)}</a>`).join('');
    const meta = [g.players, g.stack, g.updated && `작성 ${g.updated}`].filter(Boolean).map(x => `<span class="tag">${esc(x)}</span>`).join('');
    $('#rBody').innerHTML = g.has_trd
      ? `<div class="meta">${meta}</div><p class="lead">${esc(g.tagline || '')}</p>${g.skill ? `<p><b>학습 목표</b> · ${esc(g.skill)}</p>` : ''}${g.scope ? `<p><b>학습 범위</b> · ${esc(g.scope)}</p>` : ''}${g.html}`
      : '<p class="empty">TRD 작성 중입니다.</p>';
    $('#rBody').scrollTop = 0;
    $('#reader').classList.add('on'); $('#reader').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    location.hash = 'trd-' + id;
  }
  function closeTrd() {
    $('#reader').classList.remove('on'); $('#reader').setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    if (location.hash.startsWith('#trd-')) history.replaceState(null, '', location.pathname + location.search);
  }
  $('#rClose').addEventListener('click', closeTrd);
  $('#reader').addEventListener('click', e => { if (e.target.id === 'reader') closeTrd(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeTrd(); });
  $('#rToc').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return; e.preventDefault();
    const t = $('#rBody').querySelector('#' + a.dataset.s); if (t) $('#rBody').scrollTo({ top: t.offsetTop - 12, behavior: 'smooth' });
  });
  $('#rBody').addEventListener('scroll', () => {   // the section in view is marked in the contents
    const hs = [...$('#rBody').querySelectorAll('h2[id]')]; let cur = hs[0];
    for (const h of hs) if (h.offsetTop - 40 <= $('#rBody').scrollTop) cur = h;
    $('#rToc').querySelectorAll('a').forEach(a => a.classList.toggle('on', cur && a.dataset.s === cur.id));
  });
  $('#rPrint').addEventListener('click', () => { document.body.classList.add('printing'); window.print(); });
  addEventListener('afterprint', () => document.body.classList.remove('printing'));
  if (location.hash.startsWith('#trd-')) openTrd(location.hash.slice(5));

  // ── check table ──────────────────────────────────────────────────────────────────────────────────
  const ST = { ok: '있음', part: '일부', no: '없음', na: '해당 없음' };
  $('#matrix').innerHTML = `<thead><tr><th>점검 기준</th>${A.games.map(id => `<th><img src="${esc(byId[id].img)}" alt="">${esc(byId[id].title)}</th>`).join('')}</tr></thead><tbody>`
    + A.criteria.map(c => `<tr><th title="${esc(c.desc)}">${esc(c.name)}</th>${A.games.map(id => {
      const [s, note] = c.cells[id] || ['na', ''];
      if (s === 'info') return `<td class="info"><div class="cell"><span>${esc(note)}</span></div></td>`;   // reading only, no status dot
      return `<td class="${s}"><div class="cell"><i class="st ${s}" aria-label="${ST[s]}"></i><span>${esc(note)}</span></div></td>`;
    }).join('')}</tr>`).join('') + '</tbody>';
  $('#matrix').querySelectorAll('thead th img').forEach((im, i) => { im.style.cursor = 'pointer'; im.addEventListener('click', () => openTrd(A.games[i])); });

  // ── fix list ─────────────────────────────────────────────────────────────────────────────────────
  let picked = new Set();
  try { picked = new Set(JSON.parse(localStorage.getItem('launcher.picked') || '[]')); } catch (e) { /* storage off */ }
  const savePicked = () => { try { localStorage.setItem('launcher.picked', JSON.stringify([...picked])); } catch (e) { /* storage off */ } };
  const PCLS = { 높음: 'p-hi', 중간: 'p-mid', 낮음: 'p-lo' };
  // per-game status of a fix (audit.json fixes[].status, 2026-11-22): live = 배포됨 · local = 반영·배포 대기 · todo = 아직 · kept = 유지(사용자 결정)
  const ST_LBL = { live: '배포', local: '대기', todo: '아직', kept: '유지' };
  const progress = f => { if (!f.status) return ''; const g = f.games.length, done = f.games.filter(id => ['live', 'kept'].includes(f.status[id])).length;
    return `<span class="fix-prog ${done === g ? 'all' : ''}">반영 ${done}/${g}</span>`; };
  function fixes(pri) {
    const groups = ['높음', '중간', '낮음'].filter(p => pri === 'all' || p === pri);
    $('#fixList').innerHTML = groups.map(p => {
      const items = A.fixes.filter(f => f.pri === p);
      return `<div class="pri-group"><h3><b class="pri ${PCLS[p]}">${p}</b>${items.length}개</h3>${items.map(f => `
        <div class="fix ${picked.has(f.id) ? 'on' : ''}" data-id="${f.id}" role="checkbox" aria-checked="${picked.has(f.id)}" tabindex="0">
          <span class="box">${ICON.check}</span>
          <div><h4><span class="fid">${f.id}</span>${esc(f.title)}${progress(f)}</h4><p>${esc(f.why)}</p>
          <div class="tags">${f.games.map(id => { const st = (f.status || {})[id] || ''; return `<span class="tag ${st ? 'st-' + st : ''}" title="${esc(ST_LBL[st] ? (A.statusLegend || {})[st] || '' : '')}"><img src="${esc(byId[id].img)}" alt="">${esc(byId[id].title)}${st ? `<i>${ST_LBL[st]}</i>` : ''}</span>`; }).join('')}</div>
          ${f.note ? `<p class="fix-note">${esc(f.note)}</p>` : ''}</div>
        </div>`).join('')}</div>`;
    }).join('');
    updateCopy();
  }
  function updateCopy() { $('#copyTxt').textContent = picked.size ? `고른 항목 ${picked.size}개 복사` : '고른 항목 복사'; $('#copySel').disabled = !picked.size; }
  $('#fixList').addEventListener('click', e => {
    const f = e.target.closest('.fix'); if (!f) return;
    const id = f.dataset.id;
    picked.has(id) ? picked.delete(id) : picked.add(id);
    f.classList.toggle('on', picked.has(id)); f.setAttribute('aria-checked', picked.has(id));
    savePicked(); updateCopy();
  });
  $('#fixList').addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('fix')) { e.preventDefault(); e.target.click(); } });
  $('#priFilter').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $('#priFilter').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
    fixes(c.dataset.p);
  });
  $('#copySel').addEventListener('click', async () => {
    const list = A.fixes.filter(f => picked.has(f.id));
    const text = '반영할 보완 항목:\n' + list.map(f => `- ${f.id} [${f.pri}] ${f.title} — ${f.games.map(id => byId[id].title).join(', ')}`).join('\n');
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    $('#copyTxt').textContent = '복사했어요'; setTimeout(updateCopy, 1600);
  });
  fixes('all');
})();
