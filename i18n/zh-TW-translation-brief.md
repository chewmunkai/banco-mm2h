# Banco MM2H — Traditional Chinese (zh-TW) Translation Brief

**For: DeepSeek** · **Target locale: 繁體中文 · 台灣 (zh-TW)** · **Source: English (en)**
**Version:** 1 · **Source file:** `index.html` (Banco MM2H immersive marketing site)

---

## 0. Your task, in one paragraph

You are translating the complete copy of a marketing website for **Banco MM2H**, a licensed Malaysian relocation advisory. The new Chinese version targets **clients in Taiwan**. Read sections 1–8 before translating a single line — they define the audience, voice, terminology and legal guardrails. Section 9 contains every string to translate, each with a stable key. Section 10 is a self-check you must run before you return your answer.

This is **not** a literal translation job. It is a **transcreation** job: the English is deliberately restrained and premium, and the Chinese must feel like it was written in Taipei by a native copywriter for that same brand — not translated. Where a literal rendering would sound stiff, translated, or mainland-Chinese, rewrite it so it reads naturally to a Taiwanese reader while preserving the meaning, the hedges and the restraint.

---

## 1. Output format (follow exactly)

Return **only** a list of keyed blocks, in the same order as section 9. No preamble, no commentary between blocks, no re-printing of the English.

```
[[key.name]]
翻譯後的內容

[[next.key]]
翻譯後的內容
```

Rules:
- One blank line between blocks. Nothing else between them.
- Reproduce the key **exactly**, including dots. If a key is missing from your output the string will ship in English.
- Preserve any inline markup shown in the English, exactly: `<b>…</b>`, `<span>…</span>`, `<br>`, `&nbsp;`, `→`, `↗`, `↓`, `·`. Translate the text around them, never the tags.
- Multi-line source (marked `⏎`) stays multi-line in your output at the same break point.
- After the final block, add one section headed `## 譯者備註` listing any term you were unsure about, any string you could not fit within its character budget, and any claim you think creates a compliance risk. This is the only place you may write commentary.

---

## 2. What Banco MM2H is

**MM2H (Malaysia My Second Home)** is a Malaysian government long-stay visa programme for foreigners. It is **not** immigration and **not** citizenship — holders keep their own nationality. It is renewable, allows dependents, and is tiered (Silver / Gold / Platinum, plus a separate PVIP premium visa and an SEZ pathway). Requirements are set by the Government of Malaysia, revised periodically, and differ by state — Sarawak and Sabah run their own programmes.

**Banco MM2H** is a licensed advisory in Kuala Lumpur (est. 2014, offices KL / Penang / Johor). Its proposition is *one advisor, end to end*: eligibility assessment, document preparation, lodging the application with the authorities, then property, international schooling, banking and tax introductions, and settling-in support. The differentiator is **calm and coordination**, not price and not speed.

---

## 3. Who is reading this (Taiwan)

Affluent Taiwanese aged roughly 40–65: retirees and near-retirees, business owners and investors, and parents of school-age children. They are researching Malaysia as a **second base**, not an escape. What they weigh:

- **Cost of living and healthcare** — Malaysian private hospitals are excellent and far cheaper than Taiwan's private options or the West's.
- **Mandarin works there.** Malaysia has a large Chinese-Malaysian population; Mandarin and Chinese-medium schooling are part of daily life. For a Taiwanese family this is the single biggest softener of relocation anxiety — the copy should let that land where it naturally fits, without inventing claims the English does not make.
- **International schooling** — British/IGCSE, IB, American, Australian and Canadian curricula, with onward university routes.
- **Keeping Taiwanese citizenship and ties.** They are not emigrating. Framing that suggests cutting ties, or 移民 in the "give up your country" sense, will repel this reader.
- **Proximity** — direct flights, same time zone band, easy to go back and forth.

**Register:** address the reader as **您**, never 你. Professional, warm, unhurried. This is a private-advisory tone, not a property-agent tone.

---

## 4. Voice — what to preserve

The English voice is **quiet, precise and confident**. It never oversells. It uses understatement as a status signal. Preserve that.

| Do | Don't |
|---|---|
| Short, calm declarative sentences | Exclamation marks, rhetorical questions stacked for hype |
| Concrete nouns: 簽證、產權、定存、學位 | Vague abstractions: 全方位賦能、打造美好未來 |
| Understatement: 「安排妥當」 | Superlatives: 最頂級、業界第一、獨家 |
| Let the facts carry the weight | Emotional pressure, urgency, scarcity |
| Natural Taiwanese rhythm; vary sentence length | Four-character-idiom carpet-bombing (成語堆砌) |

