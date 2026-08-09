# Banco MM2H — Immersive Site

A white, welcoming, image-rich marketing site for **Banco MM2H** (Malaysia My Second Home — a one-stop relocation concierge). It opens with a cinematic **Earth → Kuala Lumpur** scroll descent (three.js) and lands into a bright "Pine · Luxe" site: pillars, residency pathways, a "Life in Malaysia" gallery, stats, testimonial and CTA.

This is the implementation of the `ui_kits/website-immersive/index.html` kit from the **Banco MM2H Design System** handoff (Claude design project `BancoMM2HDesignSystem_93823c`). The Earth→KL journey and interaction techniques are adapted from [github.com/chewmunkai/website-side-projects](https://github.com/chewmunkai/website-side-projects) (`space-nft`), reskinned to the Banco identity.

## Run

It's a static site — no build step.

```bash
python3 -m http.server 8848
# then open http://localhost:8848
```

Any static server works. An internet connection is needed at view time for three.js / GSAP / ScrollTrigger / Lenis (CDN) and Google Fonts.

## Structure

```
index.html          The immersive page
site.css  site.js   Site styles + interactions (Lenis, cursor, magnetic, splits, journey wiring)
journey.js          three.js Earth → Kuala Lumpur descent (shaders + scroll-driven camera)
image-slot.js       <image-slot> web component (read-only outside the design tool; renders src=)
styles.css          Design-system entry (@imports the tokens below)
tokens/             colors · typography · spacing · elevation · fonts · base
assets/
  logo-*.svg        Banco lockups
  icons-3d/         8 dimensional brand icons
  earth/            Earth day/night/specular/clouds textures
  photos/           Curated site photography + CREDITS.json
```

## Traditional Chinese edition (zh-TW)

`zh/index.html` is the Traditional Chinese site for Taiwanese clients. **It is generated — never edit it by hand.** `index.html` stays the single source of structure; the Chinese page is derived from it plus a translation file.

```bash
npm install          # once — cheerio + opencc-js, dev tooling only
npm run i18n         # validate the translation, then regenerate zh/index.html
```

Re-run `npm run i18n` after **any** change to `index.html`, or the two languages drift.

```
i18n/
  zh-TW-translation-brief.md   Brief handed to the translation model: audience,
                               voice, zh-TW terminology, compliance guardrails,
                               and all 227 source strings with stable keys
  zh-TW.raw.txt                Raw model output, as received — do not edit
  zh-TW.revisions.txt          Editorial pass layered over the raw output:
                               register fixes, corrections, and copy the design
                               added later. Overrides and extends by key, so the
                               as-received translation stays auditable
  zh-TW.json                   Merged, validated translations (generated)
  validate.js                  Key coverage · Simplified-character scan · Taiwan
                               vocabulary drift · tag/literal integrity · budgets
  build-zh.js                  index.html + zh-TW.json → zh/index.html
  lang.css                     Language switcher + CJK typography overrides
```

`validate.js` refuses to write `zh-TW.json` if keys are missing, Simplified characters leaked, or an inline tag or protected literal (`RM&nbsp;1,000,000`, `US$1M`, `<a href="#faq">`) was dropped in translation. Vocabulary drift and over-budget strings are reported as warnings, not blockers.

To retranslate: edit the brief, run it through the translation model, replace `zh-TW.raw.txt`, then `npm run i18n`.

## Photography

All site photos are license-clean and free (no API key, no cost), sourced from **Wikimedia Commons** and downscaled for the web. Per-image authors and licences are in [`assets/photos/CREDITS.json`](assets/photos/CREDITS.json) and in the site footer ("Image credits & attribution"). CC BY / CC BY-SA images are used with attribution; one is CC0. Drop in your own/Banco photography any time by replacing the files in `assets/photos/` (filenames match the slot ids).

Earth textures are by **Solar System Scope** (CC BY 4.0).

## Accessibility / resilience

- `prefers-reduced-motion` shortens the journey and disables animation.
- A head watchdog reveals all content if scripts fail to boot.

## Deploy

Static — host the folder as-is on GitHub Pages, Netlify, Cloudflare Pages, etc. (root = web root).
