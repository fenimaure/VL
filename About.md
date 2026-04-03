# 🏆 About — The $1,000,000 Studio Narrative Blueprint

> **Design Philosophy**: The About page isn't a résumé. It is the *soul scene* of an agency
> that charges $100K+ per engagement. The visitor must feel like they've just walked into
> a Soho House for digital craft — dim lighting, heavy materials, impeccable taste in every pixel.
> Where Works proves *what we deliver* and Services sells *what we can do*,
> About answers the only question that truly matters:
> ***"Who are these people, and why should I trust them with a million-dollar brand?"***
>
> The experience should feel like a cinematic short film, not a web page.

---

## 🏗 Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        THE "ABOUT" ECOSYSTEM                                    │
│                                                                                 │
│  ┌────────────────┐   ┌─────────────────┐   ┌────────────────────────────────┐  │
│  │ ACT I          │   │ ACT II          │   │ ACT III                        │  │
│  │ THE HOOK       │   │ THE NARRATIVE   │   │ THE HUMANS                     │  │
│  │                │   │                 │   │                                │  │
│  │ A-1 Cinematic  │   │ A-3 Scroll-     │   │ A-6 Editorial                  │  │
│  │     Hero       │──▶│     Scrubbed    │──▶│     Team Roster                │  │
│  │ A-2 Scroll     │   │     Manifesto   │   │ A-7 Founder                    │  │
│  │     Unblur     │   │ A-4 Split       │   │     Spotlight                  │  │
│  │                │   │     Narrative    │   │ A-8 Culture Bento              │  │
│  │                │   │ A-5 Velocity-   │   │                                │  │
│  │                │   │     Marquee     │   │                                │  │
│  └────────────────┘   └─────────────────┘   └────────────────────────────────┘  │
│                                │                                                │
│  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
│  │ ACT IV                    ACT V                     ACT VI                │  │
│  │                                                                           │  │
│  │ A-9  Orbital Stats        A-12 Stacked Timeline     A-15 Awards Wall      │  │
│  │ A-10 Client Logos         A-13 Values Carousel      A-16 Final CTA        │  │
│  │ A-11 Testimonials Wall    A-14 Tools / Stack        A-17 SEO + JSON-LD    │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│   Shared: ScrollReveal · MagneticHover · CustomCursor · OptimizedImage          │
│           Framer Motion (useScroll/useTransform/useVelocity) · Lenis            │
│           3D Tilt Physics · Glassmorphism · PageTransition                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema — `about_content` Table

The existing `about_content` table stores all CMS-driven content via `section_key`.
The current About page queries `supabase.from('about_content').select('*')` and
maps rows by `section_key`. We will extend with additional keys.

**Existing section_keys used by About.tsx:**
| Key | Columns Used |
|-----|-------------|
| `hero` | `title`, `subtitle`, `content`, `image_url`, `items` (settings) |
| `fullscreen_image` | `image_url` |
| `story` | `title`, `content` |
| `team` | `title`, `items[]` (each: `name`, `role`, `image`, optional `video_url`) |

**New section_keys to add:**
| Key | Purpose | Columns |
|-----|---------|---------|
| `manifesto` | Scroll-scrubbed text block | `content` (the manifesto text), `image_url` (parallax bg image) |
| `split_narrative` | Left/right story panels | `items[]` (each: `title`, `content`, `image_url`, `layout: 'left'|'right'`) |
| `founder` | Founder spotlight | `title`, `subtitle`, `content`, `image_url`, `items[]` (social links, signature_url) |
| `culture` | Bento box culture grid | `items[]` (each: `type: 'video'|'image'|'stat'|'quote'|'location'`, `value`, `label`, `media_url`) |
| `timeline` | Company milestones | `items[]` (each: `year`, `title`, `description`, `image_url`) |
| `values` | Core values | `items[]` (each: `title`, `description`, `icon`) |
| `awards` | Awards & recognition | `items[]` (each: `title`, `year`, `organization`, `badge_url`) |
| `about_stats` | Global stats | `items[]` (each: `value`, `suffix`, `label`) |
| `about_testimonials` | Full testimonials | `items[]` (each: `quote`, `author`, `role`, `avatar_url`, `company`) |

**No schema migration needed** — the existing `about_content` table columns (`title`, `subtitle`, `content`, `image_url`, `items JSONB`, `media_type`, `section_key`) already support all of this. Just insert new rows.

---

## 📸 Aesthetic Directives — The Visual Bible

### Color System
```
Light Mode:  bg-white  ·  text-black  ·  accent: primary-500 (only on hover / micro)
Dark Mode:   bg-black  ·  text-white  ·  accent: primary-400 (glow, hover)

Borders:     border-black/5 → /10 → /20  (ascending hierarchy)
             dark: border-white/5 → /10 → /20

Opacity Hierarchy (dark):
  Headlines:   rgba(255,255,255, 1.0)
  Body text:   rgba(255,255,255, 0.87)
  Meta labels: rgba(255,255,255, 0.40)
  Ghost text:  rgba(255,255,255, 0.04)
```

