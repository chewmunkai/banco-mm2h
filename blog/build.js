#!/usr/bin/env node
/* Banco MM2H blog builder.
 *
 *   npm run blog
 *
 * Source:  blog/_posts/<slug>.html
 *          First thing in the file is a JSON front-matter comment:
 *            <!--meta { "title": "...", "description": "...", ... } -->
 *          The rest is the article body (plain HTML).
 * Output:  blog/<slug>/index.html   one page per post
 *          blog/index.html          the listing
 *          sitemap.xml              blog URLs, between the blog markers
 *
 * The builder adds what every post must have, so authors can't forget it:
 * ids on every <h2>, the table of contents, reading time, Article +
 * BreadcrumbList JSON-LD, FAQPage JSON-LD (from <section id="faq">),
 * canonical/OG/Twitter tags, the trust strip and the CTA.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ORIGIN = 'https://bancomm2h.com';
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(__dirname, '_posts');
const WHATSAPP = 'https://wa.me/60162880300';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase()
  .replace(/&amp;|&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = (iso) => new Date(iso + 'T00:00:00Z')
  .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const REQUIRED = ['title', 'h1', 'description', 'slug', 'published', 'updated', 'keyword', 'hero', 'author', 'factcheck'];

function readPost(file) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const m = raw.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
  if (!m) throw new Error(`${file}: missing <!--meta {...} --> block`);
  const meta = JSON.parse(m[1]);
  for (const k of REQUIRED) if (!meta[k]) throw new Error(`${file}: meta.${k} is required`);
  if (meta.description.length > 160) console.warn(`! ${file}: description is ${meta.description.length} chars (aim ≤ 160)`);
  if (meta.title.length > 65) console.warn(`! ${file}: title is ${meta.title.length} chars (aim ≤ 65)`);
  return { meta, body: raw.slice(m[0].length) };
}

function enrich(body) {
  const $ = cheerio.load(body, null, false);
  const toc = [];
  const seen = new Set();
  $('h2').each((_, el) => {
    const $h = $(el);
    let id = $h.attr('id') || slugify($h.text());
    while (seen.has(id)) id += '-2';
    seen.add(id);
    $h.attr('id', id);
    toc.push({ id, text: $h.attr('data-toc') || $h.text().trim() });
    $h.removeAttr('data-toc');
  });
  // Tables scroll sideways on phones instead of breaking the layout.
  $('table').each((_, el) => {
    if (!$(el).parent().hasClass('tbl')) $(el).wrap('<div class="tbl" role="region" tabindex="0"></div>');
  });
  // External links open in a new tab and pass no referrer weight.
  $('a[href^="http"]').each((_, el) => {
    const $a = $(el);
    if (!$a.attr('href').startsWith(ORIGIN)) $a.attr({ target: '_blank', rel: 'noopener' });
  });
  const faq = [];
  $('#faq details').each((_, el) => {
    const q = $(el).find('summary').text().trim();
    const a = $(el).children().not('summary').text().replace(/\s+/g, ' ').trim();
    if (q && a) faq.push({ q, a });
  });
  const words = $.root().text().split(/\s+/).filter(Boolean).length;
  return { html: $.html(), toc, faq, minutes: Math.max(1, Math.round(words / 230)) };
}

/* ---- shared chrome -------------------------------------------------- */