**Specifically banned marketing register** — these are mainland-corporate or hard-sell tics and must not appear:
賦能 · 打造 · 助力 · 一鍵 · 極致 · 尊享 · 盡享 · 立即搶購 · 名額有限 · 專屬定制 · 保證通過 · 輕鬆擁有 · 財富自由 · 躺贏

**Tone anchor.** The English line *"Relocating a life takes a hundred decisions. We make them feel like one."* is the brand in one sentence. Everything you write should sound like it could sit next to that line.

---

## 5. zh-TW locale rules (critical)

Write **Traditional Chinese as used in Taiwan** — not Simplified converted to Traditional, and not Hong Kong usage. Character conversion alone is not enough; the *vocabulary* must be Taiwanese.

### 5.1 Mainland → Taiwan vocabulary

| ✗ Mainland | ✓ Taiwan |
|---|---|
| 信息 | 資訊 |
| 项目 / 項目 (as "initiative") | 專案 |
| 通过 / 通過 (as "via") | 透過 |
| 计划 | 計畫 |
| 联系 | 聯絡 |
| 咨询 | 諮詢 |
| 视频 | 影片 / 視訊 |
| 网络 · 网上 | 網路 · 線上 |
| 数据 | 資料 |
| 用户 | 使用者 |
| 质量 | 品質 |
| 服务 | 服務 |
| 小学 · 中学 | 國小 · 國中 |
| 幼儿园 | 幼稚園 |
| 高端 | 頂級 / 高階 |
| 性价比 | CP 值 |
| 房产 | 房產 / 不動產 |
| 出租 (as lease-in) | 租賃 |
| 预约 | 預約 |
| 邮件 | 信件 |

### 5.2 Punctuation and typography

- Full-width Chinese punctuation throughout: `，。、；：？「」（）`
- Quotation marks: `「」` and `『』` — **never** `“”`
- Keep the em dash `—` and the interpunct `·` where the English uses them; they are part of the brand's typographic style.
- **Space between Chinese and Latin/numerals**: 「RM 1,000,000」「US$150k」「IB 課程」「MM2H 申請」. Apply consistently.
- No full-width Latin characters or full-width digits.

### 5.3 Domain terminology

Malaysia's official Chinese terminology sometimes differs from what a Taiwanese reader would say. **Rule: use the Malaysian official term, and on its first appearance add a short Taiwanese-friendly gloss in parentheses.** After first use, the official term alone is fine.

| English | Use | Note |
|---|---|---|
| MM2H | MM2H | Keep the acronym. First use: MM2H（馬來西亞第二家園計畫） |
| Dependent pass | 家屬准證 | 准證 is the Malaysian term; gloss on first use |
| Student pass | 學生准證 | |
| Fixed deposit | 定期存款（定存） | |
| Endorsement (visa in passport) | 簽註 | Standard TW immigration term |
| Freehold | 永久產權 | |
| Leasehold | 租賃產權 | |
| Title check | 產權查核 | |
| Conveyancing lawyer | 不動產過戶律師 | |
| Ringgit / RM | 令吉（RM） | 令吉 is standard for MYR |
| Long-stay visa | 長期居留簽證 | |
| Advisory / advisor | 顧問 | Not 中介, not 仲介 — those read as broker |
| Concierge | 專人服務 / 管家式服務 | Not 禮賓司 |

### 5.4 The word 移民 — handle with care

MM2H is **not** immigration. Avoid 移民 as the headline framing. Prefer **長期居留**、**第二家園**、**海外置居**. This is both accurate and commercially smarter for a Taiwanese reader who has no intention of giving up citizenship. Where the English says "relocation", 搬遷 / 移居 is fine; 移民 is not.

### 5.5 No political framing

Do not introduce cross-strait, geopolitical, security or "escape route" framing anywhere, however subtly. The English contains none of it and it must not appear in the Chinese. Malaysia is presented as a warm, practical, well-organised second home. Nothing more.

---

## 6. Compliance guardrails (do not soften these)

This site sells immigration-adjacent and financial-adjacent advisory services. The English is **deliberately hedged**, and Chinese translation has a strong tendency to firm hedges up into promises. That would create real regulatory and legal exposure. Treat the hedges as load-bearing.

**Hard rules:**
1. **Never** convert a hedge into a guarantee. 「可能」「通常」「目前」「視個案而定」must survive. Never write 保證、必定、一定能、100%.
2. **Never** drop or shorten the disclaimers. Where the English says *"indicative"*, *"we confirm the current requirements"*, *"revised periodically"*, *"differ by state"* — every one of those qualifications must appear in the Chinese.
3. **Approval rate 98%** is a historical statistic, not a promise. Do not phrase it as an assurance of future approval.
4. **Do not invent numbers, timelines, thresholds or entitlements.** If the English does not state it, it does not exist. Where the English gives a range or an approximation (「commonly around RM 1,000,000」), keep it approximate.
5. **Tax and legal**: the English explicitly refuses one-size-fits-all promises. Keep that refusal explicit.
6. Advertising immigration-related services is regulated in Taiwan. Copy that reads as a guarantee of residency, approval or investment return is the specific risk. When in doubt, hedge harder and flag it in 譯者備註.

