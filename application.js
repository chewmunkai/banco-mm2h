/* ============================================================================
   Banco MM2H — application quiz.

   DELIVERY. Set ENDPOINT to a URL and every enquiry is POSTed there as JSON.
   Until you do, the form falls back to opening the visitor's mail client with
   the answers filled in and addressed to INBOX. That is deliberately not a
   silent no-op: every CTA on the site now points here, so an enquiry that goes
   nowhere is a lost client. Set ENDPOINT when you have one and the fallback
   stops being used.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = null;                        // e.g. 'https://formspree.io/f/xxxxxxxx'
  var INBOX = 'hello@bancomm2h.my';           // used by the mailto fallback
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

  form.addEventListener('change', function (e) {
    if (e.target.type !== 'radio' && e.target.type !== 'checkbox') return;
    enforceExclusive(e.target);
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
    var body = {
      // multi-select: every checked box, comma separated
      pathway: d.getAll('pathway').join(', '),
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

  show(1);
})();
