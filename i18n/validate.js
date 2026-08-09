// Validate a translation drop against the brief, then emit zh-TW.json.
//   node i18n/validate.js
// Checks: key coverage · Simplified characters · Taiwan vocabulary drift ·
// inline-tag integrity · character budgets · banned marketing register.
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const brief = fs.readFileSync(path.join(DIR, 'zh-TW-translation-brief.md'), 'utf8');
const raw = fs.readFileSync(path.join(DIR, 'zh-TW.raw.txt'), 'utf8');

// ---- expected keys, from section 9 of the brief -----------------------------
const sec9 = brief.split('## 9. The copy')[1].split('## 10.')[0];
const expected = [
  ...sec9.matchAll(/^\[\[([a-z0-9.]+)\]\]/gm),
  ...sec9.matchAll(/^\| `([a-z0-9.]+)`/gm),
].map(m => m[1]);

// ---- parse the drop ---------------------------------------------------------
// A value ends at the first blank line, not at the next [[key]] — the revisions
// file carries explanatory prose between entries, and running to the next key
// would swallow it into the preceding string.
const parse = src => {
  const out = {}, seq = [];
  src.split(/\n(?=\[\[)/).forEach(block => {
    const m = block.match(/^\[\[([a-z0-9.]+)\]\]\n([\s\S]*?)(?:\n\s*\n|$)/);
    if (m) { out[m[1]] = m[2].trim(); seq.push(m[1]); }
  });
  return { out, seq };
};

const base = parse(raw);
const got = base.out;
const order = base.seq;

// Editorial pass layered over the raw model output: overrides existing keys and
// adds keys for copy the design introduced later. Kept in its own file so the
// as-received translation stays auditable.
const revPath = path.join(DIR, 'zh-TW.revisions.txt');
const revised = [], added = [];
if (fs.existsSync(revPath)) {
  const rev = parse(fs.readFileSync(revPath, 'utf8'));
  rev.seq.forEach(k => {
    if (k in got) { if (got[k] !== rev.out[k]) revised.push(k); }
    else { added.push(k); order.push(k); }
    got[k] = rev.out[k];
  });
}

const fail = [], warn = [];
const F = (k, msg) => fail.push(`${k}: ${msg}`);
const W = (k, msg) => warn.push(`${k}: ${msg}`);

// ---- 1. coverage ------------------------------------------------------------
const missing = expected.filter(k => !(k in got));
// Keys the editorial pass added are intentional, not stray output.
const extra = order.filter(k => !expected.includes(k) && !added.includes(k));
const dupes = order.filter((k, i) => order.indexOf(k) !== i);

// ---- 2. Simplified characters ----------------------------------------------
// opencc s2t: any character it rewrites is a Simplified form that leaked in.
// 准 is the exception — Simplified merges 准/準, but 准 is itself a valid
// Traditional character (准證, 批准), which is exactly how this copy uses it.
// 了 likewise: opencc maps 了解→瞭解, but 了 is a valid Traditional character and
// 了解 is standard usage in Taiwan. Style preference, tracked under DRIFT instead.
const AMBIGUOUS = new Set(['准', '了']);
const s2t = require('opencc-js').Converter({ from: 'cn', to: 'tw' });
const simp = {};
for (const [k, v] of Object.entries(got)) {
  const conv = s2t(v);
  const hits = [...new Set([...v].filter((c, i) => conv[i] !== c && !AMBIGUOUS.has(c)))];
  if (hits.length) simp[k] = hits.map(c => `${c}→${s2t(c)}`).join(' ');
}

// ---- 3. Taiwan vocabulary drift --------------------------------------------
// Traditional characters, but mainland/HK word choice. Not errors — flags.
const DRIFT = [
  ['計劃', '計畫', 'TW prefers 計畫 for "plan"'],
  ['信息', '資訊', 'mainland term'],
  ['通過', '透過', 'TW prefers 透過 for "via"'],
  ['聯繫', '聯絡', 'TW prefers 聯絡'],
  ['項目', '專案', 'mainland sense of "project"'],
  ['網絡', '網路', 'mainland term'],
  ['視頻', '影片', 'mainland term'],
  ['質量', '品質', 'mainland term'],
  ['用戶', '使用者', 'mainland term'],
  ['高端', '頂級', 'mainland register'],
  ['移民', '長期居留／移居', 'brief §5.4: MM2H is not immigration'],
];
// Contexts where the flagged token is correct and must not be reported:
// 移民局 is the Immigration Department's actual name; 服務項目 is ordinary
// Taiwanese for "services" and has nothing to do with the "project" sense.
const DRIFT_OK = { '移民': ['移民局'], '項目': ['服務項目'] };
const drift = [];
for (const [k, v] of Object.entries(got))
  for (const [bad, good, why] of DRIFT) {
    if (!v.includes(bad)) continue;
    const exempt = (DRIFT_OK[bad] || []).some(ctx =>
      v.split(bad).length - 1 <= v.split(ctx).length - 1);
    if (!exempt) drift.push({ k, bad, good, why });
  }

// ---- 4. banned marketing register -------------------------------------------
const BANNED = ['賦能', '打造', '助力', '一鍵', '極致', '尊享', '盡享', '立即搶購',
  '名額有限', '專屬定制', '保證通過', '輕鬆擁有', '財富自由', '躺贏',
  '保證', '必定', '一定能', '100%'];
const banned = [];
for (const [k, v] of Object.entries(got))
  for (const b of BANNED) if (v.includes(b)) banned.push({ k, b });

// ---- 5. inline tag + literal integrity --------------------------------------
// Every tag and protected literal in the English must survive in the Chinese.
const enBlocks = {};
[...sec9.matchAll(/^\[\[([a-z0-9.]+)\]\]\n([\s\S]*?)(?=\n\n|\n```)/gm)]
  .forEach(m => { enBlocks[m[1]] = m[2].trim(); });

// &amp; is excluded: it encodes the English "&", which Chinese renders as 與/與.
// &nbsp; is NOT excluded — it holds "RM 1,000,000" together and must survive.
const tagsOf = s => (s.match(/<[^>]+>|&nbsp;/g) || []).sort();
for (const [k, en] of Object.entries(enBlocks)) {
  if (!(k in got)) continue;
  const a = tagsOf(en), b = tagsOf(got[k]);
  if (a.join('|') !== b.join('|')) F(k, `tags differ — EN [${a}] vs ZH [${b}]`);
}

const LITERALS = /US\$\d+\w*|RM&nbsp;[\d,]*\d|RM \d+\w*|\+60 3 2710 8800|© 2026|\b\d{4}\b|50%|IGCSE|A-Levels|\bIB\b|PVIP|SEZ|MM2H/g;
for (const [k, en] of Object.entries(enBlocks)) {
  if (!(k in got)) continue;
  const need = [...new Set(en.match(LITERALS) || [])];
  const lost = need.filter(x => !got[k].includes(x));
  if (lost.length) F(k, `literal(s) dropped: ${lost.join(', ')}`);
}

// ---- 6. character budgets ---------------------------------------------------
// Counts CJK + Latin words; budgets in the brief are CJK-character counts.
const BUDGETS = {
  'nav.hub': 5, 'nav.pathways': 5, 'nav.pricing': 5, 'nav.property': 5, 'nav.life': 5,
  'nav.cta': 8, 'ui.cursor.': 4, 'marq.': 4,
  'hub.1.title': 8, 'hub.2.title': 8, 'hub.3.title': 8, 'hub.4.title': 8,
  'tier.row.': 8, 'tier.flag.gold': 6, 'tier.pvip.eyebrow': 8, 'tier.pvip.feelabel': 8,
  'tier.label.feefrom': 8, 'tier.cta': 8, 'cta.button': 8, 'cta.phone': 6, 'cta.line': 10,
  'edu.badge.': 8, 'prop.badge.': 8, 'vhero.tag': 12, 'life.cap.': 12, 'ui.ph.': 12,
  'proc.1.title': 10, 'proc.2.title': 10, 'proc.3.title': 10, 'proc.4.title': 10, 'proc.5.title': 10,
  'path.1.title': 10, 'path.2.title': 10, 'path.3.title': 10,
  'hero.beat.1.k': 10, 'hero.beat.2.k': 10, 'hero.beat.3.k': 10,
};
const visible = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
// Budgets are about rendered width, so measure in CJK-width units: a CJK glyph
// is 1, a run of Latin/digits is roughly half that per character.
const width = s => [...s.replace(/[A-Za-z0-9$+.,·\s]+/g, m => '　'.repeat(Math.ceil(m.trim().length / 2)))].length;
for (const [k, v] of Object.entries(got)) {
  const rule = Object.keys(BUDGETS).find(p => k === p || (p.endsWith('.') && k.startsWith(p)));
  if (!rule) continue;
  const n = width(visible(v));
  if (n > BUDGETS[rule]) W(k, `~${n} width units, budget ${BUDGETS[rule]} — "${visible(v)}"`);
}

// ---- 7. CJK/Latin spacing ---------------------------------------------------
const spacing = [];
for (const [k, v] of Object.entries(got)) {
  const t = visible(v);
  if (/[一-鿿][A-Za-z0-9]|[A-Za-z0-9][一-鿿]/.test(t)
      && !/[（）「」，。、：；？·]/.test(t.match(/[一-鿿][A-Za-z0-9]|[A-Za-z0-9][一-鿿]/)[0]))
    spacing.push({ k, sample: t.slice(0, 40) });
}

// ---- report -----------------------------------------------------------------
const line = s => console.log(s);
line('');
line('  KEY COVERAGE');
line(`    brief ${expected.length} · total ${order.length} · missing ${missing.length} · extra ${extra.length} · dupes ${dupes.length}`);
line(`    editorial pass: ${revised.length} revised, ${added.length} added`);
if (revised.length) line(`    revised: ${revised.join(', ')}`);
if (missing.length) line(`    MISSING: ${missing.join(', ')}`);
if (extra.length) line(`    EXTRA:   ${extra.join(', ')}`);
if (dupes.length) line(`    DUPES:   ${dupes.join(', ')}`);

line('');
line('  SIMPLIFIED CHARACTERS');
line(Object.keys(simp).length ? Object.entries(simp).map(([k, v]) => `    ${k}: ${v}`).join('\n') : '    none — all Traditional');

line('');
line('  BLOCKING (tags / literals)');
line(fail.length ? fail.map(s => '    ' + s).join('\n') : '    none');

line('');
line('  TAIWAN VOCABULARY DRIFT');
line(drift.length ? drift.map(d => `    ${d.k}: "${d.bad}" → suggest "${d.good}" (${d.why})`).join('\n') : '    none');

line('');
line('  BANNED REGISTER');
line(banned.length ? banned.map(b => `    ${b.k}: "${b.b}"`).join('\n') : '    none');

line('');
line('  OVER BUDGET');
line(warn.length ? warn.map(s => '    ' + s).join('\n') : '    none');

line('');
line('  CJK/LATIN SPACING');
line(spacing.length ? spacing.map(s => `    ${s.k}: ${s.sample}`).join('\n') : '    ok');

// ---- emit -------------------------------------------------------------------
if (!missing.length && !fail.length && !Object.keys(simp).length) {
  fs.writeFileSync(path.join(DIR, 'zh-TW.json'), JSON.stringify(got, null, 2) + '\n');
  line('');
  line(`  → wrote zh-TW.json (${order.length} keys)`);
} else {
  line('');
  line('  → zh-TW.json NOT written; resolve blocking issues above');
  process.exitCode = 1;
}
line('');
