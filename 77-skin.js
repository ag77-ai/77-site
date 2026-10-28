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
    lines: {
      42: 'Day one of the new plan. 4×4 first, easy bar, chest first. Showing up is already done.',
      43: 'Four reps, four evens. The first one decides the other three.',
      44: 'Tape, photos, truth. The scale is noise; the mirror is signal.',
      45: 'AM missed, counted, closed. Push B this afternoon — that is the only session that exists now.',
      46: '5×5 on the bar, then an easy five. The ladder starts today, not Monday.',
      47: 'Ten times two minutes, run first. Rep ten should feel like rep three. Legs in the afternoon, then rest them.',
      48: 'Back check first. Pain-free means everything as written — chest, then the hinge you owe from yesterday.',
      49: '5·5·5·6·6. One more rep on the last two. Easy run, strides, lats — hand on the chair.',
      50: 'Trial eve. Easy bar, easy five, chest at full load. Early night; the number is tomorrow.',
      51: '5K, all out, line 27:30. Even pace. Kilometre one should feel too easy.',
      52: 'Fresh arms, five numbers, lines only go up. Write every one down.',
      53: 'Last Hyderabad morning. 4×4, then legs, then pack the bell. Tomorrow is rest.',
      54: 'Ekadashi, flight, rest. Eight days earned this one. Kriyas, water, Bangalore.',
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
  daysSorted.forEach(d => wrap.insertBefore(d, null));                 // append in order (moves them to the end, ordered)
  const buildTxt = ($('#bld') && $('#bld').textContent) || '';
  // keep the sync pill + token panel; drop everything else that the design replaces
  // HIDE, never remove: the sync script's bars() writes #pct/#done/#all inside .tot, and a throw there is reported as 'Offline'
  ['header', '.tot', '.oi-ct', 'details.oi-p', '.oi-hint', '.oi-sub', '.pul', '.xp', 'footer', 'a[href*="dashboard"]'].forEach(s => $$(s).forEach(n => { n.hidden = true; n.style.display = 'none'; }));
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
  function streak() { let s = 0; for (let i = days.indexOf(today) - 1; i >= 0; i--) { if ($$('input[type=checkbox]:checked', days[i]).length) s++; else break; } return s + ($$('input[type=checkbox]:checked', today).length ? 1 : 0); }

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
      [$('.key', ex), ...$$('.pts li', ex)].forEach(nd => { if (nd && /last set/i.test(nd.textContent) && /hold/i.test(nd.textContent)) nd.classList.add('last77'); });
      const srcTxt = (($('.key', ex)?.textContent || '') + ' ' + $$('.pts li', ex).map(li => li.textContent.split('\u2192')[0]).join(' ') + ' ' + ($('.c', ex)?.textContent || '')).replace(/\u00a0/g, ' ');
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
    const open = x => !$('input', x)?.checked && !x.classList.contains('skip');
    const pmTime = new Date().getHours() >= 12;
    const cur = (day === today && pmTime ? exs.filter(x => !x.closest('.blk.am')).find(open) : null) || exs.find(open);
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
      document.documentElement.dataset.session = (cur && cur.closest('.blk.am') && !pmTime) ? 'am' : 'pm';
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

  /* Quote → under the week strip (visible in every session), one per day from the pool */
  /* 71 verified quotes (sources: 77-quotes-review.html). Index = day − 42 → Days 42–100 never repeat. */
  const QUOTES = [
    ["You have to fight to reach your dream. You have to sacrifice and work hard for it.", "Lionel Messi"],
    ["In the morning when thou risest unwillingly, let this thought be present—I am rising to the work of a human being.", "Marcus Aurelius"],
    ["I didn't get where I got on pure talent alone. I got there by trying to outwork my opponents.", "Roger Federer"],
    ["Only the disciplined ones are free in life. If you aren't disciplined, you are a slave to your moods. You are a slave to your passions.", "Eliud Kipchoge"],
    ["There are more things, Lucilius, likely to frighten us than there are to crush us; we suffer more often in imagination than in reality.", "Seneca"],
    ["I've missed over 9,000 shots in my career… I've failed over and over and over again in my life. And that is why I succeed.", "Michael Jordan"],
    ["Those times when you get up early and you work hard… those times when you don't feel like working… but you do it anyway… that is actually the dream.", "Kobe Bryant"],
    ["Be dedicated to your craft, commit fully and just enjoy the journey. It's not going to be an easy road, but hard work, dedication and you'll get there.", "Usain Bolt"],
    ["You have to have three things: discipline, commitment and hard work.", "Haile Gebrselassie"],
    ["When you are fit, with passion for the game, when you are ready to compete, you are able to suffer and enjoy suffering.", "Rafael Nadal"],
    ["If you no longer go for a gap that exists, you are no longer a racing driver.", "Ayrton Senna"],
    ["I have always believed that process is more important than results.", "MS Dhoni"],
    ["Difficulties are what show men's character. Therefore when a difficult crisis meets you, remember that you are as the raw youth with whom God the trainer is wrestling.", "Epictetus"],
    ["I knew I had a lot of talent, but I decided that I was going to work harder than everybody… I was going to train like I could be the best in the world.", "Cristiano Ronaldo"],
    ["Nothing is impossible. With so many people saying it couldn't be done, all it takes is an imagination.", "Michael Phelps"],
    ["I have always believed in myself and in hard work and hence I strongly believe hard work never fails.", "Milkha Singh"],
    ["My dad put a value inside me about never giving up, and the easiest thing to do is to give up. But it's not how you fall, it's about how you get up.", "Lewis Hamilton"],
    ["I wanted to explore a new side of my body to take me to the next level because I never wanted to be average.", "Virat Kohli"],
    ["This last two or three or four repetitions… that's what makes the muscle then grow… If you can go through this pain barrier, you may get to be a champion.", "Arnold Schwarzenegger"],
    ["I've learned that 100 percent of the shots you don't take don't go in the net.", "Wayne Gretzky"],
    ["To give anything less than your best is to sacrifice the gift.", "Steve Prefontaine"],
    ["There are stones thrown at you and you turn them into milestones.", "Sachin Tendulkar"],
    ["In Northeast Ohio, nothing is given. Everything is earned. You work for what you have.", "LeBron James"],
    ["You can't be a success in anything unless you have some type of work ethic.", "Kareem Abdul-Jabbar"],
    ["I felt at that moment that it was my chance to do one thing supremely well. I drove on, impelled by a combination of fear and pride.", "Roger Bannister"],
    ["It is not enough to win the race. One must contribute to it.", "Emil Zátopek"],
    ["I wanted the world to know that my country, Ethiopia, has always won with determination and heroism.", "Abebe Bikila"],
    ["Make every session that you do count – even your recovery runs. Never do sessions just as 'fillers'.", "Sebastian Coe"],
    ["Whatever hard work and the obstacles came in between, seeing the gold medal, the national flag and listening to the national anthem have made them disappear from my mind. It was all worth it.", "Neeraj Chopra"],
    ["There are no short-cuts, just hard work and grafting.", "Mo Farah"],
    ["I hated every minute of it. But I said to myself, 'Suffer now, and live the rest of your life as a champion.'", "Muhammad Ali"],
    ["I really think a champion is defined not by their wins but by how they can recover when they fall.", "Serena Williams"],
    ["Champions adjust, and pressure is a privilege.", "Billie Jean King"],
    ["If you're looking for the shortcut, the trick, the easy way, you can get by, perhaps, for a while, but you won't be strengthening the talents that lie within you.", "John Wooden"],
    ["Three years ago, I never thought I'd step foot on a gymnastics floor again… But… I got back in the gym and worked really hard physically and mentally.", "Simone Biles"],
    ["One thing I don't do is give up, I love to fight against the odds.", "Mary Kom"],
    ["You stumble but you get back up and fight for your dreams. Getting up, trying again, is the message for children who like to watch me.", "Lionel Messi"],
    ["The mind converts and changes every hindrance to its activity into an aid… and that which is an obstacle on the road helps us on this road.", "Marcus Aurelius"],
    ["When you're playing a point, it is the most important thing in the world. But when it's behind you, it's behind you…", "Roger Federer"],
    ["No human is limited.", "Eliud Kipchoge"],
    ["Hold every hour in your grasp. Lay hold of to-day's task, and you will not need to depend so much upon to-morrow's. While we are postponing, life speeds by.", "Seneca"],
    ["I can accept failure. Everyone fails at something. But I can't accept not trying.", "Michael Jordan"],
    ["Hard work outweighs talent – every time.", "Kobe Bryant"],
    ["You need talent and then you need to work hard on your talent to be the best that you can be.", "Usain Bolt"],
    ["One of the secrets … is to accept the pain. Without pain, no gain.", "Haile Gebrselassie"],
    ["You need to work with the right attitude every day. You need to be ready to suffer, to enjoy the suffering, and to be able to change the situation.", "Rafael Nadal"],
    ["As soon as you touch this limit, something happens and you suddenly can go a little bit further. With your mind power, your determination… you can fly very high.", "Ayrton Senna"],
    ["You have seen cricketers who are not god-gifted, but even then, they have gone far. That's because of the passion.", "MS Dhoni"],
    ["First say to yourself, what manner of man you want to be… Athletes first decide what they want to be, and then they act accordingly.", "Epictetus"],
    ["The talent is useless without hard work. Nothing falls from the skies. I would never have arrived where I am without the hard work.", "Cristiano Ronaldo"],
    ["Dream, plan, reach. You come up with a dream, you figure out how you're going to get there and you go for it… You fail? Great. Get up and do it again.", "Michael Phelps"],
    ["Discipline, you have to be disciplined if you want to be world class.", "Milkha Singh"],
    ["You learn way, way more when you stumble, and fall… Work harder, dig deeper, study more - whatever it may be.", "Lewis Hamilton"],
    ["When you become fit, you feel you can do anything.", "Virat Kohli"],
    ["Just remember, you can't climb the ladder of success with your hands in your pockets.", "Arnold Schwarzenegger"],
    ["There's always space to grow up and be better. We never reach perfection. I will keep trying to be better and better and keep growing as a player.", "Lionel Messi"],
    ["Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.", "Marcus Aurelius"],
    ["Discipline is also a talent. And so is patience. Trusting yourself is a talent. Embracing the process, loving the process, is a talent.", "Roger Federer"],
    ["I always say I don't run by my legs, but I run by heart and my mind.", "Eliud Kipchoge"],
    ["Nothing, Lucilius, is ours, except time.", "Seneca"],
    ["Never say never. Because limits, like fears, are often just an illusion.", "Michael Jordan"],
    ["If you have a goal or a dream, you need to apply the Mamba Mentality to achieve it. Everything worth achieving needs total focus and dedication.", "Kobe Bryant"],
    ["There's always something you can improve on. I think you can learn from any situation.", "Usain Bolt"],
    ["I am retiring from competitive running, not from running. You cannot stop running. This is my life.", "Haile Gebrselassie"],
    ["You have to learn how to live with these kind of moments, and also to enjoy this suffering. It's what we work for, for thrilling moments.", "Rafael Nadal"],
    ["No longer talk at all about the kind of man that a good man ought to be, but be such.", "Marcus Aurelius"],
    ["Because they prove that you can win not just when you are at your best, but especially when you aren't.", "Roger Federer"],
    ["We say preparation is more important than winning. If you prepare well, then you win.", "Eliud Kipchoge"],
    ["Philosophy teaches us to act, not to speak.", "Seneca"],
    ["Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.", "Marcus Aurelius"],
    ["Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.", "Marcus Aurelius"],
  ];
  if (quote) {
    quote.className = 'quote77';
    const q = QUOTES[(((n - 42) % QUOTES.length) + QUOTES.length) % QUOTES.length];
    const qt = $('#qtx', quote), qa = $('#qau', quote); if (qt) qt.textContent = '\u201c' + q[0] + '\u201d'; if (qa) qa.textContent = '\u2014 ' + q[1];
    (Week.node || $('summary', today)).after(quote);
  }
  const am = $('.blk.am', today);

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
      <div class="mid"></div><div class="info"></div><div class="notew"><input type="text" class="nt77" placeholder="Note — blank = done as written" enterkeyhint="done" autocomplete="off"></div><div class="next"></div><button class="done"><span class="lbl">Set done</span><small></small></button>`);
    const pillR = el('button', 'restpill77');
    document.body.append(root, pillR);
    let ex = null, seq = [], si = 0, pairRest = 0, restTotal = 1, restEnd = 0, fresh = false, lock = null;
    /* s5a-9 + s5a-10 (Day 42 · 23 Oct): sound unlocked by the first tap in Workout Mode (iOS needs a gesture) · 3-2-1 + long beep at rest end · count-up hold timer */
    let ac = null, beeped = 0, holdT0 = 0, holdHit = false, holdSide = 0, holdBeep = 0;
    const holdLog = new Map();
    function audioOn() { try { if (navigator.audioSession && navigator.audioSession.type !== 'transient') navigator.audioSession.type = 'transient'; } catch (e) {}
      try { if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; ac = new C(); const s = ac.createBufferSource(); s.buffer = ac.createBuffer(1, 1, 22050); s.connect(ac.destination); s.start(0); } if (ac.state === 'suspended') ac.resume(); } catch (e) {} }
    function tone(f, d, v = 0.4) { try { if (!ac) return; if (ac.state === 'suspended') ac.resume(); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.03); } catch (e) {} }
    /* haptic: navigator.vibrate on Android; iOS 18+ Safari ticks when a <input switch> toggles (best effort) */
    const hap = el('label', 'hap77', '<input type="checkbox" switch>'); hap.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
    ['click', 'change', 'input'].forEach(ev => hap.addEventListener(ev, e => e.stopPropagation())); document.body.append(hap);
    function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); else hap.click(); } catch (e) {} }
    const tick321 = () => { tone(880, 0.14); buzz(40); }, goBeep = () => { tone(1320, 0.55, 0.5); buzz([220, 80, 220]); };
    root.addEventListener('pointerdown', audioOn, { capture: true });
    const mmss = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    /* timed card = ".p" says "N sets × 40 seconds" (EACH SIDE = two holds per set), or a hang / hold / plank test card (target = the LINE in its title, e.g. "57 s") */
    const holdOf = x => { const a = ($('.p', x)?.textContent || '').replace(/ /g, ' ').split(/rest/i)[0], m = a.match(/×\s*(\d+)\s*sec/i), sides = /EACH SIDE/i.test(a) ? 2 : 1;
      if (m) return { tgt: +m[1], sides };
      if (/hang|hold|plank/i.test(nm(x)) && !/rounds?|\+/i.test(a)) { const n = nm(x).match(/(\d+)\s*s\b/); return { tgt: n ? +n[1] : 0, sides }; }
      return null; };
    function holdSave(x, secs) {
      const src = $('input.nt', x); let L = holdLog.get(x);
      if (!L) { const m = (src?.value || '').match(/⏱\s*([\d\/]+)/); L = m ? m[1].split('/').map(Number) : []; }
      L.push(secs); holdLog.set(x, L);
      if (src) { const keep = src.value.replace(/⏱[^|]*(\|\s*)?/, '').trim(), txt = '⏱ ' + L.join('/') + ' s'; src.value = keep ? txt + ' | ' + keep : txt;
        src.dispatchEvent(new Event('input', { bubbles: true })); src.dispatchEvent(new Event('change', { bubbles: true })); if (x === ex) noteW.value = src.value; }
      const r = $('.res77 input', x); if (r) { r.value = String(Math.max(...L)); r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); } }
    function holdTick() { const r = $('.hold77', root), H = ex && holdOf(ex); if (!r || !H || !holdT0) return; const s = Math.floor((Date.now() - holdT0) / 1000);
      $('.hc', r).textContent = mmss(s); if (H.tgt) r.style.setProperty('--f', Math.min(1, s / H.tgt).toFixed(3));
      if (H.tgt && s >= H.tgt - 3 && s < H.tgt && holdBeep !== s) { holdBeep = s; tick321(); }
      if (H.tgt && s >= H.tgt && !holdHit) { holdHit = true; r.classList.add('hit'); goBeep(); } }
    const parse = x => { const t = ($('.p', x)?.textContent || '').replace(/ /g, ' '); const m = t.match(/(\d+)\s*(?:sets?|rounds?)/i) || t.match(/^(\d+)\s*×/); const r = t.match(/rest\s*(\d+)/i); return { sets: m ? +m[1] : 1, rest: r ? +r[1] : 0, target: (t.match(/×\s*([^·]+)/) || [, ''])[1].trim() }; };
    const isOpen = x => x && !$('input', x).checked && !x.classList.contains('skip');
    const sib = (x, d) => { let s = x[d]; while (s && !s.matches('label.ex')) { if (s.matches('.sh, .blk')) return null; s = s[d]; } return s; };
    const ssHead = x => /SUPERSET/i.test($('.p', x)?.textContent || ''), ssIn = x => /done INSIDE/i.test($('.p', x)?.textContent || '');
    /* superset pair: first card's .p says "SUPERSET — NO rest after this", second says "done INSIDE the … superset" */
    function pairOf(x) { let A = null, B = null;
      if (ssHead(x)) { A = x; B = sib(x, 'nextElementSibling'); } else if (ssIn(x)) { B = x; A = sib(x, 'previousElementSibling'); }
      return A && B && ssHead(A) && ssIn(B) && isOpen(A) && isOpen(B) ? [A, B] : null; }
    /* open cards in this block family, in order, starting AFTER the current exercise (then wrapping to earlier unfinished ones) */
    const allEx = () => { const inAm = !!(ex && ex.closest('.blk.am')), fam = $$('label.ex', today).filter(x => (!!x.closest('.blk.am')) === inAm), last = seq.length ? seq[seq.length - 1].x : ex, k = fam.indexOf(last); return (k < 0 ? fam : fam.slice(k + 1).concat(fam.slice(0, k + 1))).filter(isOpen); };
    async function wake() { try { if ('wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } } catch (e) { lock = null; } }
    function unwake() { try { lock && lock.release(); } catch (e) {} lock = null; }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && root.classList.contains('on')) wake(); });
    function open(x) { audioOn(); holdT0 = 0; holdSide = 0; holdHit = false; build(x); root.classList.add('on'); wake(); draw(); }
    const noteW = $('.nt77', root);
    noteW.addEventListener('input', () => { const src = ex && $('input.nt', ex); if (src) { src.value = noteW.value; src.dispatchEvent(new Event('input', { bubbles: true })); } });
    noteW.addEventListener('change', () => { const src = ex && $('input.nt', ex); if (src) src.dispatchEvent(new Event('change', { bubbles: true })); });
    noteW.addEventListener('keydown', e => { if (e.key === 'Enter') noteW.blur(); });
    /* seq = every set in run order; a pair interleaves A1 B1 A2 B2 … then the longer one's leftover sets */
    function build(x) { const pr = pairOf(x); seq = []; si = 0;
      if (pr) { const [A, B] = pr, a = parse(A), b = parse(B); pairRest = Math.max(a.rest, b.rest);
        for (let i = 0; i < Math.max(a.sets, b.sets); i++) { if (i < a.sets) seq.push({ x: A, n: i, of: a.sets, pair: pr }); if (i < b.sets) seq.push({ x: B, n: i, of: b.sets, pair: pr }); }
      } else { const a = parse(x); pairRest = a.rest; for (let i = 0; i < a.sets; i++) seq.push({ x, n: i, of: a.sets }); }
      load(seq[0].x); }
    const restAfter = i => { const c = seq[i], d = seq[i + 1]; return c.pair && d && c.x === c.pair[0] && d.x === c.pair[1] ? 0 : pairRest; };
    function load(x) { if (ex !== x) { ex = x; const src = $('input.nt', x); noteW.value = src ? src.value : '';
      const pts = $$('.pts li', x).map(li => '<li>' + li.innerHTML + '</li>').join(''), why = $('.w', x)?.innerHTML || '', up = $('.up', x)?.innerHTML || '';
      $('.info', root).innerHTML = (pts ? '<ol>' + pts + '</ol>' : '') + (why ? '<p class="why">' + why + '</p>' : '') + (up ? '<p class="up">' + up + '</p>' : ''); } }
    const nm = x => $('b', x)?.textContent || '';
    function draw() {
      if (!ex) return;
      const c = seq[si], sets = c.of, setNo = c.n + 1;
      const blk = ex.closest('.blk'), sh = (() => { let s = ex.previousElementSibling; while (s && !s.matches('.sh')) s = s.previousElementSibling; return s; })();
      $('.prog', root).style.setProperty('--p', getComputedStyle(today).getPropertyValue('--p'));
      $('.pct', root).textContent = $('.bar', today)?.dataset.pct || '';
      $('.blkname', root).textContent = ($('.bh span', blk)?.firstChild?.textContent || '') + (sh ? ' · ' + sh.textContent : '') + (c.pair ? ' · SUPERSET ' + (c.x === c.pair[0] ? 'A' : 'B') : '');
      $('.name', root).textContent = nm(ex); $('.rx', root).textContent = ($('.p', ex)?.textContent || '').replace(/ /g, ' ');
      $('.dots', root).innerHTML = Array.from({ length: sets }, (_, i) => `<i class="${i < c.n ? 'done' : i === c.n ? 'now' : ''}"></i>`).join('');
      const remain = Math.max(0, Math.ceil((restEnd - Date.now()) / 1000));
      if (remain > 0) {
        const f = Math.max(0, (restEnd - Date.now()) / (restTotal * 1000));
        $('.mid', root).innerHTML = `<div class="ring" style="--f:${f.toFixed(3)}"><div class="t">${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')}<small>rest, then ${fresh || c.pair ? nm(ex).toLowerCase() + (c.pair ? ' · set ' + setNo + ' of ' + sets : '') : 'set ' + setNo + ' of ' + sets}</small></div></div><div class="restbtns"><button data-a="add">+15 s</button><button data-a="skip">Skip rest</button></div>`;
        pillR.textContent = `Rest ${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, '0')} · back to set`;
        if (remain <= 3 && remain !== beeped) { beeped = remain; tick321(); }
      } else {
        const last = sets > 1 && setNo === sets, hold = last && /hold/i.test(($('.key', ex)?.textContent || '') + $$('.pts li', ex).map(l => l.textContent).join(' ')), H = holdOf(ex);
        const setTxt = `<span class="set">${sets > 1 ? 'Set ' + setNo + ' of ' + sets + (last ? ' · LAST' : '') : 'One go'}</span>`;
        if (H) { const run = holdT0 ? Math.floor((Date.now() - holdT0) / 1000) : 0;
          $('.mid', root).innerHTML = setTxt + `<div class="ring hold77${holdHit ? ' hit' : ''}" style="--f:${H.tgt ? Math.min(1, run / H.tgt).toFixed(3) : 0}"><div class="t"><span class="hc">${mmss(run)}</span><small>${H.tgt ? 'target ' + H.tgt + ' s · keeps counting' : 'count up'}${H.sides === 2 ? ' · ' + (holdSide ? 'second side' : 'first side') : ''}</small></div></div><div class="restbtns"><button data-a="hold" class="${holdT0 ? 'stop' : 'go'}">${holdT0 ? 'Stop · save' : 'Start hold'}</button></div>`;
        } else $('.mid', root).innerHTML = setTxt + `<span class="target">${parse(ex).target || ''}</span><span class="cue">${$('.key', ex)?.textContent || ''}</span>${hold ? '<span class="holdw">Last set: finish with the stretched hold</span>' : ''}`;
        if (restEnd && remain === 0) { restEnd = 0; beeped = 0; goBeep(); }
      }
      pillR.classList.toggle('on', remain > 0 && !root.classList.contains('on'));
      const nxt = seq[si + 1];
      if (nxt && nxt.x !== ex) $('.next', root).innerHTML = `<span>${restAfter(si) ? 'Then' : 'Straight into · no rest'}</span><b>${nm(nxt.x)} · set ${nxt.n + 1} of ${nxt.of}</b>`;
      else { const inSeq = new Set(seq.map(s => s.x)), nx = allEx().filter(x => !inSeq.has(x))[0]; $('.next', root).innerHTML = nx ? `<span>Next exercise</span><b>${nm(nx)}</b>` : ''; }
      $('.done .lbl', root).textContent = sets > 1 ? 'Set done' : 'Done';
      $('.done small', root).textContent = sets > 1 ? 'set ' + setNo + ' of ' + sets : (parse(ex).target || '');
    }
    root.addEventListener('click', e => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'add') { restEnd += 15000; restTotal += 15; beeped = 0; }
      if (a === 'skip') { restEnd = 0; beeped = 0; }
      if (a === 'hold' && ex) { const H = holdOf(ex);
        if (!holdT0) { holdT0 = Date.now(); holdHit = false; holdBeep = 0; tone(660, 0.08); }
        else { const s = Math.round((Date.now() - holdT0) / 1000); holdT0 = 0; holdHit = false; holdSave(ex, s);
          if (H && H.sides === 2 && !holdSide) holdSide = 1; else { holdSide = 0; $('.done', root).click(); return; } } }
      if (e.target.closest('.x')) { root.classList.remove('on'); if (!restEnd) unwake(); }
      if (e.target.closest('.done') && seq.length) {
        if (holdT0) { holdSave(ex, Math.round((Date.now() - holdT0) / 1000)); holdT0 = 0; } holdSide = 0; holdHit = false;
        vib(); const r = restAfter(si);
        if (si >= seq.length - 1) {
          new Set(seq.map(s => s.x)).forEach(x => { const cb = $('input[type=checkbox]', x); if (cb && !cb.checked) cb.click(); });
          const nx = allEx()[0];
          if (!nx) { root.classList.remove('on'); unwake(); return; }
          build(nx); fresh = true;
        } else { si++; load(seq[si].x); fresh = false; }
        restTotal = r || 1; restEnd = r ? Date.now() + r * 1000 : 0; beeped = 0;
      }
      draw();
    });
    pillR.onclick = () => { audioOn(); root.classList.add('on'); wake(); draw(); };
    setInterval(() => { if (restEnd) draw(); else if (holdT0) holdTick(); }, 250);
    return { open };
  })();
})();
