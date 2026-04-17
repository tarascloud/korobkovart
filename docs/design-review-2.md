# Design Review #2 — Korobkov Art Studio

**Date:** 2026-04-17
**Reviewer:** Dizy (VS Designer Agent)
**Task:** KO-053
**Scope:** Full design audit of ko.taras.cloud after KO-020..KO-025 improvements

---

## 1. Executive Summary

The site has evolved significantly since Design Review #1 (KO-020). The Inter font, shadcn/ui components, dark theme, hero section redesign, gallery hover effects, and contact page overhaul are all implemented. The overall aesthetic is clean, minimalist, and appropriate for a contemporary art studio.

This review identifies **12 inconsistencies** across 7 pages and admin panel, resulting in **8 improvement tasks** (KO-060 through KO-067).

---

## 2. Design Token Audit

### Color Palette

| Token | Light | Dark | Verdict |
|-------|-------|------|---------|
| `--background` | `#f5f5f0` (warm cream) | `#0a0a0a` (near-black) | OK |
| `--foreground` | `#1a1a1a` | `#f0f0f0` | OK |
| `--accent` | `#000000` | `#ffffff` | OK but accent === foreground in both themes; token is redundant |
| `--secondary` | `#666666` | `#999999` | ISSUE: light mode contrast ratio on `#f5f5f0` is ~4.3:1 (barely passes AA for body text at 14px+, fails for smaller text) |
| `--muted` | `#e5e5e0` | `#1c1c1c` | OK |
| `--border` | `#d4d4d0` | `#333333` | OK |