---

## 7. Do not translate

Leave these **exactly** as they appear:

- Brand: **BANCO**, **Banco MM2H**, **Banco MM2H Sdn Bhd**, **MM2H**, **PVIP**
- Tier names in card titles: **Silver**, **Gold**, **Platinum**, **PVIP** — these are the official programme designations and Taiwanese readers researching MM2H will meet them in English. Put the Chinese gloss in the tier's *description* line instead, where the key allows.
- All figures and currency: `RM 40k`, `RM 1M`, `US$150k`, `US$1M`, `RM 1,000,000`, `2400+`, `98%`, `4.9`, `50%`
- Contact: `+60 16-288 0300`, `hello@bancomm2h.my`, `app.bancomm2h.com`
- Place names keep standard Chinese forms: Kuala Lumpur → 吉隆坡 · Penang → 檳城 · Johor → 柔佛 · George Town → 喬治市 · Iskandar Puteri → 依斯干達公主城 · Sarawak → 砂拉越 · Sabah → 沙巴 · Perhentian → 停泊島 · Puteri Harbour → 公主港
- Curriculum names: **IGCSE**, **A-Levels**, **IB** (International Baccalaureate → 國際文憑 IB)
- Coordinates `3°08′N`, year `2014`, `© 2026`
- Everything in `footer.credits.body` (photographer names and licence codes) — this block is **excluded** from translation entirely; only its summary label is translated.

---

## 8. Length budgets

Chinese runs roughly 50–60% the character count of English, but some slots are width-constrained. Where a budget is given in section 9, treat it as hard — over-length text breaks the layout.

- **Navigation links:** ≤ 5 characters
- **Buttons / CTAs:** ≤ 8 characters
- **Tags, pills, eyebrows, badges:** ≤ 10 characters
- **Cursor labels** (`ui.cursor.*`): ≤ 4 characters
- **Table row keys** in the pricing cards: ≤ 8 characters
- Headings and body paragraphs: no hard limit, but do not expand. If the Chinese runs materially longer than the English, you are over-writing — cut it back.

---

## 9. The copy

> Format reminder: return `[[key]]` then the translation, blank line, next block. Preserve inline tags exactly.

### 9.1 Page metadata

| Key | English | Notes |
|---|---|---|
| `meta.title` | Banco MM2H — A second home in Malaysia | Browser tab + search title |

### 9.2 Navigation

| Key | English | Notes |
|---|---|---|
| `nav.hub` | Our hub | ≤ 5 chars |
| `nav.pathways` | Pathways | ≤ 5 chars |
| `nav.pricing` | Pricing | ≤ 5 chars |
| `nav.property` | Property | ≤ 5 chars |
| `nav.life` | Life here | ≤ 5 chars |
| `nav.faq` | FAQ | May stay as FAQ, or 常見問題 |
| `nav.cta` | Begin application | ≤ 8 chars. Appears on every screen |
| `nav.brand.sub` | Advisory & Consultancy | Under the BANCO wordmark. The firm’s name — keep it English in every edition |
| `nav.burger.aria` | Open menu | Screen-reader label, not visible |

### 9.3 Opening journey (Earth → Kuala Lumpur)

This is an animated scroll sequence. The headline is split across two blocks that appear at different moments — keep each block short and self-contained, and keep the two-line break in `hero.title.top`.

```
[[hero.title.top]]
A second home

[[hero.title.bottom]]
In Malaysia

[[hero.title.script]]
thoughtfully
```

Note on `hero.title.bottom` + `hero.title.script`: together they read *"Malaysia thoughtfully"* — the script word is set in an italic serif as a flourish. In Chinese, produce a pairing that works the same way: a place word plus a short evocative modifier (2–4 characters) that can stand alone typographically.

```
[[hero.lead]]
Scroll to descend, from Earth to Kuala Lumpur. One eco-system hub for visas, property, schooling, banking and tax, all the way down.

[[hero.cta.primary]]
Begin your descent

[[hero.cta.secondary]]
Begin application

[[hero.side.left]]
MM2H · Est. 2014

[[hero.side.right]]
Kuala Lumpur · 3°08′N

[[hero.beat.1.k]]
Entering orbit

[[hero.beat.1.l]]
A calmer life is closer than you think.

[[hero.beat.2.k]]
Approaching Malaysia

[[hero.beat.2.l]]
Tropical, affordable, world-class healthcare.

[[hero.beat.3.k]]
Touchdown · Kuala Lumpur

[[hero.beat.3.l]]
Welcome to your second home.

[[hero.scrollcue]]
Scroll to descend
```