const head = ({ title, description, url, image, imageAlt, type, extra = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="alternate" type="application/rss+xml" title="Banco MM2H Guides" href="${ORIGIN}/blog/feed.xml">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#16241C">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Banco MM2H">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/blog/blog.css">
${extra}</head>`;

const bar = `
<header class="bbar">
  <div class="bwrap bbar__in">
    <a class="bbar__brand" href="/" aria-label="Banco MM2H home"><img src="/assets/logo-full.svg" alt="Banco MM2H" width="148" height="32"></a>
    <nav class="bbar__nav" aria-label="Main">
      <a href="/blog/">Guides</a>
      <a href="/#pricing">Tiers</a>
      <a class="bbar__cta" href="/application/?src=blog-bar">Talk to an advisor</a>
    </nav>
  </div>
</header>`;

const foot = `
<footer class="bfoot">
  <div class="bwrap bfoot__in">
    <p><b>Banco MM2H</b> runs your whole move to Malaysia with one advisor. MM2H applications are lodged and processed by our MOTAC-licensed partner, PAKS (MM2H) Sdn. Bhd. (licence MM2H881). Banco is not itself a licensed MM2H agent.</p>
    <p class="bfoot__small">Guides on this site are general information, not legal, tax or financial advice. Rules change; every figure is dated and linked to its official source. © ${new Date().getUTCFullYear()} Banco MM2H · <a href="/">Home</a> · <a href="/blog/">Guides</a></p>
  </div>
</footer>
</body>
</html>
`;

const ORG = { '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: 'Banco MM2H', url: `${ORIGIN}/`, logo: `${ORIGIN}/assets/icon-512.png` };

/* ---- article page ---------------------------------------------------- */

function renderPost({ meta, body }) {
  const url = `${ORIGIN}/blog/${meta.slug}/`;
  const { html, toc, faq, minutes } = enrich(body);
  const image = ORIGIN + (meta.og || meta.hero.src);

  const graph = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: meta.h1,
      description: meta.description,
      image: [image],
      datePublished: meta.published,
      dateModified: meta.updated,
      author: { '@type': 'Organization', name: meta.author, url: `${ORIGIN}/` },
      publisher: ORG,
      mainEntityOfPage: url,
      inLanguage: 'en',
      keywords: [meta.keyword, ...(meta.keywords || [])].join(', '),
      citation: (meta.sources || []).map((s) => s.url),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${ORIGIN}/blog/` },
        { '@type': 'ListItem', position: 3, name: meta.h1, item: url },
      ],
    },
  ];
  if (faq.length) graph.push({
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  });

  const tocHtml = toc.map((t) => `<li><a href="#${t.id}">${t.text}</a></li>`).join('\n          ');
  const sources = (meta.sources || []).map((s) =>
    `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${s.title}</a><span>${s.publisher}${s.date ? ' · ' + s.date : ''}</span></li>`).join('\n        ');

  return `${head({
    title: meta.title, description: meta.description, url, image, imageAlt: meta.hero.alt, type: 'article',
    extra: `<meta property="article:published_time" content="${meta.published}">
<meta property="article:modified_time" content="${meta.updated}">
${ld({ '@context': 'https://schema.org', '@graph': graph })}
`,
  })}
<body class="blog">
${bar}
<main>
  <article class="post">
    <header class="post__head bwrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/blog/">Guides</a><span>/</span><span aria-current="page">${esc(meta.crumb || meta.h1)}</span></nav>
      <p class="post__kicker">${esc(meta.kicker || 'MM2H guide')}</p>
      <h1>${meta.h1}</h1>
      <p class="post__dek">${meta.dek || esc(meta.description)}</p>
      <div class="post__meta">
        <span>By ${esc(meta.author)}</span>
        <span>Updated <time datetime="${meta.updated}">${fmtDate(meta.updated)}</time></span>
        <span>${minutes} min read</span>
      </div>
      <div class="trust">
        <span class="trust__item"><b>✓ Fact-checked</b> ${meta.factcheck}</span>
        <span class="trust__item"><b>✓ Licensed partner</b> Applications lodged by PAKS (MM2H) Sdn. Bhd., MOTAC licence MM2H881 · <a href="https://www.mm2h.gov.my/agencies" target="_blank" rel="noopener">verify&nbsp;↗</a></span>
      </div>
    </header>

    <figure class="post__hero bwrap">
      <img src="${meta.hero.src}" alt="${esc(meta.hero.alt)}" width="${meta.hero.w || 1600}" height="${meta.hero.h || 900}" fetchpriority="high" decoding="async">
      <figcaption>${meta.hero.credit}</figcaption>
    </figure>

    <div class="post__grid bwrap">
      <aside class="toc" aria-label="On this page">
        <p class="toc__label">On this page</p>
        <ol>
          ${tocHtml}
        </ol>
      </aside>

      <div class="prose">
${html}
        <section class="sources" id="sources">
          <h2>Sources</h2>
          <p>Every rule and figure above comes from these documents. Where they disagree, we say so in the article.</p>
          <ol>
        ${sources}
          </ol>
        </section>

        <aside class="cta">
          <p class="cta__eyebrow">Next step</p>
          <p class="cta__title">${meta.ctaTitle || 'Not sure which tier fits? Ask an advisor.'}</p>
          <p>${meta.ctaBody || 'Tell us your budget, family and plans. We reply within one business day with the tier we would choose for you and why. No obligation.'}</p>
          <div class="cta__btns">
            <a class="btn-b btn-b--brass" href="/application/?src=blog-${meta.slug}">Answer a few short questions</a>
            <a class="btn-b btn-b--line" href="${WHATSAPP}?text=${encodeURIComponent(`Hi Banco, I read your guide "${meta.crumb || meta.h1}" and have a question.`)}" target="_blank" rel="noopener">WhatsApp an advisor</a>
          </div>
        </aside>
      </div>
    </div>
  </article>
</main>
${foot}`;
}

