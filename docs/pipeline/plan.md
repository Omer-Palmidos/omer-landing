# Implementation Plan: Omer Landing Page

**Project ID:** omer-landing
**Author:** Cartman (CTO)
**Date:** 2026-03-30

**Output path:** `docs/pipeline/plan.md`

---

## Project Size Assessment

**Tier: Nano**

**Reasoning:** This is a fully static single-page site with no backend, no build tooling, no framework, no database, and zero interactivity. Total deliverable: 3 files (`index.html`, `style.css`, `favicon.svg`) plus a CI workflow file (`.github/workflows/ci.yml`) and `vercel.json`. All content is hardcoded. No routing, no state, no API calls. This is a textbook Nano-tier project.

**Max stages allowed: 2**

**Stage count: 2** — justified below. Stage 1 delivers the complete functional page (HTML + CSS + favicon + vercel.json). Stage 2 delivers the Lighthouse CI workflow. These two stages are separated because CI setup is independently testable (it either passes green or not) and has a distinct scope: it requires no code changes to the page itself, only a GitHub Actions workflow file. Collapsing them would mix "build the page" with "gate the page" in a single commit, making it harder to bisect failures. Both stages are worth their overhead.

---

## Stage 1: Complete Static Page

**Objective:** Build and deploy the full personalized landing page — centered greeting, entrance animation, responsive design, favicon, and Vercel static config — as a single working deliverable.

**Implements:** R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010

**Prerequisites:** None (first stage)

**Architecture context:**
- Stack: plain HTML5 + CSS3. No framework, no build step, no `package.json`.
- Files: `index.html` (markup + `<head>` metadata), `style.css` (layout, animation, breakpoints), `favicon.svg` (vector favicon), `vercel.json` (static deploy config — set `{}` or remove `"framework": "nextjs"` key so Vercel does not attempt a Next.js build).
- Vercel serves static files directly; no build command needed.
- No JavaScript files. No environment variables. No database.
- `vercel.json` in repo root must not contain `"framework": "nextjs"`. Set to `{}` or `{ "framework": null }`.

**Design context (from design-bible.md):**
- Dark background: `#0f0e0c` with radial amber glow `radial-gradient(ellipse 60% 40% at 50% 50%, #c9a96e18 0%, transparent 70%)`
- "Hello Omer" — font `clamp(2.8rem, 8vw, 5.5rem)`, weight 300, color `#f0ede6` (16.2:1 contrast ✅)
- "from Palmidos AI" — font `clamp(1rem, 2.8vw, 1.75rem)`, weight 300, color `#c9a96e` (7.1:1 contrast ✅), letter-spacing 0.04em
- Typeface: Fraunces (Google Fonts, single `<link>`) with fallback `Georgia, "Times New Roman", serif`
- Animation: `@keyframes greetingIn` — opacity 0→1, translateY 20px→0, duration 700ms, delay 200ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, fill-mode `both`
- `@media (prefers-reduced-motion: reduce)` — cancel animation, set opacity 1, translateY 0 immediately
- Centering: `body { display: flex; align-items: center; justify-content: center; min-height: 100dvh; }`
- Mobile padding: `padding: 0 24px` on `.page` or `body`
- 16px gap between greeting lines

**Product context (from PRD + user-flows.md):**
- Greeting text exact string: `"Hello Omer"` (h1) and `"from Palmidos AI"` (p)
- `<title>Hello Omer</title>` required (R-007)
- Favicon required — no 404 in network tab (R-008); use `favicon.svg` + `favicon.ico` fallback in `<head>`
- Viewport meta tag: `width=device-width, initial-scale=1` (no `user-scalable=no`)
- `lang="en"` on `<html>`
- `<main>` landmark wrapping `.page` content; `<h1>` for main greeting
- Animation must complete within 1.5s total (200ms delay + 700ms animation = 900ms ≤ 1.5s ✅)
- No JavaScript, no analytics, no tracking, no database connection