### Typography System
| Role | Light | Dark | Size | Weight | Details |
|------|-------|------|------|--------|---------|
| **Hero Title** | `text-black` | `text-white` | `clamp(4rem,12vw,10rem)` | `900 (font-black)` | `font-display tracking-tighter leading-[0.85]` |
| **Hero Outline** | `text-stroke-light` | `text-stroke-white` | Same as above | `300 (font-light)` | `font-serif italic` |
| **Section Heading** | `text-black` | `text-white` | `text-5xl md:text-7xl` | `700 (font-bold)` | `font-display tracking-tight` |
| **Section Label** | `text-primary-500` | `text-primary-500` | `text-[10px]` | `700 (font-bold)` | `uppercase tracking-[0.4em]` with leading line `w-12 h-[1px] bg-primary-500` |
| **Body** | `text-black/60` | `text-gray-400` | `text-xl` | `300 (font-light)` | `leading-relaxed` |
| **Ghost Index** | `text-black/[0.04]` | `text-white/[0.04]` | `text-[10rem]` | `900` | Decorative position numbers |

### Motion System
```
Standard Enter:    duration: 1s, ease: [0.16, 1, 0.3, 1]          (Expo Out)
Stagger:           delay: index * 0.1
Spring Physics:    stiffness: 150, damping: 15, mass: 0.1          (MagneticHover)
Scroll Parallax:   useSpring(springProgress, {stiffness:100, damping:30})
Hover Transform:   duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
3D Tilt:           perspective(1000px) rotateX/Y(±deg) scale3d(1.01)
```

### Layout Patterns (from Works/Services)
- **Hero**: `min-h-screen flex items-center justify-center overflow-hidden`
- **Section**: `py-32 relative overflow-hidden` (generous 128px vertical padding)
- **Max Width**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Wide Breakout**: `max-w-[90rem]` for cinematic sections
- **Section Label**: `inline-flex items-center gap-3` → line + text + line (centered)
- **Ambient Glows**: `fixed inset-0 pointer-events-none` with `bg-primary-500/15 blur-[120px] animate-pulse-glow`

---

## 📦 Component Map

```text
src/
├── pages/
│   └── About.tsx                    ← Master page (rewritten, composes components)
├── components/
│   ├── ScrollReveal.tsx             ← Reuse (default, maskReveal, scaleReveal, slideReveal)
│   ├── MagneticHover.tsx            ← Reuse (all CTAs, team cards, buttons)
│   ├── CustomCursor.tsx             ← Enhanced with "Read Bio" cursor state
│   ├── OptimizedImage.tsx           ← Reuse for lazy-loaded imagery
│   ├── SEO.tsx                      ← Enhanced with About-page Organization schema
│   ├── ComponentRenderer.tsx        ← Reuse for rich text rendering
│   └── Navbar.tsx / Footer.tsx      ← No changes (already premium)
```

**No new component files needed.** All features are built inline within `About.tsx` (matching the
pattern of `Works.tsx` and `Services.tsx`, which keep their sections within the page file for
simpler composition). If any section exceeds ~200 lines, extract to `components/about/` subdirectory.

---

## ✅ Feature Catalog

> Priority: 🔴 Critical (must-have) · 🟡 High (significant impact) · 🟢 Nice-to-have (delighter)

---

## 📌 Phase 1: ACT I — The Hook

### - [x] A-1. 🔴 Cinematic "Window to Our World" Hero  ✅ DONE

**Current:** Standard parallax hero with badge, heading, subtitle, CTAs, scroll indicator. Uses basic `initial/animate` fade-ins. Title is plain text, not split. No aurora, no kinetic energy. Feels like every other agency template.

**Target:** A living, breathing opening sequence. Massive Bold+Outline split typography (matching Works page hero exactly). Aurora mesh background. Optional background video/image with the unblur treatment (A-2). The user's first thought should be: *"This is not a template."*

**Implementation:**
```tsx
// ═══ LAYER STACK (back to front) ═══
// L0: Background media (video or image from data.hero.image_url)
//     → If video: <video autoPlay loop muted playsInline>
//     → If image: <div style={{ backgroundImage }} />
//     → Initial state: filter: blur(30px) brightness(0.8)
//     → On scroll: blur transitions from 30px → 0px (A-2)
//
// L1: Aurora gradient mesh (slow-orbiting colored blobs)
//     → Reuse from Hero.tsx: two counter-rotating 200% gradient divs
//     → bg-gradient-to-tr from-transparent via-gray-500/5 to-transparent
//     → animate-spin-slow (8s), opacity-30, blur-[100px]
//
// L2: Grain texture overlay (CSS noise, no external asset)
//     → background-image: url("data:image/svg+xml,...") with <feTurbulence>
//     → opacity: 0.03, pointer-events: none
//
// L3: Gradient overlays
//     → If media present: from-black/40 via-black/20 to-black/60
//     → If no media: from-white/90 via-white/50 to-white (matches Hero.tsx)
//
// L4: Content
//     → Label: line + "About Us · Est. 2014" + line (10px uppercase tracking-[0.4em])
//     → Title: Split into Bold line + Serif Outline line
//       - Bold: "We Craft" → per-character stagger y:200→0, delay: i*0.05
//       - Outline: "Legacies." → per-character stagger, text-stroke-light, italic
//       - Both use: text-[clamp(4rem,12vw,10rem)] (matches Works hero exactly)
//       - Each character: whileHover={{ scale: 1.1, y: -20 }}
//     → Subtitle: "Digital boutique · Manila, PH" in primary-500 text-2xl
//     → Description: data.hero.content in text-xl font-light max-w-2xl
//     → CTAs: MagneticHover-wrapped pill buttons (same as Hero.tsx)
//       - Primary: "Meet the Team" → bg-black text-white rounded-full
//       - Secondary: "Our Story" → text-black/40 with leading line
//
// L5: Scroll indicator
//     → absolute bottom-12 left-10 rotate-90 origin-left (matches Hero.tsx)
//     → "Scroll" label + shimmer line animation

// ═══ TITLE RENDERING (EXACT MATCH: Works.tsx line 419-441) ═══
// <h1 className="flex flex-col items-center leading-[0.85]">
//   <div className="overflow-hidden">
//     <motion.span
//       initial={{ y: '100%' }}
//       animate={{ y: 0 }}
//       transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
//       className="block text-[clamp(4rem,12vw,10rem)] font-black tracking-tighter
//                  text-black dark:text-white font-display"
//     >
//       We Craft
//     </motion.span>
//   </div>
//   <div className="overflow-hidden">
//     <motion.span
//       initial={{ y: '100%' }}
//       animate={{ y: 0 }}
//       transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
//       className="block text-[clamp(4rem,12vw,10rem)] text-stroke-light
//                  dark:text-stroke-white italic font-light font-serif"
//     >
//       Legacies.
//     </motion.span>
//   </div>
// </h1>
```

