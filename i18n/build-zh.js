// Generate zh/index.html from index.html + i18n/zh-TW.json.
//   node i18n/build-zh.js
//
// index.html stays the single source of structure — the Chinese page is derived,
// never hand-edited. Re-run this after any change to the English page.
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.join(__dirname, '..');

// Which Chinese edition this run produces. Invoked once per variant:
//   node i18n/build-zh.js tw    → /zh/      traditional, Taiwan
//   node i18n/build-zh.js cn    → /zh-cn/   simplified, mainland
const EDITIONS = {
  tw: { dir: 'zh',    lang: 'zh-Hant-TW', json: 'zh-TW.json' },
  cn: { dir: 'zh-cn', lang: 'zh-Hans-CN', json: 'zh-CN.json' },
};
const TARGET = process.argv[2] || 'tw';
const ED = EDITIONS[TARGET];
if (!ED) { console.error('unknown edition: ' + process.argv[2]); process.exit(1); }

const t = JSON.parse(fs.readFileSync(path.join(__dirname, ED.json), 'utf8'));
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// decodeEntities:false keeps &amp; / &nbsp; byte-identical through the round trip.
const $ = cheerio.load(src, { decodeEntities: false });

const miss = [];
// Strings the design added that have no translation yet. These stay English on
// the zh page — recorded and reported rather than silently shipped.
const untranslated = [];
const need = k => { if (!(k in t)) { miss.push(k); return ''; } return t[k]; };

// full text replace
const T = (sel, key, i) => {
  const el = i === undefined ? $(sel) : $(sel).eq(i);
  if (!el.length) return miss.push(`[no match] ${sel}`);
  el.text(need(key));
};
// inner HTML replace (for strings carrying <span>/<b>/<a>)
const H = (sel, key, i) => {
  const el = i === undefined ? $(sel) : $(sel).eq(i);
  if (!el.length) return miss.push(`[no match] ${sel}`);
  el.html(need(key));
};
// replace only the leading text node, keeping child elements (arrows, svg, <b>)
const LEAD = (sel, key, i) => {
  const el = i === undefined ? $(sel) : $(sel).eq(i);
  if (!el.length) return miss.push(`[no match] ${sel}`);
  const node = el[0].children.find(c => c.type === 'text' && c.data.trim());
  if (!node) return miss.push(`[no text node] ${sel}`);
  node.data = need(key);
};
const ATTR = (sel, attr, key, i) => {
  const el = i === undefined ? $(sel) : $(sel).eq(i);
  if (!el.length) return miss.push(`[no match] ${sel}`);
  el.attr(attr, need(key));
};

// ─── document ────────────────────────────────────────────────────────────────
$('html').attr('lang', ED.lang);
T('title', 'meta.title');

// ─── nav (fixed header) ──────────────────────────────────────────────────────
['nav.hub', 'nav.pathways', 'nav.pricing', 'nav.property', 'nav.life', 'nav.faq']
  .forEach((k, i) => T('.nav__links a', k, i));
LEAD('.nav__right .btn--primary .btn__l', 'nav.cta');
ATTR('.nav__burger', 'aria-label', 'nav.burger.aria');
$('.brand__sub').each((_, el) => $(el).text(t['nav.brand.sub']));

// ─── journey hero ────────────────────────────────────────────────────────────
const topLines = t['hero.title.top'].split('⏎');
$('.jtitle--top span[data-split]').each((i, el) => { if (topLines[i]) $(el).text(topLines[i]); });
T('.jtitle--bottom span[data-split]', 'hero.title.bottom', 0);
T('.jtitle--bottom span.script', 'hero.title.script');
T('.jlead__sub', 'hero.lead');
LEAD('.jlead__ctas .btn--primary .btn__l', 'hero.cta.primary');
T('.jlead__ctas .btn--ghost .btn__l', 'hero.cta.secondary');
T('.jside--l', 'hero.side.left');
T('.jside--r', 'hero.side.right');
[1, 2, 3].forEach((n, i) => {
  T('.beat .k', `hero.beat.${n}.k`, i);
  T('.beat .l', `hero.beat.${n}.l`, i);
});
T('.scrollcue span', 'hero.scrollcue', 0);

