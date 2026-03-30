# Architecture: Omer Landing Page

**Project ID:** omer-landing
**Author:** Stan (Software Architect)
**Date:** 2026-03-30

**Where this file lives:** `docs/pipeline/architecture.md` (versioned with code)

---

## Tech Stack

Every choice here follows the "boring is better" principle. The PRD explicitly recommends plain HTML/CSS (R-001 through R-005), and this project has zero interactivity, zero data fetching, and zero server-side logic — so the stack is intentionally minimal.

| Layer      | Technology         | Version  | Justification |
|------------|--------------------|----------|---------------|
| Language   | HTML5 + CSS3       | n/a      | Zero-dependency, maximum performance for a static page with no interactivity |
| Framework  | None (plain HTML)  | n/a      | Single page, no routing, no state management needed; framework would only add overhead |
| Styling    | Vanilla CSS (inline `<style>` or `style.css`) | n/a | CSS keyframe animations are native; no build step, no class purging, no config |
| Runtime    | Vercel Edge CDN    | n/a      | Pre-provisioned; serves static files with near-zero TTFB globally |
| Build tool | None               | n/a      | Static files deploy directly; no transpile step required |
| Testing    | Lighthouse CI (GitHub Actions) | latest | Automated performance + accessibility gate per success metrics |

**Trade-off:** We chose plain HTML/CSS over Next.js because the page has zero interactivity and zero data fetching. Trade-off: if the project ever needs dynamic content, a migration to a framework (Next.js App Router) will be required. This is acceptable for MVP scope.

**Trade-off:** We chose system fonts over Google Fonts as the primary preference. Trade-off: slightly less typographic control, but zero external network dependency and best possible LCP score (R-003, R-006).

---

## Environment Variables

No environment variables are required for this project. The page is fully static with hardcoded content.

| Name | Environments | Consumed by | Notes |
|------|--------------|-------------|-------|
| *(none)* | — | — | No secrets, no API keys, no database connection needed per PRD non-goals. Neon Postgres (`shiny-hat-40318359`) is provisioned but **must not be used**. |

No `.env` file or Vercel env vars need to be configured. Never commit credentials; the Neon connection string must remain unused.

---

## System Architecture

### Components

| Component | Responsibility | Implements | Communicates With |
|-----------|---------------|------------|-------------------|
| `index.html` | Delivers page structure, semantic markup, `<title>`, favicon reference, and inline or linked CSS | R-001, R-002, R-003, R-004, R-005, R-007, R-008 | Browser (client only) |
| `style.css` | Visual layout (centering, typography), CSS keyframe animations, responsive breakpoints, reduced-motion media query | R-002, R-003, R-004, R-006, R-009, R-010 | index.html (linked) |
| `favicon.ico` / `favicon.svg` | Browser tab icon | R-008 | index.html (`<link rel="icon">`) |
| Vercel CDN | Serves static files globally; handles HTTPS, HTTP/2, edge caching | R-005 | Browser |
| GitHub Actions CI | Runs Lighthouse CI on each push to `main`; gates on Performance ≥ 95 and Accessibility ≥ 95 | Success Metrics | Vercel deployment URL |

### Data Flow

```
Browser → GET https://omer-landing-palmidos.vercel.app
        ← HTTP 200 + index.html (served from Vercel Edge CDN)
Browser parses HTML, loads style.css
CSS @keyframes animation triggers automatically on page render
"Hello Omer, from Palmidos AI" fades/slides in → fully visible ≤1.5s
```

No server-side logic. No API calls. No JavaScript execution required.

### Client–Server Integration

Not applicable. This is a fully static page with no client–server communication beyond the initial document request. There are no API routes, no server components, and no fetch calls.

---

## Data Model

Not applicable. This project has no database (per PRD non-goals) and no dynamic data. All content is hardcoded in `index.html`.

---

## API Design

Not applicable. This is a static page — no API endpoints exist or are needed.

**Post-deploy smoke check (Tweek):**

| Check | URL | Expected |
|-------|-----|----------|
| Page loads | `https://omer-landing-palmidos.vercel.app` | HTTP 200, body contains "Hello Omer" |
| Favicon present | `https://omer-landing-palmidos.vercel.app/favicon.ico` | HTTP 200, no 404 |

---

## Directory Structure

Minimal by design. No build tooling, no `node_modules`, no framework scaffolding.

```
omer-landing/                   # repo root
  .github/
    workflows/
      ci.yml                    # Lighthouse CI — Performance ≥ 95, Accessibility ≥ 95
  docs/
    pipeline/
      prd.md
      user-flows.md
      architecture.md           # this file
      infra.json
  index.html                    # single page — all markup and <title>, favicon ref (R-001, R-007)
  style.css                     # layout, animation, responsive breakpoints (R-002, R-003, R-004, R-009, R-010)
  favicon.ico                   # browser tab icon (R-008); SVG alternative acceptable
  vercel.json                   # static deployment config (framework: null or remove nextjs ref)
  README.md
```