`hero.beat.*.k` are ≤ 10 characters (small caps labels). `hero.beat.*.l` are one short line each.

### 9.4 Video hero (Kuala Lumpur)

```
[[vhero.title]]
Your second home,⏎in Malaysia

[[vhero.sub]]
A calmer, well-arranged life in Malaysia. Visas, property, schooling and banking, handled end to end by one advisor.

[[vhero.cta.primary]]
Begin application

[[vhero.cta.secondary]]
Explore now

[[vhero.tag]]
Live. Invest. Belong.
```

`vhero.title` — keep the line break. `vhero.tag` is a three-beat rhythmic tagline on a glass pill (≤ 12 characters); reproduce the *rhythm*, not the literal words. Three balanced beats.

### 9.5 Manifesto

```
[[manifesto.eyebrow]]
Malaysia, thoughtfully arranged

[[manifesto.h2]]
A new country.<br>Hundreds of decisions.<br><span class="u-script">We make them simple and transparent.</span>

[[manifesto.1.k]]
One advisor

[[manifesto.1.v]]
A single point of contact from first enquiry to the day you land. Never a queue, never a hand-off.

[[manifesto.2.k]]
End to end

[[manifesto.2.v]]
Visa, property, schooling, banking and tax, arranged together, in the right order, on one timeline.

[[manifesto.3.k]]
Licensed partners

[[manifesto.3.v]]
Your application is lodged by a licensed MM2H partner. We coordinate them, check every document and track every milestone for you.
```

`manifesto.h2` is the brand's signature line — spend the most time here. The `<span class="u-script">` portion is set in italic serif; it should be the emotional payoff of the sentence. Keep both spans, keep their order.

### 9.6 Marquee (scrolling ribbon)

| Key | English | Notes |
|---|---|---|
| `marq.1` | Visas | ≤ 4 chars |
| `marq.2` | Property | ≤ 4 chars |
| `marq.3` | Schooling | ≤ 4 chars |
| `marq.4` | Banking | ≤ 4 chars |
| `marq.5` | Tax | ≤ 4 chars |
| `marq.6` | Concierge | ≤ 4 chars |

These scroll horizontally as single words. Keep them uniform in length if you can — it is a typographic rhythm.

### 9.7 Hub — one hub, every step

```
[[hub.eyebrow]]
One hub, every step

[[hub.h2]]
Everything a second home needs, <span class="u-script">under one roof.</span>

[[hub.1.title]]
Visa & residency

[[hub.1.body]]
We assess your tier and prepare and check every document; your licensed MM2H partner lodges it with the authorities. We track each milestone to endorsement and beyond.

[[hub.1.tag.1]]
MM2H application

[[hub.1.tag.2]]
Dependent passes

[[hub.1.tag.3]]
Renewals

[[hub.2.title]]
Property concierge

[[hub.2.body]]
Curated homes to buy or lease across Kuala Lumpur, Penang and Johor, with independent title checks and financing partners arranged.

[[hub.2.tag.1]]
Buy or lease

[[hub.2.tag.2]]
Title checks

[[hub.2.tag.3]]
Financing

[[hub.3.title]]
Schools & education

[[hub.3.body]]
International school placement across British, IB, American and more, with dependent and student passes arranged alongside your application.

[[hub.3.tag.1]]
Placement

[[hub.3.tag.2]]
Student passes

[[hub.3.tag.3]]
University routes

[[hub.4.title]]
Banking & tax

[[hub.4.body]]
Local accounts, fixed deposits and tax structuring with vetted advisors, so your money is set up correctly from the first week.

[[hub.4.tag.1]]
Local accounts

[[hub.4.tag.2]]
Fixed deposit

[[hub.4.tag.3]]
Tax advisors
```

`hub.*.title` ≤ 8 characters (they appear both as a heading and in a small sticky panel). `hub.*.tag.*` ≤ 8 characters — these are small pills. Keep `&amp;` exactly as written.

### 9.8 Pathways — three routes

```
[[path.eyebrow]]
Choose your pathway

[[path.h2]]
Three routes to a <span class="u-script">second home.</span>

[[path.lead]]
Retirement, business or education. The same calm, end-to-end process, shaped around why you're moving.

[[path.hint]]
Scroll to explore

[[path.1.tag]]
Retirement · 50+

[[path.1.title]]
A calmer chapter

[[path.1.body]]
For those seeking an affordable, unhurried base with world-class private healthcare and year-round warmth.

[[path.1.more]]
From RM 1M property →

[[path.2.tag]]
Business · Investors

[[path.2.title]]
A regional base

[[path.2.body]]
For entrepreneurs and investors establishing a Southeast-Asian presence, with work rights on the Platinum tier.

[[path.2.more]]
Bespoke structuring →

[[path.3.tag]]
Education · Families

[[path.3.title]]
A future for the children

[[path.3.body]]
For families prioritising international schooling, with student passes arranged alongside the family's visa.

[[path.3.more]]
Student passes included →
```