// ─── video hero ──────────────────────────────────────────────────────────────
// Keyed by href, not position: the design reorders and adds nav links, and
// positional mapping silently mislabels them when it does.
const NAVKEY = {
  '#hub': 'nav.hub', '#pathways': 'nav.pathways', '#pricing': 'nav.pricing',
  '#property': 'nav.property', '#life': 'nav.life', '#faq': 'nav.faq',
};
$('.vnav__links a, .nav__links a').each((_, el) => {
  const k = NAVKEY[$(el).attr('href')];
  if (k && t[k]) $(el).text(t[k]); else untranslated.push(`nav link ${$(el).attr('href')}`);
});
T('.vnav__cta', 'nav.cta');
// site.js splits .vhead on newlines to build the per-line reveal — keep them.
$('.vhead').text(t['vhero.title'].replace(/⏎\s*/g, '\n'));
T('.vsub', 'vhero.sub');
T('.vbtn--solid', 'vhero.cta.primary');
T('.vbtn--glass', 'vhero.cta.secondary');
// .vtag (the "Live. Invest. Belong." promise mark) was removed by the design;
// vhero.tag stays in zh-TW.json unused in case it returns.

// ─── manifesto ───────────────────────────────────────────────────────────────
T('.manifesto__ey', 'manifesto.eyebrow');
H('.manifesto h2.clip-line', 'manifesto.h2');
[1, 2, 3].forEach((n, i) => {
  T('.manifesto__meta .k', `manifesto.${n}.k`, i);
  T('.manifesto__meta .v', `manifesto.${n}.v`, i);
});

// ─── marquee (two identical rows of six) ─────────────────────────────────────
$('.marq__item').each((i, el) => $(el).text(t[`marq.${(i % 6) + 1}`]));

// ─── hub ─────────────────────────────────────────────────────────────────────
T('.hubx__head .u-eyebrow', 'hub.eyebrow');
H('.hubx__head h2', 'hub.h2');
T('.hubx__stagetitle .t', 'hub.1.title');
$('.hubx__row').each((i, el) => {
  const n = i + 1, row = $(el);
  row.find('h3').text(t[`hub.${n}.title`]);
  row.find('p').text(t[`hub.${n}.body`]);
  row.attr('data-title', t[`hub.${n}.title`]);
  row.find('.tags span').each((j, s) => $(s).text(t[`hub.${n}.tag.${j + 1}`]));
});

// ─── pathways ────────────────────────────────────────────────────────────────
T('.phz__intro .u-eyebrow', 'path.eyebrow');
H('.phz__intro h2', 'path.h2');
T('.phz__intro p', 'path.lead');
// keeps the animated <span class="bar"> that sits inside the hint
$('.phz__hint').html(`${t['path.hint']} <span class="bar"><i></i></span>`);
$('.phz__panel').each((i, el) => {
  const n = i + 1, p = $(el);
  p.find('.tag').text(t[`path.${n}.tag`]);
  p.find('h3').text(t[`path.${n}.title`]);
  p.find('.txt p').text(t[`path.${n}.body`]);
  p.find('.more').text(t[`path.${n}.more`]);          // pre-refine markup
  // refine.css markup: a real CTA per route, plus a mono note beneath it.
  // LEAD keeps the trailing <span>→</span> the design animates on hover.
  const cta = p.find('.phz__cta')[0];
  if (cta) {
    const node = cta.children.find(x => x.type === 'text' && x.data.trim());
    if (node && t[`path.${n}.cta`]) node.data = t[`path.${n}.cta`] + ' ';
  }
  if (t[`path.${n}.note`]) p.find('.phz__note').text(t[`path.${n}.note`]);
});
[['path-retire', 'ui.ph.retire'], ['path-biz', 'ui.ph.biz'], ['path-edu', 'ui.ph.edu']]
  .forEach(([id, k]) => $(`image-slot#${id}`).attr('placeholder', t[k]));