**Data source:** `data.hero` (existing section_key in Supabase).
Supports `**Bold** Outline` syntax for title split (same as `Hero.tsx` line 124).

**Key micro-interactions:**
- Each title character responds to hover with scale+lift (matching Hero.tsx)
- CTA buttons use MagneticHover with `strength={0.3}` (primary) / `strength={0.15}` (secondary)
- Ambient gradient blobs pulse with `animate-pulse-glow` keyframe

**Accessibility:**
- `<span className="sr-only">{rawTitle}</span>` for screen readers
- `prefers-reduced-motion`: instant reveal, no aurora animation

**Files:** `About.tsx`

---

### - [x] A-2. 🔴 Scroll-Driven Unblur Transition  ✅ DONE

**Target:** As the user scrolls past the hero, the background media transitions from heavily blurred (abstract, painterly) to crisp reality while the hero text scales up and fades out. This creates a cinematic "focusing your eyes" effect that no template has.

**Implementation:**
```tsx
// Using useScroll targeted at heroRef:
const heroRef = useRef(null);
const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
});

// Parallax translation for background
const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

// Blur interpolation: 30px when at top, 0px when leaving
const blurRaw = useTransform(scrollYProgress, [0, 0.8], [30, 0]);
const blur = useSpring(blurRaw, { stiffness: 100, damping: 30 });

// Text scale up and fade out  
const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.3]);
const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

// Apply to background:
// <motion.div style={{ y: bgY, filter: useMotionTemplate`blur(${blur}px)` }}>

// Apply to text container:
// <motion.div style={{ scale: textScale, opacity: textOpacity }}>
```

**Key details:**
- Spring physics on blur ensures smooth scrubbing (not jittery)
- Mobile: scales down the blur range to 15px→0px for performance
- `will-change: filter` on the background media div

**Files:** `About.tsx`

---

## 📌 Phase 2: ACT II — The Narrative

### - [x] A-3. 🔴 The Manifesto (Scroll-Scrubbed Typography)  ✅ DONE

**Target:** Replace the boring "Our Story" paragraph section with a cinematic scroll-driven text reveal. A massive block of manifesto text (150vh container) where each word fills from dim gray to full opacity as the user scrolls through. This is *the* signature About page interaction.

**Implementation:**
```tsx
// Container: height 150vh, position relative
// Inner: sticky top-0, h-screen, flex items-center justify-center
//
// Text: "We don't build websites. We engineer digital gravity.
//        Brands come to us when they can no longer afford to be ignored.
//        We are architects of obsession."
//
// Each word is a <motion.span> with opacity driven by scroll position:
const containerRef = useRef(null);
const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end 0.5"]
});

// Split text into words:
const words = manifesto.split(' ');
// Each word i gets its own opacity range:
// const start = i / words.length;
// const end = start + (1 / words.length);
// const wordOpacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

// Render:
// {words.map((word, i) => {
//   const range = [i / words.length, (i + 1) / words.length];
//   const opacity = useTransform(scrollYProgress, range, [0.15, 1]);
//   return (
//     <motion.span
//       key={i}
//       style={{ opacity }}
//       className="text-4xl md:text-6xl lg:text-7xl font-bold font-display
//                  text-black dark:text-white leading-[1.1] tracking-tight"
//     >
//       {word}{' '}
//     </motion.span>
//   );
// })}

// Typography: text-4xl → md:6xl → lg:7xl, font-display, tracking-tight
// Max width: max-w-5xl mx-auto px-6
// Background: parallax image slides up behind text (if data.manifesto.image_url exists)
//   → Separate useTransform for Y offset at 0.3× speed
//   → Opacity 0.1 (barely visible, atmospheric)
```

**Data source:** `data.manifesto.content` (new section_key) or fallback hardcoded text.

