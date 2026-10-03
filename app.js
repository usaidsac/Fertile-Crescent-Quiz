// Fertile Crescent Quiz: the app. Quiz questions live in packet1.js and hammurabi.js.
(function () {
  var MIX_COUNT = 15;
  var app = document.getElementById('app');
  var state = null;

  // ---------- helpers ----------
  function $(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem('fcq.' + k); localStorage.setItem('fcq.' + k, v); } catch (e) { return null; } }
  function findQuiz(id) { return (window.QUIZZES || []).filter(function (q) { return q.id === id; })[0]; }

  // ---------- read aloud ----------
  var canSpeak = 'speechSynthesis' in window;
  function speak(text) {
    if (!canSpeak) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, 'blank').replace(/[★❓→→]/g, ' '));
    u.lang = 'en-US'; u.rate = 0.85;
    speechSynthesis.speak(u);
  }
  function speakBtn(text) {
    if (!canSpeak) return null;
    var b = $('<button class="say" type="button" aria-label="Listen">🔊 Listen</button>');
    b.onclick = function () { speak(text); };
    return b;
  }

  // ---------- build questions ----------
  function vocabQuestions(words) {
    return words.map(function (w) {
      var others = words.filter(function (o) { return o.word !== w.word; });
      if (Math.random() < 0.5) {
        return {
          q: 'What does the word "' + w.word + '" mean?', icon: w.icon, say: w.say,
          choices: [w.meaning].concat(shuffle(others).slice(0, 3).map(function (o) { return o.meaning; })),
          explain: w.word.charAt(0).toUpperCase() + w.word.slice(1) + (w.say ? ' (' + w.say + ')' : '') + ' means ' + w.meaning + '.'
        };
      }
      return {
        q: 'Which word means: "' + w.meaning + '"?',
        choices: [w.word].concat(shuffle(others).slice(0, 3).map(function (o) { return o.word; })),
        explain: '"' + w.meaning.charAt(0).toUpperCase() + w.meaning.slice(1) + '" is the meaning of ' + w.word + '.'
      };
    });
  }
  function sectionQuestions(sec) { return sec.vocab ? vocabQuestions(sec.vocab) : sec.questions.slice(); }

  function prepare(q) {
    var right = q.choices[q.answer || 0];
    var list = q.choices.slice();
    if (q.distract) {
      shuffle(q.distract.pool).forEach(function (x) {
        if (list.length < q.choices.length + q.distract.n && list.indexOf(x) < 0) list.push(x);
      });
    }
    if (!q.order) list = shuffle(list);
    var p = {}; for (var k in q) p[k] = q[k];
    p.list = list; p.right = right;
    return p;
  }

  // ---------- map picture ----------
  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }
  function starPoints(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rr = i % 2 ? r * 0.45 : r, a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }
  function mapBox(m) {
    var b = m.base, v = b.view || [0, 0, b.w, b.h];
    var svg = el('svg', { viewBox: v.join(' '), role: 'img', 'aria-label': 'Map' });
    svg.appendChild(el('image', { href: b.src, x: 0, y: 0, width: b.w, height: b.h }));
    var s = v[2] / 1000 * 1.25; // keeps marks the same size on different maps
    (m.labels || []).forEach(function (l) {
      var t = el('text', { x: l.x, y: l.y, 'class': 'maplabel' + (l.italic ? ' it' : ''), 'font-size': 16 }, l.text);
      if (l.rotate) t.setAttribute('transform', 'rotate(' + l.rotate + ' ' + l.x + ' ' + l.y + ')');
      svg.appendChild(t);
    });
    if (m.star) svg.appendChild(el('polygon', { points: starPoints(m.star[0], m.star[1], 17), 'class': 'star' }));
    (m.marks || []).forEach(function (k) {
      svg.appendChild(el('circle', { cx: k.x, cy: k.y, r: 22, 'class': 'qmark' }));
      svg.appendChild(el('text', { x: k.x, y: k.y + 10, 'class': 'qmarkt' }, '?'));
    });
    if (m.ring) {
      svg.appendChild(el('circle', { cx: m.ring[0], cy: m.ring[1], r: Math.max(26 * s, 24), 'class': 'ring-halo' }));
      svg.appendChild(el('circle', { cx: m.ring[0], cy: m.ring[1], r: Math.max(26 * s, 24), 'class': 'ring' }));
    }
    if (m.north) {
      var nx = v[0] + 30, ny = v[1] + 14;
      svg.appendChild(el('path', { d: 'M' + nx + ',' + (ny + 34) + ' L' + nx + ',' + (ny + 10) + ' M' + (nx - 7) + ',' + (ny + 18) + ' L' + nx + ',' + (ny + 8) + ' L' + (nx + 7) + ',' + (ny + 18), 'class': 'north' }));
      svg.appendChild(el('text', { x: nx, y: ny + 4, 'class': 'maplabel', 'text-anchor': 'middle', 'font-size': 15 }, 'N'));
    }

    var wrap = $('<div class="map"><div class="mapscroll"></div><div class="mapbar"></div></div>');
    var scroller = wrap.firstChild;
    scroller.appendChild(svg);
    var btn = $('<button type="button" class="small"></button>');
    wrap.querySelector('.mapbar').appendChild(btn);
    if (m.note) wrap.querySelector('.mapbar').appendChild($('<span class="mapnote">' + esc(m.note) + '</span>'));
    function setZoom(on) {
      wrap.classList.toggle('zoomed', on);
      btn.textContent = on ? '🗺️ See the whole map' : '🔍 Make the map bigger';
      if (on) {
        requestAnimationFrame(function () {
          var fx = m.ring ? (m.ring[0] - v[0]) / v[2] : 0.5, fy = m.ring ? (m.ring[1] - v[1]) / v[3] : 0.5;
          scroller.scrollLeft = fx * scroller.scrollWidth - scroller.clientWidth / 2;
          scroller.scrollTop = fy * scroller.scrollHeight - scroller.clientHeight / 2;
        });
      }
    }
    btn.onclick = function () { setZoom(!wrap.classList.contains('zoomed')); };
    setZoom(!!(m.zoom && m.ring) && window.innerWidth < 700);
    return wrap;
  }

  // ---------- screens ----------
  function header(back) {
    var h = $('<header class="top"><a href="#" class="brand">🌙 Fertile Crescent Quiz</a></header>');
    if (back) { var b = $('<a class="back">← Back</a>'); b.href = back; h.insertBefore(b, h.firstChild); }
    return h;
  }

  function home() {
    app.innerHTML = '';
    app.appendChild(header());
    var main = $('<main></main>');
    main.appendChild($('<section class="hero"><h1>Test what you know!</h1><p>Pick a packet. Answer the questions. You will see right away if you are correct.</p></section>'));
    var nameBox = $('<label class="name">Your name: <input type="text" autocomplete="name" maxlength="40" placeholder="Type your name"></label>');
    var inp = nameBox.querySelector('input');
    inp.value = store('name') || '';
    inp.oninput = function () { store('name', inp.value.trim()); };
    main.appendChild(nameBox);
    (window.QUIZZES || []).forEach(function (qz) {
      var count = qz.sections.reduce(function (n, s) { return n + (s.vocab || s.questions).length; }, 0);
      var a = $('<a class="card big"><span class="emo">' + qz.emoji + '</span><span><b>' + esc(qz.title) + '</b><small>' + count + ' questions</small></span><span class="go">›</span></a>');
      a.href = '#/' + qz.id;
      main.appendChild(a);
    });
    main.appendChild($('<p class="foot">Essential Question: How can geographic features impact the development of civilizations?</p>'));
    app.appendChild(main);
  }

  function packetMenu(qz) {
    app.innerHTML = '';
    app.appendChild(header('#'));
    var main = $('<main></main>');
    main.appendChild($('<h1 class="ptitle">' + qz.emoji + ' ' + esc(qz.title) + '</h1>'));
    main.appendChild($('<p class="lead">Choose a part to practice:</p>'));
    var parts = qz.sections.map(function (s) { return { id: s.id, title: s.title, emoji: s.emoji, n: (s.vocab || s.questions).length }; });
    var total = parts.reduce(function (n, p) { return n + p.n; }, 0);
    parts.push({ id: 'mix', title: 'Mixed Test', emoji: '⭐', n: Math.min(MIX_COUNT, total), sub: 'Questions from every part' });
    parts.push({ id: 'all', title: 'Everything', emoji: '🏆', n: total, sub: 'Every question in the packet' });
    parts.forEach(function (p) {
      var best = store('best.' + qz.id + '.' + p.id);
      var a = $('<a class="card"><span class="emo">' + p.emoji + '</span><span><b>' + esc(p.title) + '</b><small>' + p.n + ' questions' + (p.sub ? ' · ' + p.sub : '') + (best ? ' · Best: ' + best : '') + '</small></span><span class="go">›</span></a>');
      a.href = '#/' + qz.id + '/' + p.id;
      main.appendChild(a);
    });
    app.appendChild(main);
  }

  function start(qz, partId, onlyThese) {
    var qs;
    if (onlyThese) qs = onlyThese;
    else if (partId === 'mix' || partId === 'all') {
      qs = [];
      qz.sections.forEach(function (s) { qs = qs.concat(sectionQuestions(s)); });
      qs = shuffle(qs);
      if (partId === 'mix') qs = qs.slice(0, MIX_COUNT);
    } else {
      var sec = qz.sections.filter(function (s) { return s.id === partId; })[0];
      if (!sec) { location.hash = '#/' + qz.id; return; }
      qs = shuffle(sectionQuestions(sec));
    }
    var sec2 = qz.sections.filter(function (s) { return s.id === partId; })[0];
    state = {
      qz: qz, part: partId, retry: !!onlyThese,
      partTitle: sec2 ? sec2.title : (partId === 'mix' ? 'Mixed Test' : 'Everything'),
      qs: qs.map(prepare), i: 0, score: 0, missed: [], answered: false
    };
    showQuestion();
  }

  function showQuestion() {
    var s = state, q = s.qs[s.i];
    app.innerHTML = '';
    app.appendChild(header('#/' + s.qz.id));
    var main = $('<main class="quiz"></main>');
    main.appendChild($('<div class="progress"><div class="bar" style="width:' + (100 * s.i / s.qs.length) + '%"></div></div>'));
    main.appendChild($('<div class="meta"><span>Question ' + (s.i + 1) + ' of ' + s.qs.length + '</span><span>✅ ' + s.score + '</span></div>'));

    var qbox = $('<div class="question"></div>');
    if (q.icon) qbox.appendChild($('<div class="icon">' + q.icon + '</div>'));
    qbox.appendChild($('<h2>' + esc(q.q) + '</h2>'));
    var sb = speakBtn(q.q + '. ' + q.list.join('. '));
    if (sb) qbox.appendChild(sb);
    main.appendChild(qbox);
    if (q.map) main.appendChild(mapBox(q.map));
    if (q.img) main.appendChild($('<figure class="photo"><img src="' + q.img.src + '" alt="' + esc(q.img.alt) + '"></figure>'));

    var choices = $('<div class="choices"></div>');
    var letters = 'ABCDEF';
    q.list.forEach(function (c, idx) {
      var b = $('<button type="button" class="choice"><span class="letter">' + letters[idx] + '</span><span class="txt">' + esc(c) + '</span></button>');
      b.onclick = function () { answer(c, b, choices); };
      choices.appendChild(b);
    });
    main.appendChild(choices);
    app.appendChild(main);
    window.scrollTo(0, 0);
  }

  function answer(c, btn, choices) {
    var s = state, q = s.qs[s.i];
    if (s.answered) return;
    s.answered = true;
    var ok = c === q.right;
    if (ok) s.score++; else s.missed.push(q);
    Array.prototype.forEach.call(choices.children, function (b) {
      b.disabled = true;
      var t = b.querySelector('.txt').textContent;
      if (t === q.right) b.classList.add('right');
      else if (b === btn) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    var fb = $('<div class="feedback ' + (ok ? 'ok' : 'no') + '" role="status"></div>');
    fb.appendChild($('<p class="verdict">' + (ok ? '✅ Correct! Great job!' : '❌ Not quite. The answer is: <b>' + esc(q.right) + '</b>') + '</p>'));
    if (q.explain) fb.appendChild($('<p>' + esc(q.explain) + '</p>'));
    var row = $('<div class="row"></div>');
    var sb = speakBtn((ok ? 'Correct! ' : 'Not quite. The answer is: ' + q.right + '. ') + (q.explain || ''));
    if (sb) row.appendChild(sb);
    var last = s.i === s.qs.length - 1;
    var next = $('<button type="button" class="next">' + (last ? 'See my score 🏁' : 'Next ➜') + '</button>');
    next.onclick = function () {
      if (canSpeak) speechSynthesis.cancel();
      s.answered = false;
      if (last) finish(); else { s.i++; showQuestion(); }
    };
    row.appendChild(next);
    fb.appendChild(row);
    choices.parentNode.appendChild(fb);
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function finish() {
    var s = state, n = s.qs.length, pct = Math.round(100 * s.score / n);
    if (!s.retry) {
      var key = 'best.' + s.qz.id + '.' + s.part, old = store(key);
      if (!old || parseInt(old, 10) < pct) store(key, pct + '%');
    }
    var msg = pct === 100 ? '🏆 Perfect score! Amazing!' : pct >= 80 ? '🌟 Great work!' : pct >= 60 ? '👍 Good job! Keep practicing.' : '💪 Keep going! Practice makes you stronger.';
    app.innerHTML = '';
    app.appendChild(header('#/' + s.qz.id));
    var main = $('<main class="done"></main>');
    var name = store('name');
    var d = new Date();
    main.appendChild($('<div class="scorecard">' +
      '<p class="who">' + (name ? esc(name) : 'Student') + '</p>' +
      '<p class="what">' + esc(s.qz.short) + ' · ' + esc(s.partTitle) + (s.retry ? ' (practice missed)' : '') + '</p>' +
      '<p class="big">' + s.score + ' / ' + n + '</p>' +
      '<p class="pct">' + pct + '%</p>' +
      '<p class="msg">' + msg + '</p>' +
      '<p class="when">' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</p></div>'));
    main.appendChild($('<p class="tip">📸 Take a screenshot to show your teacher.</p>'));
    var row = $('<div class="buttons"></div>');
    if (s.missed.length) {
      var m = $('<button type="button" class="next">🔁 Practice the ones I missed (' + s.missed.length + ')</button>');
      var missed = s.missed.slice();
      m.onclick = function () { start(s.qz, s.part, shuffle(missed)); };
      row.appendChild(m);
    }
    var again = $('<button type="button" class="secondary">↺ Try again</button>');
    again.onclick = function () { start(s.qz, s.part); };
    row.appendChild(again);
    var back = $('<a class="secondary btn">Choose another part</a>'); back.href = '#/' + s.qz.id;
    row.appendChild(back);
    main.appendChild(row);
    if (s.missed.length) {
      var list = $('<div class="review"><h2>Study these:</h2></div>');
      s.missed.forEach(function (q) {
        list.appendChild($('<div class="rq"><p class="q">' + esc(q.q) + '</p><p class="a">✅ ' + esc(q.right) + '</p></div>'));
      });
      main.appendChild(list);
    }
    app.appendChild(main);
    window.scrollTo(0, 0);
  }

  // ---------- routing ----------
  function route() {
    if (canSpeak) speechSynthesis.cancel();
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var qz = parts[0] && findQuiz(parts[0]);
    if (!qz) return home();
    if (!parts[1]) return packetMenu(qz);
    start(qz, parts[1]);
  }
  window.addEventListener('hashchange', route);
  route();
})();