// ─── pricing tiers ───────────────────────────────────────────────────────────
T('.tiers__head .u-eyebrow', 'tiers.eyebrow');
H('.tiers__head h2', 'tiers.h2');
T('.tiers__head p', 'tiers.lead');
H('.tiers__note', 'tiers.note');

const ROWKEYS = {
  'Fixed deposit': 'tier.row.deposit', 'Minimum stay / yr': 'tier.row.stay',
  'Dependents': 'tier.row.dependents', 'Property minimum': 'tier.row.propmin',
  'Validity': 'tier.row.validity', 'Offshore income / mo': 'tier.row.income',
  'Work rights': 'tier.row.work',
};
const ROWVALS = {
  'Spouse · children': 'tier.val.spouse', 'Whole family': 'tier.val.family',
  '90 days': 'tier.val.days', '5 years': 'tier.val.y5', '15 years': 'tier.val.y15',
  '20 years': 'tier.val.y20', 'Permitted': 'tier.val.permitted',
};
// Tier NAMES stay in English — they are the official MM2H programme designations
// (brief §7). Only the surrounding copy is localised.
const TIERDESC = ['tier.silver.desc', 'tier.gold.desc', 'tier.platinum.desc', 'tier.pvip.desc'];
$('.ptier').each((i, el) => {
  const c = $(el), isPvip = c.hasClass('ptier--dark');
  c.find('.ptier__ey').text(t[isPvip ? 'tier.pvip.eyebrow' : 'tier.label.eyebrow']);
  c.find('.ptier__desc').text(t[TIERDESC[i]]);
  c.find('.ptier__lab').text(t[isPvip ? 'tier.pvip.feelabel' : 'tier.label.feefrom']);
  c.find('.ptier__hint').text(t[isPvip ? 'tier.pvip.hint' : 'tier.label.hint']);
  c.find('.ptier__flag').text(t['tier.flag.gold']);
  c.find('.ptier__row').each((_, r) => {
    const k = $(r).find('.k'), v = $(r).find('.v');
    if (ROWKEYS[k.text().trim()]) k.text(t[ROWKEYS[k.text().trim()]]);
    if (ROWVALS[v.text().trim()]) v.text(t[ROWVALS[v.text().trim()]]);
  });
  const btn = c.find('.ptier__btn');
  const node = btn[0].children.find(x => x.type === 'text' && x.data.trim());
  if (node) node.data = t['tier.cta'];
});

// ─── education / property features ───────────────────────────────────────────
[['#education', 'edu'], ['#property', 'prop']].forEach(([sel, p]) => {
  const s = $(sel);
  s.find('.u-eyebrow').text(t[`${p}.eyebrow`]);
  s.find('h2.clip-line').html(t[`${p}.h2`]);
  s.find('.feat__copy > p.reveal').first().html(t[`${p}.lead`]);
  s.find('.feat__list li').each((i, li) => $(li).html(t[`${p}.li.${i + 1}`]));
  s.find('.feat__note').text(t[`${p}.note`]);
  s.find('.feat__badge .t').text(t[`${p}.badge.t`]);
  s.find('.feat__badge .s').text(t[`${p}.badge.s`]);
});
$('image-slot#edu-feature').attr('placeholder', t['ui.ph.educampus']);
$('image-slot#property-feature').attr('placeholder', t['ui.ph.propres']);

// ─── process ─────────────────────────────────────────────────────────────────
T('.proc__sticky .u-eyebrow', 'proc.eyebrow');
H('.proc__sticky h2', 'proc.h2');
T('.proc__curtitle', 'proc.1.title');
$('.proc__step').each((i, el) => {
  const n = i + 1, s = $(el);
  s.attr('data-title', t[`proc.${n}.title`]);   // read by upgrade.js for the sticky panel
  s.find('h3').text(t[`proc.${n}.title`]);
  s.find('p').text(t[`proc.${n}.body`]);
  s.find('.when').text(t[`proc.${n}.when`]);
});

