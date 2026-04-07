var S = { goal: 30 };
var fromSubmission = false;

/* ── Calc ────────────────────────────────── */
function getReq(g) {
  return {
    bread:      Math.ceil(g / 10),
    meat:       g * 2,
    cheese:     g,
    mustard:    Math.ceil(g / 50),
    bags:       Math.ceil(g / 50),
    chips:      Math.max(1, Math.floor(g / 20)),
    tangerines: Math.max(1, Math.floor(g / 20))
  };
}
/* calcItems — alias with meatOz field, used by canvas/copy functions */
function calcItems(g) {
  var r = getReq(g);
  return { bread: r.bread, meatOz: r.meat, cheese: r.cheese, mustard: r.mustard, bags: r.bags, chips: r.chips, tangerines: r.tangerines };
}

/* ── Render ──────────────────────────────── */
function renderCalc(doTick) {
  var g = S.goal, c = getReq(g);
  var vals = { 'v-bread': c.bread, 'v-meat': c.meat, 'v-cheese': c.cheese, 'v-mustard': c.mustard, 'v-bags': c.bags, 'v-chips': c.chips, 'v-tangerines': c.tangerines };
  Object.keys(vals).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (doTick && parseInt(el.textContent, 10) !== vals[id]) {
      tickTo(el, vals[id]);
    } else if (!doTick && el.textContent != vals[id]) {
      el.textContent = vals[id]; animPop(el);
    }
  });
  var sn = document.getElementById('sum-num');
  if (sn) {
    if (doTick && parseInt(sn.textContent, 10) !== g) {
      tickTo(sn, g);
    } else if (!doTick && sn.textContent != g) {
      sn.textContent = g; animPop(sn);
    }
  }
  postH();
}

function renderLogReceipt() {
  var lp = document.getElementById('log-plan-num');
  if (lp) lp.textContent = S.goal;
}

/* ── Goal controls ───────────────────────── */
function onGoalInput() {
  var v = parseInt(document.getElementById('goal-inp').value, 10);
  if (!isNaN(v) && v >= 5 && v <= 500) { S.goal = v; renderCalc(); }
}
function onGoalBlur() {
  var v = parseInt(document.getElementById('goal-inp').value, 10);
  if (isNaN(v) || v < 5) v = 5; if (v > 500) v = 500;
  S.goal = v; document.getElementById('goal-inp').value = v; renderCalc();
}
function stepGoal(d) {
  var inp = document.getElementById('goal-inp');
  var v = parseInt(inp.value, 10) || 0;
  S.goal = Math.max(5, Math.min(500, v + d));
  inp.value = S.goal;
  animPop(inp);
  renderCalc(true); /* tick mode — vigorous counter animation */
}

/* ── Navigation ──────────────────────────── */
function switchView(id) {
  var views = ['view-main', 'view-log', 'view-impact'];
  var activeEl = null;
  views.forEach(function(v) {
    var el = document.getElementById(v);
    if (el.classList.contains('active') && !el.classList.contains('view-exit')) activeEl = el;
  });
  var nextEl = document.getElementById(id);
  if (activeEl === nextEl) return;
  if (activeEl) {
    activeEl.classList.add('view-exit');
    activeEl.addEventListener('animationend', function onExit() {
      activeEl.classList.remove('active', 'view-exit');
      activeEl.removeEventListener('animationend', onExit);
    });
    setTimeout(function() { nextEl.classList.add('active'); postH(); }, 160);
  } else {
    nextEl.classList.add('active');
    postH();
  }
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'scroll', y: 0 }, '*');
  }
}
function showMain() {
  fromSubmission = false;
  switchView('view-main');
}
function showLog() {
  renderLogReceipt();
  var saved = localStorage.getItem('ftc_email');
  if (saved) { var em = document.getElementById('log-email'); if (em) em.value = saved; }
  switchView('view-log');
}
function showImpact(fromSub) {
  fromSubmission = !!fromSub;
  var cel = document.getElementById('cel-banner');
  if (cel) {
    cel.style.display = fromSub ? 'block' : 'none';
    if (fromSub) {
      var cn = document.getElementById('cel-num');
      if (cn) cn.textContent = S.goal;
    }
  }
  switchView('view-impact');
  updateImpact();
}
function tryImpact() {
  if (!localStorage.getItem('ftc_email')) { showLog(); return; }
  showImpact(false);
}