**CSS custom properties to define in `:root`:**
```css
:root {
  --color-bg:      #0f0e0c;
  --color-primary: #f0ede6;
  --color-accent:  #c9a96e;
  --color-glow:    #c9a96e18;
  --font-serif:    'Fraunces', Georgia, 'Times New Roman', serif;
  --size-main:     clamp(2.8rem, 8vw, 5.5rem);
  --size-sub:      clamp(1rem, 2.8vw, 1.75rem);
  --space-gap:     16px;
  --space-edge:    24px;
}
```

**DOM structure (exact from design-bible.md):**
```html
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Omer</title>
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    <link rel="icon" href="favicon.ico" sizes="any">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <main class="page">
      <div class="greeting greeting--animate">
        <h1 class="greeting__main">Hello Omer</h1>
        <p class="greeting__sub">from Palmidos AI</p>
      </div>
    </main>
  </body>
</html>
```

**Test strategy:** pragmatic
> This is a purely presentational static page with zero backend logic. All acceptance criteria are visual/structural and verified by manual QA + automated Lighthouse checks in Stage 2. No TDD or Jest required — tests follow implementation via browser/Lighthouse inspection.

### Files to Create/Modify

| File Path | Action (create/modify) | Purpose |
|-----------|----------------------|---------|
| `index.html` | create | Single HTML page — markup, `<head>` metadata, greeting structure (R-001, R-002, R-007, R-008) |
| `style.css` | create | Layout (flexbox centering), animation (`@keyframes greetingIn`), responsive typography, color tokens, reduced-motion override (R-002, R-003, R-004, R-006, R-009, R-010) |
| `favicon.svg` | create | SVG vector favicon — Palmidos AI minimal mark or letter-based glyph (R-008) |
| `vercel.json` | modify | Remove/nullify `"framework": "nextjs"` so Vercel treats repo as static; set `{}` or `{ "framework": null }` |
| `README.md` | modify | Document local dev (`npx serve .`), deployment (auto via Vercel on push to main), and note: no env vars required |

### Acceptance Criteria — Stage 1

1. [ ] `index.html` exists at repo root and contains the exact text "Hello Omer" and "from Palmidos AI" in the DOM (R-001)
2. [ ] "Hello Omer" is wrapped in an `<h1>` element with class `greeting__main`; "from Palmidos AI" is in a `<p>` element with class `greeting__sub` (R-001)
3. [ ] `<title>` element contains exactly "Hello Omer" (R-007)
4. [ ] `<html>` has `lang="en"`; `<meta charset="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1">` are present (R-004)
5. [ ] `<link rel="icon" href="favicon.svg" type="image/svg+xml">` and `<link rel="icon" href="favicon.ico" sizes="any">` are present in `<head>`; `favicon.svg` file exists at repo root (R-008)
6. [ ] `style.css` defines `body` with `display: flex; align-items: center; justify-content: center; min-height: 100dvh` — greeting is vertically and horizontally centered at all viewport widths (R-002)
7. [ ] `@keyframes greetingIn` animates opacity 0→1 and translateY 20px→0; `.greeting--animate` applies it with 700ms duration, 200ms delay, `cubic-bezier(0.16, 1, 0.3, 1)` easing, and `fill-mode: both`; total animation completes by 900ms (R-003)
8. [ ] `@media (prefers-reduced-motion: reduce)` sets `.greeting--animate { animation: none; opacity: 1; transform: translateY(0); }` (R-003 error state)
9. [ ] `--color-primary: #f0ede6` used for `.greeting__main` text; `--color-accent: #c9a96e` used for `.greeting__sub` text — both colors produce WCAG AAA contrast on `#0f0e0c` background (R-006, R-010)
10. [ ] `.greeting__main` uses `font-size: var(--size-main)` = `clamp(2.8rem, 8vw, 5.5rem)` (R-004); `.greeting__sub` uses `font-size: var(--size-sub)` = `clamp(1rem, 2.8vw, 1.75rem)` (R-004)
11. [ ] Background uses `background-color: var(--color-bg)` and `background-image: radial-gradient(ellipse 60% 40% at 50% 50%, var(--color-glow) 0%, transparent 70%)` (R-009)
12. [ ] No horizontal scrollbar at 375px viewport width; greeting text does not clip or overflow (R-004)
13. [ ] `vercel.json` does not contain `"framework": "nextjs"` — Vercel can deploy the repo as a static site without a build error (R-005)
14. [ ] Opening `index.html` in a browser (or via `npx serve .`) shows the greeting centered on screen with the animation playing on load (R-003, R-005)
15. [ ] No JavaScript files exist in the repo; no `<script>` tags in `index.html`; no npm packages installed (PRD non-goal)
16. [ ] No `.env` file committed; no database connection strings in any file (PRD hard constraint)