**Key details:**
- Each word's opacity range is `[i/total, (i+1)/total]` mapped to `[0.15, 1.0]`
- Words that are already passed remain at full opacity (they don't dim again)
- Mobile: reduce to `text-3xl` and `height: 120vh` for faster read
- `prefers-reduced-motion`: all words visible at once, no scroll effect

**Files:** `About.tsx`

---

### - [x] A-4. 🟡 Split Narrative Blocks  ✅ DONE

**Target:** Below the manifesto, show 2–3 story sections in alternating left-image / right-text layout (or vice versa). Each block has a parallax image, a heading, and narrative text. This mirrors the "Strategy-First / Built with Precision" sections from Services (S-9).

**Implementation:**
```tsx
// Layout per block:
// ┌─────────────────────┬───────────────────────┐
// │                     │  ── Our Beginning ──   │
// │   [Parallax Image]  │                        │
// │                     │  Started in a garage   │
// │                     │  in Manila...          │
// │                     │                        │
// │                     │  "150+ projects later" │
// └─────────────────────┴───────────────────────┘
//
// Next block flips: text on left, image on right
// Grid: grid-cols-1 md:grid-cols-2 gap-16 items-center
// Image: ScrollReveal variant="maskReveal" + parallax via useParallax
// Text: ScrollReveal variant="slideReveal" slideFrom="left"|"right"
// Section label: line + "Chapter 01" + line (primary-500)
```

**Data source:** `data.split_narrative.items[]` — each with `title`, `content`, `image_url`, `layout`.

**Files:** `About.tsx`

---

### - [x] A-5. 🟡 Velocity-Reactive Marquee  ✅ DONE

**Target:** A horizontal infinite scrolling ticker (matching Services S-2) between the narrative and team sections. Words alternate between filled and outlined styles. Speed reacts to scroll velocity.

**Implementation:**
```tsx
// Words: "STRATEGY · DESIGN · DEVELOPMENT · BRANDING · DIGITAL · GROWTH · EXCELLENCE · CRAFT"
// Every 3rd word: text-stroke-light (outlined), rest: filled
// Speed: CSS --marquee-speed custom property driven by Lenis scroll velocity
// Hover: pauses, hovered word scales 120% in primary-500
//
// Reuse exact pattern from Services.tsx marquee implementation:
// const { scrollY } = useScroll();
// const velocity = useVelocity(scrollY);
// const smoothVelocity = useSpring(velocity, { stiffness: 100, damping: 40 });
// const velocityFactor = useTransform(smoothVelocity, [0, 1000], [1, 5]);
//
// Two identical rows for seamless loop (animate-scroll, translateX(-50%))
// Each row is duplicated content side by side
```

**Files:** `About.tsx`

---

## 📌 Phase 3: ACT III — The Humans

### - [ ] A-6. 🔴 Editorial Team Roster with 3D Tilt & Video Crossfade

**Current:** Basic 4-column grid of cards with `whileInView` scale animation. Image + name + role. Static, flat, and forgettable.

**Target:** An interactive, physics-driven team gallery that makes every visitor hover over each portrait. Each card uses 3D tilt physics (reuse from WorkCard), black & white → color video crossfade on hover, and a glassmorphism bio slide-up panel.

**Implementation:**
```tsx
// ═══ CARD ANATOMY ═══
// ┌────────────────────────────────────────┐
// │                                        │  Default: grayscale(100%), high contrast
// │   [Portrait Image / Video]             │  Hover:   grayscale(0%), video plays
// │                                        │
// │   ┌────────────────────────────────┐   │  ← Glassmorphism panel (slides up on hover)
// │   │ John Doe                       │   │  backdrop-blur-xl bg-white/10 dark:bg-black/10
// │   │ Creative Director              │   │  border border-white/20
// │   │                                │   │
// │   │ ☕ 4 cups/day · 🎵 Lo-fi beats │   │  ← Quirky stat from items
// │   └────────────────────────────────┘   │
// └────────────────────────────────────────┘
//
// 3D Tilt (reuse from WorkCard, Works.tsx line 762-772):
// const handleMouseMove = (e) => {
//   const rect = cardRef.current.getBoundingClientRect();
//   const rx = (e.clientY - rect.top - rect.height/2) / 25;
//   const ry = (rect.width/2 - (e.clientX - rect.left)) / 25;
//   cardRef.current.style.transform =
//     `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.01,1.01,1.01)`;
// };
//
// Video crossfade (reuse from WorkCard, Works.tsx line 774-786):
// onMouseEnter: video.play(), setIsHovered(true)
// onMouseLeave: video.pause(), video.currentTime=0, reset transform
//
// Grayscale toggle:
// className={`transition-all duration-700 ${isHovered ? '' : 'grayscale'}`}
//
// Bio panel animation:
// <motion.div
//   initial={{ y: '100%', opacity: 0 }}
//   animate={isHovered ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
//   transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
//   className="absolute bottom-0 inset-x-0 p-6 glass-card"
// >

// ═══ LAYOUT ═══
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8
// Stagger: each card delays by index * 0.1
// First card (founder) spans two rows: sm:row-span-2 (larger)
// data-cursor="view" data-cursor-text="Bio"
```

**Data source:** `data.team.items[]` — existing, enhanced with optional fields:
- `video_url`: 3-second looping clip
- `stat`: quirky personal stat string
- `social_links`: `{linkedin?, twitter?, instagram?}`

**Mobile:**
- Disable 3D tilt (`window.matchMedia('(pointer: coarse)').matches`)
- Show bio panel by default (no hover on touch)
- Grayscale still applies; tap toggles color momentarily

**Files:** `About.tsx`

---

### - [ ] A-7. 🟡 Founder Spotlight Section

