# Implementation Plan: Omer Landing Page

**Project ID:** omer-landing
**Author:** Cartman (CTO)
**Date:** 2026-03-30

**Output path:** `docs/pipeline/plan.md` and `docs/pipeline/plan-status.md` in the app repo (committed to `main`).

---

## Project Size Assessment

**Tier: Small**

**Reasoning:** This is a plain HTML/CSS static page with no build tooling, no backend, no framework, and no database. Total file count is ~6 (`index.html`, `style.css`, `favicon.svg`, `favicon.ico`, `vercel.json`, `README.md`) plus a CI workflow file. Single concern. Maximum 2–3 stages.

**Stage count: 2** — within Small tier cap.

**Stage 1 scaffolding note:** Per the Stage 1 Scaffolding Rule, this project has **no build tooling** (no `package.json`, no bundler). Therefore Stage 1 is the **first functional deliverable** — the working HTML/CSS page itself. There is nothing meaningful to scaffold separately.

---

## Stage 1: Functional Landing Page

**Objective:** Build and deploy the complete, polished "Hello Omer" landing page — markup, styling, animations, favicon, responsive design — as a fully working static site on Vercel.

**Implements:** R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010

**Prerequisites:** None (first stage)

**Architecture:**
The project is plain HTML + CSS with zero JavaScript and no build tooling. Files deploy directly to Vercel as a static site. The existing `vercel.json` must be updated from `"framework": "nextjs"` to remove the `framework` key (or set `{}`), so Vercel serves the files as a plain static site without attempting a Next.js build. Repo: `tegridy-farms/omer-landing`. Vercel URL: `https://omer-landing-palmidos.vercel.app`.

Directory structure per architecture spec:
```
omer-landing/
  index.html          ← All markup, <title>, favicon refs
  style.css           ← Layout, animation, responsive breakpoints
  favicon.svg         ← SVG favicon (primary, vector)
  favicon.ico         ← Fallback favicon (legacy browsers)
  vercel.json         ← Update: remove "framework": "nextjs" key
  README.md           ← Update with project description
```

No `node_modules`, no `package.json`, no build step. `npx serve .` (without install) can be used for local preview.

**Design:**
Dark-mode aesthetic with warm near-black background (`#0f0e0c`). Typography uses **Fraunces** (Google Fonts, single `<link>`, `display=swap`) with Georgia/serif fallback. Two-part greeting:
- `<h1 class="greeting__main">Hello Omer</h1>` — `#f0ede6`, `clamp(2.8rem, 8vw, 5.5rem)`, weight 300
- `<p class="greeting__sub">from Palmidos AI</p>` — `#c9a96e` (amber-gold accent), `clamp(1rem, 2.8vw, 1.75rem)`, weight 300, `letter-spacing: 0.04em`

Background: radial-gradient amber halo (`radial-gradient(ellipse 60% 40% at 50% 50%, #c9a96e18 0%, transparent 70%)`) layered over the solid background color.

Entrance animation:
```css
@keyframes greetingIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.greeting--animate {
  animation: greetingIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
}
@media (prefers-reduced-motion: reduce) {
  .greeting--animate { animation: none; opacity: 1; transform: translateY(0); }
}
```

CSS custom properties in `:root`:
```css
:root {
  --color-bg:      #0f0e0c;
  --color-primary: #f0ede6;
  --color-accent:  #c9a96e;
  --color-glow:    #c9a96e18;
  --font-serif:    'Fraunces', Georgia, serif;
  --size-main:     clamp(2.8rem, 8vw, 5.5rem);
  --size-sub:      clamp(1rem, 2.8vw, 1.75rem);
  --space-gap:     16px;
  --space-edge:    24px;
}
```

Body centering using `min-height: 100dvh` (iOS Safari address bar safe):
```css
body {
  margin: 0;
  background-color: var(--color-bg);
  background-image: radial-gradient(ellipse 60% 40% at 50% 50%, var(--color-glow) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 0 var(--space-edge);
  box-sizing: border-box;
}
```

