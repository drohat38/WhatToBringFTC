/* ─────────────────────────────────────────────────────────────────────────────
   Feed the City — Planner v2
   Single-page. No view system. Uses shared/chapters.js.
   ───────────────────────────────────────────────────────────────────────────── */
'use strict';

var S = { goal: 30 };
var currentChapter = null; // { slug, name } — set by readChapterParam()

/* ─────────────────────────────────────────────────────────────────────────────
   INGREDIENT DEFINITIONS
   ───────────────────────────────────────────────────────────────────────────── */
var ITEMS = [
  {
    key: 'bread',
    emoji: '🍞',
    name: 'Sliced Bread',
    desc: 'Wheat or whole grain preferred',
    baseUnit: 'loaf',
    pluralUnit: 'loaves',
  },
  {
    key: 'meat',
    emoji: '🥩',
    name: 'Deli Meat',
    desc: 'Pre-packaged only — turkey, chicken, or ham. Organic preferred. No deli counter meat.',
    baseUnit: 'oz',
    pluralUnit: 'oz',
  },
  {
    key: 'cheese',
    emoji: '🧀',
    name: 'Sliced Cheese',
    desc: 'Real sliced cheese. Not processed cheese or cheese product.',
    baseUnit: 'slice',
    pluralUnit: 'slices',
  },
  {
    key: 'mustard',
    emoji: '🟡',
    name: 'Yellow Mustard',
    desc: 'No spicy mustard or mayo.',
    baseUnit: 'bottle',
    pluralUnit: 'bottles',
  },
  {
    key: 'bags',
    emoji: '🛍️',
    name: 'Sandwich Bags',
    desc: 'Must zip. Not fold-over bags.',
    baseUnit: 'box',
    pluralUnit: 'boxes',
  },
];