/* ── Submit ──────────────────────────────── */
function handleSubmit() {
  var email = document.getElementById('log-email').value.trim();
  var city  = document.getElementById('log-chapter').value;
  var ok = true;
  var eEl = document.getElementById('log-email'), eErr = document.getElementById('email-err');
  if (!email || !email.includes('@') || !email.includes('.')) {
    eEl.classList.add('err'); eErr.classList.add('show'); ok = false;
  } else { eEl.classList.remove('err'); eErr.classList.remove('show'); }
  var cErr = document.getElementById('chapter-err');
  if (!city) { cErr.classList.add('show'); ok = false; }
  else { cErr.classList.remove('show'); }
  if (!ok) return;
  localStorage.setItem('ftc_email', email);
  var logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  logs.push({ meals: S.goal, date: new Date().toLocaleDateString(), chapter: city });
  localStorage.setItem('ftc_logs', JSON.stringify(logs));
  var impBtn = document.getElementById('btn-view-impact'); if (impBtn) impBtn.style.display = '';
  showImpact(true);
}

/* ── Copy ────────────────────────────────── */
function handleCopy() {
  var g = S.goal, c = calcItems(g);
  var lines = [
    '🛒 FEED THE CITY — GROCERY LIST',
    '🥪 ' + g + ' Sandwiches',
    '─────────────────────────────',
    '☐ Sliced Bread: '   + c.bread   + (c.bread===1   ? ' loaf'    : ' loaves'),
    '☐ Deli Meat: '      + c.meatOz  + ' oz total',
    '☐ Sliced Cheese: '  + c.cheese  + (c.cheese===1  ? ' slice'   : ' slices'),
    '☐ Yellow Mustard: ' + c.mustard + (c.mustard===1 ? ' bottle'  : ' bottles'),
    '☐ Sandwich Bags: '  + c.bags    + (c.bags===1    ? ' box'     : ' boxes')
  ];
  if (c.chips > 0)      lines.push('☐ Chips: '      + c.chips      + (c.chips===1      ? ' bag' : ' bags'));
  if (c.tangerines > 0) lines.push('☐ Tangerines: ' + c.tangerines + (c.tangerines===1 ? ' bag' : ' bags') + ' (3 lb)');
  lines.push('', '🧡 Feed the City');
  var ta = document.createElement('textarea');
  ta.value = lines.join('\n'); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;pointer-events:none';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  var btn = document.getElementById('btn-copy');
  btn.textContent = 'Copied!'; btn.classList.add('ok');
  setTimeout(function() { btn.textContent = 'Copy List'; btn.classList.remove('ok'); }, 2200);
}

/* ── Save Image ──────────────────────────── */
function handleSave() {
  var btn = document.getElementById('btn-save');
  if (btn) { btn.textContent = 'Building…'; btn.disabled = true; }
  document.fonts.ready.then(function() {
    var canvas = buildCanvas();
    canvas.toBlob(function(blob) {
      if (btn) {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Save Image';
        btn.disabled = false;
      }
      var file = new File([blob], 'ftc-shopping-list.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Feed the City Shopping List' }).catch(function(err) {
          if (err.name !== 'AbortError') downloadCanvas(canvas);
        });
      } else { downloadCanvas(canvas); }
    }, 'image/png');
  });
}
function downloadCanvas(canvas) {
  var a = document.createElement('a');
  a.download = 'ftc-shopping-list.png'; a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
/* ── Canvas helpers ─────────────────────────── */
function _pill(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath(); ctx.fill();
}
function _wrap(ctx, text, x, y, maxW, lineH) {
  var words = text.split(' '), line = '';
  for (var i = 0; i < words.length; i++) {
    var test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) { ctx.fillText(line.trim(), x, y); line = words[i] + ' '; y += lineH; }
    else { line = test; }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, y);
}