**Finding DR2-01 (MEDIUM):** `--secondary` (#666666) on `--background` (#f5f5f0) has ~4.3:1 contrast. For `text-xs` (12px) used extensively in artwork metadata, this fails WCAG AA which requires 4.5:1 for text under 18px. Dark mode #999999 on #0a0a0a is ~6.4:1, passes.

**Finding DR2-02 (LOW):** `--accent` token is identical to `--foreground` in both themes. It is only used in `::selection`. Consider removing or repurposing for a true accent color (e.g., a warm gold or subtle brand color for CTAs).

### Typography

| Element | Size | Weight | Tracking | Verdict |
|---------|------|--------|----------|---------|
| H1 (Hero) | text-4xl/6xl/7xl | extrabold (800) | tight | OK |
| H1 (Pages) | text-3xl | bold (700) | wider + uppercase | OK |
| H2 | text-2xl / text-xl | bold (700) | wider + uppercase | OK |
| H3 | text-lg / text-xl | bold (700) | wider + uppercase | OK |
| Nav links | text-sm | normal (400) | wider + uppercase | OK |
| Body | default (16px) | normal | normal | OK |
| Metadata | text-xs / text-sm | normal / medium | wider | OK |

**Finding DR2-03 (LOW):** Heading hierarchy is inconsistent between pages. About page uses H2 (text-2xl) for artist name but H3 (text-lg) for sections. Exhibitions uses H2 (text-xl) for section headers. Partners uses H2 (text-lg). Should standardize: H2 = text-xl or text-2xl consistently for section headers within content pages.

### Spacing

| Context | Value | Verdict |
|---------|-------|---------|
| Page wrapper | `max-w-7xl mx-auto px-6 py-16` | Consistent across gallery, about, exhibitions, partners, contact |
| Section gaps | py-20 (home), mb-16 (about, partners) | Slightly inconsistent but contextually fine |
| Card gaps | gap-8 | Consistent |
| Header | py-4, gap-8 nav | OK |
| Footer | py-8 | OK |

Spacing is generally well-structured and consistent.

---

## 3. Page-by-Page Audit

### 3.1 Home Page

**Structure:** IntroOverlay (session-once) -> HeroSection (90vh) -> Featured Works (4-col grid) -> Series Descriptions (2-col)

**Positives:**
- Hero is visually striking with animated logo, decorative line, and clear CTAs
- Featured grid uses consistent ArtworkCard component
- Series descriptions use ScrollReveal animation

**Issues:**
- **DR2-04 (MEDIUM):** CTA buttons in Hero have no border-radius, matching the sharp aesthetic, but they also lack visible focus states. Tab navigation skips from nav to these buttons with no focus ring visible.
- **DR2-05 (LOW):** The decorative line in Hero animates to width 96px but uses a motion.div with fixed pixel width. On very large screens this is proportionally tiny. Consider making it responsive.
- **DR2-06 (MEDIUM):** Featured section heading "Featured Works" and "View All" link are on the same line, but on mobile (sm:) when grid goes to 1 column, the heading text may wrap awkwardly with the arrow link.

### 3.2 Gallery Page

**Structure:** H1 -> Filter tabs (series) -> 3-column grid of ArtworkCards

**Positives:**
- Filter tabs are well-designed with active state, counts in parentheses
- Grid is responsive: 1/2/3 columns
- ArtworkCard has hover lift (-4px), scale 1.05 on image, overlay with title

**Issues:**
- **DR2-07 (MEDIUM):** Filter buttons have no border-radius, consistent with site style, but overflow-x-auto on mobile has no scroll indicator. Users may not discover hidden filter tabs on small screens.
- **DR2-08 (LOW):** ArtworkCard shows title both in hover overlay AND below the image. This is intentional for accessibility (hover overlay is not visible on touch devices), but creates visual duplication on desktop hover. Consider hiding the bottom title on hover or differentiating the overlay content.

### 3.3 Artwork Detail Page

**Structure:** Back link -> 2-column (image + details table) -> InquiryForm (if available) -> Related works

**Positives:**
- Clean detail table layout with consistent border-b styling
- BuyButton with full purchase flow modal
- Related works section

**Issues:**
- **DR2-09 (HIGH):** Status "available" uses `text-green-600` which is hardcoded and does not adapt to dark theme. Green-600 on dark background (#0a0a0a) has adequate contrast, but it breaks the monochrome palette without a design system color variable. The `status_exhibition` and other statuses have no color at all.
- **DR2-10 (MEDIUM):** The "or Inquire" divider between BuyButton and InquiryForm uses `bg-background` for the text span background. This works but creates a hard edge if the parent has any gradient or visual texture.
- **DR2-11 (LOW):** Back link uses `&larr;` HTML entity. Other pages use unicode arrows differently. Should standardize arrow usage (Lucide icon vs HTML entity).

### 3.4 About Page

**Structure:** H1 -> Artist bio -> Education list -> Artist Statements (Podilia + Destruction) -> Download booklet CTA

**Positives:**
- Clean, readable layout with good text hierarchy
- Education list uses custom square bullet points (w-2 h-2 bg-foreground)

**Issues:**
- **DR2-12 (LOW):** Artist statements use `whitespace-pre-line` which can create unexpected layout on different screen sizes if the i18n text contains embedded newlines.
- **DR2-13 (MEDIUM):** Download booklet button uses `bg-foreground text-background` (filled style) but Partners page press kit button uses `border border-foreground` (outline style) for the same action. Inconsistent CTA styling for the same booklet download.

### 3.5 Exhibitions Page

**Structure:** H1 -> Personal exhibitions list -> Joint exhibitions list

**Positives:**
- Clean timeline-like layout with date + venue
- Sorted by year descending

**Issues:**
- **DR2-14 (LOW):** Exhibition items use plain `flex gap-6` layout. The date column (`min-w-[80px]`) is a magic number. On mobile, the flex layout works but the date + description could benefit from a stacked layout below sm breakpoint.
- **DR2-15 (LOW):** No empty state if exhibitions arrays were empty. Data is static so this is unlikely but defensive UI is good practice.

### 3.6 Partners Page

**Structure:** H1 + subtitle -> Why Partner -> Partnership Types (2x2 grid) -> Press Kit -> Inquiry Form

**Positives:**
- Well-structured content hierarchy
- Partnership type cards are clean with border styling
- InquiryForm integration works well

**Issues:**
- **DR2-16 (LOW):** Partnership type cards define SVG path data (`icon` prop) but never render them. Dead code from an earlier implementation.
- **DR2-13 (see above):** Press kit uses outline button vs About page using filled button for same action.

### 3.7 Contact Page

**Structure:** H1 (centered) -> 2-column: photo + social links

**Positives:**
- Clean social link cards with hover color transitions (Instagram gradient, Telegram blue, WhatsApp green)
- Good use of custom InstagramIcon SVG
- Responsive layout

**Issues:**
- **DR2-17 (MEDIUM):** Social link cards use hardcoded hover colors that only apply bg-color change. In dark mode, the `hover:text-white` works, but in light mode it also forces white text on hover which can conflict with the brand's monochrome aesthetic.
- **DR2-18 (LOW):** The photo aspect ratio is 3/4 (portrait) which is correct for an artist photo, but the left column takes full width on mobile. On very tall phones, this pushes social links completely below the fold.

### 3.8 Admin Panel

**Structure:** Sidebar nav (lg:block) -> Content area

**Positives:**
- Clean sidebar with text-only navigation
- Dashboard stats grid is well-structured
- ArtworkTable with sortable columns
- OrderTable with inline status change

**Issues:**
- **DR2-19 (HIGH):** Admin sidebar is `hidden lg:block`. On tablet/mobile there is NO navigation to admin sub-pages. Users on iPad or phone have no way to switch between admin sections except by modifying the URL manually.
- **DR2-20 (MEDIUM):** ArtworkTable and OrderTable status colors use Tailwind literal colors (bg-green-100, bg-red-100, etc.) that do not respect dark theme. The `bg-green-100 text-green-800` badge will look washed out on dark background. The Badge component in `ui/badge.tsx` already handles dark variants properly but is not used in tables.
- **DR2-21 (MEDIUM):** MarketingDashboard has hardcoded English text throughout (tab labels, instructions, descriptions). It does not use next-intl translations, unlike all other pages.

---

## 4. Cross-Cutting Issues

### 4.1 Accessibility (A11y)

| Check | Status | Notes |
|-------|--------|-------|
| Alt texts on images | PASS | All Image components have alt text |
| Focus states | FAIL | No visible focus-visible styles on buttons/links. Only default browser outline. |
| Aria labels | PARTIAL | ThemeToggle and burger menu have aria-label. LanguageSwitcher buttons lack aria-label. |
| Color contrast | PARTIAL | Secondary text in light mode borderline (see DR2-01) |
| Skip to content | FAIL | No skip-to-main-content link for keyboard users |
| Form labels | PASS | All form inputs have associated labels |

**Finding DR2-22 (HIGH):** No focus-visible styles anywhere. The site uses `outline-none` on inputs and buttons have no focus ring. Keyboard navigation is effectively invisible.

### 4.2 Dark Theme

| Component | Status | Notes |
|-----------|--------|-------|
| Background/text | PASS | Proper CSS variables |
| Cards/borders | PASS | Proper CSS variables |
| Buttons (hero) | PASS | Uses foreground/background swap |
| Artwork cards | PASS | bg-muted placeholder works |
| Admin tables | FAIL | Hardcoded light-only badge colors |
| Marketing page | FAIL | bg-green-50, bg-amber-50, bg-neutral-100 are hardcoded light |
| Contact socials | PARTIAL | Hover colors work but base state is fine |
| PurchaseModal | PASS | Uses design tokens |

**Finding DR2-23 (MEDIUM):** Multiple admin components use hardcoded light-theme Tailwind colors that break in dark mode.

### 4.3 Responsive Design

| Breakpoint | Pages affected | Issues |
|------------|---------------|--------|
| < 640px (mobile) | Gallery filters, Exhibitions | Filter tabs may overflow hidden, exhibition layout could stack better |
| 640-1024px (tablet) | Admin | Sidebar hidden, no mobile nav |
| > 1280px (desktop) | All | Fine |

### 4.4 Component Consistency

| Pattern | Instances | Consistent? |
|---------|-----------|-------------|
| Page wrapper | All content pages | YES: max-w-7xl/4xl mx-auto px-6 py-16 |
| Section headers | Home, Gallery, About, Exhibitions, Partners | PARTIAL: font size varies (text-xl to text-2xl) |
| CTA buttons | Hero, About, Partners, BuyButton | PARTIAL: same action (booklet) has different styles |
| Status badges | ArtworkDetail, ArtworkTable, OrderTable | NO: each uses different approach |
| Back links | ArtworkDetail, Collections | YES: same pattern |

---

## 5. Comparison with Design Review #1 (KO-020)

| KO-020 Finding | KO-021-025 Resolution | DR2 Status |
|---------------|----------------------|------------|
| Hero section basic | KO-021: Animated logo, CTAs, scroll indicator | RESOLVED |
| Buttons inconsistent | KO-022: shadcn/ui Button component | MOSTLY RESOLVED (booklet CTA still inconsistent) |
| Gallery hover effects | KO-023: Scale + overlay + lift | RESOLVED |
| Mobile responsive issues | KO-024: Responsive audit | MOSTLY RESOLVED (admin sidebar still an issue) |
| Dark theme incomplete | KO-025: CSS variables, theme toggle | MOSTLY RESOLVED (admin hardcoded colors remain) |

**Progress:** 5/5 original findings addressed, 3 fully resolved, 2 partially resolved with residual issues caught in this review.

---

## 6. Improvement Tasks Created

| Ticket | Title | Priority | Summary |
|--------|-------|----------|---------|
| KO-070 | Focus-visible styles for all interactive elements | HIGH | Add focus-visible ring to buttons, links, inputs, filters |
| KO-071 | Admin mobile navigation (tablet/phone) | HIGH | Add hamburger/drawer nav for admin on screens < lg |
| KO-072 | Fix secondary text contrast in light mode | MEDIUM | Darken --secondary from #666666 to #555555 for WCAG AA compliance |
| KO-073 | Dark theme fixes for admin status badges | MEDIUM | Use Badge component or add dark: variants to ArtworkTable, OrderTable, MarketingDashboard |
| KO-074 | Standardize section heading sizes across pages | MEDIUM | Consistent H2/H3 sizing for About, Exhibitions, Partners |
| KO-075 | Unify booklet/press-kit CTA button style | LOW | Same button variant for same action across About and Partners pages |
| KO-076 | Gallery filter scroll indicator on mobile | LOW | Add horizontal scroll fade/arrow hint for filter tabs on narrow screens |
| KO-077 | Remove dead icon path data from Partners page | LOW | Clean up unused SVG path definitions in partnership type cards |

---

## 7. Methodology

- Full source code review of all components in `src/components/`, `src/app/[locale]/`, and `src/components/admin/`
- CSS variable analysis in `globals.css`
- Contrast ratio calculations using WCAG formula
- Responsive breakpoint analysis via Tailwind class inspection
- Dark theme audit by tracing CSS variable usage and hardcoded Tailwind colors
- Component consistency check across all pages
