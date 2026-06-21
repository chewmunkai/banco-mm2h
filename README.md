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

## Photography

All site photos are license-clean and free (no API key, no cost), sourced from **Wikimedia Commons** and downscaled for the web. Per-image authors and licences are in [`assets/photos/CREDITS.json`](assets/photos/CREDITS.json) and in the site footer ("Image credits & attribution"). CC BY / CC BY-SA images are used with attribution; one is CC0. Drop in your own/Banco photography any time by replacing the files in `assets/photos/` (filenames match the slot ids).

Earth textures are by **Solar System Scope** (CC BY 4.0).

## Accessibility / resilience

- `prefers-reduced-motion` shortens the journey and disables animation.
- A head watchdog reveals all content if scripts fail to boot.

## Deploy

Static — host the folder as-is on GitHub Pages, Netlify, Cloudflare Pages, etc. (root = web root).
