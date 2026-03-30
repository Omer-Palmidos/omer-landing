# Prior QA Summary — Stage 2 Context

**Project ID:** omer-landing
**Prepared by:** Cartman (CTO)
**Date:** 2026-03-30
**Covers:** Stage 1 QA review (`docs/qa/stage-1-review.md`)

---

## Summary

Stage 1 QA passed with zero issues. All 16 acceptance criteria met. AgentShield Grade A. Design QA PASS.

---

## Key Findings & Conventions Established

### What Passed Well (repeat these patterns)

- **CSS custom properties in `:root`**: all design tokens (`--color-bg`, `--color-primary`, `--color-accent`, `--color-glow`, `--font-serif`, `--size-main`, `--size-sub`, `--space-gap`, `--space-edge`) declared at top of `style.css`. Continue this pattern for any new CSS in Stage 2 (none expected, but note for consistency).
- **Animation spec match**: `@keyframes greetingIn` at exactly 200ms delay + 700ms duration = 900ms total. `cubic-bezier(0.16, 1, 0.3, 1)` easing. `fill-mode: both`. Matched design-bible spec exactly — no drift.
- **`prefers-reduced-motion`**: correctly implemented. Text renders instantly at `opacity: 1; transform: none` when reduced-motion is active.
- **`min-height: 100dvh`**: used correctly (not `100vh`) for iOS Safari address bar safety.
- **`vercel.json` = `{}`**: framework key removed. Vercel serves as plain static site with no build error.
- **No JavaScript**: zero `.js` files, zero `<script>` tags. Confirmed clean.
- **Semantic HTML**: `<main>` landmark, `<h1>` for greeting, `<p>` for attribution, `lang="en"`, correct viewport meta. Lighthouse Accessibility already primed for ≥ 95.
- **Favicon**: both `favicon.svg` (primary) and `favicon.ico` (fallback) committed and referenced in `<head>`.

### Regressions to Watch in Stage 2

- **No regressions from Stage 1** — Stage 2 only adds `.github/workflows/ci.yml` and `lighthouserc.json`. No existing files should be touched.
- **Do not modify `index.html`, `style.css`, or `vercel.json`** — Stage 2 is CI infrastructure only. Any unexpected changes to these files in Stage 2 is out of scope.

### Recurring Conventions to Enforce

1. **File scope discipline**: Stage 2 touches exactly 2 files (`.github/workflows/ci.yml`, `lighthouserc.json`). If Kenny modifies anything outside those two files, flag it.
2. **No `npm ci` / `next build` in CI**: this is a plain static site. The workflow must NOT include Node.js dependency install steps, build steps, or DATABASE_URL secrets. Lighthouse-only.
3. **Global `@lhci/cli` install in CI**: use `npm install -g @lhci/cli` (not `npm ci` from a package.json) since there is no package.json in this repo.
4. **Production URL in `lighthouserc.json`**: must target `https://omer-landing-palmidos.vercel.app`, not a localhost or preview URL.
5. **Assertion thresholds**: `performance >= 0.95` and `accessibility >= 0.95` (values in 0–1 range for lhci, not 0–100).

### Security Notes

- AgentShield Grade A on Stage 1. No secrets, no credentials, no tracking.
- Stage 2 adds no new secret requirements (LHCI runs against the public Vercel URL, no auth token needed).

---

## Stage 2 Readiness Assessment

The page is technically optimal for Lighthouse ≥ 95:
- Zero JavaScript → perfect JS execution score
- CSS-only animation (opacity + transform, GPU-composited) → no layout shift, 60fps
- System-serif fallback + Fraunces with `font-display: swap` → fast FCP/LCP
- Vercel Edge CDN with brotli/HTTP2 → low TTFB

Stage 2 is expected to be straightforward. The main risk is CI config syntax errors or wrong URL in `lighthouserc.json`.