**Target:** A dedicated full-width section for the agency founder. Large portrait on one side, a personal letter / manifesto on the other. Handwritten signature image at the bottom. This humanizes the brand — clients hire *people*, not agencies.

**Implementation:**
```tsx
// ┌───────────────────────────────────────────────────────────┐
// │                                                           │
// │  ── A Letter from Our Founder ──                          │
// │                                                           │
// │  ┌──────────────┐  "I started this agency because I       │
// │  │              │  believed design could change how        │
// │  │ [Portrait]   │  people feel about a brand. Every        │
// │  │              │  pixel, every interaction, every moment  │
// │  │              │  should make someone stop and think:     │
// │  │              │  'Whoever made this, cares.'"            │
// │  │              │                                          │
// │  │              │  — [Signature Image]                     │
// │  │              │    CEO & Creative Director               │
// │  └──────────────┘                                          │
// └───────────────────────────────────────────────────────────┘
//
// Grid: md:grid-cols-2 gap-20 items-center
// Image: large, rounded-2xl, premium-image-treatment, parallax
// Text: ComponentRenderer for rich text (bold, italic support)
// Signature: <img> with w-48, opacity-80
// Border: top and bottom border-black/5 dark:border-white/5
// Background: subtle gradient mesh (bg-primary-500/5 blur-3xl in corners)
```

**Data source:** `data.founder` — `title`, `content`, `image_url`, `items[0].signature_url`

**Files:** `About.tsx`

---

### - [ ] A-8. 🔴 Studio Culture Bento Box

**Target:** An Apple-style bento grid showcasing the agency's personality. Mixed-size cards containing behind-the-scenes video, location, awards, design philosophy quotes, and live stats. A cursor-tracking radial glow effect follows the mouse under the borders.

**Implementation:**
```text
Desktop Layout (md+):
┌─────────────────────────────┬──────────────────┐
│  (Large — 2×2)              │  (Small — 1×1)   │
│  Behind-the-scenes video    │  📍 Manila, PH   │
│  autoPlay on viewport       │  + mini map       │
│                             ├──────────────────┤
│                             │  (Medium — 1×1)  │
│                             │  🏆 12 Awards    │
│                             │  (scrolling list) │
├──────────┬──────────────────┼──────────────────┤
│ (1×1)    │ (1×1)            │  (1×2)           │
│ ♫ Now    │ 99%              │                  │
│ Playing  │ Client           │  "Good design    │
│ (embed)  │ Retention        │   is invisible.  │
│          │ (counter)        │   Great design    │
│          │                  │   is inevitable." │
└──────────┴──────────────────┴──────────────────┘

Mobile Layout:
Single column, 2×1 grid for small cards, full-width for large

═══ CURSOR GLOW EFFECT ═══
Each bento panel: border border-white/10 dark:border-white/5
On mouse move over the grid container:
  → Calculate mouse position relative to container
  → Apply radial-gradient at mouse position as a mask on a pseudo-element
  → The glow "follows" the cursor, illuminating borders it passes over

Implementation:
const handleMouseMove = (e: React.MouseEvent) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridRef.current.style.setProperty('--glow-x', `${x}px`);
    gridRef.current.style.setProperty('--glow-y', `${y}px`);
};

CSS:
.bento-grid::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
        600px circle at var(--glow-x) var(--glow-y),
        rgba(99,102,241, 0.15),
        transparent 40%
    );
    pointer-events: none;
    z-index: 1;
}
```

**Data source:** `data.culture.items[]`

**Files:** `About.tsx`, `index.css` (bento-grid glow styles)

---

## 📌 Phase 4: ACT IV — The Proof

### - [ ] A-9. 🔴 Orbital Stats Visualization

**Target:** Present agency metrics in a radial/orbital layout on desktop (reuse the exact pattern from Services S-8). Stats fly in from edges to orbital positions on scroll. Numbers count up when in view.

**Implementation:**
```text
         ┌ 150+ Works ┐
    ┌────┤            ├────┐
    │    └────────────┘    │
  ┌─┴─┐                ┌──┴──┐
  │98% │   ┌─────────┐ │ 50+ │
  │Sat.│   │ LOVELLI │ │Brands│
  └─┬─┘   │  PROVEN │ └──┬──┘
    │    ┌─┤ RESULTS ├─┐  │
    └────┤            ├──┘
         └ 10+ Years  ┘
```

**Reuse:** Exact implementation from `Services.tsx` orbital stats section (S-8).
- CountUp component (from Works.tsx line 36-62)
- Orbital CSS transforms for desktop
- Grid fallback on mobile (grid-cols-2)
- IntersectionObserver to trigger count-up

**Data source:** `data.about_stats.items[]` or hardcoded fallback:
```ts
const stats = [
    { value: 150, suffix: '+', label: 'Works Delivered' },
    { value: 98, suffix: '%', label: 'Client Satisfaction' },
    { value: 50, suffix: '+', label: 'Global Brands' },
    { value: 10, suffix: '+', label: 'Years Experience' }
];
```

**Files:** `About.tsx`

---

### - [ ] A-10. 🟡 Client Logo Marquee with Tooltips

**Target:** Infinite horizontal marquee of grayscale client logos. On hover, each logo colorizes and shows a tooltip with client name + project type. Exact same implementation as Services S-10.