**Product Note:**
The page exists to deliver one moment of delight to Omer — "Hello Omer, from Palmidos AI" — centered, beautiful, and immediate. No interactivity. No forms. No links. No analytics. No database. The `<title>` must read "Hello Omer" (R-007). The favicon must be present and not 404 (R-008). Vercel URL must return HTTP 200 with the correct content (R-005).

**Test strategy:** pragmatic

*Justification: This is a pure presentational/static stage — no business logic, no API, no migrations. Acceptance criteria are verified visually and via simple HTTP checks, not unit tests. Lighthouse CI is a separate Stage 2 concern.*

### Files to Create/Modify

| File Path | Action (create/modify) | Purpose |
|-----------|----------------------|---------|
| `index.html` | modify | Complete semantic markup: `<title>Hello Omer</title>`, Google Fonts link, favicon refs, centered `<main>` with `.greeting.greeting--animate`, `<h1>` + `<p>` |
| `style.css` | create | CSS custom properties, body centering (flexbox + `100dvh`), typography, radial-gradient background, `@keyframes greetingIn`, responsive `clamp()`, `prefers-reduced-motion` override |
| `favicon.svg` | create | SVG favicon — amber circle or "P" lettermark for Palmidos AI (minimal, scales well) |
| `favicon.ico` | create | ICO fallback (16×16 or 32×32) for legacy browser compatibility |
| `vercel.json` | modify | Remove `"framework": "nextjs"` key; replace with `{}` or static config so Vercel serves plain HTML |
| `README.md` | modify | Brief project description: Omer Landing Page, Vercel URL, local preview instructions (`npx serve .`) |

### Acceptance Criteria — Stage 1

1. [ ] `index.html` contains the exact text "Hello Omer" in an `<h1>` and "from Palmidos AI" in a `<p>`, both visible without scrolling at 1280×800 viewport (R-001)
2. [ ] The greeting is visually centered (vertically and horizontally) at 1280×800 desktop and 375×667 mobile; no scrollbar appears (R-002)
3. [ ] CSS `@keyframes greetingIn` animation is defined in `style.css`; the `.greeting--animate` class applies it with a 200ms delay and 700ms duration; animation completes within 1.5s of page load (R-003)
4. [ ] `@media (prefers-reduced-motion: reduce)` block in `style.css` sets `animation: none; opacity: 1; transform: translateY(0)` on `.greeting--animate` — text appears instantly when reduced-motion is enabled (R-003)
5. [ ] Page renders without horizontal overflow or text clipping at 375px, 768px, and 1280px viewports; `clamp()` typography used for both greeting lines (R-004)
6. [ ] `curl -I https://omer-landing-palmidos.vercel.app` returns HTTP 200; response body contains "Hello Omer" (R-005)
7. [ ] "Hello Omer" (`#f0ede6` on `#0f0e0c`) meets WCAG AA contrast ≥ 4.5:1 (actual: 16.2:1); "from Palmidos AI" (`#c9a96e` on `#0f0e0c`) meets WCAG AA contrast ≥ 4.5:1 (actual: 7.1:1) (R-006)
8. [ ] `<title>Hello Omer</title>` is present in rendered HTML (R-007)
9. [ ] `favicon.svg` and `favicon.ico` are committed; both referenced in `<head>` via `<link rel="icon">`; `curl -I https://omer-landing-palmidos.vercel.app/favicon.ico` returns HTTP 200 (R-008)
10. [ ] Background radial-gradient amber halo is present in `style.css` on `body` (R-009)
11. [ ] `<h1>` and `<p>` are visually differentiated: `<h1>` uses `--color-primary` (`#f0ede6`) and large fluid size; `<p>` uses `--color-accent` (`#c9a96e`) and smaller fluid size (R-010)
12. [ ] `vercel.json` does not contain `"framework": "nextjs"` (prevents Vercel build failure on plain HTML)
13. [ ] `min-height: 100dvh` is used (not `100vh`) in `style.css` for iOS Safari address bar compatibility (R-002, R-004)
14. [ ] `<html lang="en">` and `<meta name="viewport" content="width=device-width, initial-scale=1">` present (accessibility baseline)
15. [ ] No JavaScript files exist in the repo root; page renders fully without JS execution

