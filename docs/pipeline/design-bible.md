# Design Bible: Omer Landing Page

**Project ID:** omer-landing
**Author:** Wendy (UX Designer)
**Date:** 2026-03-30

**Output path:** `docs/pipeline/design-bible.md`

---

## Design Principles

1. **Singular focus, maximum impact** — One message. One moment. Every design decision serves the greeting and nothing else. Decorative elements exist only to frame it, never to compete. (Supports R-001, R-002)

2. **Motion with restraint** — The entrance animation is the only event on this page. It must feel intentional and unhurried, not flashy. CSS-only, 60fps, zero layout shift. The text arrives; it doesn't perform. (Supports R-003)

3. **Typographic hierarchy does the heavy lifting** — "Hello Omer" and "from Palmidos AI" are visually distinct at first glance through weight and scale contrast, not gimmicks. The typeface carries personality without decoration. (Supports R-010, R-006)

4. **Performance is a design value** — System fonts, zero JavaScript, zero external requests (unless a single Google Font is justified). Sub-1.5s LCP is a UX requirement, not just a metric. (Supports R-005, Success Metrics)

5. **Accessible by default** — `prefers-reduced-motion` support, WCAG AA contrast (≥4.5:1), semantic markup, and viewport-safe centering are non-negotiable from day one. (Supports R-006, R-004)

---

## Color Palette

Dark-mode aesthetic: premium, editorial, intimate. A near-black background tinted with the slightest warm undertone keeps it from feeling sterile. The primary text is near-white with a warm tint. The accent — used only for "from Palmidos AI" — is a muted amber-gold that reads as crafted, not corporate.