**Implementation:**
- Reuse `ClientLogos.tsx` component (already exists at `src/components/ClientLogos.tsx`)
- Enhance with tooltip on hover: `<div>` positioned absolutely above logo
- Tooltip shows: `{client.name}` + `{client.category}`
- Grayscale → color: `filter: grayscale(100%) → grayscale(0%)` on hover
- Two rows for luxury density, scrolling in opposite directions

**Files:** `About.tsx` (import and render `ClientLogos`)

---

### - [ ] A-11. 🟡 Testimonials Masonry Wall

**Target:** Instead of a carousel (which the Services page already has), the About page shows testimonials in a staggered masonry layout. Large quotes with prominent avatars and glassmorphism card treatments.

**Implementation:**
```tsx
// 3-column masonry on desktop, 2-column tablet, 1-column mobile
// Each card: glass-card with backdrop-blur-md
// ┌────────────────────────────────────────┐
// │  "                                     │ ← Large quotation mark (text-6xl primary-500/10)
// │  Lovelli transformed our entire        │
// │  digital presence. The attention to    │
// │  detail was extraordinary.             │
// │                                        │
// │  ┌──┐ Maria Santos                    │
// │  │🖼│ CEO, TechPH Corp               │
// │  └──┘                                  │
// └────────────────────────────────────────┘
//
// Stagger reveal: ScrollReveal variant="default" with delay={index * 0.1}
// Cards have varying heights (some quotes longer, creating natural masonry)
// Border: 1px border-black/5 dark:border-white/5
// Hover: border-primary-500/30, slight lift (-4px)
```

**Data source:** `data.about_testimonials.items[]` or pull from all services' testimonials.

**Files:** `About.tsx`

---

## 📌 Phase 5: ACT V — The Journey

### - [ ] A-12. 🔴 Stacked Scroll-Driven Timeline

**Target:** Agency milestones presented as a vertical timeline with scroll-driven line-draw animation. Each milestone "activates" as the line reaches it. This matches the existing process timeline in Services (S-7/S-19) but with a historical narrative focus.

**Implementation:**
```tsx
// Timeline layout:
// ┌────────────────────────────────────────────────────────┐
// │          ● 2014 — "The Beginning"                      │
// │          │  Started with a laptop and a dream           │
// │          │  in a Manila apartment.                      │
// │          │  [Image]                                     │
// │          │                                              │
// │          ● 2016 — "First International Client"          │
// │          │  Landed our first overseas project:           │
// │          │  a complete rebrand for...                    │
// │          │                                              │
// │          ● 2020 — "Pivoted to Remote-First"             │
// │          │  ...                                          │
// │          │                                              │
// │          ● 2024 — "50th Brand Partnership"              │
// │          │  ...                                          │
// │          ○ (next milestone is yours)                    │
// └────────────────────────────────────────────────────────┘
//
// SVG line: stroke-dashoffset animated by scrollYProgress
// Active dots: filled with primary-500 when scroll passes them
// Inactive dots: open circle with border
// Each milestone entry: ScrollReveal variant="slideReveal" alternating left/right
// Final dot: "Your story starts here" with CTA to /contact
//
// Reuse exact ProcessTimeline SVG line-draw pattern from Services.tsx (S-19)
```

**Data source:** `data.timeline.items[]`

**Files:** `About.tsx`

---

### - [ ] A-13. 🟡 Core Values Carousel

**Target:** Horizontal swipeable carousel of core values. Each value card has an icon, title, and short description. Auto-advances every 6 seconds. Matches the testimonials carousel from Services (S-12) but simpler.

**Implementation:**
```tsx
// Each value card:
// ┌────────────────────────────┐
// │    🎯                      │
// │    PRECISION               │
// │                            │
// │    Every pixel, every      │
// │    interaction, every      │
// │    line of code — crafted  │
// │    with obsessive detail.  │
// └────────────────────────────┘
//
// Framer Motion drag for swipe (dragConstraints, onDragEnd)
// Auto-advance: setInterval(6000) with AnimatePresence
// Pagination dots below (accent color active)
// Mobile: full-width cards, touch-optimized
// Desktop: show 3 cards at once, center card slightly enlarged
```

**Data source:** `data.values.items[]`

**Files:** `About.tsx`

---

### - [ ] A-14. 🟢 Tools & Technology Stack

**Target:** Showcase the tools and technologies the agency uses. A grid of tool icons/logos with hover animations. Matches Services S-21 "Tools & Technologies Used" pattern.

**Implementation:**
```tsx
// Grid of tool pills: grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4
// Each pill: glass-card px-4 py-3
//   → Tool icon (from Lucide or inline SVG)
//   → Tool name (text-xs uppercase)
//   → MagneticHover wrapper
//   → Hover: accent-border, scale 1.05
//
// Categories: Design | Development | Strategy | Analytics
// Filter pills above (like Works category filter)
//
// Tools: Figma, React, Next.js, TypeScript, Supabase, Framer Motion,
//        Adobe CC, Notion, Linear, Slack, etc.
```

**Files:** `About.tsx`

---

## 📌 Phase 6: ACT VI — The Exit

### - [ ] A-15. 🟢 Awards & Recognition Wall

**Target:** A compact, elegant section showing agency awards and press mentions. Each award is a minimal card with the organization name, award title, and year.