**`mkdir -p` command for CI setup:**
```bash
mkdir -p .github/workflows docs/pipeline
```

**Note on `vercel.json`:** The existing `vercel.json` has `"framework": "nextjs"` but the project is plain HTML. Update to `{}` or remove `framework` key so Vercel treats it as a static site rather than attempting a Next.js build.

---

## File Boundaries

All content lives in two files: `index.html` and `style.css`. No splitting is needed.

- `index.html`: semantic HTML structure only — `<head>` metadata, `<body>` markup, `<link>` to stylesheet. No inline `<style>` blocks (keep concerns separated).
- `style.css`: all visual rules — custom properties for colors, layout (flexbox centering), `@keyframes` animation, `@media` breakpoints, `@media (prefers-reduced-motion: reduce)` override.
- No JavaScript files in MVP scope. No `main.js`, no `app.js`.

---

## Local Development, CI, and Post-Deploy Checks

| Topic | Convention |
|-------|------------|
| **Local env** | Open `index.html` directly in a browser, or use `npx serve .` for a local HTTP server (no install needed). No `.env` file required. |
| **Migrations** | Not applicable — no database. |
| **CI** | `.github/workflows/ci.yml`: install `@lhci/cli`, deploy preview to Vercel, run `lhci autorun` against `https://omer-landing-palmidos.vercel.app`. Assert `performance >= 0.95` and `accessibility >= 0.95`. Use template at `/home/openclaw/.openclaw/company/templates/github-actions-ci-nextjs.yml` as a reference; adapt for static (skip `npm ci` / `next build` steps — only Lighthouse audit step needed). |
| **Post-deploy smoke** | `curl -I https://omer-landing-palmidos.vercel.app` → expect `HTTP/2 200`. `curl -I https://omer-landing-palmidos.vercel.app/favicon.ico` → expect `200` (not 404). |
| **Security scan** | `bash /home/openclaw/.openclaw/scripts/agentshield-scan.sh` from repo root before release. |
| **Reduced-motion** | Verify `@media (prefers-reduced-motion: reduce)` branch shows text instantly — test in Chrome DevTools (Rendering > Emulate CSS media feature). |

---

## Security Considerations

1. **No secrets** — no credentials, API keys, or tokens exist in this project. Nothing to protect. (R-005 constraint)
2. **No third-party scripts** — no analytics, tracking pixels, or ad tags per PRD non-goals. Zero XSS attack surface from third-party JS.
3. **Subresource Integrity (SRI)** — if a Google Font `<link>` is added, include `crossorigin` attribute. No SRI is needed for self-hosted assets.
4. **HTTPS enforced by Vercel** — all traffic is automatically redirected to HTTPS; no configuration needed.
5. **Content Security Policy** — Vercel can add a restrictive CSP header via `vercel.json` headers config. Recommended for MVP: `default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com`. Add `unsafe-inline` only if using inline `<style>` (avoid it by using `style.css`).

---

## Performance Considerations

1. **Zero JavaScript** — no JS bundle means instant parse + execute time; LCP is the CSS + HTML render time only. (R-003, Success Metrics LCP < 1.5s)
2. **System fonts preferred** — eliminates font-fetch network round-trip, improving LCP and FCP. (R-001)
3. **CSS-only animations** — `@keyframes` with `transform` and `opacity` only; both are GPU-composited, guaranteeing 60fps with zero layout shift. (R-003, R-009)
4. **Vercel Edge CDN** — static assets served from edge with HTTP/2, gzip/brotli compression, and long-lived cache headers automatically. (R-005)
5. **Favicon optimization** — use SVG favicon (`favicon.svg`) for vector scalability and tiny file size instead of multi-resolution `.ico`; reference both for broad compatibility. (R-008)
6. **`100dvh` for mobile centering** — use `min-height: 100dvh` instead of `100vh` to handle iOS Safari address bar correctly; eliminates vertical mis-centering on mobile. (R-002, R-004)
7. **`clamp()` for responsive typography** — use `clamp(1.8rem, 5vw, 4rem)` for the heading to prevent text overflow at 375px and scale gracefully to 1440px without media query duplication. (R-004)

---

## Third-Party Dependencies

No npm dependencies. No package.json required.

| Package | Version Range | Purpose | Justification |
|---------|--------------|---------|---------------|
| `@lhci/cli` (CI only) | `^0.14` | Lighthouse CI runner in GitHub Actions | Automated performance/accessibility gating per success metrics; not shipped to users |

Optional (only if Google Font is chosen by design):

| Resource | Source | Purpose | Justification |
|----------|--------|---------|---------------|
| Google Fonts CSS | `fonts.googleapis.com` | Specific typeface for premium aesthetic | Only if system fonts are deemed insufficient by design review; single `<link>` import, no JS |

---

## External Services

None — no external service integrations.

This project intentionally has no outbound API calls. Google Fonts (if used) is a CDN resource loaded by the browser, not an API the application calls. No integration specs are required.

