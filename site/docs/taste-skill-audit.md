# Taste-Skill Audit: KorobkovArt

**Date:** 2026-04-18
**Auditor:** Dizy (VS Designer Agent)
**Baseline:** DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
**Project type:** Art studio portfolio / e-commerce (creative/editorial)

---

## 1. Typography (Rule 1) -- SEVERITY: HIGH

### Finding T1: Inter font used globally
- **File:** `src/app/[locale]/layout.tsx:14`
- **Issue:** `Inter` is imported from `next/font/google` and set as `--font-inter`. Per taste-skill Rule 1, Inter is explicitly BANNED for premium/creative projects. For an art studio website, this is the single biggest visual downgrade.
- **Rule violated:** Rule 1 (ANTI-SLOP: "Discourage Inter for Premium or Creative vibes")
- **Fix:** Replace with a font pairing suitable for an art/editorial context. Recommended: `Satoshi` (sans-serif body) paired with a serif display like `Playfair Display` or `Cormorant Garamond` for headlines. Since this is a creative/editorial project (not a dashboard), serif headers are appropriate and encouraged.

### Finding T2: Headlines lack typographic presence
- **Files:** `src/app/[locale]/gallery/page.tsx:11`, `src/components/ExhibitionsSection.tsx:19`, multiple section headers
- **Issue:** Gallery page H1 is `text-2xl font-semibold tracking-[0.2em]` -- too small and too spaced for a primary heading. Most section headings are `text-xl` or `text-2xl` with uniform tracking. Missing hierarchy through weight variation.
- **Rule violated:** Rule 1 ("Headlines should feel heavy and intentional", default `text-4xl md:text-6xl tracking-tighter leading-none`)
- **Fix:** Establish clear typographic scale: display (hero) > section headers > sub-headers. Use `text-3xl md:text-5xl tracking-tight` for section H2s. Introduce weight variety: 300/400/500/600/700/800.

### Finding T3: Missing letter-spacing variation
- **Issue:** Nearly all text uses `tracking-[0.15em]` or `tracking-[0.2em]` uniformly. Large headlines should use negative tracking (tighter), while small labels/caps should use positive tracking.
- **Rule violated:** Rule 1 ("Use negative tracking for large headers, positive tracking for small caps")

### Finding T4: No text-wrap balancing
- **Issue:** No usage of `text-wrap: balance` or `text-wrap: pretty` on any headlines or paragraphs.
- **Rule violated:** Redesign Skill Typography ("Orphaned words")

---

## 2. Color (Rule 2) -- SEVERITY: LOW-MEDIUM

### Finding C1: Clean neutral palette -- GOOD
- **Status:** PASS. The project uses a well-constructed warm neutral palette (`#f5f5f0` light bg, `#0a0a0a` dark bg) with no "AI Purple" or neon gradients. Accent is pure black/white which is appropriate for an art gallery.

### Finding C2: Instagram hover gradient introduces off-palette colors
- **Files:** `src/app/[locale]/page.tsx:24`, `src/app/[locale]/contact/page.tsx:21`
- **Issue:** Social link hover states use `hover:from-purple-500 hover:via-pink-500 hover:to-orange-400` (Instagram), `hover:bg-[#0088cc]` (Telegram), `hover:bg-[#25D366]` (WhatsApp). These saturated brand colors clash with the otherwise refined neutral palette.
- **Rule violated:** Rule 2 ("Max 1 Accent Color. Saturation < 80%", "COLOR CONSISTENCY")
- **Fix:** On hover, use a single consistent treatment: subtle background shift to `foreground/10` or tinted shadow, rather than injecting each platform's brand colors.

### Finding C3: Hardcoded green for "available" status
- **File:** `src/components/ArtworkDetail.tsx:83`
- **Issue:** `text-green-600` is hardcoded for the "available" status, breaking the otherwise neutral palette.
- **Fix:** Use a desaturated, palette-consistent indicator (e.g., a small dot or subtle badge).

---

## 3. Layout (Rule 3) -- SEVERITY: MEDIUM

### Finding L1: Centered hero section
- **File:** `src/components/HeroSection.tsx:25`
- **Issue:** Hero is `flex flex-col items-center justify-center` with `text-center` -- a centered layout. Per taste-skill Rule 3, centered hero sections are BANNED when `LAYOUT_VARIANCE > 4` (currently 8).
- **Rule violated:** Rule 3 (ANTI-CENTER BIAS)
- **Fix:** Shift to a split-screen layout (50/50) or left-aligned content with the video background asymmetrically positioned. Consider: text left-aligned at ~40% width, with the video filling the remaining space.