`path.*.tag` keeps the `·` separator and the `50+`. `path.*.more` keeps the trailing `→`. `path.*.title` ≤ 10 characters — these are large display headings.

### 9.9 Pricing tiers

Shared labels first:

| Key | English | Notes |
|---|---|---|
| `tier.label.eyebrow` | MM2H · Tier | Above each tier name |
| `tier.label.feefrom` | Advisory fee from | ≤ 8 chars |
| `tier.label.hint` | Indicative professional fee — confirmed before you commit. | Hedge — must survive intact |
| `tier.row.deposit` | Fixed deposit | ≤ 8 chars |
| `tier.row.stay` | Minimum stay / yr | ≤ 8 chars |
| `tier.row.dependents` | Dependents | ≤ 8 chars |
| `tier.row.propmin` | Property minimum | ≤ 8 chars |
| `tier.row.validity` | Validity | ≤ 8 chars |
| `tier.row.income` | Offshore income / mo | ≤ 8 chars |
| `tier.row.work` | Work rights | ≤ 8 chars |
| `tier.val.spouse` | Spouse · children | Keep the `·` |
| `tier.val.family` | Whole family | |
| `tier.val.days` | 90 days | |
| `tier.val.y5` | 5 years | |
| `tier.val.y15` | 15 years | |
| `tier.val.y20` | 20 years | |
| `tier.val.permitted` | Permitted | |
| `tier.cta` | Begin application | ≤ 8 chars |
| `tier.flag.gold` | Most chosen | ≤ 6 chars — badge on the Gold card |
| `tier.pvip.eyebrow` | Premium visa | ≤ 8 chars |
| `tier.pvip.feelabel` | Participation fee | ≤ 8 chars |
| `tier.pvip.hint` | Indicative — we confirm the current figure | Hedge — must survive |

Section head and tier descriptions:

```
[[tiers.eyebrow]]
Pathways to residency

[[tiers.h2]]
Find the route<br>that <span class="u-script">fits your plans.</span>

[[tiers.lead]]
Malaysia offers tiered long-stay programmes. Below are the headline figures. We confirm the exact, current requirements for your situation before you commit.

[[tier.silver.desc]]
The entry tier. A calm, affordable base with the lightest commitment.

[[tier.gold.desc]]
The balanced choice. Longer stay rights and room for the whole family.

[[tier.platinum.desc]]
The premium tier. The longest horizon and the widest privileges.

[[tier.pvip.desc]]
Malaysia's Premium Visa Programme. A long horizon for high earners, with no fixed deposit.

[[tiers.note]]
<span class="i">ⓘ</span><span>Figures are indicative and set by the Government of Malaysia. They are revised periodically and differ by tier and by state (Sarawak and Sabah run their own programmes). Up to <b>50%</b> of a fixed deposit may later be applied to an approved property, education or medical use. We confirm the current requirements for your exact situation. Official rules: <a href="#faq" data-scroll-to="#faq">see the FAQ</a> for where to verify.</span>
```

`tiers.h2` — keep the `<br>` where it is. `tiers.note` is the most compliance-sensitive string on the page: **every** qualification must survive, and the `<b>50%</b>` and `<a>` tags must be preserved exactly. The tier descriptions are where you may add the Chinese gloss for Silver / Gold / Platinum if it reads naturally.

### 9.10 Education feature

```
[[edu.eyebrow]]
Children & schooling

[[edu.h2]]
Your children, settled and <span class="u-script">thriving.</span>

[[edu.lead]]
Malaysia is one of Asia's most established homes for international education, and your children can enrol on a dependent or student pass arranged right alongside your MM2H application.

[[edu.li.1]]
<b>Curricula on your doorstep</b>British (IGCSE &amp; A-Levels), International Baccalaureate, American, Australian and Canadian programmes across Kuala Lumpur, Penang and Iskandar Puteri.

[[edu.li.2]]
<b>Day schools to boarding names</b>We shortlist by curriculum, commute and budget, then arrange the visits so you can choose with confidence.

[[edu.li.3]]
<b>Passes for every child</b>Dependent and student passes prepared alongside your application and renewed in step with your stay.

[[edu.li.4]]
<b>A clear path to university</b>Branch campuses of UK and Australian universities, with onward routes to the UK, US and beyond.

[[edu.note]]
We handle placement, registration and the paperwork; you choose the school that feels right.

[[edu.badge.t]]
Student passes

[[edu.badge.s]]
Alongside MM2H
```