### Estimated Complexity

**Complexity:** S

---

## Stage 2: Lighthouse CI

**Objective:** Add a GitHub Actions workflow that runs Lighthouse CI against the live Vercel deployment on every push to `main`, gating on Performance ≥ 95 and Accessibility ≥ 95.

**Implements:** R-005, R-006 (Success Metrics: Lighthouse Performance ≥ 95, Accessibility ≥ 95, LCP < 1.5s)

**Prerequisites:** Stage 1 complete and deployed to `https://omer-landing-palmidos.vercel.app`

**Architecture context:**
- CI tool: `@lhci/cli` v^0.14 (dev-only, installed in workflow — not shipped to users)
- Workflow file: `.github/workflows/ci.yml`
- Target URL: `https://omer-landing-palmidos.vercel.app` (hardcoded — no `VERCEL_URL` env var needed since the URL is stable and pre-provisioned)
- No `npm ci` or build step — Vercel deploys automatically on push; Lighthouse runs against the already-live URL
- Reference template: `/home/openclaw/.openclaw/company/templates/github-actions-ci-nextjs.yml` — adapt for static (skip build steps, only run Lighthouse audit)
- Assertions: `performance >= 0.95`, `accessibility >= 0.95`
- `lhci` config: inline in workflow or via `.lighthouserc.json` at repo root

**Product context:**
- User Flow 3 (CI Bot) requires Lighthouse to gate on Performance ≥ 95 and Accessibility ≥ 95 on each push
- LCP < 1.5s is a success metric — Lighthouse reports LCP; CI should log it
- No `DATABASE_URL` secret required (no database in this project)

**Test strategy:** strict
> CI configuration is infrastructure-as-code with binary pass/fail behavior. Acceptance criteria are verified by observing the workflow run green on GitHub Actions.

### Files to Create/Modify

| File Path | Action (create/modify) | Purpose |
|-----------|----------------------|---------|
| `.github/workflows/ci.yml` | create | GitHub Actions workflow — installs `@lhci/cli`, runs Lighthouse against Vercel URL, asserts Performance ≥ 95 and Accessibility ≥ 95 |
| `.lighthouserc.json` | create | Lighthouse CI config — target URL, assertion thresholds, output settings |

### Acceptance Criteria — Stage 2

1. [ ] `.github/workflows/ci.yml` exists and triggers on `push` to `main` and on `pull_request` (R-005 CI gate)
2. [ ] Workflow installs `@lhci/cli@^0.14` and runs `lhci autorun` against `https://omer-landing-palmidos.vercel.app`
3. [ ] `.lighthouserc.json` asserts `"performance": ["error", {"minScore": 0.95}]` and `"accessibility": ["error", {"minScore": 0.95}]`
4. [ ] Workflow completes green (exit 0) when pushed to `main` — visible in GitHub Actions tab for `tegridy-farms/omer-landing`
5. [ ] If Lighthouse Performance drops below 0.95 or Accessibility below 0.95, the workflow exits non-zero (CI fails)
6. [ ] No `npm ci` or `next build` steps in the workflow — it is a pure Lighthouse audit, no build required (R-005, architecture constraint)
7. [ ] No secrets or credentials are hardcoded in `ci.yml` or `.lighthouserc.json` (PRD hard constraint)

### Estimated Complexity

**Complexity:** S