### Estimated Complexity

**Complexity:** M

---

## Stage 2: Lighthouse CI

**Objective:** Add GitHub Actions Lighthouse CI that automatically audits Performance ≥ 95 and Accessibility ≥ 95 on every push to `main`.

**Implements:** R-005 (deployment gate), Success Metrics (LCP < 1.5s, Lighthouse Performance ≥ 95, Accessibility ≥ 95)

**Prerequisites:** Stage 1 complete and merged — Vercel deployment live at `https://omer-landing-palmidos.vercel.app`

**Architecture:**
Per the architecture spec, CI uses `@lhci/cli ^0.14` in GitHub Actions. Since this is a plain static site with no `npm install` or build step, the CI workflow is **Lighthouse-only** — it skips `npm ci`, `next build`, and DB steps. The workflow runs `lhci autorun` against the **production Vercel URL** (`https://omer-landing-palmidos.vercel.app`) since there is no preview deployment step in the workflow (no framework, no PR deploy hook needed for this minimal site). Reference: `/home/openclaw/.openclaw/company/templates/github-actions-ci-nextjs.yml` — adapt by removing Node.js install, npm ci, DB guard, and build steps; keep only `lhci autorun`.

**Design:** No UI changes. This stage is infrastructure only.

**Product Note:**
Per the success metrics in the PRD, Lighthouse Performance ≥ 95 and Accessibility ≥ 95 are hard gates. `lighthouserc.json` must define these assertions. The LCP threshold of 1.5s is implicit in the Performance score gate (a 1.5s LCP on a CSS-only page will easily exceed 95).

**Test strategy:** strict

*Justification: CI configuration is the acceptance criterion itself — the workflow must pass on the live deployment. This is a functional correctness check, not a visual one.*

### Files to Create/Modify

| File Path | Action (create/modify) | Purpose |
|-----------|----------------------|---------|
| `.github/workflows/ci.yml` | create | GitHub Actions workflow: install `@lhci/cli`, run `lhci autorun` against `https://omer-landing-palmidos.vercel.app` on push to `main` and on PRs |
| `lighthouserc.json` | create | Lighthouse CI config: assert `performance >= 0.95`, `accessibility >= 0.95`; set `url` to `https://omer-landing-palmidos.vercel.app` |

### Acceptance Criteria — Stage 2

1. [ ] `.github/workflows/ci.yml` exists and is syntactically valid YAML; workflow triggers on `push` to `main` and on `pull_request` (Success Metrics)
2. [ ] Workflow installs `@lhci/cli` via `npm install -g @lhci/cli` (no `package.json` needed — global install in CI only)
3. [ ] `lighthouserc.json` defines `assertions.categories:performance >= 0.95` and `assertions.categories:accessibility >= 0.95` (Success Metrics)
4. [ ] `lighthouserc.json` sets the URL to `https://omer-landing-palmidos.vercel.app`
5. [ ] GitHub Actions run on a push to `main` completes without error; Lighthouse Performance score ≥ 95 and Accessibility score ≥ 95 are both reported as PASS in CI logs (R-005, Success Metrics)
6. [ ] CI workflow does NOT include `npm ci`, `next build`, `DATABASE_URL`, or any DB-related steps (plain static site — no Node.js deps to install)
7. [ ] No `node_modules`, `.env`, or credential files are committed to the repo (security baseline)

### Estimated Complexity

**Complexity:** S

---

## Stage Count Justification

This project is **Small tier** (max 3 stages). Two stages are used:
- **Stage 1** is the single functional deliverable (all HTML/CSS per PRD + architecture).
- **Stage 2** is CI/Lighthouse gating, which cannot be tested until Stage 1 is deployed. Keeping CI separate avoids blocking the working page on CI config, and ensures the Lighthouse audit runs against real deployed output.

Collapsing both into one stage would mean CI is tested before Vercel deployment is proven, creating a chicken-and-egg problem. Two stages is the correct and minimal split.