function buildCanvas() {
  var g = S.goal, c = calcItems(g);
  var DPR = 2;
  var W = 900, PAD = 72;
  var ORANGE = '#FF6500', NAVY = '#003366',
      WHITE = '#FFFFFF', OFF = '#FAFBFC', BORDER = '#EAECF0', MUTED = '#8894A4', TEXT = '#0F1F35';

  var mainRows = [
    { n:'Sliced Bread',    q:c.bread,   u:c.bread===1   ?'loaf':'loaves'   },
    { n:'Deli Meat',       q:c.meatOz,  u:'oz'                             },
    { n:'Sliced Cheese',   q:c.cheese,  u:c.cheese===1  ?'slice':'slices'  },
    { n:'Yellow Mustard',  q:c.mustard, u:c.mustard===1 ?'bottle':'bottles' },
    { n:'Sandwich Bags',   q:c.bags,    u:c.bags===1    ?'box':'boxes'     }
  ];
  var snackRows = [];
  if (c.chips > 0)      snackRows.push({ n:'Chips',      q:c.chips,      u:c.chips===1      ?'bag':'bags' });
  if (c.tangerines > 0) snackRows.push({ n:'Tangerines', q:c.tangerines, u:c.tangerines===1 ?'bag (3 lb)':'bags (3 lb)' });
  var hasSnacks = snackRows.length > 0;
  var allRows = mainRows.concat(hasSnacks ? snackRows : []);

  /* Layout constants */
  var HEADER_H = 200;
  var ITEM_H = 68;   /* generous whitespace per item */
  var SEC_GAP = 36;  /* gap before snack section */
  var FOOTER_H = 90;
  var bodyPadT = 48, bodyPadB = 56;

  var bodyH = bodyPadT
    + mainRows.length * ITEM_H
    + (hasSnacks ? SEC_GAP + snackRows.length * ITEM_H : 0)
    + bodyPadB;
  var H = HEADER_H + bodyH + FOOTER_H;

  var canvas = document.createElement('canvas');
  canvas.width = W*DPR; canvas.height = H*DPR;
  var ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  /* === BACKGROUND === */
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H);

  /* Subtle off-white body panel */
  ctx.fillStyle = OFF; ctx.fillRect(0, HEADER_H, W, bodyH);

  /* === HEADER: full-bleed dark navy === */
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, HEADER_H);

  /* Diagonal orange accent slab in top-right corner */
  ctx.save(); ctx.fillStyle = ORANGE; ctx.globalAlpha = 0.15;
  ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W, HEADER_H); ctx.lineTo(W * 0.55, HEADER_H); ctx.lineTo(W * 0.82, 0);
  ctx.closePath(); ctx.fill(); ctx.restore();

  /* Solid orange bottom strip to separate header from body */
  ctx.fillStyle = ORANGE; ctx.fillRect(0, HEADER_H - 4, W, 4);

  /* Brand eyebrow */
  ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.font = '700 11px "Open Sans"'; ctx.textAlign = 'left';
  ctx.fillText('FEED THE CITY  ·  TANGOCHARITIES.ORG', PAD, 42);

  /* Hero: giant number */
  ctx.fillStyle = ORANGE; ctx.font = 'bold 128px Anton'; ctx.textAlign = 'left';
  var numStr = String(g);
  var numW = ctx.measureText(numStr).width;
  ctx.fillText(numStr, PAD, 162);

  /* "SANDWICHES" right next to number */
  ctx.fillStyle = WHITE; ctx.font = 'bold 44px Anton';
  ctx.fillText(g === 1 ? ' SANDWICH' : ' SANDWICHES', PAD + numW + 4, 162);

  /* Subline */
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '600 12px "Open Sans"';
  ctx.fillText('Your Feed the City grocery list', PAD, 188);

  /* === BODY: clean minimal list === */
  var y = HEADER_H + bodyPadT;

  function drawItem(row, isLast) {
    var mid = y + ITEM_H / 2;

    /* Item name — left, clean typography */
    ctx.fillStyle = TEXT; ctx.font = '700 18px "Open Sans"'; ctx.textAlign = 'left';
    ctx.fillText(row.n, PAD, mid + 7);

    /* Quantity + unit — right, orange number */
    ctx.fillStyle = ORANGE; ctx.font = 'bold 34px Anton'; ctx.textAlign = 'right';
    ctx.fillText(String(row.q), W - PAD - 80, mid + 11);
    ctx.fillStyle = MUTED; ctx.font = '600 13px "Open Sans"'; ctx.textAlign = 'left';
    ctx.fillText(row.u, W - PAD - 72, mid + 13);

    /* Thin hairline divider (skip last item) */
    if (!isLast) {
      ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD, y + ITEM_H); ctx.lineTo(W - PAD, y + ITEM_H); ctx.stroke();
    }
    y += ITEM_H;
  }

  mainRows.forEach(function(row, i) { drawItem(row, i === mainRows.length - 1 && !hasSnacks); });

  if (hasSnacks) {
    /* Section gap with "SNACKS" label */
    y += SEC_GAP / 2;
    ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
    /* Label */
    ctx.fillStyle = MUTED; ctx.font = '700 10px "Open Sans"'; ctx.textAlign = 'left';
    ctx.fillText('ALSO BRING', PAD, y + 20);
    y += SEC_GAP / 2;
    snackRows.forEach(function(row, i) { drawItem(row, i === snackRows.length - 1); });
  }

  /* === FOOTER === */
  var fy = H - FOOTER_H;
  ctx.fillStyle = NAVY; ctx.fillRect(0, fy, W, FOOTER_H);
  ctx.fillStyle = ORANGE; ctx.fillRect(0, fy, W, 4);
  ctx.fillStyle = WHITE; ctx.font = 'bold 20px Anton'; ctx.textAlign = 'left';
  ctx.fillText('TANGOCHARITIES.ORG', PAD, fy + 36);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '600 11px "Open Sans"';
  ctx.fillText('Feed the City  ·  Thank you for showing up.', PAD, fy + 62);

  return canvas;
}