**Implementation:**
```tsx
// Horizontal scrollable strip (like Works horizontal showcase but simpler)
// Each award:
// ┌──────────────────────┐
// │  🏆 Awwwards SOTD    │
// │     2024              │
// └──────────────────────┘
//
// Style: glass-card, text-center
// Scroll: overflow-x-auto scrollbar-hide scroll-snap-x-mandatory
// MagneticHover on each card
// If no awards data: section hidden entirely
```

**Data source:** `data.awards.items[]`

**Files:** `About.tsx`

---

### - [ ] A-16. 🔴 The Final CTA — "Start a Dialogue"

**Target:** A seamless transition from the About story into a full-viewport call to action. This should feel like the finale of a film, not a sales pitch. Background fades to black, massive magnetic button appears, background video clips through a text mask.

**Implementation:**
```tsx
// ┌────────────────────────────────────────────────────────┐
// │                                                        │
// │  Background: pitch black                               │
// │  Optional bg video visible through text-clip mask       │
// │                                                        │
// │  ── Ready? ──                                          │
// │                                                        │
// │         Let's build something                          │
// │         Extraordinary.                                 │
// │                                                        │
// │  ┌──────────────────────────────────────┐              │
// │  │        Start a Dialogue →            │              │
// │  └──────────────────────────────────────┘              │
// │                                                        │
// │  "Join 50+ brands that chose craft over commodity."    │
// │                                                        │
// │  ⊙ ⊙ ⊙ ⊙ ⊙  (stacked client avatars)                │
// └────────────────────────────────────────────────────────┘
//
// Title: Bold + Outline split (matching hero)
//   "something" = font-black filled
//   "Extraordinary." = text-stroke, italic serif
// CTA: MagneticHover, rounded-full, bg-white text-black
//      → Hover: bg-primary-500 text-white, scale 1.05
//      → data-cursor="view" data-cursor-text="Go"
//      → Links to /contact
// Stacked avatars: 5 overlapping circular images (-ml-3 each)
// Section: bg-black text-white (forced, not theme-dependent)
// data-cursor state: "Start" text on the cursor
```

**Files:** `About.tsx`

---

### - [x] A-17. 🔴 SEO + JSON-LD Organization Schema  ✅ DONE

**Target:** Full Organization schema.org markup plus proper meta tags for the About page.

**Implementation:**
```tsx
// <SEO
//   title="About Us"
//   description="We are Lovelli — a Manila-based digital boutique crafting
//                award-winning experiences for global brands since 2014."
//   url="/about"
// />
//
// JSON-LD:
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lovelli",
    "url": "https://lovelli.com",
    "logo": "...",
    "description": "Premium digital boutique...",
    "foundingDate": "2014",
    "foundingLocation": { "@type": "Place", "name": "Manila, Philippines" },
    "numberOfEmployees": { "@type": "QuantitativeValue", "value": "50+" },
    "sameAs": ["instagram_url", "linkedin_url", "twitter_url"],
    "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@lovelli.com",
        "contactType": "sales"
    }
}
```

**Files:** `About.tsx`

---

## 📌 Phase 7: Motion, Mobile & Performance

### - [x] A-18. 🔴 Dark Mode Polish  ✅ DONE

**Target:** Intentional dark mode — not just inverted. Every section must look stunning in both modes. Follow the exact hierarchy from Works (W-30).

- Headlines: `rgba(255,255,255,1.0)`, Body: `0.87`, Meta: `0.40`, Ghost: `0.04`
- Gradient meshes: cooler tones (primary-500 at 4-6% opacity)
- Borders: `white/5` base → `white/10` hover → `white/20` active
- Remove any gray backgrounds in dark mode (pure `bg-black` or `bg-dark-950`)

**Files:** `About.tsx`, `index.css`

---

### - [ ] A-19. 🔴 Mobile-First Responsive Design

**Target:** Every section must be designed mobile-first with touch-optimized interactions.

| Section | Desktop | Mobile |
|---------|---------|--------|
| Hero | Full viewport, per-char animation | Reduced char stagger, smaller type |
| Unblur | 30px→0px | 15px→0px (perf) |
| Manifesto | 150vh scroll scrub | 120vh, text-3xl |
| Split Narrative | 2-col grid | Single col, image above text |
| Team | 3-col grid, 3D tilt | 1-col, no tilt, bio visible by default |
| Bento | Complex multi-row grid | Single column stack |
| Stats | Orbital layout | 2×2 grid |
| Timeline | Alternating left/right | Straight vertical, left-aligned |
| CTA | Full viewport | py-20, smaller type |

- Disable `MagneticHover` on `(pointer: coarse)` (already handled by component)
- Disable 3D tilt on touch devices
- Use `scroll-snap` for horizontal scrollable sections

**Files:** `About.tsx`

---

### - [ ] A-20. 🟡 Image & Video Loading Strategy

**Target:** Optimized media loading across the page.

| Media | Strategy |
|-------|----------|
| Hero video/image | `loading="eager"`, render immediately |
| Team portraits | `loading="lazy"`, blur-up skeleton |
| Team videos | `preload="none"`, upgrade to `metadata` via IntersectionObserver (rootMargin: 200px) |
| Bento images/videos | `loading="lazy"`, play on viewport entry |
| Timeline images | `loading="lazy"` |
| Background parallax images | `loading="lazy"`, low-res first |

- Use `OptimizedImage` wrapper where applicable
- Use skeleton `image-skeleton` class for loading placeholders (already in index.css)