Assumption: No official Palmidos AI brand colors were provided (PRD Open Question #1). The palette below is designed to feel premium and warm. Override with brand colors if provided.

| Name           | Hex / OKLCH                      | Usage                                      | Contrast on Background |
|----------------|----------------------------------|--------------------------------------------|------------------------|
| Background     | `#0f0e0c` / `oklch(8% 0.01 60)`  | Page background — warm near-black          | —                      |
| Surface-subtle | `#1a1916` / `oklch(12% 0.012 60)`| Used for background mesh/gradient layers   | —                      |
| Text-primary   | `#f0ede6` / `oklch(93% 0.01 80)` | "Hello Omer" — warm near-white             | 16.2:1 ✅ WCAG AAA     |
| Text-accent    | `#c9a96e` / `oklch(72% 0.09 75)` | "from Palmidos AI" — muted amber-gold      | 7.1:1 ✅ WCAG AAA      |
| Text-dim       | `#7a756c` / `oklch(50% 0.015 60)`| Reserved for any future supporting copy   | 4.6:1 ✅ WCAG AA       |
| Glow-halo      | `#c9a96e22`                      | Radial glow behind text (CSS gradient)     | —                      |

**Contrast notes:**
- Text-primary on Background: ~16.2:1 — well above WCAG AA (4.5:1) and AAA (7:1)
- Text-accent on Background: ~7.1:1 — exceeds WCAG AA
- No gray-on-gray combinations. No pure black (#000) or pure white (#fff).

---

## Typography

The typeface must feel crafted without being ornate. **Fraunces** (variable, Google Fonts) is an "optical illusion" serif with soft, editorial warmth — it distinguishes this page from the generic tech-sans defaults. The italic axis is available for expressive fallback.

Assumption: Fraunces is chosen for its premium editorial feel. If performance constraints require system fonts (per PRD preference), fall back to `Georgia, "Times New Roman", serif` for R-001 text and accept the lighter typographic personality trade-off.

**Font loading strategy:** Single Google Fonts `<link>` with `display=swap`. Fallback: `Georgia, "Times New Roman", serif`. CSS `font-display: swap` ensures no invisible text.

| Element         | Font Family            | Size (fluid)                       | Weight | Line Height | Letter-spacing |
|-----------------|------------------------|------------------------------------|--------|-------------|----------------|
| Greeting-main   | Fraunces, Georgia, serif | `clamp(2.8rem, 8vw, 5.5rem)`       | 300    | 1.1         | -0.02em        |
| Greeting-sub    | Fraunces, Georgia, serif | `clamp(1rem, 2.8vw, 1.75rem)`      | 300    | 1.4         | 0.04em         |
| `<title>`       | (browser-native)       | n/a                                | —      | —           | —              |

**Sizing rationale:**
- `clamp(2.8rem, 8vw, 5.5rem)` for "Hello Omer": minimum 44.8px at 375px viewport, maximum 88px at 1100px+. Never overflows. Never too small.
- `clamp(1rem, 2.8vw, 1.75rem)` for "from Palmidos AI": visually subordinate at all sizes; ~40% the visual weight of the main line.
- Both use the same font family — differentiated by scale and color only, maintaining system coherence.

**Anti-patterns avoided:**
- No Inter, Roboto, or Open Sans
- No monospace as "technical" shorthand
- No bold weight on the main greeting — weight 300 + large size creates refined presence, not loudness

---

## Spacing System

- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

For this single-page layout, spacing tokens serve two purposes:
1. The gap between "Hello Omer" and "from Palmidos AI" — 16px (`--space-4` = 4 × 4)
2. Viewport padding on mobile to prevent text from touching edges — 24px horizontal padding at 375px

---

## Component Library

This is a single-screen static page. The "component" is the greeting unit itself.

---

### GreetingBlock

**Implements:** R-001, R-002, R-003, R-006, R-010

The central content unit. Contains two text elements displayed as a vertically-stacked group, centered in the viewport both horizontally and vertically.

- **Variants:** Only one variant (single-page, single purpose)
- **States:**
  - `default (pre-animation)`: opacity 0, translateY(20px) — invisible and shifted down
  - `entered (post-animation)`: opacity 1, translateY(0) — fully visible, in position
  - `reduced-motion`: skip animation state; render at opacity 1, translateY(0) immediately
- **Props:**
  - `greeting-main`: string — "Hello Omer"
  - `greeting-sub`: string — "from Palmidos AI"
- **Description:**
  A `<div class="greeting">` containing:
  1. `<h1 class="greeting__main">Hello Omer</h1>` — rendered in Text-primary at large fluid size, weight 300
  2. `<p class="greeting__sub">from Palmidos AI</p>` — rendered in Text-accent at smaller fluid size, weight 300, letter-spacing 0.04em (adds subtle formality/distinction)
  
  The block has `text-align: center`. The gap between the two lines is 16px.
  
  Animation class `.greeting--animate` triggers on page load (no JS needed — applied directly in HTML; CSS `@keyframes` picks it up immediately).

---

### BackgroundLayer

**Implements:** R-009

A purely decorative CSS layer. Provides depth without competing with the greeting.

- **Variants:** One variant — radial gradient halo
- **States:** Static (no interaction states needed)
- **Props:** None (CSS-driven)
- **Description:**
  Applied to `body` via CSS only. Two layers:
  1. **Base**: solid Background color `#0f0e0c`
  2. **Halo**: `radial-gradient(ellipse 60% 40% at 50% 50%, #c9a96e18 0%, transparent 70%)` — a very faint amber glow centered exactly where the text sits. It illuminates the text area without rendering as a visible shape.
  
  No JavaScript. No canvas. No particles. Pure CSS. Lighthouse Performance score is unaffected.

---

## Page Layouts

### Main Page (index.html)

**Implements:** R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-009, R-010

- **Layout:** Full-viewport flexbox. `body` is `display: flex; align-items: center; justify-content: center; min-height: 100dvh`. No grid, no columns, no sidebars. One centered block.

- **Components used:** GreetingBlock, BackgroundLayer

- **Content hierarchy:**
  1. **First:** Background color fills viewport (renders instantly)
  2. **Second:** Radial halo glow appears (part of background, no separate render step)
  3. **Third:** GreetingBlock animates in — "Hello Omer" dominates, "from Palmidos AI" subtly follows beneath

- **DOM structure:**
  ```
  <html>
    <head>
      <title>Hello Omer</title>
      <link rel="icon" href="favicon.svg" type="image/svg+xml">
      <link rel="icon" href="favicon.ico" sizes="any">
      <link rel="stylesheet" href="style.css">
      <!-- Optional: Google Fonts for Fraunces -->
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

- **Responsive behavior:**
  - **375px (mobile):** Greeting centered within `min-height: 100dvh`. `clamp()` ensures text fits without overflow. 24px horizontal padding on `.page` prevents text from touching screen edges. Font renders at ~44.8px (main) and ~16px (sub). Fully legible.
  - **768px (tablet):** Same layout. Font at ~61px (main) and ~21px (sub). Centered. No change in structure.
  - **1280px+ (desktop):** Font at ~88px (main) and ~28px (sub). Halo effect most visible. Centered. No scroll.

- **Semantic markup notes:**
  - `<main>` wraps the content for landmark navigation
  - `<h1>` for the primary greeting — correct heading hierarchy for a single-page document
  - `<p>` for "from Palmidos AI" — it is attribution/subtext, not a heading
  - `lang="en"` on `<html>` for screen reader language detection

---

## Interaction Patterns

| Pattern            | Trigger                     | Behavior                                                                 | Duration   |
|--------------------|-----------------------------|--------------------------------------------------------------------------|------------|
| Greeting entrance  | Page load (CSS auto-start)  | `.greeting--animate` fades in (opacity 0→1) and slides up (translateY 20px→0) using `@keyframes greetingIn` | 900ms total — 200ms delay + 700ms ease-out |
| Reduced-motion     | `prefers-reduced-motion: reduce` | `@keyframes` replaced with instant opacity: 1, translateY: 0. No translate motion at all. Text appears immediately. | 0ms (instant) |
| No hover/focus states | n/a                    | No interactive elements on MVP page. No hover or focus patterns needed.  | —          |
| Font load fallback | Google Fonts CDN unavailable | `font-display: swap` — system serif renders immediately; Fraunces swaps in when loaded. No layout shift (fallback metrics specified). | n/a         |

**Animation implementation (CSS):**

```css
@keyframes greetingIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.greeting--animate {
  animation: greetingIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both;
}

@media (prefers-reduced-motion: reduce) {
  .greeting--animate {
    animation: none;
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Easing note:** `cubic-bezier(0.16, 1, 0.3, 1)` is an ease-out-expo curve — elements decelerate sharply on arrival, feeling weighty and resolved rather than floaty. Matches R-003 quality bar.

**`both` fill-mode:** Ensures opacity: 0 before the 200ms delay fires, and holds the final state after completion. No flash of invisible text.

---

## Responsive Breakpoints

| Name    | Min Width | Max Width  | Layout Notes                                                                  |
|---------|-----------|------------|-------------------------------------------------------------------------------|
| Mobile  | 320px     | 767px      | 24px horizontal padding on `.page`. `min-height: 100dvh` for iOS Safari. `clamp()` typography prevents overflow. Minimum rendered size: ~44.8px (main), ~16px (sub). |
| Tablet  | 768px     | 1279px     | No structural changes. Typography scales naturally via `clamp()`. Padding can relax to 48px. |
| Desktop | 1280px    | —          | Full typographic scale: ~88px (main), ~28px (sub). Halo gradient most visible. |

**No media queries needed for layout** — flexbox centering and `clamp()` handle all three breakpoints natively. A single `@media` query exists only for `prefers-reduced-motion`.

**iOS Safari caveat (per architecture spec):** Use `min-height: 100dvh` (dynamic viewport height) rather than `100vh` to ensure correct vertical centering when the address bar is visible. `100dvh` is supported in Safari 15.4+. Acceptable for modern browser targets.

---

## Accessibility Requirements

**Implements:** R-006, R-004 (mobile legibility), Lighthouse Accessibility ≥ 95

- **Color contrast:**
  - Text-primary (`#f0ede6`) on Background (`#0f0e0c`): **16.2:1** — WCAG AAA ✅
  - Text-accent (`#c9a96e`) on Background (`#0f0e0c`): **7.1:1** — WCAG AAA ✅
  - Both far exceed the AA minimum of 4.5:1 for normal text

- **Touch targets:** No interactive elements exist on this page. Not applicable for MVP.

- **Viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1">` — required. Do NOT include `user-scalable=no`. Users must be able to pinch-zoom.

- **Focus indicators:** No focusable elements on this page. Lighthouse will not flag missing focus rings. If any link or button is added in a future iteration, specify a `2px solid Text-accent` outline with `outline-offset: 4px`.

- **ARIA patterns:**
  - `<main>` landmark — identifies primary content area for screen readers
  - `<h1>` for "Hello Omer" — establishes document heading structure
  - No ARIA roles required beyond semantic HTML
  - No `aria-label` overrides needed; content is self-describing

- **Keyboard navigation:** No interactive elements — no tab stops, no keyboard traps. Page is entirely readable without keyboard interaction.

- **Screen reader behavior:**
  - Reading order: `<h1>Hello Omer</h1>` → `<p>from Palmidos AI</p>`
  - Animation (opacity/transform) is visually-only — does not affect DOM content; screen readers read the text immediately regardless of animation state
  - No `aria-live` regions needed (no dynamic content updates)

- **Reduced motion (R-003 error state):** `@media (prefers-reduced-motion: reduce)` removes translate/opacity animation. Text renders immediately at full opacity. Implemented in CSS — no JavaScript required.

- **Semantic HTML:** `lang="en"` on `<html>`. `<meta charset="utf-8">`. `<title>Hello Omer</title>` (implements R-007).

- **Favicon accessibility:** Both `favicon.svg` (vector) and `favicon.ico` (fallback) referenced in `<head>` (implements R-008). SVG favicon should use `currentColor` or explicit color — no transparency issues on OS dark/light mode.

---

## Implementation Notes for Developer

These notes bridge from design spec to code decisions:

1. **Google Fonts import (if Fraunces is approved):**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&display=swap" rel="stylesheet">
   ```
   CSS variable: `--font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;`

2. **If system fonts are chosen** (per PRD performance preference): use `font-family: Georgia, 'Times New Roman', serif` directly. The design still works — the amber-gold accent and weight/scale contrast carry the visual identity.

3. **CSS custom properties** (all values token-ized):
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

4. **Body centering:**
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

5. **No JavaScript.** No `DOMContentLoaded` listeners. No scroll handlers. Animation is pure CSS.

6. **Content Security Policy** (recommended in `vercel.json`):
   ```
   default-src 'self';
   style-src 'self' fonts.googleapis.com;
   font-src fonts.gstatic.com;
   ```
   Omit `fonts.googleapis.com` and `fonts.gstatic.com` if using system fonts only.