/* ── Impact Card Canvas (1080 × 1350 — Instagram 4:5) ── */
function buildImpactCanvas() {
  var logs   = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  var total  = logs.reduce(function(s, e) { return s + e.meals; }, 0);
  var events = logs.length;
  var city   = logs.length ? logs[logs.length - 1].chapter.split(',')[0] : 'Your City';

  var DPR = 2;
  var W = 1080, H = 1350;
  /* ── Strict brand palette: White, Orange, Sky Blue, Navy ── */
  var ORANGE = '#FF6500', NAVY = '#003366', SKY = '#3BAEE8', WHITE = '#FFFFFF';
  var SKY_PALE = 'rgba(59,174,232,0.10)', BORDER = 'rgba(0,51,102,0.09)';

  var msLabel, msDesc;
  if (total>=500)      { msLabel='500 MEAL LEGEND';    msDesc='Your commitment to this community is extraordinary.'; }
  else if (total>=250) { msLabel='250 MEALS SERVED';   msDesc="You've helped feed 250 people. That's the power of showing up."; }
  else if (total>=100) { msLabel='100 MEAL CLUB';      msDesc='One hundred people ate because of what you brought.'; }
  else if (total>=25)  { msLabel='FIRST CONTRIBUTOR';  msDesc="You showed up. That's everything."; }
  else                 { msLabel='COMMUNITY BUILDER';  msDesc='Every sandwich you pack goes directly to a family in your community.'; }

  var canvas = document.createElement('canvas');
  canvas.width = W*DPR; canvas.height = H*DPR;
  var ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  /* ── Pristine white background ── */
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, W, H);

  /* ── Sky blue geometric accent: large soft circle, bottom-right ── */
  ctx.save();
  var skyGrd = ctx.createRadialGradient(W*0.82, H*0.68, 0, W*0.82, H*0.68, 560);
  skyGrd.addColorStop(0, 'rgba(59,174,232,0.13)');
  skyGrd.addColorStop(1, 'rgba(59,174,232,0)');
  ctx.fillStyle = skyGrd; ctx.fillRect(0, 0, W, H);
  ctx.restore();

  /* ── Orange accent arc, top-left ── */
  ctx.save();
  var orngGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, 320);
  orngGrd.addColorStop(0, 'rgba(255,101,0,0.09)');
  orngGrd.addColorStop(1, 'rgba(255,101,0,0)');
  ctx.fillStyle = orngGrd; ctx.fillRect(0, 0, W, H);
  ctx.restore();

  /* ── Top orange bar ── */
  ctx.fillStyle = ORANGE; ctx.fillRect(0, 0, W, 8);

  /* ── Brand wordmark ── */
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,51,102,0.35)'; ctx.font = '700 13px "Open Sans"';
  ctx.fillText('FEED THE CITY  ·  TANGOCHARITIES.ORG', W/2, 54);

  /* ── City badge (navy pill) ── */
  var cTxt = city.toUpperCase(); ctx.font = '800 17px "Open Sans"';
  var cW = ctx.measureText(cTxt).width + 60, cH = 50;
  _pill(ctx, W/2-cW/2, 72, cW, cH, 25, NAVY);
  ctx.fillStyle = WHITE; ctx.font = '800 17px "Open Sans"'; ctx.textAlign = 'center';
  ctx.fillText(cTxt, W/2, 72+34);

  /* ── Thin separator ── */
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W*0.12, 148); ctx.lineTo(W*0.88, 148); ctx.stroke();

  /* ── Sky blue soft radial glow behind the hero number ── */
  ctx.save();
  var heroGrd = ctx.createRadialGradient(W/2, 560, 60, W/2, 560, 420);
  heroGrd.addColorStop(0, 'rgba(59,174,232,0.22)');
  heroGrd.addColorStop(0.5, 'rgba(59,174,232,0.08)');
  heroGrd.addColorStop(1, 'rgba(59,174,232,0)');
  ctx.fillStyle = heroGrd; ctx.beginPath(); ctx.arc(W/2, 560, 420, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  /* ── "YOU FED" eyebrow ── */
  ctx.fillStyle = 'rgba(0,51,102,0.38)'; ctx.font = '800 28px "Open Sans"'; ctx.textAlign = 'center';
  ctx.fillText('YOU  FED', W/2, 210);

  /* ── Massive orange hero number ── */
  var totalStr = String(total || 0);
  var heroSize = totalStr.length>=5?220:totalStr.length>=4?280:totalStr.length>=3?360:450;
  var numY = 230 + heroSize*0.82;

  /* Sky blue drop shadow layer (offset + blur effect) */
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = SKY; ctx.font = 'bold '+heroSize+'px Anton'; ctx.textAlign = 'center';
  ctx.fillText(totalStr, W/2+6, numY+10);
  ctx.restore();

  ctx.fillStyle = ORANGE; ctx.font = 'bold '+heroSize+'px Anton'; ctx.textAlign = 'center';
  ctx.fillText(totalStr, W/2, numY);

  /* ── "MEALS" in heavy navy ── */
  ctx.fillStyle = NAVY; ctx.font = 'bold 84px Anton'; ctx.textAlign = 'center';
  ctx.fillText('MEALS', W/2, numY+108);

  /* ── Subtext ── */
  ctx.fillStyle = 'rgba(0,51,102,0.42)'; ctx.font = '600 21px "Open Sans"'; ctx.textAlign = 'center';
  ctx.fillText('contributed across '+events+(events===1?' event':' events'), W/2, numY+160);

  /* ── Thin separator ── */
  var divY = numY+196;
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W*0.15, divY); ctx.lineTo(W*0.85, divY); ctx.stroke();

  /* ── Milestone badge (orange pill) ── */
  var badgeY = divY+28;
  _pill(ctx, W/2-270, badgeY, 540, 68, 34, ORANGE);
  ctx.fillStyle = WHITE; ctx.font = 'bold 28px Anton'; ctx.textAlign = 'center';
  ctx.fillText(msLabel, W/2, badgeY+46);

  /* ── Milestone description ── */
  ctx.fillStyle = 'rgba(0,51,102,0.48)'; ctx.font = 'italic 600 19px "Open Sans"'; ctx.textAlign = 'center';
  _wrap(ctx, msDesc, W/2, badgeY+110, 840, 32);

  /* ── Stats trio on sky-blue tint bento card ── */
  var statsTop = H-310;
  /* Stats tinted bento card — fill + separate stroke pill */
  _pill(ctx, 52, statsTop, W-104, 154, 20, 'rgba(59,174,232,0.09)');
  /* Stroke border using same pill path */
  ctx.save(); ctx.strokeStyle='rgba(59,174,232,0.20)'; ctx.lineWidth=1;
  ctx.beginPath();
  (function(x,y,w,h,r){ ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath(); })(52,statsTop,W-104,154,20);
  ctx.stroke(); ctx.restore();

  [
    { val: String(total||0), lbl: 'MEALS SERVED', x: W/2-240 },
    { val: String(events),   lbl: 'EVENTS',       x: W/2     },
    { val: city.split(' ')[0], lbl: 'CITY',        x: W/2+240 }
  ].forEach(function(st, i) {
    if (i>0) {
      ctx.strokeStyle = 'rgba(59,174,232,0.22)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(st.x-120, statsTop+22); ctx.lineTo(st.x-120, statsTop+126); ctx.stroke();
    }
    ctx.fillStyle = ORANGE; ctx.font = 'bold 46px Anton'; ctx.textAlign = 'center';
    ctx.fillText(st.val, st.x, statsTop+72);
    ctx.fillStyle = 'rgba(0,51,102,0.42)'; ctx.font = '700 11px "Open Sans"';
    ctx.fillText(st.lbl, st.x, statsTop+100);
  });

  /* ── Navy footer ── */
  ctx.fillStyle = NAVY; ctx.fillRect(0, H-140, W, 140);
  ctx.fillStyle = ORANGE; ctx.fillRect(0, H-140, W, 4);
  ctx.fillStyle = WHITE; ctx.font = 'bold 28px Anton'; ctx.textAlign = 'center';
  ctx.fillText('TANGOCHARITIES.ORG', W/2, H-82);
  ctx.fillStyle = 'rgba(255,255,255,0.42)'; ctx.font = '600 15px "Open Sans"';
  ctx.fillText('Thank you for showing up, month after month.', W/2, H-52);

  return canvas;
}

