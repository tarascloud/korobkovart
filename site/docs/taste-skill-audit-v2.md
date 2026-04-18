# Taste-Skill Audit V2: KorobkovArt

**Date:** 2026-04-18
**Auditor:** Dizy (VS Designer Agent)
**Baseline:** DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
**Previous audit:** taste-skill-audit.md (12 tasks, all DONE)

---

## Changes Since Audit V1

### What improved (KO-TASTE-01 through 12)

| Area | Before | After | Verdict |
|------|--------|-------|---------|
| **Font** | Inter (banned) | Manrope | GOOD -- geometric sans, good for art context |
| **Hero layout** | Centered (banned at VARIANCE 8) | Left-aligned split-screen with video BG | GOOD |
| **Gallery grid** | 3-column (banned) | 2-column masonry via CSS `columns-2` | GOOD |
| **About page** | Bare paragraph + image | Split-screen with zigzag artist statement | GOOD |
| **Tactile feedback** | No active states | Global `active:scale-[0.98]` in CSS | GOOD |
| **Stagger animations** | None | CSS stagger via `--index` delay | GOOD |
| **Noise overlay** | None | SVG feTurbulence, opacity 0.035, overlay blend | GOOD |
| **Tinted shadows** | None | `.hover-tinted-shadow` with warm rgba on light/dark | GOOD |
| **Viewport units** | `min-h-screen` | `min-h-[100dvh]` | GOOD |
| **Social hovers (home)** | Instagram gradient, Telegram blue, WhatsApp green | Neutral `hover:bg-foreground` | GOOD |

### What still needed work (found in Audit V2)

---

## V2 Findings and Fixes

### KO-TASTE-13: Contact page hover colors + center bias (DONE)

**Finding:** Contact page was missed during KO-TASTE-08. Still had per-brand saturated hover colors (`hover:from-purple-500`, `hover:bg-[#0088cc]`, `hover:bg-[#25D366]`) and centered layout (`items-center justify-center text-center`).

**Fix:** Rewrote contact page layout to left-aligned asymmetric (matching hero pattern). All social links now use unified `hover:bg-foreground hover:text-background` with `hover-tinted-shadow`. Added ScrollReveal stagger to social links.

### KO-TASTE-14: ScrollReveal spring physics (DONE)

**Finding:** KO-TASTE-07 was marked DONE but ScrollReveal still used `ease: [0.16, 1, 0.3, 1]` cubic-bezier instead of spring physics.

**Fix:** Replaced with `type: "spring", stiffness: 80, damping: 20, delay`. Now all scroll-triggered animations use premium spring physics.

### KO-TASTE-15: CV page typographic hierarchy (DONE)

**Finding:** CV page had flat, uniform typography -- all headings `text-lg font-semibold tracking-[0.2em]`, no visual structure, no animations. Felt like a raw document.

**Fix:**
- H1 redesigned as bold display title with decorative line (matching site pattern)
- Sections separated by `border-t` with generous vertical spacing
- Biography section uses split-layout pattern (sticky label left, content right)
- Education uses same split-layout
- Exhibition lists use `border-b` item pattern with hover states
- All sections wrapped in ScrollReveal with stagger delays

### KO-TASTE-16: Gallery page H1 + empty state (DONE)

**Finding:** Gallery H1 was `text-2xl font-semibold tracking-[0.2em]` -- undersized. Empty state was bare `<p>` text.

**Fix:**
- H1 upgraded to `text-3xl sm:text-4xl font-bold tracking-tighter leading-none`
- Empty state redesigned with custom SVG icon (abstract picture frame with landscape path and sun circle), heading text, and helper suggestion

### KO-TASTE-17: InquiryForm spinner + green status (DONE)

**Finding:** Submit button showed literal "..." during loading (taste-skill Rule 5 violation). ArtworkDetail used `text-green-600` for available status (breaks neutral palette, Rule 2).

**Fix:**
- Replaced "..." with inline SVG spinner (`animate-spin`) alongside button text
- Replaced `text-green-600` with subtle foreground-colored dot indicator (`w-1.5 h-1.5 rounded-full bg-foreground/60`)

### KO-TASTE-18: Remove redundant bounce chevrons (DONE)

**Finding:** Home page had two `ChevronsDown` with `animate-bounce` between Featured Works/About and About/Contact sections. Generic AI pattern (taste-skill Section 7). The hero already has its own scroll indicator.

**Fix:** Removed both redundant chevron elements. Added `mt-16` spacing to the About image for visual breathing room. Cleaned up unused ChevronsDown import from page.tsx.

### KO-TASTE-19: Footer legal links (DONE)

**Finding:** Footer had no privacy policy or terms of service links. Layout was a single row with everything compressed.

**Fix:**
- Restructured footer: top row (social links + location), divider, bottom row (copyright + legal links)
- Added Privacy Policy and Terms of Service links (pointing to `/privacy` and `/terms` routes -- pages to be created separately)
- Improved spacing with `py-10`, tracking on social links, uppercase location text

---

## Updated Score

| Category | V1 | V2 | Notes |
|----------|----|----|-------|
| Typography | 4/10 | 7/10 | Manrope good. CV page now has proper hierarchy. Gallery H1 fixed. |
| Color | 7/10 | 8/10 | Contact page harmonized. Green status replaced with neutral dot. |
| Layout | 5/10 | 8/10 | Hero, About, Contact all asymmetric. CV split-layout. Gallery masonry. |
| Materiality | 5/10 | 7/10 | Noise overlay, tinted shadows, border-b patterns. |
| States | 5/10 | 7/10 | Spinner on forms. Designed empty state. Active feedback global. |
| Motion | 5/10 | 7/10 | Spring physics on ScrollReveal. Stagger on grids. CV has scroll reveals. |
| Forbidden Patterns | 6/10 | 8/10 | No brand-colored hovers. No bounce chevrons. Legal links added. |
| **Overall** | **5.3/10** | **7.4/10** | Significant improvement. Remaining items are minor polish. |

---

## Remaining Opportunities (not critical)

1. **Manrope vs serif pairing** -- For a creative/editorial art studio, a serif display font (Cormorant, Playfair) for headings paired with Manrope body would add editorial presence. Current all-Manrope is functional but not distinctive.

2. **Partners page cards** -- 2x2 grid of bordered cards for partnership types could benefit from the split-layout or list pattern used elsewhere for consistency.

3. **404 page localization** -- Still hardcoded English text ("This page doesn't exist", "Go Home").

4. **Privacy/Terms pages** -- Footer links now point to routes that don't exist yet. Need placeholder pages.

5. **ArtworkCard aspect ratio** -- All cards use `aspect-[3/4]`. For DESIGN_VARIANCE 8, some variety (featured pieces spanning wider) could add visual interest, though this requires data-driven sizing.

6. **ExhibitionsSection on home page** -- Not rendered (referenced via ExhibitionsSection component but not used in page.tsx). Consider re-adding if exhibition data exists.
