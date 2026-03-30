# User Flows: Omer Landing Page

**Project ID:** omer-landing
**Author:** Kyle (Product Manager)
**Date:** 2026-03-30

**Output path:** `docs/pipeline/user-flows.md`

---

## Flow 1: First Visit — Page Load & Greeting

**Implements:** R-001, R-002, R-003, R-004, R-005

> As Omer, I want to open the landing page and immediately see a beautiful, personalized greeting so that I feel welcomed and impressed.

### Actor

Omer (the recipient) — visiting on any device via the Vercel URL.

### Preconditions

1. The page is deployed and live at `https://omer-landing-palmidos.vercel.app`
2. Visitor has a working internet connection
3. Visitor is using any modern browser (Chrome, Safari, Firefox, Edge — latest two versions)

### Steps

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | User navigates to `https://omer-landing-palmidos.vercel.app` | Browser sends GET request; Vercel responds with HTTP 200 and HTML payload |
| 2 | Browser parses and renders HTML/CSS | Page background appears; greeting text is in DOM but initially invisible (opacity: 0) |
| 3 | CSS animation triggers automatically on load | Greeting fades and/or slides in over ~800–1200ms |
| 4 | Animation completes | "Hello Omer, from Palmidos AI" is fully visible, centered in the viewport |
| 5 | User reads the greeting | Page is static — no further interaction required |

### Success Criteria

- Greeting text "Hello Omer, from Palmidos AI" is visible and centered within 1.5s of page load
- Animation plays smoothly (no jank, no layout shift)
- Page renders correctly at 375px (mobile), 768px (tablet), and 1280px+ (desktop)
- Browser tab shows title "Hello Omer" and a favicon

### Error States

| Error | Trigger | System Behavior | Recovery |
|-------|---------|-----------------|----------|
| Page fails to load | Vercel outage or DNS failure | Browser shows standard network error page | User retries; no fallback page needed at this scope |
| Broken favicon 404 | Missing favicon file in repo | Browser tab shows no icon; page still loads | Ensure favicon file is committed and referenced correctly in `<head>` |
| Animation not playing | Browser has `prefers-reduced-motion: reduce` enabled | CSS should respect `@media (prefers-reduced-motion: reduce)` and show text immediately without animation | Text is still displayed; animation is skipped gracefully |
| Font fails to load | Google Fonts CDN unavailable (if used) | System fallback font renders instead | Acceptable — system fonts are the primary preference per R-001 |

---

## Flow 2: Mobile Visitor

**Implements:** R-004, R-001, R-002

> As a mobile visitor, I want the page to look polished on my phone so that the experience feels intentional, not broken.

### Actor

Any visitor (Omer or otherwise) on a mobile device (375px–428px viewport width).

### Preconditions

1. Page is deployed and live
2. Visitor is on a smartphone browser (Safari on iOS, Chrome on Android)
3. Device has a screen width between 375px and 428px

### Steps

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | User opens URL on mobile browser | Page loads; viewport meta tag (`width=device-width, initial-scale=1`) ensures correct scaling |
| 2 | Browser renders the page at mobile width | Greeting text is centered vertically and horizontally within the mobile viewport (100dvh or 100vh) |
| 3 | Animation plays | Same fade/slide-in animation as desktop; timing is identical |
| 4 | User views the greeting | Text is legible; font size scales appropriately (no overflow, no horizontal scroll) |

### Success Criteria

- No horizontal scrollbar at 375px width
- Greeting text is fully visible without zooming
- Font size is readable (minimum 16px effective size on mobile)
- Vertical centering works on both iOS Safari (with address bar) and Chrome on Android

### Error States

| Error | Trigger | System Behavior | Recovery |
|-------|---------|-----------------|----------|
| Text overflows horizontally | Font size too large for narrow viewport | Text clips or causes scroll | Use `clamp()` or responsive font sizing (e.g. `vw`-based) to prevent overflow |
| Page not centered on iOS Safari | 100vh includes address bar on iOS | Content appears off-center | Use `100dvh` (dynamic viewport height) or JS fallback for Safari |

---

## Flow 3: Lighthouse / CI Automated Check

**Implements:** R-005, R-006, Success Metrics

> As the CI pipeline, I run Lighthouse against each deployment to verify performance and accessibility do not regress.

### Actor

GitHub Actions CI bot (automated, not a human user).

### Preconditions

1. A commit is pushed to `main` branch
2. Vercel deployment completes successfully (deploy hook or preview URL available)
3. Lighthouse CI is configured in the repo (optional: if not configured, this flow is manual)

### Steps

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | Developer pushes code to `main` | GitHub Actions triggers CI workflow |
| 2 | Vercel deploys the new version | Vercel build succeeds; deployment URL is live |
| 3 | Lighthouse CI runs against the deployment URL | Lighthouse audits Performance, Accessibility, Best Practices, SEO |
| 4 | Scores are reported | CI passes if Performance ≥ 95 and Accessibility ≥ 95; fails otherwise |

### Success Criteria

- Lighthouse Performance score ≥ 95
- Lighthouse Accessibility score ≥ 95
- No WCAG AA contrast violations flagged
- LCP (Largest Contentful Paint) < 1.5s

### Error States

| Error | Trigger | System Behavior | Recovery |
|-------|---------|-----------------|----------|
| Performance score drops below 95 | Heavy background animation or unoptimized assets | CI fails; PR blocked | Optimize animation (CSS-only, no JS library); compress any image assets |
| Accessibility failure | Low contrast ratio or missing `alt` attributes | CI fails with specific violation | Fix contrast (≥ 4.5:1) or add missing semantic attributes |
| Vercel build fails | Syntax error or missing file | Deployment does not complete; Lighthouse cannot run | Fix build error; re-push to trigger new deployment |