function handleImpactSave() {
  var btn = document.getElementById('btn-impact-save');
  if (btn) { btn.textContent = 'Building…'; btn.disabled = true; }
  document.fonts.ready.then(function() {
    var canvas = buildImpactCanvas();
    canvas.toBlob(function(blob) {
      if (btn) { btn.textContent = 'Download My Impact Card'; btn.disabled = false; }
      var logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
      var citySuffix = logs.length ? '-' + logs[logs.length-1].chapter.split(',')[0].toLowerCase().replace(/\s+/g, '-') : '';
      var filename = 'ftc-impact' + citySuffix + '-' + new Date().toISOString().slice(0, 10) + '.png';
      var file = new File([blob], filename, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'My Feed the City Impact' }).catch(function(err) {
          if (err.name !== 'AbortError') { var a = document.createElement('a'); a.download = filename; a.href = URL.createObjectURL(blob); document.body.appendChild(a); a.click(); document.body.removeChild(a); }
        });
      } else {
        var a = document.createElement('a'); a.download = filename; a.href = URL.createObjectURL(blob);
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
    }, 'image/png');
  });
}

/* ── Impact ──────────────────────────────── */
function updateImpact() {
  var logs  = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  var total = logs.reduce(function(s,e){ return s+e.meals; }, 0);
  var prevTotal = fromSubmission ? Math.max(0, total - S.goal) : total;

  /* Empty / first-time state */
  var emptyEl   = document.getElementById('impact-empty');
  var sections  = ['.scorecard', '.journey', '.ms-lbl', '.ms-list', '.hist-details'];
  var isEmpty   = !logs.length;
  if (emptyEl) emptyEl.style.display = isEmpty ? 'block' : 'none';
  sections.forEach(function(sel) {
    var el = document.querySelector(sel);
    if (el) el.style.display = isEmpty ? 'none' : '';
  });
  if (isEmpty) return;

  setText('stat-meals',  total);
  setText('stat-events', logs.length);
  var chapters={};
  logs.forEach(function(l){ chapters[l.chapter]=(chapters[l.chapter]||0)+1; });
  var top=Object.keys(chapters).length?Object.keys(chapters).reduce(function(a,b){return chapters[a]>chapters[b]?a:b;}):'—';
  setText('stat-city', top.split(',')[0]);
  var thresholds=[25,100,250,500], nxt=thresholds.find(function(t){return total<t;})||500;
  /* Circular ring + counter animation — synced over 1.5s cubic-bezier */
  var CIRC = 2 * Math.PI * 64; /* circumference for r=64 */
  var ringArc = document.getElementById('ring-arc');
  if (ringArc) {
    ringArc.setAttribute('stroke-dasharray', CIRC);
    ringArc.style.strokeDashoffset = CIRC; /* start empty */
    var pct = Math.min(1, total / nxt);
    setTimeout(function() {
      ringArc.style.strokeDashoffset = CIRC * (1 - pct);
    }, 80);
  }
  /* Count-up animation: 0 → total over 1500ms — mirrors ring draw speed */
  (function() {
    var el = document.getElementById('j-cur');
    if (!el) return;
    el.textContent = '0';
    var dur = 1500;
    setTimeout(function() {
      var startTs = null;
      requestAnimationFrame(function step(ts) {
        if (!startTs) startTs = ts;
        var p = Math.min((ts - startTs) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
        el.textContent = Math.round(eased * total);
        if (p < 1) requestAnimationFrame(step);
      });
    }, 80);
  })();
  setText('j-nxt', nxt);
  setText('j-nxt-lbl', nxt < 500 ? 'Next: '+nxt+' meals' : 'All milestones reached!');
  var msg;
  if      (total >= 500) msg = "You've personally fed " + total + " people. Your commitment to this community is extraordinary.";
  else if (total >= 100) msg = "You've personally fed " + total + " people. That's the power of showing up, month after month.";
  else if (total >= 25)  msg = "You've personally fed " + total + " people so far. Keep going — every meal matters.";
  else                   msg = "Every sandwich you pack goes directly to a family in your community.";
  setText('j-msg', msg);
  /* Show only the "one you're at" and the "next one" */
  var allMs=[25,100,250,500];
  var reachedMs = null, nextMs = null;
  for(var i=allMs.length-1; i>=0; i--) { if(total>=allMs[i]){ reachedMs=allMs[i]; break; } }
  for(var i=0; i<allMs.length; i++) { if(total<allMs[i]){ nextMs=allMs[i]; break; } }
  
  var visibleMs = [];
  if (reachedMs) visibleMs.push(reachedMs);
  if (nextMs) visibleMs.push(nextMs);

  allMs.forEach(function(t){
    var el=document.getElementById('m-'+t); if(!el) return;
    el.classList.remove('has-line'); // reset line class

    if (visibleMs.indexOf(t) !== -1) {
      el.style.display='';
      el.classList.toggle('reached', total>=t);
      el.classList.toggle('active',  t===nextMs);

      // if it's the first of 2 items, give it the connecting line downwards
      if (visibleMs.length === 2 && t === visibleMs[0]) {
        el.classList.add('has-line');
      }

      /* Force-restart the slide-up animation */
      el.style.animation = 'none';
      void el.offsetHeight; /* trigger reflow */
      el.style.animation = 'ms-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) both';
      el.style.animationDelay = (visibleMs.indexOf(t) * 90) + 'ms';

      /* Milestone burst — fire only on milestones just crossed this session */
      if (fromSubmission && prevTotal < t && total >= t) {
        el.classList.remove('just-reached');
        void el.offsetHeight;
        el.classList.add('just-reached');
        setTimeout(function() { el.classList.remove('just-reached'); }, 1400);
      }
    } else {
      el.style.display='none';
    }
  });
  var h='';
  if(!logs.length) { h='<p class="hist-empty">No contributions logged yet.</p>'; }
  else {
    logs.slice().reverse().slice(0,10).forEach(function(l,di){
      var origIdx=logs.length-1-di;
      h+='<div class="hist-row">'
        +'<div class="hist-badge">'+(di+1)+'</div>'
        +'<div class="hist-info"><div class="hist-city">'+esc(l.chapter.split(',')[0])+'</div><div class="hist-date">'+esc(l.date)+'</div></div>'
        +'<div class="hist-right"><span class="hist-meals">'+l.meals+'</span><span class="hist-meals-lbl">meals</span></div>'
        +'<button class="hist-del" onclick="deleteLog('+origIdx+')" aria-label="Delete entry">✕</button>'
        +'</div>';
    });
  }
  var hl=document.getElementById('hist-list'); if(hl)hl.innerHTML=h;
}

function deleteLog(index) {
  var logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  logs.splice(index, 1);
  localStorage.setItem('ftc_logs', JSON.stringify(logs));
  updateImpact();
}

function logout() {
  localStorage.removeItem('ftc_email'); localStorage.removeItem('ftc_logs');
  var btn=document.getElementById('btn-view-impact'); if(btn) btn.style.display='none';
  showMain();
}

/* ── City Picker ─────────────────────────── */
var _cityOpen = false;
function initCityPicker() {
  var select = document.getElementById('log-chapter');
  var list   = document.getElementById('city-list');
  if (!select || !list) return;
  var defaultVal = select.options[select.selectedIndex].value;
  Array.from(select.options).forEach(function(opt) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'city-option' + (opt.value === defaultVal ? ' city-selected' : '');
    btn.textContent = opt.value;
    btn.setAttribute('data-value', opt.value);
    btn.addEventListener('click', function() { selectCity(opt.value); });
    list.appendChild(btn);
  });
  var disp = document.getElementById('city-display');
  if (disp) disp.textContent = defaultVal;
}
function toggleCityPicker() { _cityOpen ? closeCityPicker() : openCityPicker(); }
function openCityPicker() {
  _cityOpen = true;
  var picker = document.getElementById('city-picker');
  if (picker) { picker.classList.add('open'); picker.setAttribute('aria-expanded','true'); }
  var s = document.getElementById('city-search'); if (s) { s.value = ''; s.focus(); }
  filterCities('');
  setTimeout(function() { document.addEventListener('click', cityOutside, true); }, 0);
}
function closeCityPicker() {
  _cityOpen = false;
  var picker = document.getElementById('city-picker');
  if (picker) { picker.classList.remove('open'); picker.setAttribute('aria-expanded','false'); }
  document.removeEventListener('click', cityOutside, true);
}
function cityOutside(e) {
  var picker = document.getElementById('city-picker');
  if (picker && !picker.contains(e.target)) closeCityPicker();
}
function selectCity(val) {
  var select = document.getElementById('log-chapter');
  if (select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === val) { select.selectedIndex = i; break; }
    }
  }
  var disp = document.getElementById('city-display');
  if (disp) disp.textContent = val;
  document.querySelectorAll('.city-option').forEach(function(btn) {
    btn.classList.toggle('city-selected', btn.getAttribute('data-value') === val);
  });
  var cErr = document.getElementById('chapter-err');
  if (cErr) cErr.classList.remove('show');
  closeCityPicker();
}
function filterCities(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.city-option').forEach(function(btn) {
    btn.classList.toggle('city-hidden', q !== '' && btn.textContent.toLowerCase().indexOf(q) === -1);
  });
}