### Finding L2: 3-column card grid in PressSection
- **File:** `src/components/PressSection.tsx:46`
- **Issue:** `grid grid-cols-1 md:grid-cols-3 gap-8` -- the classic "3 equal cards horizontally" pattern is explicitly banned.
- **Rule violated:** Section 7 ("NO 3-Column Card Layouts")
- **Fix:** Use a 2-column zig-zag layout, horizontal scroll strip, or stacked list (similar to ExhibitionsSection which already uses a better list pattern).

### Finding L3: Gallery grid uses 3-column layout
- **File:** `src/components/ArtworkGrid.tsx:61`
- **Issue:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` -- for an art gallery, a uniform 3-column grid feels generic. At DESIGN_VARIANCE 8, a masonry layout or varied aspect ratios would be more appropriate.
- **Rule violated:** Rule 3 ("Layout Diversification"), Section 7 ("NO 3-Column Card Layouts")
- **Fix:** Implement a masonry layout with varied card sizes (some 2-column span, some taller). CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` plus variable `grid-row: span 2` for featured pieces.

### Finding L4: About page is bare
- **File:** `src/app/[locale]/about/page.tsx`
- **Issue:** Only a paragraph of text plus a full-width image. No heading, no visual structure, no depth. This is one of the most important pages for an art studio.
- **Rule violated:** Redesign Skill Layout ("Missing whitespace", "Empty, flat sections")
- **Fix:** Add artist name heading, timeline/milestones, awards, studio photos. Use a split layout or offset composition.

---

## 4. Materiality (Rule 4) -- SEVERITY: LOW-MEDIUM

### Finding M1: Generic card borders in PressSection
- **File:** `src/components/PressSection.tsx:49`
- **Issue:** `border border-border p-6` -- basic card container. Per taste-skill, cards should only exist when elevation communicates hierarchy.
- **Rule violated:** Rule 4 (ANTI-CARD OVERUSE)
- **Fix:** Remove borders, use `divide-y` list or pure spacing between items.

### Finding M2: shadcn/ui Card component in default state
- **File:** `src/components/ui/card.tsx`
- **Issue:** The Card component is untouched shadcn default: `rounded-xl border bg-card shadow-sm`. For a premium art studio site, this needs custom radii, shadows, and styling.
- **Rule violated:** Section 7 ("shadcn/ui Customization: NEVER in generic default state")
- **Fix:** Customize Card: remove `rounded-xl` (use sharp corners to match the art studio aesthetic), replace `shadow-sm` with tinted shadow, adjust border treatment.

### Finding M3: No grain/noise texture
- **Issue:** All backgrounds are flat colors. For a creative/art studio site, subtle grain overlays would add materiality and break digital flatness.
- **Rule violated:** Redesign Skill Surfaces ("Flat design with zero texture")
- **Fix:** Add a fixed, pointer-events-none noise overlay on the body.

---

## 5. Interactive States (Rule 5) -- SEVERITY: MEDIUM

### Finding S1: No active/pressed feedback on buttons
- **Files:** All buttons across the project
- **Issue:** Buttons have hover states (`hover:opacity-90` or `hover:bg-foreground`) but zero `:active` feedback. No `scale(0.98)` or `translateY(1px)` on press.
- **Rule violated:** Rule 5 ("Tactile Feedback: On :active, use -translate-y-[1px] or scale-[0.98]")
- **Fix:** Add `active:scale-[0.98]` to all interactive buttons globally.

### Finding S2: Loading state uses "..." text
- **Files:** `src/components/InquiryForm.tsx:115`, `src/components/PurchaseModal.tsx:411`
- **Issue:** Submit buttons show literal "..." during loading. This is a bare minimum implementation.
- **Rule violated:** Rule 5 ("Loading: Skeletal loaders matching layout sizes")
- **Fix:** Replace with a small spinner icon or shimmer animation inside the button.

### Finding S3: Gallery has no empty state design
- **File:** `src/components/ArtworkGrid.tsx:59`
- **Issue:** Empty state is a plain text paragraph: `text-secondary text-center py-20`. No composed visual.
- **Rule violated:** Rule 5 ("Beautifully composed empty states indicating how to populate data")
- **Fix:** Design a proper empty state with an illustration or icon, heading, and descriptive text.

### Finding S4: 404 page is not localized and minimal
- **File:** `src/app/not-found.tsx`
- **Issue:** Hardcoded English, links to `/en`, no branded visual. Minimal effort.
- **Fix:** Add brand-consistent design, use localized text, include navigation options.

---

## 6. Motion (Section 4) -- SEVERITY: MEDIUM

### Finding MO1: No stagger animations
- **Issue:** Grid items (artworks, press mentions) all appear at once. No `staggerChildren` or cascade delays on the main gallery grid.
- **Rule violated:** Section 4 ("Staggered Orchestration: Do not mount lists or grids instantly")
- **Fix:** Add staggered entry to ArtworkCard grid items using Framer Motion variants with `staggerChildren: 0.05`.

