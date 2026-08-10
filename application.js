/* ============================================================================
   Banco MM2H — application quiz.

   TO GO LIVE: set ENDPOINT below to the URL that should receive submissions,
   then delete the noindex meta tag in application/index.html (and the zh copy).
   While ENDPOINT is null the page runs in preview mode: it shows the notice
   bar, logs the payload to the console, and never pretends a lead was sent to
   anyone. Nothing here posts anywhere until you fill that constant in.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = null;          // e.g. 'https://formspree.io/f/xxxxxxxx'
  var TOTAL_STEPS = 4;

  var form = document.getElementById('quiz');
  if (!form) return;

  var steps = [].slice.call(form.querySelectorAll('.step'));
  var bar = document.getElementById('bar');
  var fill = bar.querySelector('i');
  var stepNow = document.getElementById('stepNow');
  var live = document.getElementById('live');
  var backBtn = document.getElementById('back');
  var nextBtn = document.getElementById('next');
  var sendBtn = document.getElementById('send');
  var formErr = document.getElementById('formErr');
  var done = document.getElementById('done');
  var notice = document.getElementById('notice');

  var at = 1;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!ENDPOINT && notice) notice.hidden = false;

  /* ---- step machinery ---------------------------------------------- */
  function stepEl(n) { return form.querySelector('.step[data-step="' + n + '"]'); }

  function show(n, focusIt) {
    at = n;
    steps.forEach(function (s) {
      var on = Number(s.dataset.step) === n;
      s.hidden = !on;
      s.classList.toggle('is-on', on);
    });

    fill.style.width = (n / TOTAL_STEPS * 100) + '%';
    stepNow.textContent = String(n);
    bar.setAttribute('aria-valuenow', String(n));

    backBtn.hidden = n === 1;
    nextBtn.hidden = n === TOTAL_STEPS;
    sendBtn.hidden = n !== TOTAL_STEPS;

    if (n < TOTAL_STEPS) nextBtn.disabled = !answered(n);

    // let a screen reader know where we are without stealing focus mid-flow
    live.textContent = stepNow.textContent + ' / ' + TOTAL_STEPS + ' — ' +
      stepEl(n).querySelector('.step__q').textContent;

    if (focusIt) {
      var first = stepEl(n).querySelector('input, textarea');
      if (first) first.focus({ preventScroll: true });
    }
  }

  function answered(n) {
    var group = stepEl(n).querySelector('input[type="radio"]');
    if (!group) return true;
    return !!form.querySelector('input[name="' + group.name + '"]:checked');
  }

  /* ---- choosing an option advances on its own ----------------------- */
  form.addEventListener('change', function (e) {
    if (e.target.type !== 'radio') return;
    if (at < TOTAL_STEPS) {
      nextBtn.disabled = false;
      // a beat so the tick is visibly registered before the step turns over
      setTimeout(function () { if (at < TOTAL_STEPS && answered(at)) show(at + 1, false); },
        reduced ? 0 : 260);
    }
  });

  nextBtn.addEventListener('click', function () { if (answered(at)) show(at + 1, false); });
  backBtn.addEventListener('click', function () { if (at > 1) show(at - 1, false); });

  /* ---- validation --------------------------------------------------- */
  function markBad(input, bad) {
    var f = input.closest('.field');
    if (f) f.classList.toggle('is-bad', bad);
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function validateContact() {
    var name = form.elements.name;
    var email = form.elements.email;
    var okName = name.value.trim().length > 0;
    var okMail = validEmail(email.value.trim());
    markBad(name, !okName);
    markBad(email, !okMail);
    var firstBad = !okName ? name : (!okMail ? email : null);
    if (firstBad) firstBad.focus();
    return okName && okMail;
  }

  ['name', 'email'].forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener('input', function () {
      if (el.closest('.field').classList.contains('is-bad')) {
        markBad(el, n === 'email' ? !validEmail(el.value.trim()) : !el.value.trim());
      }
    });
  });

  /* ---- what we collect ---------------------------------------------- */
  // Attribution only — no personal data ever goes into a URL or a third party.
  function context() {
    var q = new URLSearchParams(location.search);
    var out = {
      lang: document.documentElement.lang,
      source: q.get('src') || '',            // which CTA sent them here
      page: location.pathname,
      referrer: document.referrer || '',
      submitted_at: new Date().toISOString()
    };
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .forEach(function (k) { if (q.get(k)) out[k] = q.get(k); });
    return out;
  }

  function payload() {
    var d = new FormData(form);
    var body = {
      pathway: d.get('pathway') || '',
      household: d.get('household') || '',
      timeline: d.get('timeline') || '',
      name: (d.get('name') || '').trim(),
      email: (d.get('email') || '').trim(),
      phone: (d.get('phone') || '').trim(),
      note: (d.get('note') || '').trim()
    };
    var c = context();
    for (var k in c) body[k] = c[k];
    return body;
  }

  /* ---- submit -------------------------------------------------------- */
  function finish() {
    form.hidden = true;
    done.hidden = false;
    done.focus();
    if (history.replaceState) history.replaceState(null, '', location.pathname + '#done');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formErr.hidden = true;
    if (!validateContact()) return;

    var data = payload();

    if (!ENDPOINT) {
      // Preview mode. Show the completion screen so the flow can be reviewed,
      // but be loud that nothing left the browser.
      console.warn('[banco] No ENDPOINT set — nothing was sent. Payload was:', data);
      finish();
      return;
    }

    sendBtn.classList.add('is-busy');
    sendBtn.disabled = true;

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      finish();
    }).catch(function (err) {
      console.error('[banco] submit failed', err);
      formErr.hidden = false;
      sendBtn.classList.remove('is-busy');
      sendBtn.disabled = false;
    });
  });

  show(1, false);
})();