/* ── Helpers ─────────────────────────────── */
function setText(id,v){ var el=document.getElementById(id); if(el)el.textContent=v; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function animPop(el){ el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
function postH(){ if(window.parent)window.parent.postMessage({type:'resize',height:document.body.scrollHeight},'*'); }

/* ── Liquid fast-tick counter ─────────────── */
function tickTo(el, target) {
  var start = parseInt(el.textContent, 10) || 0;
  target = parseInt(target, 10);
  if (start === target) return;
  var steps = Math.min(10, Math.max(3, Math.abs(target - start)));
  var dur = 190;
  var step = 0;
  if (el._ticker) { clearInterval(el._ticker); el._ticker = null; }
  el._ticker = setInterval(function() {
    step++;
    if (step >= steps) {
      clearInterval(el._ticker); el._ticker = null;
      el.textContent = target;
      animPop(el);
    } else {
      var frac = step / steps;
      el.textContent = Math.round(start + (target - start) * frac);
    }
  }, Math.round(dur / steps));
}

window.addEventListener('load', function() {
  var saved=localStorage.getItem('ftc_email');
  if(saved){ var em=document.getElementById('log-email'); if(em)em.value=saved; }
  /* Show "View my impact history" only if user has logged in before */
  var impBtn=document.getElementById('btn-view-impact');
  if(impBtn) impBtn.style.display=saved?'':'none';
  initCityPicker();
  /* Restore last-used chapter city */
  var logs=JSON.parse(localStorage.getItem('ftc_logs')||'[]');
  if(logs.length){ selectCity(logs[logs.length-1].chapter); }
  renderCalc();
});
window.addEventListener('resize', postH);