In `edu.li.*` the `<b>` lead-in is a bold mini-heading with **no space or punctuation** before the body text that follows — reproduce that structure exactly. Bold lead-ins ≤ 10 characters. `edu.badge.*` ≤ 8 characters.

### 9.11 Property feature

```
[[prop.eyebrow]]
Property & ownership

[[prop.h2]]
A home to buy, or a place to <span class="u-script">lease.</span>

[[prop.lead]]
Foreigners can own property in Malaysia in their own name. Most homes are freehold or long leasehold. We make the search, the checks and the financing feel effortless.

[[prop.li.1]]
<b>Freehold, in your own name</b>

[[prop.li.2]]
<b>Rent first, buy when you're sure</b>

[[prop.li.3]]
<b>Shortlists in KL, Penang and Iskandar Puteri</b>

[[prop.li.4]]
<b>Title checked by an independent lawyer</b>

[[prop.note]]
Property and visa rules are set by the government and revised from time to time. We verify the current thresholds before you commit.

[[prop.badge.t]]
Freehold & title

[[prop.badge.s]]
Checked before you sign
```

`prop.li.1` — keep `RM&nbsp;1,000,000` exactly, including the `&nbsp;`, and keep "commonly around" as an approximation. `prop.li.4` — the restriction on what foreigners cannot buy must stay explicit; do not soften it into a positive.

### 9.12 Process — how it works

```
[[proc.eyebrow]]
How it works

[[proc.h2]]
From first call to <span class="u-script">touchdown.</span>

[[proc.1.title]]
Discovery & eligibility

[[proc.1.body]]
We learn why you're moving, recommend the tier that fits your goals and budget, and map a realistic timeline, with no obligation.

[[proc.1.when]]
Week one

[[proc.2.title]]
Documents & preparation

[[proc.2.body]]
Passport, medical, police clearance and financials, prepared and checked by us so nothing bounces back from the authorities.

[[proc.2.when]]
Weeks 2–5

[[proc.3.title]]
Lodgement & conditional approval

[[proc.3.body]]
Your licensed MM2H partner submits the application to the MM2H centre. We track every milestone, so you always know exactly where things stand.

[[proc.3.when]]
Months 1–4

[[proc.4.title]]
Endorsement & fixed deposit

[[proc.4.body]]
You place the fixed deposit, complete the medical and insurance, and the visa is endorsed in your passport on arrival.

[[proc.4.when]]
On approval

[[proc.5.title]]
Property & settling in

[[proc.5.body]]
Property, schools, banking and arrival support. Your advisor stays with you well past the day the visa lands.

[[proc.5.when]]
Ongoing
```

`proc.*.title` ≤ 10 characters — they appear in a sticky panel that swaps as you scroll. `proc.*.when` ≤ 8 characters; keep the en-dashes in `2–5` and `1–4`. These are **typical** timings, not commitments — do not phrase them as guarantees.

### 9.13 Life in Malaysia — filmstrip

```
[[life.eyebrow]]
Life in Malaysia

[[life.h2]]
A warm, welcoming <span class="u-script">place to land.</span>

[[life.drag]]
Drag to explore
```

Captions — each ≤ 12 characters, keep the `·`:

| Key | English |
|---|---|
| `life.cap.1` | Kuala Lumpur · dusk |
| `life.cap.2` | George Town · street food |
| `life.cap.3` | Family · at home |
| `life.cap.4` | Perhentian · islands |
| `life.cap.5` | Condo · modern interior |
| `life.cap.6` | School · international |
| `life.cap.7` | Puteri Harbour · marina |

### 9.14 Proof — statistics

```
[[proof.eyebrow]]
Why Banco

[[proof.h2]]
We coordinate every authority, signature and milestone, so <span class="u-script">nothing is lost in translation.</span>

[[proof.stat.1]]
Families relocated since 2014

[[proof.stat.2]]
Application approval rate

[[proof.stat.3]]
Government & legal partners

[[proof.stat.4]]
Average client rating
```

The numbers (2400+, 98%, 12, 4.9) are animated separately and are **not** translated. `proof.h2` contains a deliberate pun on *"lost in translation"* — for a Chinese-language audience being served in their own language, this line can carry real weight. Transcreate it; do not translate the idiom literally. `proof.stat.2` is a historical rate — see §6.3.

### 9.15 FAQ