// ─── life filmstrip ──────────────────────────────────────────────────────────
T('.film__head .u-eyebrow', 'life.eyebrow');
H('.film__head h2', 'life.h2');
LEAD('.film__drag', 'life.drag');               // keeps the trailing arrow svg
// Captions keyed to the slide's own image-slot id, never to its position — the
// design reorders this strip, and positional keys silently attach a caption to
// the wrong photograph.
const FILMKEY = {
  'life-1': 1, 'life-2': 2, 'life-3': 3, 'life-4': 4, 'life-5': 5, 'life-6': 6, 'life-7': 7,
  'life-8': 8, 'life-9': 9, 'life-10': 10,
};
$('.film__item').each((_, fig) => {
  const id = $(fig).find('image-slot').attr('id');
  const n = FILMKEY[id];
  const cap = $(fig).find('.cap');
  if (n && t[`life.cap.${n}`]) {
    cap.text(t[`life.cap.${n}`]);
    $(fig).find('image-slot').attr('placeholder', t[`ui.ph.life${n}`]);
  } else {
    untranslated.push(`film caption "${cap.text().trim()}" (${id})`);
  }
});

// ─── proof ───────────────────────────────────────────────────────────────────
T('.statx__head .u-eyebrow', 'proof.eyebrow');
H('.statx__head h2', 'proof.h2');
$('.statx__cell .l').each((i, el) => $(el).text(t[`proof.stat.${i + 1}`]));

// ─── faq ─────────────────────────────────────────────────────────────────────
T('.faqx__head .u-eyebrow', 'faq.eyebrow');
H('.faqx__head h2', 'faq.h2');
T('.faqx__head p', 'faq.lead');
$('.faqx__list details').each((i, el) => {
  const n = i + 1, d = $(el);
  d.find('.q').text(t[`faq.${n}.q`]);
  d.find('.a p').html(t[`faq.${n}.a`]);
});
T('.faqx__note', 'faq.note');

// ─── closing cta ─────────────────────────────────────────────────────────────
T('.ctax__l .u-eyebrow', 'cta.eyebrow');
H('.ctax__l h2', 'cta.h2');
T('.ctax__l p', 'cta.lead');
LEAD('.btn--gold .btn__l', 'cta.button');
LEAD('.ctax__phone', 'cta.phone');               // keeps the svg + <b>number</b>

// ─── footer ──────────────────────────────────────────────────────────────────
ATTR('.foot__logo', 'alt', 'footer.logo.alt');
T('.foot__row span', 'footer.legal', 0);
// data-cursor is gone from these links (refine.js removed the custom cursor),
// so match them by position within the footer's legal row instead.
T('.foot__row a', 'footer.privacy', 0);
T('.foot__row a', 'footer.terms', 1);
T('.foot__credits summary', 'footer.credits.summary');
// credits body stays English: photographer names and licence codes (brief §7)

// The design's expanded footer.
T('.foot__blurb', 'footer.blurb');
T('.foot__cta', 'footer.cta');
// Column order follows the design: Programmes · Services · Company · Talk to us.
// The phone number and email address are not translated (brief §7).
const FOOTCOLS = [
  { head: 'footer.col.programmes', links: ['footer.prog.silver', 'footer.prog.gold', 'footer.prog.platinum', 'footer.prog.pvip'] },
  { head: 'footer.col.services', links: ['footer.svc.visa', 'footer.svc.property', 'footer.svc.education', 'footer.svc.banking'] },
  { head: 'footer.col.company', links: ['footer.co.pathways', 'footer.co.process', 'footer.co.life', 'footer.co.faq'] },
  { head: 'footer.col.talk', links: [null, null], spans: ['footer.talk.cities', 'footer.talk.hours'] },
];
$('.foot__col').each((i, el) => {
  const c = FOOTCOLS[i], col = $(el);
  if (!c) return untranslated.push(`footer column ${i + 1} has no mapping`);
  col.find('h3').text(t[c.head]);
  col.find('a').each((j, a) => { if (c.links[j]) $(a).text(t[c.links[j]]); });
  (c.spans || []).forEach((k, j) => col.find('span').eq(j).text(t[k]));
});