/* ---- listing --------------------------------------------------------- */

function renderIndex(posts) {
  const url = `${ORIGIN}/blog/`;
  const cards = posts.map(({ meta }) => `
      <a class="card" href="/blog/${meta.slug}/">
        <img src="${meta.thumb || meta.hero.src}" alt="" loading="lazy" decoding="async" width="640" height="360">
        <div class="card__body">
          <p class="post__kicker">${esc(meta.kicker || 'MM2H guide')}</p>
          <h2>${meta.h1}</h2>
          <p>${esc(meta.description)}</p>
          <span class="card__meta">Updated <time datetime="${meta.updated}">${fmtDate(meta.updated)}</time></span>
        </div>
      </a>`).join('');
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MM2H guides',
    url,
    publisher: ORG,
    hasPart: posts.map(({ meta }) => ({ '@type': 'Article', headline: meta.h1, url: `${ORIGIN}/blog/${meta.slug}/` })),
  };
  return `${head({
    title: 'MM2H Guides: Malaysia My Second Home, Explained | Banco MM2H',
    description: 'Plain-English guides to Malaysia My Second Home (MM2H): tiers, costs, property and the application, each fact-checked against MOTAC\'s official terms.',
    url, image: `${ORIGIN}/assets/og-image.jpg`, imageAlt: 'Kuala Lumpur skyline at dusk', type: 'website',
    extra: ld(graph) + '\n',
  })}
<body class="blog">
${bar}
<main class="bwrap blist">
  <header class="blist__head">
    <p class="post__kicker">Guides</p>
    <h1>MM2H, explained with the official sources open</h1>
    <p class="post__dek">Every figure in these guides links to the government document it comes from. Where the official documents disagree with each other, we show you both.</p>
  </header>
  <div class="cards">${cards}
  </div>
</main>
${foot}`;
}

/* ---- RSS + sitemap --------------------------------------------------- */

function renderFeed(posts) {
  const items = posts.map(({ meta }) => `  <item>
    <title>${esc(meta.h1)}</title>
    <link>${ORIGIN}/blog/${meta.slug}/</link>
    <guid>${ORIGIN}/blog/${meta.slug}/</guid>
    <pubDate>${new Date(meta.published + 'T00:00:00Z').toUTCString()}</pubDate>
    <description>${esc(meta.description)}</description>
  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Banco MM2H Guides</title>
  <link>${ORIGIN}/blog/</link>
  <description>Plain-English MM2H guides, fact-checked against MOTAC's official terms.</description>
  <language>en</language>
${items}
</channel>
</rss>
`;
}

function updateSitemap(posts) {
  const file = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf8');
  const newest = posts.map((p) => p.meta.updated).sort().pop();
  const block = ['  <!-- blog:start (generated by blog/build.js) -->',
    `  <url><loc>${ORIGIN}/blog/</loc><lastmod>${newest}</lastmod></url>`,
    ...posts.map(({ meta }) => `  <url><loc>${ORIGIN}/blog/${meta.slug}/</loc><lastmod>${meta.updated}</lastmod></url>`),
    '  <!-- blog:end -->'].join('\n');
  xml = /<!-- blog:start[\s\S]*?<!-- blog:end -->/.test(xml)
    ? xml.replace(/  <!-- blog:start[\s\S]*?<!-- blog:end -->/, block)
    : xml.replace('</urlset>', `${block}\n</urlset>`);
  fs.writeFileSync(file, xml);
}

/* ---- main ------------------------------------------------------------ */

const posts = fs.readdirSync(SRC).filter((f) => f.endsWith('.html') && !f.startsWith('_'))
  .map(readPost)
  .filter((p) => !p.meta.draft)
  .sort((a, b) => b.meta.published.localeCompare(a.meta.published));

for (const p of posts) {
  const dir = path.join(__dirname, p.meta.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPost(p));
  console.log(`✓ /blog/${p.meta.slug}/`);
}
fs.writeFileSync(path.join(__dirname, 'index.html'), renderIndex(posts));
fs.writeFileSync(path.join(__dirname, 'feed.xml'), renderFeed(posts));
updateSitemap(posts);
console.log(`✓ /blog/ index, feed.xml, sitemap.xml (${posts.length} post${posts.length === 1 ? '' : 's'})`);