```
[[faq.eyebrow]]
Good to know

[[faq.h2]]
MM2H Frequently asked questions

[[faq.lead]]
The honest version. What the programme is, what it lets you do, and where the official rules live.

[[faq.1.q]]
Who is MM2H for?

[[faq.1.a]]
Malaysia My Second Home is a long-stay visa for foreigners who want to live in Malaysia without giving up their citizenship: retirees, families, remote professionals and investors. It is renewable, and your spouse, children and, in many cases, parents can join you as dependents.

[[faq.2.q]]
Can my children study in Malaysia?

[[faq.2.a]]
Yes. Children join on a dependent or student pass and attend Malaysia's international and private schools: British, IB, American, Australian and more. We arrange placement and the pass paperwork. See <a href="#education" data-scroll-to="#education">Children &amp; schooling</a> above.

[[faq.3.q]]
Can I buy a home, and what can foreigners own?

[[faq.3.a]]
Foreigners can own property in their own name above a minimum purchase price set by each state (commonly around RM&nbsp;1,000,000, with variations). Some categories, such as Malay-reserved land and certain low-cost units, are not open to foreign buyers. You can also lease while you settle. See <a href="#property" data-scroll-to="#property">Property &amp; ownership</a>.

[[faq.4.q]]
Can I work or run a business on MM2H?

[[faq.4.a]]
The national Silver and Gold tiers are residency visas, not work permits. The Platinum tier permits work and business, and the SEZ pathway suits remote professionals. Employment and business each have their own rules, which change from time to time. We advise on the right structure for your plans.

[[faq.5.q]]
What are the financial requirements?

[[faq.5.a]]
Since the 2024 relaunch, fixed-deposit and property thresholds are set per tier, from US$65k (SEZ) up to US$1M (Platinum). They are revised periodically and differ by state; Sarawak and Sabah run their own programmes. Rather than quote a figure that may already be out of date, we confirm the current requirements for your exact situation and point you to the official sources.

[[faq.6.q]]
How is healthcare in Malaysia?

[[faq.6.a]]
Malaysia's private hospitals are excellent and far more affordable than in the West, and many are internationally accredited. We recommend private health cover and can introduce trusted providers.

[[faq.7.q]]
How are taxes handled?

[[faq.7.a]]
Malaysia generally taxes income sourced in Malaysia, and the treatment of foreign-sourced income has its own rules that have changed in recent years. We connect you with vetted tax advisors so your situation is structured correctly. We don't make one-size-fits-all tax promises.

[[faq.8.q]]
How long does approval take?

[[faq.8.a]]
Timelines vary with the tier and your paperwork and are typically measured in months. We prepare and check everything, your licensed MM2H partner lodges it, and we track each milestone so you always know where things stand.

[[faq.9.q]]
What does Banco actually do?

[[faq.9.a]]
Everything, in one place: eligibility, documents, coordinating the licensed MM2H partner who lodges your application, property, schooling, banking, tax introductions and settling-in support, with one dedicated advisor from first enquiry to arrivals.

[[faq.note]]
Official requirements rest with the Government of Malaysia. For the current programme rules, see the official MM2H portal and the Immigration Department of Malaysia. We'll confirm everything that applies to your situation.
```

FAQ notes:
- `faq.1.a` — *"without giving up their citizenship"* is the most important sentence on this page for a Taiwanese reader. Give it full weight.
- `faq.3.a` and `faq.4.a` — the restrictions (Malay-reserved land; Silver/Gold are not work permits) must stay explicit and unambiguous. This is exactly where a softened translation becomes a mis-selling problem.
- `faq.5.a` — the refusal to quote a fixed figure is intentional. Keep the refusal, keep `US$65k` and `US$1M` as written.
- `faq.7.a` — keep the explicit "we don't make one-size-fits-all tax promises".
- Preserve every `<a href="…">` tag and its target exactly.
- `faq.*.q` ≤ 20 characters where possible — they sit on a single accordion row.

### 9.16 Closing CTA

```
[[cta.eyebrow]]
Ready when you are

[[cta.h2]]
Speak with an <span class="u-script">MM2H advisor.</span>

[[cta.lead]]
No obligation. Tell us a little about your plans and we'll be in touch within one business day.

[[cta.button]]
Begin application

[[cta.phone]]
Call us

[[cta.line]]
Add us on LINE
```

`cta.phone` is the label only — the number `+60 16-288 0300` follows it and is not translated. ≤ 6 characters.

`cta.line` is **new** — it does not exist on the English page yet. A LINE contact channel is being added for Taiwanese clients (§11). Write the button label as a Taiwanese brand would phrase it — LINE 官方帳號 conventions apply. ≤ 10 characters, and keep **LINE** in Latin capitals.

### 9.17 Footer

```
[[footer.logo.alt]]
Banco MM2H — Your journey. Our expertise. Your new home.

[[footer.legal]]
© 2026 Banco Advisory & Consultancy · MM2H relocation advisory

[[footer.privacy]]
Privacy

[[footer.terms]]
Terms

[[footer.credits.summary]]
Image credits & attribution
```

