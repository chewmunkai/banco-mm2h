// Markdown -> DOCX for the Banco MM2H zh-TW translation brief.
// Straight quotes are preserved verbatim: the brief contains HTML attributes
// (href="#faq") that DeepSeek must copy back unchanged, and smart quotes would
// silently corrupt them.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, LevelFormat, PageOrientation,
} = require('docx');

const SRC = process.argv[2];
const OUT = process.argv[3];

const CONTENT_W = 9360;          // Letter 12240 - 2x1440 margins
const MONO = 'Courier New';
const CODE_BG = 'F4F5F3';
const RULE = 'D8DCD6';

const md = fs.readFileSync(SRC, 'utf8').split('\n');

// ---- inline: **bold**, `code`, *italic* -------------------------------------
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ ...base, text: text.slice(last, m.index) }));
    const t = m[0];
    if (t.startsWith('**')) out.push(new TextRun({ ...base, text: t.slice(2, -2), bold: true }));
    else if (t.startsWith('`')) out.push(new TextRun({ ...base, text: t.slice(1, -1), font: MONO, size: 18, shading: { type: ShadingType.CLEAR, fill: CODE_BG } }));
    else out.push(new TextRun({ ...base, text: t.slice(1, -1), italics: true }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ ...base, text: text.slice(last) }));
  return out.length ? out : [new TextRun({ ...base, text: '' })];
}

// ---- tables ----------------------------------------------------------------
const cells = row => row.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
const isSep = row => /^\|?[\s:-]*-[-\s:|]*\|?$/.test(row) && row.includes('-');

// Width columns proportionally to their content, clamped so a "Key" column
// never starves the prose column and vice versa.
function widths(rows, n) {
  const avg = Array.from({ length: n }, (_, i) =>
    Math.max(6, rows.reduce((s, r) => s + (r[i] || '').length, 0) / rows.length));
  const total = avg.reduce((a, b) => a + b, 0);
  const min = Math.floor(CONTENT_W / (n * 2.6));
  let w = avg.map(a => Math.max(min, Math.round((a / total) * CONTENT_W)));
  const drift = CONTENT_W - w.reduce((a, b) => a + b, 0);
  w[w.length - 1] += drift;
  return w;
}

function table(block) {
  const head = cells(block[0]);
  const body = block.slice(2).map(cells);
  const n = head.length;
  const w = widths([head, ...body], n);
  const border = { style: BorderStyle.SINGLE, size: 2, color: RULE };
  const borders = { top: border, bottom: border, left: border, right: border };

  const mkRow = (data, isHead) => new TableRow({
    tableHeader: isHead,
    children: Array.from({ length: n }, (_, i) => new TableCell({
      width: { size: w[i], type: WidthType.DXA },
      borders,
      shading: isHead ? { type: ShadingType.CLEAR, fill: 'EFF1ED' } : undefined,
      margins: { top: 60, bottom: 60, left: 110, right: 110 },
      children: [new Paragraph({
        spacing: { before: 0, after: 0 },
        children: runs(data[i] || '', { size: 19, bold: isHead || undefined }),
      })],
    })),
  });

  return new Table({
    columnWidths: w,
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [mkRow(head, true), ...body.map(r => mkRow(r, false))],
  });
}

// ---- walk ------------------------------------------------------------------
const kids = [];
let i = 0;

while (i < md.length) {
  const line = md[i];

  // fenced code
  if (line.trim().startsWith('```')) {
    const buf = [];
    i++;
    while (i < md.length && !md[i].trim().startsWith('```')) buf.push(md[i++]);
    i++;
    buf.forEach((l, idx) => kids.push(new Paragraph({
      spacing: { before: idx === 0 ? 100 : 0, after: idx === buf.length - 1 ? 140 : 0, line: 250 },
      shading: { type: ShadingType.CLEAR, fill: CODE_BG },
      indent: { left: 170, right: 170 },
      children: [new TextRun({ text: l || ' ', font: MONO, size: 17 })],
    })));
    continue;
  }

  // table
  if (line.trim().startsWith('|') && md[i + 1] && isSep(md[i + 1])) {
    const buf = [];
    while (i < md.length && md[i].trim().startsWith('|')) buf.push(md[i++]);
    kids.push(table(buf));
    kids.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    continue;
  }

  // horizontal rule
  if (/^---+$/.test(line.trim())) {
    kids.push(new Paragraph({
      spacing: { before: 160, after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE } },
      children: [],
    }));
    i++; continue;
  }

  // headings
  const h = line.match(/^(#{1,4})\s+(.*)$/);
  if (h) {
    const lvl = h[1].length;
    kids.push(new Paragraph({
      heading: lvl === 1 ? HeadingLevel.TITLE : lvl === 2 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
      spacing: { before: lvl === 1 ? 0 : lvl === 2 ? 360 : 260, after: lvl === 1 ? 200 : 130 },
      pageBreakBefore: lvl === 2 && kids.length > 0 && /^##\s+9\./.test(line),
      children: runs(h[2]),
    }));
    i++; continue;
  }

  // blockquote
  if (line.trim().startsWith('>')) {
    kids.push(new Paragraph({
      spacing: { before: 100, after: 140 },
      indent: { left: 220 },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C8B273', space: 12 } },
      children: runs(line.replace(/^\s*>\s?/, ''), { italics: true, size: 20 }),
    }));
    i++; continue;
  }

  // bullets
  const b = line.match(/^(\s*)-\s+(.*)$/);
  if (b) {
    kids.push(new Paragraph({
      numbering: { reference: 'bullets', level: b[1].length >= 2 ? 1 : 0 },
      spacing: { before: 40, after: 40 },
      children: runs(b[2]),
    }));
    i++; continue;
  }

  // numbered
  const nlist = line.match(/^(\s*)\d+\.\s+(.*)$/);
  if (nlist) {
    kids.push(new Paragraph({
      numbering: { reference: 'steps', level: 0 },
      spacing: { before: 40, after: 40 },
      children: runs(nlist[2]),
    }));
    i++; continue;
  }

  // blank
  if (!line.trim()) { i++; continue; }

  // paragraph
  kids.push(new Paragraph({
    spacing: { before: 60, after: 120, line: 290 },
    children: runs(line),
  }));
  i++;
}

const doc = new Document({
  creator: 'Banco MM2H',
  title: 'Banco MM2H — Traditional Chinese (zh-TW) Translation Brief',
  description: 'Context, voice, terminology and full source copy for zh-TW transcreation',
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 200 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 200 } } } },
      ] },
      { reference: 'steps', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 240 } } } },
      ] },
    ],
  },
  styles: {
    default: {
      document: { run: { size: 21, font: 'Calibri' }, paragraph: { spacing: { line: 290 } } },
      title: { run: { size: 40, bold: true, color: '0F2C1E' }, paragraph: { spacing: { after: 200 } } },
      heading1: { run: { size: 29, bold: true, color: '0F2C1E' } },
      heading2: { run: { size: 24, bold: true, color: '2C4A38' } },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
        margin: { top: 1200, right: 1440, bottom: 1200, left: 1440 },
      },
    },
    children: kids,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log(`wrote ${OUT} — ${kids.length} blocks, ${(buf.length / 1024).toFixed(0)} KB`);
});