### Finding MO2: ScrollReveal uses linear easing
- **File:** `src/components/ScrollReveal.tsx:19`
- **Issue:** Uses `ease: "easeOut"` -- a generic CSS easing. Per taste-skill, spring physics should be used for interactive elements.
- **Rule violated:** Section 4 ("Premium Spring Physics: type: spring, stiffness: 100, damping: 20")
- **Fix:** Replace `ease: "easeOut"` with `type: "spring", stiffness: 80, damping: 20` for a more natural, weighty reveal.

### Finding MO3: No scroll-triggered reveals on gallery page
- **Issue:** The gallery page loads all cards statically. No `whileInView` animations on individual artwork cards as user scrolls.
- **Fix:** Wrap ArtworkCard items in viewport-triggered fade-in with stagger.

---

## 7. Forbidden Patterns (Section 7) -- SEVERITY: MEDIUM

### Finding F1: Lucide icons exclusively
- **Files:** Throughout (`lucide-react` in package.json, imports in Header, ThemeToggle, pages)
- **Issue:** Lucide is identified as "the default AI icon choice" in taste-skill Section 7. Used for everything: ChevronsDown, Lock, Sun, Moon, Mail, MessageCircle, Send.
- **Rule violated:** Section 7 ("Lucide or Feather icons exclusively -- use Phosphor, Heroicons, or custom set")
- **Fix:** Not critical for an art studio (icons are minimal here), but consider Phosphor for variety. The custom InstagramIcon SVG is a good pattern to extend.

### Finding F2: Theme toggle is sun/moon switch
- **File:** `src/components/ThemeToggle.tsx`
- **Issue:** Classic Sun/Moon toggle. Per taste-skill, this is a generic pattern.
- **Rule violated:** Section 7 ("Light/dark toggle always a sun/moon switch")
- **Fix:** Low priority for art studio. Could integrate into settings or use system preference auto-detection.

### Finding F3: Duplicate social contact sections
- **Files:** `src/app/[locale]/page.tsx:99-114`, `src/app/[locale]/contact/page.tsx:71-93`
- **Issue:** Identical social links component duplicated between home page bottom and contact page. Not a taste-skill violation per se, but creates maintenance burden and visual inconsistency opportunity.
- **Fix:** Extract into a shared `SocialLinks` component.

### Finding F4: Missing legal links in footer
- **File:** `src/components/Footer.tsx`
- **Issue:** No privacy policy or terms of service links.
- **Rule violated:** Redesign Skill ("No legal links")

### Finding F5: `min-h-screen` instead of `min-h-[100dvh]`
- **Files:** `src/app/error.tsx:11`, `src/app/not-found.tsx:5`
- **Issue:** Uses `min-h-screen` which can cause layout jumping on iOS Safari.
- **Rule violated:** Section 2 ("NEVER use h-screen. ALWAYS use min-h-[100dvh]")

---

## Summary Score

| Category | Score | Notes |
|----------|-------|-------|
| Typography | 4/10 | Inter font is the #1 issue. Flat hierarchy. |
| Color | 7/10 | Clean neutral palette. Minor social hover clashes. |
| Layout | 5/10 | Centered hero, 3-col grids, bare About page. |
| Materiality | 5/10 | Default shadcn Card, no texture, basic borders. |
| States | 5/10 | Loading skeletons exist. No active feedback. Empty states weak. |
| Motion | 5/10 | ScrollReveal exists. No stagger, no spring physics. |
| Forbidden Patterns | 6/10 | No major violations. Lucide-only, sun/moon toggle. |
| **Overall** | **5.3/10** | Solid foundation with clean code. Needs premium polish. |

---

## Task List

| ID | Title | Effort | Priority |
|----|-------|--------|----------|
| KO-TASTE-01 | Replace Inter with premium font pairing | M | 1 |
| KO-TASTE-02 | Redesign hero section: break center bias | L | 2 |
| KO-TASTE-03 | Establish typographic scale and hierarchy | M | 1 |
| KO-TASTE-04 | Replace 3-col grids with masonry/asymmetric layouts | M | 2 |
| KO-TASTE-05 | Add active/pressed tactile feedback to all buttons | S | 1 |
| KO-TASTE-06 | Add stagger animations to grid items | S | 2 |
| KO-TASTE-07 | Replace ScrollReveal easing with spring physics | S | 3 |
| KO-TASTE-08 | Harmonize social link hover colors with palette | S | 2 |
| KO-TASTE-09 | Add grain/noise texture overlay | S | 3 |
| KO-TASTE-10 | Customize shadcn Card component for art studio aesthetic | S | 2 |
| KO-TASTE-11 | Redesign About page with proper structure | M | 2 |
| KO-TASTE-12 | Fix min-h-screen to min-h-[100dvh] + improve empty states | S | 3 |
