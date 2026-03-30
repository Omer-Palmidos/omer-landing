# PRD: Omer Landing Page

**Project ID:** omer-landing
**Author:** Kyle (Product Manager)
**Date:** 2026-03-30

**Output path:** `docs/pipeline/prd.md`

---

## Problem Statement

Omer needs a personalized, polished landing page that makes a strong first impression. Generic "under construction" or blank pages fail to communicate warmth or professionalism. A bespoke page — minimal, beautifully designed, with smooth animations — signals craftsmanship and personal attention. Without it, visitors land on nothing and bounce immediately. This page solves that with a single, elegant message: "Hello Omer, from Palmidos AI."

## Target Users

**Omer (the recipient)**
- Key characteristic: A person receiving a dedicated, personalized web experience
- Primary goal: Feel welcomed and impressed upon landing on the page
- Pain point addressed: Generic or empty pages feel impersonal and forgettable

**Palmidos AI (the sender)**
- Key characteristic: An AI product/brand showcasing aesthetic quality and craft
- Primary goal: Deliver a memorable, on-brand first impression
- Pain point addressed: Lack of a visible, polished public presence for demos or personal outreach

## Product Overview

Omer Landing is a single-page static web application deployed on Vercel. It displays a clean, centered greeting — "Hello Omer, from Palmidos AI" — with smooth CSS animations and a minimal aesthetic. No user interaction beyond loading the page is required. It is a showcase of design restraint: one message, delivered beautifully.

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page load time (LCP) | < 1.5s on a 4G connection | Lighthouse / WebPageTest |
| Lighthouse Performance score | ≥ 95 | Lighthouse CI in GitHub Actions |
| Lighthouse Accessibility score | ≥ 95 | Lighthouse CI in GitHub Actions |
| Animation completes without jank | 60fps on mid-range device | DevTools Performance tab |
| Page renders correctly on mobile (375px width) | Pass visual QA | Manual / screenshot test |

---

## Tech Constraints

**Pre-provisioned infrastructure (always present, do not re-provision):**
- Hosting: Vercel (project already linked to GitHub repo `tegridy-farms/omer-landing`)
- Vercel URL: `https://omer-landing-palmidos.vercel.app`
- Neon Postgres provisioned (`neon_project_id: shiny-hat-40318359`) — **not required for this project**; do not wire up a database connection
- Repo: GitHub under `tegridy-farms` org, CI/CD active from first push

**Required stack decisions for this project:**
- Frontend framework: Plain HTML + CSS (no framework needed for a single static page). Optionally Next.js if the team prefers a consistent stack — but vanilla is preferred for simplicity and performance.
- Styling: Plain CSS (no Tailwind required; keep dependencies minimal)
- Auth: None
- Key libraries/dependencies: No npm dependencies required. All animations via CSS keyframes.

**Trade-off:** We chose plain HTML/CSS over Next.js/React because the page has zero interactivity and zero data fetching. Trade-off: if the project ever needs dynamic content, a migration to a framework will be required.

**Hard constraints:**
- Never hardcode credentials or secrets — always use environment variables
- No external services beyond what's listed (no analytics, no tracking, no third-party fonts that require API keys)
- No database connection — Neon is provisioned but must not be used in this project
- Google Fonts (or system fonts) are acceptable for typography; prefer system fonts for best performance

---

## Requirements

| ID    | Priority | Description | Acceptance Criterion (binary pass/fail) |
|-------|----------|-------------|------------------------------------------|
| R-001 | P0 | Display the greeting text "Hello Omer, from Palmidos AI" prominently on the page | Text is present in the DOM and visible without scrolling on a 1280×800 viewport |
| R-002 | P0 | Page must be centered — the greeting is vertically and horizontally centered in the viewport | Greeting is centered at 100vh height on desktop (1280×800) and mobile (375×667) |
| R-003 | P0 | Smooth entrance animation on page load — greeting fades and/or slides in | Animation plays on first load; completes within 1.5s; no layout shift during animation |
| R-004 | P0 | Page is fully responsive — renders correctly on mobile (375px), tablet (768px), and desktop (1280px+) | Visual QA passes at all three breakpoints with no overflow or clipping |
| R-005 | P0 | Deployed and accessible at the Vercel URL `https://omer-landing-palmidos.vercel.app` | HTTP 200 response from the Vercel URL; page content matches design |
| R-006 | P1 | Clean, minimal aesthetic — light or dark background with high-contrast typography | Typography passes WCAG AA contrast ratio (≥ 4.5:1 for normal text) |
| R-007 | P1 | Page has a proper `<title>` tag: "Hello Omer" | `<title>` element contains "Hello Omer" in rendered HTML |
| R-008 | P1 | Favicon is set (any simple icon, or Palmidos AI brand mark if available) | Browser tab shows a favicon; no broken favicon 404 in network tab |
| R-009 | P2 | Subtle background visual — gradient, animated mesh, or particles — to add depth without distracting from the greeting | Background animation/gradient is present and does not reduce Lighthouse Performance score below 90 |
| R-010 | P2 | "from Palmidos AI" rendered in a visually distinct style (e.g. lighter weight, smaller size, or accent color) from "Hello Omer" | The two parts of the greeting are visually differentiated by font weight, size, or color |

---

## Non-Goals (MVP Scope Boundary)

1. **No user interaction** — no buttons, forms, CTAs, or navigation links on the MVP page
2. **No database usage** — Neon Postgres is provisioned but must not be connected or queried
3. **No analytics or tracking** — no GA, Mixpanel, or pixel integrations
4. **No multi-language / i18n** — English only; no locale switching
5. **No CMS or dynamic content** — the greeting text is hardcoded; no admin panel or editable content system

---

## Implementation Notes

- The entire page can be a single `index.html` + `style.css` (or equivalent in the chosen framework). No server-side logic is needed.
- If using Next.js for stack consistency, use `output: 'export'` for fully static output to keep Vercel deploys fast and simple.
- Animation should use CSS keyframes only — no JavaScript animation libraries (GSAP, Framer Motion) for MVP; keeps bundle size at zero.
- We chose system fonts over Google Fonts for R-001 text as a first preference to maximize performance. If the design requires a specific typeface, a single Google Font import is acceptable.

---

## Boundaries

- Never commit `.env` files or hardcoded secrets to the repo
- Never modify the GitHub Actions / CI config unless explicitly required by a requirement
- Never add npm dependencies not relevant to the requirements without noting it
- Do not wire up any database connection — Neon is off-limits for this project
- Do not add tracking pixels, analytics scripts, or third-party ad tags

---

## Open Questions

1. Does Palmidos AI have a brand color palette or logo to incorporate into the design? If yes, provide hex codes or assets before Stan begins implementation.
2. Light mode or dark mode preference? (Default assumption: dark background with light text for a premium feel — override if needed.)
3. Should the page eventually link to a Palmidos AI product/site, or remain a standalone dead-end page indefinitely?