`footer.logo.alt` is the brand's three-beat tagline (image alt text): *Your journey. Our expertise. Your new home.* Preserve the three-beat rhythm. `footer.legal` keeps `© 2026`, `Sdn Bhd` and every `·`. The credits **body** paragraph is not translated — see §7.

### 9.18 Interface microcopy

Custom cursor labels that appear when hovering — **≤ 4 characters each**, they sit inside a small circle.

| Key | English |
|---|---|
| `ui.cursor.top` | Top |
| `ui.cursor.apply` | Apply |
| `ui.cursor.descend` | Descend |
| `ui.cursor.visas` | Visas |
| `ui.cursor.property` | Property |
| `ui.cursor.schools` | Schools |
| `ui.cursor.banking` | Banking |
| `ui.cursor.retirement` | Retirement |
| `ui.cursor.business` | Business |
| `ui.cursor.education` | Education |
| `ui.cursor.drag` | Drag |
| `ui.cursor.privacy` | Privacy |
| `ui.cursor.terms` | Terms |
| `ui.cursor.email` | Email |

Image placeholder text (shown only if a photo fails to load) — ≤ 12 characters:

| Key | English |
|---|---|
| `ui.ph.retire` | Photo · retirees by the coast |
| `ui.ph.biz` | Photo · KL business district |
| `ui.ph.edu` | Photo · international school |
| `ui.ph.educampus` | International campus |
| `ui.ph.propres` | Kuala Lumpur residential |
| `ui.ph.life1` | Skyline at dusk |
| `ui.ph.life2` | Street food |
| `ui.ph.life3` | Family at home |
| `ui.ph.life4` | Tropical nature / islands |
| `ui.ph.life5` | Modern condo interior |
| `ui.ph.life6` | Children at school |
| `ui.ph.life7` | Marina / waterfront living |

Language switcher (new — no English original exists yet):

| Key | Intent |
|---|---|
| `ui.lang.en` | Label for the English option in the language switcher |
| `ui.lang.zh` | Label for the Chinese option — write it in Chinese as a Taiwanese reader would expect to see it |
| `ui.lang.aria` | Screen-reader label for the switcher, e.g. "Select language" |

---

## 10. Self-check before you answer

Run every one of these. Fix what fails, then return your output.

1. **Character set** — no Simplified characters anywhere. Scan for: 项 关 语 见 后 学 国 长 无 会 应 请 务 单 门 问 题 议 认 让 说 讲 买 卖 产 业 华 亚.
2. **Vocabulary** — no term from the ✗ column in §5.1 survives anywhere in your output.
3. **Banned register** — none of the words listed in §4 appear.
4. **移民** — does not appear as the framing for MM2H (§5.4).
5. **Politics** — no cross-strait, security or "escape" framing anywhere (§5.5).
6. **Hedges intact** — every "indicative", "commonly around", "typically", "revised periodically", "differ by state", "we confirm" has a Chinese counterpart. No 保證 / 必定 / 一定 / 100% anywhere.
7. **Numbers untouched** — every figure, currency code and date matches the English exactly.
8. **Tags intact** — every `<b>`, `<span>`, `<br>`, `<a href>`, `&amp;`, `&nbsp;` is present, correctly nested, and its attributes unchanged.
9. **Keys** — every key in section 9 appears exactly once in your output, in order, spelled identically.
10. **Budgets** — count characters on every string with a stated limit. Over-length strings break the layout; if you truly cannot fit one, ship your best attempt and list it in 譯者備註.
11. **Spacing** — a space sits between Chinese and adjacent Latin text or numerals throughout.
12. **Read it aloud** — does it sound like a Taipei copywriter, or like a translation? If the second, rewrite it.

---

## 11. Decisions and open items

Context only — not for you to answer. Recorded here so this document stays the single source of truth.

**Settled:**

- **Application portal stays English.** `app.bancomm2h.com` is English-only and every CTA on the Chinese page leads there. Accepted by the client: Taiwanese clients are comfortable with an English URL and portal. No change needed, and no apologetic wording about it in the copy.
- **LINE channel is planned.** Taiwanese clients expect LINE over phone or email; a LINE contact point will be added to the Chinese page. Provisional key `cta.line` in §9.16 covers the button label — translate it, it will be used.
- **Hero animation.** The opening headline uses a per-token split animation that behaves differently on Chinese text (no word spaces). Known, deferred, being handled separately. Translate `hero.*` normally and do not compensate for it.

**Still open:**

- Tier names: keep **Silver / Gold / Platinum** in English (current instruction, §7) or localise to 銀級 / 金級 / 白金級 throughout? Follow §7 unless told otherwise.
- Pricing figures on this page are marked indicative and need verification against current MM2H rules before the Chinese version goes live.
