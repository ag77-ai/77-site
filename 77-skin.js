/* 77 · Aurora skin — behaviour add-on (handoff 22 Oct 2026, adapted to the real DOM by Claude, 22 Oct).
   Loads AFTER every inline script (defer). It never replaces existing logic: ticks stay real <input type=checkbox>
   changes so save/push keep firing; notes (input.nt) stay; O / push / applyAll come from the sync script.
   Adaptations: days flattened + sorted (old "Past days" wrapper removed) · header/%/quote/open-items/pulse/xp/footer/DASH
   removed or moved · quote → first AM row · food line items → .food77 with a live tick · nbsp-safe header split ·
   skips + test results synced via O (skip_dNN / res_dNN_i) · desktop layout unfolds every block · Week declared before use. */
(() => {
  const CFG = {
    syncPill: '#sync',
    connectPanel: '#tok',
    themeKey: '77-theme',
    nightFrom: 18, nightTo: 8,
    restDefault: 60,
    lines: {
      42: 'Day one of the new plan. Easy run, easy bar, chest first. Showing up is already done.',
      43: 'Four reps, four evens. The first one decides the other three.',
      44: 'Tape, photos, truth. The scale is noise; the mirror is signal.',
      45: 'Twenty-five pull-ups in sets of five. The ladder starts here.',
      46: 'Ten times two minutes. Rep ten should feel like rep three.',
      47: '5·5·5·6·6. One more rep on the last two. That is how 25 happens.',
      48: 'Easy run, strides, lats. Nothing heroic. Everything counted.',
      49: 'Seventy percent today. The trial is tomorrow; the test is Sunday.',
      50: '5K, all out, line 27:30. Even pace. Kilometre one should feel too easy.',
      51: 'Fresh legs, five numbers, lines only go up. Write every one down.',
      52: 'New ladder from the test. Last week’s max is this week’s floor.',
      53: 'Last Hyderabad morning. 4×4, then pack the bell.',
      54: 'Ekadashi. Water, then Bangalore. The gym block starts on arrival.',
      55: 'First gym day. Two sessions at seventy percent to learn, then the loads climb weekly.',
      56: 'Real weights. Three-second lowers. Chest and lats finally get what they asked for.',
      57: 'Easy run on the track. Heart rate under 145, cadence over 162.',
      58: 'Tempo joins today: five kilometres, the middle three at 158–166.',
      59: 'Add weight only where every rep was clean. That is the whole rule.',
      60: 'Sixty in, forty left. Lean mass goes up from here.',
      61: 'Weighted pull-ups 5×3. The thick bar made this light.',
      62: 'Sunday by feel. Photos first. Then whatever the legs say.',
      63: 'Loads up on everything that was clean twice.',
      64: 'Easy miles build the engine the trial will spend.',
      65: 'Max test two. Lines: pull 10, chin 12, knee 27, push 33, hang 60.',
      66: 'Side delts on every upper day. The width comes from here.',
      67: 'Quality run. Even reps. Cap 178.',
      68: 'Two-thirds done. Thirteen percent is within reach this week.',
      69: 'Press heavier, row slower. Upper chest and mid-back are the gap.',
      70: 'Ekadashi. Train first, eat at Meal 2, nothing to make up.',
      71: 'Easy run plus strides. Fast and relaxed are the same thing.',
      72: 'Pull day. Lats through the stretch, pause at the top.',
      73: 'Sunday. Photos, tape, honest review.',
      74: 'The deficit is shallow; make the stimulus loud.',
      75: 'Tempo: hold the middle three kilometres steady, not brave.',
      76: 'Twenty-four days left. Nothing new; everything heavier or faster.',
      77: 'Day 77 of 77. The number is the name. Earn it today.',
      78: 'Easy day before the trial. Legs fresh, head clear.',
      79: '5K trial, then max test. Lines: 25:30, pull 12, push 36.',
      80: 'Twenty to go. The last stretch of the gym block.',
      81: 'Side delts, upper chest, lats. Say the three words, then lift.',
      82: 'Quality run. Last hard reps of the gym block.',
      83: 'Last gym day. Note every load; home decides what replaces it.',
      84: 'Ekadashi, home. Water, bar, the kettlebell you know.',
      85: 'Hold the loads. The gym gave the gain; the deficit keeps it.',
      86: 'Easy run on the old loop. Compare it to Day 39.',
      87: 'Hard bar. The ladder is three rungs higher than October.',
      88: 'Fed-abs protocol starts: Meal 2 composition, salt, fibre timing.',
      89: 'Quality run. Twelve days to the line.',
      90: 'Sunday. Photos fed, not fasted. That is the new standard.',
      91: 'Hard bar, Lower A. Ten days.',
      92: 'Easy day before the last max test.',
      93: 'Max test four. Lines: pull 13, chin 14, knee 32, push 37, hang 70.',
      94: 'One week. Nothing new. Everything clean.',
      95: 'Quality run, the last one. Even, controlled, done.',
      96: 'Sets of six now feel like sets of four felt in October.',
      97: 'Easy run plus strides. Save the legs.',
      98: 'Light day. Lay out Sunday’s numbers in your head.',
      99: 'Rest by feel. Tomorrow is the hundredth.',
      100: 'Day 100. Ekadashi. 5K, pull-ups, push-ups, photos. Lines only go up.',
    },
    defaultLines: ['You don’t need to feel like it. You only need to start.', 'Nobody is watching. That is the point.', 'Same bar, same dark, a little stronger.', 'Do today’s. Tomorrow has its own.'],
  };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const vib = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} };
  const O_ = () => (typeof O === 'object' && O) ? O : null;          // synced items map (notes, skips, results)
  const pushO = () => { try { if (typeof push === 'function') push(); } catch (e) {} };
  const desktop = () => window.matchMedia('(min-width: 900px)').matches;

  /* ── 0. Pre-pass: flatten + sort days, remove the old chrome ── */
  const wrap = $('.w') || document.body;
  const oldPast = $('details.past');
  if (oldPast) { $$('details.day', oldPast).forEach(d => wrap.append(d)); oldPast.remove(); }
  const dayNum = d => +(($('.dn', d)?.textContent || '').match(/\d+/) || [0])[0];
  const daysSorted = $$('details.day').sort((a, b) => dayNum(a) - dayNum(b));
  const firstDay = $('details.day');
  daysSorted.forEach(d => wrap.insertBefore(d, null));                 // append in order (moves them to the end, ordered)
  const buildTxt = ($('#bld') && $('#bld').textContent) || '';
  // keep the sync pill + token panel; drop everything else that the design replaces
  ['header', '.tot', '.oi-ct', 'details.oi-p', '.oi-hint', '.oi-sub', '.pul', '.xp', 'footer', 'a[href*="dashboard"]'].forEach(s => $$(s).forEach(n => n.remove()));
  const quote = $('.qt'); const reset = $('.rst');

  /* ── Theme ── */
  function applyTheme() {
    let pref = 'auto'; try { pref = localStorage.getItem(CFG.themeKey) || 'auto'; } catch (e) {}
    const h = new Date().getHours();
    const dark = pref === 'dark' || (pref === 'auto' && (h >= CFG.nightFrom || h < CFG.nightTo));
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const meta = $('meta[name=theme-color]'); if (meta) meta.content = dark ? '#0b0a12' : '#f6f4fa';
    $$('.seg77 button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === pref));
  }

  /* ── Day setup ── */
  const days = $$('details.day');
  const today = days.find(d => d.open) || days[days.length - 1];
  if (!today) return;
  today.classList.add('today');
  const n = dayNum(today);

  /* Week strip (declared before refresh() can call it) */
  const Week = {
    node: null,
    render() {
      if (!this.node) { this.node = el('div', 'week77'); today.querySelector('summary').after(this.node); }
      const idx = days.indexOf(today), dow = (new Date().getDay() + 6) % 7, start = Math.max(0, idx - dow);
      const L = 'MTWTFSS'; let doneW = 0, planned = 0, html = '';
      for (let i = 0; i < 7; i++) {
        const d = days[start + i]; let segs = '';
        ['am', 'pm'].forEach(k => {
          const b = d && $('.blk.' + k + ':not(.food-blk)', d), xs = b ? $$('label.ex', b) : [];
          const ok = xs.length && xs.every(x => $('input', x)?.checked || x.classList.contains('skip')) && xs.some(x => $('input', x)?.checked);
          const cls = !xs.length ? 'rest' : ok ? 'done' : d === today ? 'part' : start + i < idx ? 'miss' : '';
          if (xs.length) planned++; if (ok) doneW++; segs += `<i class="seg ${cls}"></i>`;
        });
        html += `<span class="d ${d === today ? 'now' : ''}">${segs}${L[i]}</span>`;
      }
      this.node.innerHTML = `<span class="days">${html}</span><span class="sum">${doneW} of ${planned} this week<span>${streak()}-day streak</span></span>`;
    },
  };
  function streak() { let s = 0; for (let i = days.indexOf(today) - 1; i >= 0; i--) { if ($$('input[type=checkbox]:checked', days[i]).length) s++; else break; } return s + 1; }

  /* skips + test results: synced through O when the sync script is present, localStorage otherwise */
  function skipKey(day) { return 'skip_d' + dayNum(day); }
  function saveSkips(day) {
    const list = $$('label.ex', day).map((x, i) => x.classList.contains('skip') ? i : -1).filter(i => i >= 0);
    const o = O_(); if (o) { if (list.length) o[skipKey(day)] = list.join(','); else delete o[skipKey(day)]; pushO(); }
    try { localStorage.setItem('77-' + skipKey(day), JSON.stringify(list)); } catch (e) {}
  }
  function loadSkips(day) {
    let list = []; const o = O_();
    if (o && o[skipKey(day)] != null) list = String(o[skipKey(day)]).split(',').map(Number);
    else { try { list = JSON.parse(localStorage.getItem('77-' + skipKey(day)) || '[]'); } catch (e) {} }
    $$('label.ex', day).forEach((x, i) => x.classList.toggle('skip', list.includes(i)));
  }
  function resKey(day, i) { return 'res_d' + dayNum(day) + '_' + i; }
  function resPaint(day) { $$('label.ex', day).forEach((x, i) => { const inp = $('.res77 input', x); if (!inp || document.activeElement === inp) return; const o = O_(); inp.value = (o && o[resKey(day, i)]) || (() => { try { return localStorage.getItem('77-' + resKey(day, i)) || ''; } catch (e) { return ''; } })(); }); }

  days.forEach(day => {
    $$('.dnote', day).forEach(d => { if (/^\s*Ekadashi/i.test(d.textContent)) d.remove(); });
    const tagTxt = ($('.tg', day)?.textContent || '');
    if (/TEST|TRIAL/i.test(tagTxt)) day.classList.add('test');
    if (/EKADASHI/i.test(tagTxt)) day.classList.add('eka');
    const dn = $('.dn', day); if (dn && !dn.dataset.n) { dn.dataset.n = String(dayNum(day)); dn.textContent = dn.dataset.n; }

    // Food line items → .food77 (keeps the real checkbox so it still syncs)
    $$('label.ex[for$="_food"]', day).forEach(f => {
      const blk = f.closest('.blk'); const cb = $('input[type=checkbox]', f);
      const title = ($('b', f)?.textContent || '').replace(/^FOOD TODAY — /, '');
      const box = el('label', 'food77'); box.htmlFor = cb.id;
      box.append(cb, el('b', '', '+150 kcal today'), el('span', '', title.replace(/^\+150 kcal · /, '') + ' · inside Meal 2'), el('span', 'bx'));
      const am = $('.blk.am', day); (am || blk).after(box); if (blk && !$('label.ex', blk)) blk.remove(); else f.remove();
    });

    $$('label.ex', day).forEach((ex, i) => {
      ex.style.setProperty('--ci', i + 1);
      const txt = $('.txt', ex); if (!txt || $('.more77', ex)) return;
      txt.dataset.idx = String(i + 1).padStart(2, '0');
      const srcTxt = (($('.key', ex)?.textContent || '') + ' ' + ($('.pts', ex)?.textContent || '') + ' ' + ($('.c', ex)?.textContent || '')).replace(/\u00a0/g, ' ');
      const lm = srcTxt.match(/(\d+(?:\.\d+)?\s*kg(?:\s*(?:plates?(?:\s*(?:in each hand|per hand))?|per hand|in each hand|bell|ball))?)/i) || srcTxt.match(/\b(2\.7 plates|bodyweight)\b/i);
      if (lm && $('.p', ex)) { const chip = el('span', 'load77', lm[1].replace(/\s+/g, ' ')); $('.p', ex).after(chip); }
      const more = el('div', 'more77');
      const key = $('.key', ex); if (key) more.append(key.cloneNode(true));
      ['.stp', '.c', '.pts', '.w', '.up'].forEach(s => { const node = $(s, ex); if (node) more.append(node); });
      const note = $('textarea, input[type=text]', ex); if (note) more.append(note);
      const acts = el('div', 'acts77');
      const v = $('.v', ex);
      if (v && !ex.closest('.blk.pm')) { const pill = v.cloneNode(true); pill.className = 'v'; pill.innerHTML = '▶ Video'; acts.append(pill); }
      const skip = el('button', '', ex.classList.contains('skip') ? 'Un-skip' : 'Skip today'); skip.type = 'button';
      skip.onclick = e => { e.preventDefault(); e.stopPropagation(); ex.classList.toggle('skip'); skip.textContent = ex.classList.contains('skip') ? 'Un-skip' : 'Skip today'; saveSkips(day); refresh(day); };
      acts.append(skip); more.append(acts); ex.append(more);
      if (ex.closest('.blk.pm') && !v) { const ph = el('span', 'v missing'); ph.title = 'Add YouTube link'; txt.after(ph); }
      const go = el('button', 'go77', 'Start workout'); go.type = 'button';
      go.onclick = e => { e.preventDefault(); e.stopPropagation(); Workout.open(ex); };
      ex.append(go);
      if (day.classList.contains('test') && /MAX TEST|TIME TRIAL/i.test($('b', ex)?.textContent || '') && !$('.res77', ex)) {
        const r = el('div', 'res77', '<input inputmode="decimal" placeholder="result"><span>write the number here · it syncs</span>');
        const inp = $('input', r);
        inp.oninput = () => { const o = O_(); if (o) { if (inp.value.trim()) o[resKey(day, i)] = inp.value.trim(); else delete o[resKey(day, i)]; } try { localStorage.setItem('77-' + resKey(day, i), inp.value); } catch (e) {} };
        inp.onchange = pushO;
        r.onclick = e => e.stopPropagation(); ex.append(r);
      }
    });
    loadSkips(day); resPaint(day);

    // Block headers: "☀️ MORNING · 03:15–05:00 · rule…" → title / time / rule (nbsp-safe)
    $$('.blk', day).forEach(blk => {
      const bh = $('.bh', blk); if (!bh || bh.dataset.done) return; bh.dataset.done = 1;
      const raw = bh.textContent.replace(/ /g, ' ').replace(/[\u{1F300}-\u{1FAFF}☀-➿]️?/gu, '').replace(/\s+/g, ' ').trim();
      const parts = raw.split(/\s·\s/); const title = parts[0] || ''; let time = parts[1] || ''; const rest = parts.slice(2); if (/^evening/i.test(title)) { time = '30 min'; }
      bh.innerHTML = '';
      const t = el('span', '', title.toLowerCase().replace(/^\w/, c => c.toUpperCase()));
      if (time) t.append(el('span', 'time', time));
      bh.append(t, el('span', 'cnt'));
      if (rest.length) bh.after(el('div', 'bh-rule dnote', rest.join(' · ')));
      bh.onclick = () => { blk.classList.toggle('fold'); blk.dataset.userFold = blk.classList.contains('fold') ? 1 : 0; };
    });
    // progressive disclosure: tapping the text expands instead of ticking
    day.addEventListener('click', e => {
      const ex = e.target.closest('label.ex'); if (!ex) return;
      if (e.target.closest('.bx, input[type=checkbox]')) { vib(); return; }
      if (e.target.closest('a, textarea, input, button, .more77')) { if (!e.target.closest('a')) e.preventDefault(); return; }
      e.preventDefault(); ex.classList.toggle('open');
    });
    day.addEventListener('change', e => { if (e.target.matches('label.ex input[type=checkbox]')) { e.target.closest('label.ex').classList.remove('skip'); saveSkips(day); refresh(day); } });
    refresh(day, true);
  });

  /* ── Progress, current exercise, folds, session ── */
  function refresh(day, first) {
    const exs = $$('label.ex', day), done = exs.filter(x => $('input', x)?.checked).length, p = exs.length ? done / exs.length : 0;
    day.style.setProperty('--p', p.toFixed(3));
    const bar = $('.bar', day); if (bar) { bar.dataset.pct = Math.round(p * 100) + '%'; bar.dataset.count = done + ' of ' + exs.length + ' done'; }
    exs.forEach(x => x.classList.remove('cur'));
    const cur = exs.find(x => !$('input', x)?.checked && !x.classList.contains('skip'));
    if (day === today && cur) cur.classList.add('cur');
    exs.forEach(x => x.classList.remove('curb'));
    if (day === today) $$('.blk', day).forEach(blk => { const c = $$('label.ex', blk).find(x => !$('input', x)?.checked && !x.classList.contains('skip')); if (c) c.classList.add('curb'); });
    $$('.blk', day).forEach(blk => {
      const bx = $$('label.ex', blk), dn = bx.filter(x => $('input', x)?.checked).length, handled = bx.filter(x => $('input', x)?.checked || x.classList.contains('skip')).length;
      const cnt = $('.bh .cnt', blk); if (cnt) cnt.textContent = dn + '/' + bx.length;
      const bh = $('.bh', blk); if (bh) bh.dataset.summary = handled === bx.length && bx.length ? 'done' : bx.length + (bx.length === 1 ? ' item' : ' exercises');
      if (day === today && blk.dataset.userFold == null) blk.classList.toggle('fold', !(cur && blk.contains(cur)));
    });
    if (day === today) {
      const amLeft = cur && cur.closest('.blk.am'); document.documentElement.dataset.session = (amLeft && new Date().getHours() < 12) ? 'am' : 'pm';
      document.documentElement.style.setProperty('--p', p.toFixed(3));
      Week.render();
    }
  }
  window.addEventListener('resize', () => refresh(today));

  /* ── Hero extras on today: daily line, dial, banner ── */
  const sum = $('summary', today);
  if (sum && !$('.line77', sum)) {
    sum.append(el('div', 'line77', CFG.lines[n] || CFG.defaultLines[n % CFG.defaultLines.length]));
    const dial = el('div', 'dial77', `<div class="ticks"></div><div class="past"></div><div class="sun"></div><div class="face"><small>DAY</small><strong>${n}</strong><span>${$('.dd', today)?.textContent || ''}</span></div>`);
    dial.style.setProperty('--day', ((n - 1) / 100).toFixed(2)); sum.prepend(dial);
    if (today.classList.contains('test')) sum.prepend(el('div', 'banner77', '<div><b>Test day</b>Fresh, full effort, every number written down. Lines only go up.</div>'));
    sum.addEventListener('click', e => e.preventDefault());
  }

  /* Past days wrapper */
  const pastDays = days.slice(0, days.indexOf(today));
  if (pastDays.length && !$('details.past77')) {
    const avg = Math.round(pastDays.reduce((a, d) => { const x = $$('input[type=checkbox]', d); return a + (x.length ? x.filter(i => i.checked).length / x.length : 1); }, 0) / pastDays.length * 100);
    const w = el('details', 'past77', `<summary>Past days<span>${pastDays.length} · avg ${avg}%</span></summary>`);
    const future = days.slice(days.indexOf(today) + 1);
    (future.length ? future[future.length - 1] : today).after(w);
    pastDays.reverse().forEach(d => { d.open = false; w.append(d); });
  }
  const futureDays = days.slice(days.indexOf(today) + 1);
  if (futureDays.length) { const h = el('div', 'next77', 'Coming up'); today.after(h); }

  /* Quote → first row of today's AM block */
  const am = $('.blk.am', today);
  if (quote && am) { quote.className = 'quote77'; ($('.bh-rule', am) || $('.bh', am)).after(quote); }

  /* ── Sync pill → settings sheet ── */
  const pill = $(CFG.syncPill);
  const sheet = el('div', 'sheet77', `<div class="pane"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Sync &amp; settings</h2><button class="btn77 close" style="height:44px;padding:0 16px">Done</button></div>
    <div class="slot-sync"></div>
    <div style="display:flex;flex-direction:column;gap:10px"><span class="lbl">APPEARANCE</span><div class="seg77"><button data-v="auto">Auto</button><button data-v="dark">Dark</button><button data-v="light">Light</button></div>
    <span style="font:400 14px/1.35 var(--f-body);color:var(--fg2)">Auto: dark ${CFG.nightFrom}:00–0${CFG.nightTo}:00, light in daylight.</span></div>
    <div class="slot-tools" style="display:flex;gap:8px;flex-wrap:wrap"></div><span class="lbl">Build ${buildTxt}</span></div>`);
  document.body.append(sheet);
  if (pill) { pill.classList.add('sync77'); pill.removeAttribute('onclick'); pill.addEventListener('click', () => { sheet.classList.add('on'); }); }
  const st = el('div', 'syncstate77'); $('.slot-sync', sheet).append(st);
  const mirror = () => { const t = $('#synct'); const s = pill?.dataset.s || ''; st.textContent = (t ? t.textContent : '') ; st.dataset.s = s; }; mirror(); setInterval(mirror, 1000);
  const conn = $(CFG.connectPanel); if (conn) { $('.slot-sync', sheet).append(conn); const chg = el('button', 'btn77', 'Change token'); chg.type = 'button'; chg.onclick = () => { conn.style.display = 'block'; chg.style.display = 'none'; }; $('.slot-sync', sheet).append(chg); const vis = () => { const s = pill?.dataset.s || ''; const ok = s === 'ok' || s === 'saving'; if (ok) { conn.style.display = 'none'; chg.style.display = ''; } else { conn.style.display = 'block'; chg.style.display = 'none'; } }; vis(); setInterval(vis, 1500); }
  if (reset) { const b = $('button', reset); if (b) { b.classList.add('btn77'); $('.slot-tools', sheet).append(b); } reset.remove(); }
  sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.close')) sheet.classList.remove('on'); const b = e.target.closest('.seg77 button'); if (b) { try { localStorage.setItem(CFG.themeKey, b.dataset.v); } catch (x) {} applyTheme(); } });
  applyTheme(); setInterval(applyTheme, 60000);

  /* After a sync pull, re-read skips/results and recompute */
  if (typeof applyAll === 'function') { const _aa = applyAll; applyAll = function () { _aa(); days.forEach(d => { loadSkips(d); resPaint(d); refresh(d); }); }; }

  /* ── Workout mode ── */
  const Workout = (() => {
    const root = el('div', 'wo77', `<div class="top"><button class="x" aria-label="Back to today">✕</button><div class="prog"><i></i></div><span class="pct" style="font:700 14px/1 var(--f-mono);color:var(--fg2)"></span></div>
      <div class="blkname"></div><div class="name"></div><div class="rx"></div><div class="dots"></div>
      <div class="mid"></div><div class="next"></div><button class="done"><span class="lbl">Set done</span><small></small></button>`);
    const pillR = el('button', 'restpill77');
    document.body.append(root, pillR);
    let ex = null, sets = 1, rest = CFG.restDefault, restTotal = 1, doneN = 0, restEnd = 0, fresh = false, lock = null;
    const parse = x => { const t = ($('.p', x)?.textContent || '').replace(/ /g, ' '); const m = t.match(/(\d+)\s*(?:sets?|rounds?)/i) || t.match(/^(\d+)\s*×/); const r = t.match(/rest\s*(\d+)/i); return { sets: m ? +m[1] : 1, rest: r ? +r[1] : 0, target: (t.match(/×\s*([^·]+)/) || [, ''])[1].trim() }; };
    const allEx = () => $$('label.ex', today).filter(x => !$('input', x).checked && !x.classList.contains('skip'));
    async function wake() { try { if ('wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } } catch (e) { lock = null; } }
    function unwake() { try { lock && lock.release(); } catch (e) {} lock = null; }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && root.classList.contains('on')) wake(); });
    function open(x) { load(x); root.classList.add('on'); wake(); draw(); }
    function load(x) { ex = x; const pr = parse(x); sets = pr.sets; rest = pr.rest; doneN = 0; }
    function draw() {
      if (!ex) return;
      const blk = ex.closest('.blk'), sh = (() => { let s = ex.previousElementSibling; while (s && !s.matches('.sh')) s = s.previousElementSibling; return s; })();
      $('.prog', root).style.setProperty('--p', getComputedStyle(today).getPropertyValue('--p'));
      $('.pct', root).textContent = $('.bar', today)?.dataset.pct || '';
      $('.blkname', root).textContent = ($('.bh span', blk)?.firstChild?.textContent || '') + (sh ? ' · ' + sh.textContent : '');
      $('.name', root).textContent = $('b', ex)?.textContent || ''; $('.rx', root).textContent = ($('.p', ex)?.textContent || '').replace(/ /g, ' ');
      $('.dots', root).innerHTML = Array.from({ length: sets }, (_, i) => `<i class="${i < doneN ? 'done' : i === doneN ? 'now' : ''}"></i>`).join('');
      const remain = Math.max(0, Math.ceil((restEnd - Date.now()) / 1000));
      const setNo = Math.min(doneN + 1, sets);
      if (remain > 0) {
        const f = Math.max(0, (restEnd - Date.now()) / (restTotal * 1000));
        $('.mid', root).innerHTML = `<div class="ring" style="--f:${f.toFixed(3)}"><div class="t">${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')}<small>rest, then ${fresh ? ($('b', ex)?.textContent || '').toLowerCase() : 'set ' + setNo + ' of ' + sets}</small></div></div><div class="restbtns"><button data-a="add">+15 s</button><button data-a="skip">Skip rest</button></div>`;
        pillR.textContent = `Rest ${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')} · back to set`;
      } else {
        $('.mid', root).innerHTML = `<span class="set">${sets > 1 ? 'Set ' + setNo + ' of ' + sets : 'One go'}</span><span class="target">${parse(ex).target || ''}</span><span class="cue">${$('.key', ex)?.textContent || ''}</span>`;
        if (restEnd && remain === 0) { restEnd = 0; vib(); }
      }
      pillR.classList.toggle('on', remain > 0 && !root.classList.contains('on'));
      const nx = allEx().filter(x => x !== ex)[0];
      $('.next', root).innerHTML = nx ? `<span>Next exercise</span><b>${$('b', nx)?.textContent || ''}</b>` : '';
      $('.done .lbl', root).textContent = sets > 1 ? 'Set done' : 'Done';
      $('.done small', root).textContent = sets > 1 ? 'set ' + setNo + ' of ' + sets : (parse(ex).target || '');
    }
    root.addEventListener('click', e => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'add') { restEnd += 15000; restTotal += 15; }
      if (a === 'skip') restEnd = 0;
      if (e.target.closest('.x')) { root.classList.remove('on'); if (!restEnd) unwake(); }
      if (e.target.closest('.done')) {
        vib(); doneN++;
        if (doneN >= sets) {
          const cb = $('input[type=checkbox]', ex); if (cb && !cb.checked) cb.click();
          const r = rest, nx = allEx()[0];
          if (!nx) { root.classList.remove('on'); unwake(); return; }
          load(nx); fresh = true; restTotal = r || 1; restEnd = r ? Date.now() + r * 1000 : 0;
        } else { fresh = false; restTotal = rest || 1; restEnd = rest ? Date.now() + rest * 1000 : 0; }
      }
      draw();
    });
    pillR.onclick = () => { root.classList.add('on'); wake(); draw(); };
    setInterval(() => { if (restEnd) draw(); }, 250);
    return { open };
  })();
})();
