/* ============================================================================
   Banco MM2H — application quiz.

   DELIVERY. Enquiries are POSTed as JSON to Banco OS, which creates a lead
   stamped source=website and emails the founders. The mailto fallback below is
   still wired and still matters: it is what runs if the portal is down or the
   request is blocked, and every CTA on the site points here, so an enquiry that
   goes nowhere is a lost client.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = 'https://app.bancomm2h.com/api/intake/website';
  // Served locally (npm run serve) → talk to a local portal, so the whole
  // journey can be walked through without posting test enquiries into the real
  // leads table. Cannot fire in production: it keys off the hostname the page
  // itself was loaded from.
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    ENDPOINT = 'http://localhost:3000/api/intake/website';
  }
  var INBOX = 'hello@bancomm2h.my';           // used by the mailto fallback
  var TOTAL_STEPS = 5;

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
  var doneMail = document.getElementById('doneMail');

  var at = 1;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- step machinery ---------------------------------------------- */
  function stepEl(n) { return form.querySelector('.step[data-step="' + n + '"]'); }
  function isMulti(n) { return stepEl(n).hasAttribute('data-multi'); }

  function show(n) {
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

    live.textContent = n + ' / ' + TOTAL_STEPS + ' — ' +
      stepEl(n).querySelector('.step__q').textContent;
  }

  function answered(n) {
    var input = stepEl(n).querySelector('input[type="radio"], input[type="checkbox"]');
    if (!input) return true;
    return !!form.querySelector('input[name="' + input.name + '"]:checked');
  }

  /* ---- choosing an option ------------------------------------------- */
  // "Still exploring" is not compatible with naming a specific need, so it
  // clears the rest, and choosing anything specific clears it.
  function enforceExclusive(changed) {
    if (changed.type !== 'checkbox' || !changed.checked) return;
    var group = form.querySelectorAll('input[name="' + changed.name + '"]');
    var isExclusive = changed.hasAttribute('data-exclusive');
    [].forEach.call(group, function (i) {
      if (i === changed) return;
      if (isExclusive || i.hasAttribute('data-exclusive')) i.checked = false;
    });
  }

  // Sub-questions belong to a tick above them, so they appear with it and are
  // CLEARED when it goes away — a hidden checkbox that still submits would send
  // school stages for a family that un-ticked schooling.
  function reveal(wrapId, checkboxId) {
    var wrap = document.getElementById(wrapId);
    var box = document.getElementById(checkboxId);
    if (!wrap || !box) return;
    wrap.hidden = !box.checked;
    if (box.checked) return;
    // textarea as well as input: a hidden <textarea> still submits, so leaving
    // it out would send free text for a service that was un-ticked.
    [].forEach.call(wrap.querySelectorAll('input, textarea'), function (i) {
      if (i.type === 'checkbox') i.checked = false; else i.value = '';
    });
    countOther();
  }

  function syncSubQuestions() {
    reveal('eduLevels', 'svcEdu');
    reveal('otherWrap', 'svcOther');
  }

  // Live count for the "Others" box. maxlength stops typing silently at the
  // cap, so show the remaining room rather than letting keystrokes vanish.
  var otherBox = document.getElementById('fother');
  var otherNow = document.querySelector('[data-count-now]');
  function countOther() {
    if (!otherBox || !otherNow) return;
    var max = parseInt(otherBox.getAttribute('maxlength'), 10) || 200;
    var n = otherBox.value.length;
    otherNow.textContent = n;
    var el = otherNow.parentNode;
    el.classList.toggle('is-near', n >= max * 0.8 && n < max);
    el.classList.toggle('is-full', n >= max);
  }
  if (otherBox) otherBox.addEventListener('input', countOther);

  form.addEventListener('change', function (e) {
    if (e.target.type !== 'radio' && e.target.type !== 'checkbox') return;
    enforceExclusive(e.target);
    syncSubQuestions();
    if (at >= TOTAL_STEPS) return;

    nextBtn.disabled = !answered(at);

    // Single-choice steps move on by themselves. A multi-select step must not:
    // the visitor is not finished until they say so, so it waits for Continue.
    if (!isMulti(at) && e.target.type === 'radio') {
      setTimeout(function () {
        if (at < TOTAL_STEPS && answered(at)) show(at + 1);
      }, reduced ? 0 : 260);
    }
  });

  nextBtn.addEventListener('click', function () { if (answered(at)) show(at + 1); });
  backBtn.addEventListener('click', function () { if (at > 1) show(at - 1); });

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
  // Attribution only. No personal data is ever put in a URL.
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
    // "none" means "just the visa for now" — a UI convenience, not a service.
    // Sending it would put the word "none" on the lead as a thing to quote.
    var services = d.getAll('services').filter(function (v) { return v !== 'none'; });
    var body = {
      // multi-select: every checked box, comma separated
      pathway: d.getAll('pathway').join(', '),
      household: d.get('household') || '',
      timeline: d.get('timeline') || '',
      services: services.join(', '),
      education_levels: d.getAll('education_levels').join(', '),
      services_other: (d.get('services_other') || '').trim(),
      name: (d.get('name') || '').trim(),
      email: (d.get('email') || '').trim(),
      phone: (d.get('phone') || '').trim(),
      note: (d.get('note') || '').trim(),
      company: (d.get('company') || '').trim()
    };
    var c = context();
    for (var k in c) body[k] = c[k];
    return body;
  }

  /* ---- delivery ------------------------------------------------------ */
  function finish(viaMail) {
    form.hidden = true;
    done.hidden = false;
    if (viaMail && doneMail) doneMail.hidden = false;
    done.focus();
    if (history.replaceState) history.replaceState(null, '', location.pathname + '#done');
  }

  // The visible label for whatever is checked in a group. The payload keeps the
  // machine values for a CRM; a person reading their inbox wants the words.
  function labels(groupName) {
    var picked = [].slice.call(
      form.querySelectorAll('input[name="' + groupName + '"]:checked'));
    return picked.map(function (i) {
      var t = i.parentNode.querySelector('.opt__t');
      return t ? t.textContent.trim() : i.value;
    }).join(', ');
  }

  // Readable plain text, since a person opens this in their inbox.
  function mailtoUrl(d) {
    var lines = [
      'Looking for: ' + (labels('pathway') || '—'),
      'Household:   ' + (labels('household') || '—'),
      'Timeline:    ' + (labels('timeline') || '—'),
      'Quote for:   ' + (labels('services') || '—'),
      labels('education_levels') ? 'School stage: ' + labels('education_levels') : '',
      d.services_other ? 'Also:        ' + d.services_other : '',
      '',
      'Name:  ' + d.name,
      'Email: ' + d.email,
      'Phone: ' + (d.phone || '—'),
      '',
      'Notes: ' + (d.note || '—'),
      '',
      '— sent from ' + d.page + ' (' + d.lang + ')',
      d.source ? 'source: ' + d.source : ''
    ];
    return 'mailto:' + INBOX +
      '?subject=' + encodeURIComponent('MM2H enquiry — ' + d.name) +
      '&body=' + encodeURIComponent(lines.filter(Boolean).join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formErr.hidden = true;
    if (!validateContact()) return;

    var data = payload();

    if (!ENDPOINT) {
      // No endpoint yet: hand the enquiry to the visitor's mail client rather
      // than dropping it. They still have to press send, which the done screen
      // tells them.
      window.location.href = mailtoUrl(data);
      finish(true);
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
      finish(false);
    }).catch(function (err) {
      console.error('[banco] submit failed, falling back to mail', err);
      window.location.href = mailtoUrl(data);
      finish(true);
    });
  });

  syncSubQuestions();
  show(1);
})();