**Files:** `About.tsx`

---

### - [x] A-21. 🟢 Custom Cursor "Bio" State  ✅ DONE

**Target:** When hovering over team member cards, custom cursor shows "Bio" text instead of default.

**Implementation:**
- Add `data-cursor="view" data-cursor-text="Bio"` to team cards
- CustomCursor already handles `data-cursor-text` — no changes needed to the component

**Files:** `About.tsx`

---

### - [x] A-22. 🟢 Scroll Progress Bar  ✅ DONE

**Target:** Thin accent-colored progress bar at top of page showing scroll position (same as Services S-38).

**Implementation:**
```tsx
const { scrollYProgress } = useScroll();
<motion.div
    className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left bg-primary-500"
    style={{ scaleX: scrollYProgress }}
/>
```

**Files:** `About.tsx`

---

### - [x] A-23. 🟢 MagneticHover on All Interactive Elements  ✅ DONE

**Target:** Wrap every button, link, and CTA with MagneticHover. Already a pattern across Works and Services.

| Element | Strength |
|---------|----------|
| Primary CTA buttons | `0.3` |
| Secondary links | `0.15` |
| Team cards | `0.1` |
| Tool pills | `0.15` |
| Award cards | `0.15` |

**Files:** `About.tsx`

---

## 📊 Progress Tracker

| Section | Features | Priority | Status |
|---------|----------|----------|--------|
| **ACT I: The Hook** | A-1, A-2 | 2🔴 | ██████████ 100% (2/2) |
| **ACT II: The Narrative** | A-3, A-4, A-5 | 1🔴 2🟡 | ██████████ 100% (3/3) |
| **ACT III: The Humans** | A-6, A-7, A-8 | 2🔴 1🟡 | ░░░░░░░░░░ 0% (0/3) |
| **ACT IV: The Proof** | A-9, A-10, A-11 | 1🔴 2🟡 | ░░░░░░░░░░ 0% (0/3) |
| **ACT V: The Journey** | A-12, A-13, A-14 | 1🔴 1🟡 1🟢 | ░░░░░░░░░░ 0% (0/3) |
| **ACT VI: The Exit** | A-15, A-16, A-17 | 1🔴 0🟡 1🟢 | ███░░░░░░░ 33% (1/3) |
| **Motion/Mobile/Perf** | A-18 to A-23 | 2🔴 1🟡 3🟢 | █████████░ 83% (5/6) |
| **TOTAL** | **23 Features** | **10🔴 7🟡 6🟢** | **█████░░░░░ 48% (11/23)** |

---

## 🗓 Implementation Priority Order

### Sprint 1 — Foundation (A-1, A-2, A-3, A-17, A-18)
The cinematic hero, unblur transition, scroll-scrubbed manifesto, SEO, and dark mode system.
This establishes the visual language — if this sprint doesn't wow, nothing else matters.

### Sprint 2 — The Story (A-4, A-5, A-6, A-7)
Split narrative, velocity marquee, team roster with physics, founder spotlight.
This is where the personality of the agency comes through.

### Sprint 3 — Social Proof (A-8, A-9, A-10, A-11)
Culture bento, orbital stats, client logos, testimonials masonry.
This builds the credibility layer.

### Sprint 4 — Journey & Polish (A-12, A-13, A-14, A-15)
Timeline, values, tools, awards. These are character-building features that add depth.

### Sprint 5 — Mobile & Exit (A-16, A-19, A-20, A-21, A-22, A-23)
Final CTA engine, mobile optimization, loading strategy, cursor states, scroll progress.

---

## 🎯 Design Benchmarks

| Benchmark | What to study |
|-----------|---------------|
| **Locomotive.ca/about** | Scroll-driven text reveal, team section stagger, timeline |
| **Lusion.co** | 3D depth in team cards, noise textures, aurora gradients |
| **BasicAgency.com** | Massive typography, manifesto scrolling, editorial team layout |
| **ActiveTheory.net** | Cinematic hero unblur, video integration, scroll-jacked reveals |
| **RaoulAudouin.com** | Bento grid with cursor glow, glassmorphism panels |
| **Linear.app/about** | Clean stats, values section, team photo grid |
| **Stripe.com/about** | Timeline presentation, clean professional tone |

---

## 🔑 Why This Surpasses Works & Services

| Dimension | Works | Services | **About** |
|-----------|-------|----------|-----------|
| **Hero** | Word-level reveal | Character-level 3D flip | **Character reveal + scroll-unblur + aurora** |
| **Narrative** | Description paragraph | Marquee ticker | **Scroll-scrubbed manifesto + split narrative** |
| **People** | N/A | N/A | **3D tilt + video crossfade + glassmorphism bio** |
| **Social Proof** | Featured spotlight | Orbital stats + testimonials | **Orbital stats + masonry testimonials + timeline** |
| **Personality** | Category filter | Comparison matrix | **Culture bento box with cursor glow** |
| **Exit** | Footer | Mini contact form | **Text-clipped video CTA + stacked avatars** |
| **Emotional Impact** | "These are talented" | "These are capable" | **"These are the people I want to work with"** |

> **The About page is the emotional anchor of the entire site.**
> If Works proves competence and Services proves capability,
> About proves *character*. It's the page that turns a visitor into a believer.
> Every scroll, every hover, every reveal is engineered to make the visitor feel:
> *"I already trust these people."*