var ALSO_ITEMS = [
  {
    key: 'chips',
    emoji: '🥔',
    name: 'Chips',
    desc: 'Full-size bags only. Healthier oils preferred (avocado, olive). No snack-size bags.',
    baseUnit: 'bag',
    pluralUnit: 'bags',
  },
  {
    key: 'tangerines',
    emoji: '🍊',
    name: 'Tangerines',
    desc: 'Halos or Cuties · 3 lb bags.',
    baseUnit: 'bag (3 lb)',
    pluralUnit: 'bags (3 lb)',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   QUANTITY FORMULAS
   ───────────────────────────────────────────────────────────────────────────── */
function getReq(g) {
  return {
    bread:      Math.ceil(g / 10),
    meat:       g * 2,
    cheese:     g,
    mustard:    Math.ceil(g / 50),
    bags:       Math.ceil(g / 50),
    chips:      Math.max(1, Math.floor(g / 20)),
    tangerines: Math.max(1, Math.floor(g / 20)),
  };
}

function getUnit(item, val) {
  return val === 1 ? item.baseUnit : item.pluralUnit;
}

/* ─────────────────────────────────────────────────────────────────────────────
   DOM HELPERS
   ───────────────────────────────────────────────────────────────────────────── */
function qs(sel) { return document.querySelector(sel); }
function el(id)  { return document.getElementById(id); }

function animPop(elem) {
  if (!elem) return;
  elem.classList.remove('popping');
  void elem.offsetWidth; // reflow
  elem.classList.add('popping');
  elem.addEventListener('animationend', function handler() {
    elem.classList.remove('popping');
    elem.removeEventListener('animationend', handler);
  });
}

function tickTo(elem, target) {
  if (!elem) return;
  var cur = parseInt(elem.textContent, 10);
  if (isNaN(cur) || cur === target) { elem.textContent = target; return; }
  var steps = Math.min(8, Math.abs(target - cur));
  var inc = (target - cur) / steps;
  var i = 0;
  var t = setInterval(function() {
    i++;
    elem.textContent = (i < steps) ? Math.round(cur + inc * i) : target;
    if (i >= steps) clearInterval(t);
  }, 28);
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUILD INGREDIENT ROWS (JS-rendered)
   ───────────────────────────────────────────────────────────────────────────── */
function buildRows(items, listId) {
  var list = el(listId);
  if (!list) return;
  list.innerHTML = '';
  items.forEach(function(item) {
    var li = document.createElement('li');
    li.className = 'ing-row';
    li.setAttribute('data-key', item.key);
    li.innerHTML =
      '<span class="ing-emoji" aria-hidden="true">' + item.emoji + '</span>' +
      '<div class="ing-info">' +
        '<span class="ing-name">' + item.name + '</span>' +
        '<span class="ing-desc">' + item.desc + '</span>' +
      '</div>' +
      '<div class="ing-qty">' +
        '<span class="ing-qty-num" id="qty-' + item.key + '">—</span>' +
        '<span class="ing-qty-unit" id="qty-unit-' + item.key + '">' + item.baseUnit + '</span>' +
      '</div>';
    list.appendChild(li);
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER QUANTITIES
   ───────────────────────────────────────────────────────────────────────────── */
function renderCalc(doTick) {
  var r = getReq(S.goal);
  var allItems = ITEMS.concat(ALSO_ITEMS);

  allItems.forEach(function(item) {
    var numEl  = el('qty-' + item.key);
    var unitEl = el('qty-unit-' + item.key);
    var val    = r[item.key];
    if (numEl) {
      if (doTick) { tickTo(numEl, val); animPop(numEl); }
      else numEl.textContent = val;
    }
    if (unitEl) unitEl.textContent = getUnit(item, val);
  });

  // Goal display
  var goalEl = el('goal-display');
  if (goalEl) {
    if (doTick) { tickTo(goalEl, S.goal); animPop(goalEl); }
    else goalEl.textContent = S.goal;
  }

  // Hint
  var hintEl = el('goal-hint');
  if (hintEl) hintEl.textContent = 'Enough to feed ~' + Math.round(S.goal / 2) + ' families';

  // Sync hidden input
  var inp = el('goal-input');
  if (inp) inp.value = S.goal;

  postH();
}

/* ─────────────────────────────────────────────────────────────────────────────
   GOAL CONTROLS
   ───────────────────────────────────────────────────────────────────────────── */
function stepGoal(d) {
  S.goal = Math.max(5, Math.min(500, S.goal + d));
  renderCalc(true);
}

/* ─────────────────────────────────────────────────────────────────────────────
   IFRAME HEIGHT (Wix postMessage)
   ───────────────────────────────────────────────────────────────────────────── */
function postH() {
  try {
    window.parent.postMessage(
      { type: 'ftc:resize', height: document.body.scrollHeight + 16 },
      '*'
    );
  } catch(e) { /* no-op outside iframe */ }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER PARAM → CITY LOCKING
   ───────────────────────────────────────────────────────────────────────────── */
function readChapterParam() {
  var params = new URLSearchParams(window.location.search);
  var slug   = params.get('chapter');
  if (slug && typeof getChapter === 'function') {
    var ch = getChapter(slug);
    if (ch) { currentChapter = ch; lockCity(ch); return; }
  }
  showCityPicker();
}

function lockCity(ch) {
  var badge = el('city-badge');
  var wrap  = el('city-picker-wrap');
  if (badge) { badge.textContent = ch.name; badge.classList.remove('hidden'); }
  if (wrap)  { wrap.classList.add('hidden'); }
}

function showCityPicker() {
  var badge = el('city-badge');
  var wrap  = el('city-picker-wrap');
  if (badge) badge.classList.add('hidden');
  if (wrap)  { wrap.classList.remove('hidden'); initCityPicker(); }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CITY PICKER (only when no ?chapter= param)
   ───────────────────────────────────────────────────────────────────────────── */
function initCityPicker() {
  var sel  = el('city-select');
  var opts = el('city-options');
  if (!sel || !opts || typeof CHAPTERS === 'undefined') return;

  sel.innerHTML  = '<option value="">Select city…</option>';
  opts.innerHTML = '';

  CHAPTERS.forEach(function(ch) {
    // Hidden <select> option
    var opt = document.createElement('option');
    opt.value = ch.slug; opt.textContent = ch.name;
    sel.appendChild(opt);

    // Custom list item
    var li = document.createElement('li');
    li.textContent = ch.name;
    li.setAttribute('data-slug', ch.slug);
    li.setAttribute('role', 'option');
    li.onclick = function() { selectCity(ch.slug, ch.name); };
    opts.appendChild(li);
  });

  // Restore last-used city
  var logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  if (logs.length > 0) {
    var last = logs[logs.length - 1];
    if (last.chapter) selectCity(last.chapter, '');
  }
}

function openCityPicker() {
  var dd = el('city-dropdown');
  if (!dd) return;
  var opening = !dd.classList.contains('open');
  dd.classList.toggle('open', opening);
  if (opening) {
    var srch = el('city-search');
    if (srch) { srch.value = ''; filterCities(''); setTimeout(function() { srch.focus(); }, 60); }
  }
  postH();
}

function closeCityPicker() {
  var dd = el('city-dropdown');
  if (dd) dd.classList.remove('open');
}

function filterCities(q) {
  var lq   = q.toLowerCase();
  var lis  = document.querySelectorAll('#city-options li');
  lis.forEach(function(li) {
    li.style.display = li.textContent.toLowerCase().indexOf(lq) !== -1 ? '' : 'none';
  });
}

function selectCity(slug, name) {
  if (!name && typeof CHAPTERS !== 'undefined') {
    var found = CHAPTERS.find(function(c) { return c.slug === slug; });
    if (found) name = found.name;
  }
  currentChapter = { slug: slug, name: name || slug };

  var label = el('city-label');
  if (label) label.textContent = name || slug;

  var sel = el('city-select');
  if (sel) sel.value = slug;

  // Highlight active
  var lis = document.querySelectorAll('#city-options li');
  lis.forEach(function(li) {
    li.classList.toggle('active', li.getAttribute('data-slug') === slug);
  });

  closeCityPicker();
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXPAND LOG CTA
   ───────────────────────────────────────────────────────────────────────────── */
function expandLog() {
  var expand  = el('log-expand');
  var success = el('log-success');
  if (!expand) return;

  // Hide any previous success message
  if (success) success.classList.add('hidden');

  var isOpen = expand.classList.contains('open');
  expand.classList.toggle('open', !isOpen);
  expand.setAttribute('aria-hidden', isOpen ? 'true' : 'false');

  if (!isOpen) {
    // Pre-fill email if saved
    var saved   = localStorage.getItem('ftc_email');
    var emailEl = el('email-input');
    if (emailEl && saved) emailEl.value = saved;
    setTimeout(function() {
      var emailEl2 = el('email-input');
      if (emailEl2) emailEl2.focus();
      postH();
    }, 380);
  } else {
    postH();
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUBMIT (log impact)
   ───────────────────────────────────────────────────────────────────────────── */
function handleSubmit() {
  var emailEl = el('email-input');
  var email   = emailEl ? emailEl.value.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (emailEl) {
      emailEl.classList.add('error');
      emailEl.focus();
      setTimeout(function() { emailEl.classList.remove('error'); }, 2000);
    }
    return;
  }

  var slug = currentChapter ? currentChapter.slug : '';
  if (!slug) {
    var sel = el('city-select');
    slug = sel ? sel.value : '';
  }

  // Persist to localStorage
  localStorage.setItem('ftc_email', email);
  var logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]');
  logs.push({ meals: S.goal, date: new Date().toISOString(), chapter: slug });
  localStorage.setItem('ftc_logs', JSON.stringify(logs));

  // Collapse email field, show success
  var expand  = el('log-expand');
  var success = el('log-success');
  if (expand)  { expand.classList.remove('open'); expand.setAttribute('aria-hidden', 'true'); }
  if (success) success.classList.remove('hidden');

  // Auto-hide success after 5s
  setTimeout(function() {
    if (success) success.classList.add('hidden');
  }, 5000);

  // postMessage → Wix parent scrolls to Eventbrite
  try {
    window.parent.postMessage({ type: 'ftc:scrollToRegistration' }, '*');
  } catch(e) {}

  postH();
}

/* ─────────────────────────────────────────────────────────────────────────────
   COPY LIST
   ───────────────────────────────────────────────────────────────────────────── */
function handleCopy() {
  var r = getReq(S.goal);
  var city = currentChapter
    ? (currentChapter.name || currentChapter.slug)
    : (el('city-label') ? el('city-label').textContent : '');
  if (city === 'Select city…') city = '';

  var lines = [
    '🥪 FEED THE CITY — GROCERY LIST',
    city ? '📍 ' + city : null,
    '🎯 Goal: ' + S.goal + ' sandwiches (~' + Math.round(S.goal / 2) + ' families)',
    '',
    '— SANDWICHES —',
    '🍞 Sliced Bread      ' + r.bread + (r.bread === 1 ? ' loaf' : ' loaves'),
    '🥩 Deli Meat          ' + r.meat  + ' oz',
    '🧀 Sliced Cheese      ' + r.cheese + (r.cheese === 1 ? ' slice' : ' slices'),
    '🟡 Yellow Mustard    ' + r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles'),
    '🛍️ Sandwich Bags     ' + r.bags + (r.bags === 1 ? ' box' : ' boxes'),
    '',
    '— ALSO BRING —',
    '🥔 Chips              ' + r.chips + (r.chips === 1 ? ' bag' : ' bags') + ' (full-size)',
    '🍊 Tangerines         ' + r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags') + ' · 3 lb (Halos/Cuties)',
    '',
    'feedthecity.org | tangocharities.org',
  ].filter(function(l) { return l !== null; }).join('\n');

  function onCopied() {
    var btn = el('btn-copy');
    if (!btn) return;
    var orig = btn.textContent;
    btn.textContent = '✓ COPIED!';
    btn.classList.add('feedback-ok');
    setTimeout(function() {
      btn.textContent = orig;
      btn.classList.remove('feedback-ok');
    }, 2200);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(lines).then(onCopied).catch(function() {
      fallbackCopy(lines, onCopied);
    });
  } else {
    fallbackCopy(lines, onCopied);
  }
}

function fallbackCopy(text, callback) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); callback(); } catch(e) {}
  document.body.removeChild(ta);
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE IMAGE (canvas grocery card)
   ───────────────────────────────────────────────────────────────────────────── */
function handleSave() {
  var btn = el('btn-save');
  if (btn) { btn.textContent = '⏳ GENERATING…'; btn.classList.add('feedback-spin'); }

  // Small delay so browser repaints the button before canvas work
  setTimeout(function() {
    document.fonts.ready.then(function() {
      buildCanvas();
      if (btn) {
        setTimeout(function() {
          btn.textContent = '⬇ SAVE IMAGE';
          btn.classList.remove('feedback-spin');
        }, 1200);
      }
    });
  }, 40);
}

function buildCanvas() {
  var r   = getReq(S.goal);
  var W   = 900;
  var PAD = 52;

  var rows = [
    { label: 'Sliced Bread',      qty: r.bread      + (r.bread      === 1 ? ' loaf'    : ' loaves')   },
    { label: 'Deli Meat',         qty: r.meat        + ' oz'                                            },
    { label: 'Sliced Cheese',     qty: r.cheese      + (r.cheese     === 1 ? ' slice'   : ' slices')   },
    { label: 'Yellow Mustard',    qty: r.mustard     + (r.mustard    === 1 ? ' bottle'  : ' bottles')  },
    { label: 'Sandwich Bags',     qty: r.bags        + (r.bags       === 1 ? ' box'     : ' boxes')    },
    { label: 'Chips',             qty: r.chips       + (r.chips      === 1 ? ' bag'     : ' bags')     },
    { label: 'Tangerines (3 lb)', qty: r.tangerines  + (r.tangerines === 1 ? ' bag'     : ' bags')     },
  ];

  var HEADER_H = 180;
  var ROW_H    = 60;
  var BODY_H   = PAD + rows.length * ROW_H + PAD;
  var FOOTER_H = 76;
  var H        = HEADER_H + BODY_H + FOOTER_H;

  var canvas = el('canvas');
  if (!canvas) return;
  canvas.width  = W;
  canvas.height = H;

  var ctx = canvas.getContext('2d');

  // Header — navy
  ctx.fillStyle = '#003366';
  ctx.fillRect(0, 0, W, HEADER_H);

  // Orange left bar
  ctx.fillStyle = '#FF6500';
  ctx.fillRect(0, 0, 10, HEADER_H);

  // Big number
  ctx.font      = 'bold 100px serif';
  ctx.fillStyle = '#FF6500';
  ctx.textAlign = 'left';
  ctx.fillText(String(S.goal), PAD + 14, HEADER_H - 28);
  var numW = ctx.measureText(String(S.goal)).width;

  // SANDWICHES label
  ctx.font      = '600 22px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('SANDWICHES', PAD + 14 + numW + 18, HEADER_H - 52);

  // Subtitle
  ctx.font      = '400 15px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('FEED THE CITY — GROCERY CHECKLIST', PAD + 14 + numW + 18, HEADER_H - 26);

  // Body — off-white
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, HEADER_H, W, BODY_H);

  // Rows
  rows.forEach(function(row, i) {
    var y = HEADER_H + PAD + i * ROW_H;

    // Divider
    if (i > 0) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
    }

    var midY = y + ROW_H / 2 + 6;

    // Item name
    ctx.font      = '600 19px sans-serif';
    ctx.fillStyle = '#003366';
    ctx.textAlign = 'left';
    ctx.fillText(row.label, PAD, midY);

    // Quantity
    ctx.font      = 'bold 22px sans-serif';
    ctx.fillStyle = '#FF6500';
    ctx.textAlign = 'right';
    ctx.fillText(row.qty, W - PAD, midY);
  });

  // Footer — navy
  ctx.fillStyle = '#003366';
  ctx.fillRect(0, HEADER_H + BODY_H, W, FOOTER_H);

  ctx.font      = '400 13px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.textAlign = 'center';
  ctx.fillText('tangocharities.org/feed-the-city', W / 2, HEADER_H + BODY_H + FOOTER_H / 2 + 5);

  // Download or share
  downloadCanvas(canvas, 'ftc-grocery-list.png');
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob(function(blob) {
    var file = new File([blob], filename, { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(function() { triggerDL(canvas, filename); });
    } else {
      triggerDL(canvas, filename);
    }
  }, 'image/png');
}

function triggerDL(canvas, filename) {
  var a      = document.createElement('a');
  a.href     = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}

/* ─────────────────────────────────────────────────────────────────────────────
   CLOSE PICKER ON OUTSIDE CLICK
   ───────────────────────────────────────────────────────────────────────────── */
document.addEventListener('click', function(e) {
  var wrap = el('city-picker-wrap');
  if (wrap && !wrap.contains(e.target)) closeCityPicker();
});

/* ─────────────────────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────────────────────── */
window.addEventListener('load', function() {
  // Build ingredient rows from JS data
  buildRows(ITEMS,      'ing-list');
  buildRows(ALSO_ITEMS, 'also-list');

  // Read ?chapter= param → lock or show picker
  readChapterParam();

  // Restore saved email
  var saved = localStorage.getItem('ftc_email');
  if (saved) {
    var emailEl = el('email-input');
    if (emailEl) emailEl.value = saved;
  }

  // Initial render (no tick animation on load)
  renderCalc(false);

  // Initial height report
  setTimeout(postH, 300);
});