// Anything user-facing the mapping above did not reach still ships in English.
$('.phz__cta, .phz__note, .foot__col h3, .foot__col a, .foot__col span, .foot__blurb, .foot__cta')
  .each((_, el) => {
    const s = $(el).text().trim();
    if (/^[A-Za-z0-9][A-Za-z0-9 &·,.()+@'-]*$/.test(s) && !/^[+@]|@/.test(s))
      untranslated.push(`"${s.slice(0, 40)}"`);
  });

// ─── cursor labels ───────────────────────────────────────────────────────────
const CURSOR = {
  Top: 'ui.cursor.top', Apply: 'ui.cursor.apply', Descend: 'ui.cursor.descend',
  Visas: 'ui.cursor.visas', Property: 'ui.cursor.property', Schools: 'ui.cursor.schools',
  Banking: 'ui.cursor.banking', Retirement: 'ui.cursor.retirement',
  Business: 'ui.cursor.business', Education: 'ui.cursor.education', Drag: 'ui.cursor.drag',
  Privacy: 'ui.cursor.privacy', Terms: 'ui.cursor.terms', Email: 'ui.cursor.email',
};
$('[data-cursor]').each((_, el) => {
  const k = CURSOR[$(el).attr('data-cursor')];
  if (k) $(el).attr('data-cursor', t[k]);
});

// ─── language switcher ───────────────────────────────────────────────────────
// index.html carries its own EN-side switcher and alternates; drop them so a
// rebuild replaces rather than duplicates.
$('.langsw').remove();
$('link[rel="alternate"]').remove();
$('link[href$="lang.css"]').remove();

// Every language is labelled in its OWN script, not the current page's — a
// reader looking for Simplified scans for 简体, whatever page they are on.
const LANGS = [
  { key: 'en', label: 'English',  lang: 'en',          href: '../index.html' },
  { key: 'tw', label: '\u7e41\u9ad4', lang: 'zh-Hant-TW', href: '../zh/index.html' },
  { key: 'cn', label: '\u7b80\u4f53', lang: 'zh-Hans-CN', href: '../zh-cn/index.html' },
];
const switcher = () => `
      <div class="langsw" role="group" aria-label="${t['ui.lang.aria']}">` +
  LANGS.map(l => l.key === TARGET
    ? `\n        <span class="langsw__opt is-on" aria-current="true">${l.label}</span>`
    : `\n        <a class="langsw__opt" href="${l.href}" hreflang="${l.lang}">${l.label}</a>`
  ).join('') + `
      </div>`;
$('.nav__right').prepend(switcher());
$('.vnav').append(switcher().replace('class="langsw"', 'class="langsw langsw--v"'));
// Third switcher inside the journey: the fixed header is hidden for the whole
// intro, so without this the first screen offers no way to change language.
$('.jhero').append(switcher().replace('class="langsw"', 'class="langsw langsw--hero"'));

$('head').append(
  `\n<link rel="alternate" hreflang="en" href="../index.html">` +
  `\n<link rel="alternate" hreflang="x-default" href="../index.html">` +
  `\n<link rel="alternate" hreflang="zh-Hant-TW" href="../zh/index.html">` +
  `\n<link rel="alternate" hreflang="zh-Hans-CN" href="../zh-cn/index.html">` +
  `\n<link rel="stylesheet" href="../i18n/lang.css">\n`);

// ─── rebase relative paths (the page now lives one directory down) ───────────
let out = $.html();
out = out
  .replace(/(\b(?:src|href|poster|data-img|data-icon)=")(?!https?:|#|\.\.\/|\/)\.?\/?(?=[a-z])/g, '$1../')
  .replace(/(data-base=")(?!https?:|\.\.\/)\.?\/?/g, '$1../');
// the switcher's own links were just rebased by the rule above — undo that
out = out.replace(/href="\.\.\/\.\.\/index\.html"/g, 'href="../index.html"');
// The zh self-referencing alternate must point at THIS page. The rebase above
// rewrote its "./index.html" to "../index.html", i.e. at the English page —
// which tells search engines the Chinese URL's zh-TW version is the English one.
out = out.replace(
  new RegExp('(<link rel="alternate" hreflang="' + ED.lang + '" href=")[^"]*(")'),
  '$1./index.html$2');
// Every CTA must land on the Chinese form, not the English one. These are
// root-relative so the path rebase above deliberately leaves them alone.
out = out.replace(/href="\/application\/\?src=/g, 'href="/' + ED.dir + '/application/?src=');

fs.mkdirSync(path.join(ROOT, ED.dir), { recursive: true });
fs.writeFileSync(path.join(ROOT, ED.dir, 'index.html'), out);

console.log(miss.length
  ? `\n  ${miss.length} UNRESOLVED SELECTORS:\n${miss.map(m => '    ' + m).join('\n')}\n`
  : '\n  all selectors matched\n');
if (untranslated.length) {
  console.log(`  ${untranslated.length} STRINGS SHIPPING IN ENGLISH (design added them after the translation):`);
  console.log(untranslated.map(m => '    ' + m).join('\n') + '\n');
}
console.log(`  → ${ED.dir}/index.html (${(out.length / 1024).toFixed(0)} KB)\n`);
// Unresolved selectors mean the page is structurally wrong — fail. Untranslated
// strings are a known, reported gap, not a build failure.
process.exitCode = miss.length ? 1 : 0;

// ─── application quiz ────────────────────────────────────────────────────────
// A second, simpler pass. This page was authored by us with data-i18n keys, so
// it needs no selector map at all — walk the attributes and swap. index.html
// gets the selector treatment above only because it predates the i18n work.
(function buildApplication() {
  const src = path.join(ROOT, 'application', 'index.html');
  if (!fs.existsSync(src)) return;

  const $a = cheerio.load(fs.readFileSync(src, 'utf8'), { decodeEntities: false });
  const gaps = [];

  $a('[data-i18n]').each((_, el) => {
    const k = $a(el).attr('data-i18n');
    if (!(k in t)) return gaps.push(k);
    const attr = $a(el).attr('data-i18n-attr');   // e.g. translate the content="" of a meta
    if (attr) $a(el).attr(attr, t[k]); else $a(el).text(t[k]);
  });

  $a('html').attr('lang', ED.lang);

  // Same three-way switcher as the marketing page, from one level deeper.
  const APPLANG = [
    { key: 'en', label: 'English',  lang: 'en',          href: '../../application/index.html' },
    { key: 'tw', label: '\u7e41\u9ad4', lang: 'zh-Hant-TW', href: '../../zh/application/index.html' },
    { key: 'cn', label: '\u7b80\u4f53', lang: 'zh-Hans-CN', href: '../../zh-cn/application/index.html' },
  ];
  $a('.langsw').attr('aria-label', t['ui.lang.aria']).html(
    APPLANG.map(l => l.key === TARGET
      ? `\n      <span class="langsw__opt is-on" aria-current="true">${l.label}</span>`
      : `\n      <a class="langsw__opt" href="${l.href}" hreflang="${l.lang}">${l.label}</a>`
    ).join('') + '\n    ');

  $a('link[rel="alternate"]').remove();
  $a('head').append(
    APPLANG.map(l => `\n<link rel="alternate" hreflang="${l.lang}" href="${l.key === TARGET ? './index.html' : l.href}">`).join('') +
    `\n<link rel="alternate" hreflang="x-default" href="../../application/index.html">\n`);

  let out = $a.html();
  // The page sits one level deeper than the English original, so shared
  // resources need another hop. Page links stay as they are: "../index.html"
  // already resolves to the Chinese homepage from /zh/application/.
  ['../assets/', '../styles.css', '../application.css', '../application.js', '../i18n/']
    .forEach(p => { out = out.split('"' + p).join('"../' + p); });

  fs.mkdirSync(path.join(ROOT, ED.dir, 'application'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, ED.dir, 'application', 'index.html'), out);

  console.log(gaps.length
    ? `  application: ${gaps.length} untranslated key(s): ${gaps.join(', ')}\n`
    : '  application: all keys resolved\n');
  console.log(`  → ${ED.dir}/application/index.html (${(out.length / 1024).toFixed(0)} KB)\n`);
})();
