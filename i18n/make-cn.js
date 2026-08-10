/* ============================================================================
   zh-TW.json  →  zh-CN.json

   Two stages, because one is not enough:

   1. opencc tw→cn converts the CHARACTERS (繁 → 简).
   2. A vocabulary layer converts the WORDS. opencc leaves most Taiwan-specific
      vocabulary intact — 透過→透过, 聯絡→联络, 資訊→资讯 are all valid simplified
      strings that a mainland reader would still clock as Taiwanese. The whole
      zh-TW copy was deliberately written in Taiwan vocabulary, so without this
      stage the simplified site reads as a Taiwanese site in disguise.

   Malaysian official terminology (准证, 令吉) is deliberately NOT localised:
   those are the terms on the actual documents.

   Run:  node i18n/make-cn.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const DIR = __dirname;
const tw = JSON.parse(fs.readFileSync(path.join(DIR, 'zh-TW.json'), 'utf8'));
const toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' });

/* ---- stage 2: Taiwan word → mainland word ------------------------------- */
// Longest-first so 工作天 is handled before any shorter overlap.
const VOCAB = [
  ['透過', '通过'],       ['聯絡', '联系'],       ['聯繫', '联系'],
  ['資訊', '信息'],       ['影片', '视频'],       ['網路', '网络'],
  ['線上', '在线'],       ['品質', '质量'],       ['專案', '项目'],
  ['遠距', '远程'],       ['工作天', '工作日'],   ['計畫', '计划'],
  ['行動裝置', '移动设备'], ['數位', '数字'],     ['伺服器', '服务器'],
  ['資料', '资料'],       ['幼稚園', '幼儿园'],   ['國小', '小学'],
  ['國中', '初中'],       ['高中職', '高中'],     ['錄取', '录取'],
  ['諮詢', '咨询'],       ['審核', '审核'],       ['據點', '据点'],
  ['物件', '房源'],       ['承租', '租赁'],       ['房仲', '中介'],
  ['優先', '优先'],       ['預算', '预算'],       ['安頓', '安顿'],
  ['移居', '移居'],       ['申辦', '办理'],       ['核發', '签发'],
  ['退件', '退回'],       ['備齊', '备齐'],       ['媒合', '对接'],
  ['分別', '分别'],       ['歡迎', '欢迎'],
];

// Applied after opencc, so both sides are written in simplified characters.
const MAP = VOCAB.map(([a, b]) => [toSimplified(a), b])
  .filter(([a, b]) => a !== b)
  .sort((x, y) => y[0].length - x[0].length);

/* ---- explicit per-key overrides ---------------------------------------- */
// Anything the two mechanical stages cannot know. Keep this list short and
// justified; it is read by humans reviewing the simplified site.
const OVERRIDE = {
  // LINE is a Taiwan/Japan messenger with almost no mainland presence. Naming
  // it to a mainland reader is noise at best. Left generic until the client
  // confirms which channel the simplified audience should be pointed at.
  'cta.line': '加入官方帐号',
  // 定存 is Taiwanese shorthand; mainland writes the term out.
  'hub.4.tag.2': '定期存款',
};

const cn = {};
const changed = [];
for (const [k, v] of Object.entries(tw)) {
  let s = toSimplified(v);
  const before = s;
  for (const [a, b] of MAP) if (s.includes(a)) s = s.split(a).join(b);
  if (k in OVERRIDE) s = OVERRIDE[k];
  if (s !== before) changed.push(k);
  cn[k] = s;
}

fs.writeFileSync(path.join(DIR, 'zh-CN.json'), JSON.stringify(cn, null, 2) + '\n');

/* ---- report ------------------------------------------------------------- */
// Scan for Traditional-only characters directly. Re-running the converter and
// comparing does NOT work: opencc tw→cn maps 么 → 幺 on a second pass, so every
// string containing 什么 — correct mainland usage — looked like a failure.
const TRAD_ONLY = '們個這來時從東車專層實對開經過還進遠達運連邊點樣種級約線結給續總舉樂習書買賣產業華為說認讓議題問門單務請應會無長國學後見語關項適當獨隨錄';
const stillTraditional = Object.entries(cn)
  .filter(([, v]) => [...v].some(ch => TRAD_ONLY.includes(ch)))
  .map(([k]) => k);

console.log('');
console.log(`  ${Object.keys(cn).length} keys → zh-CN.json`);
console.log(`  vocabulary adjusted beyond character conversion: ${changed.length} key(s)`);
console.log(`  explicit overrides: ${Object.keys(OVERRIDE).join(', ')}`);
console.log(stillTraditional.length
  ? `  ** still traditional: ${stillTraditional.join(', ')}`
  : '  no traditional characters remain');
console.log('');
