# 🏆 Services — Awwwards Crown Jewel Blueprint

> **Design Philosophy**: Works showcases *results*. Services sells *capability*.  
> The experience should feel like walking through a premium architectural studio —  
> every surface, every micro-interaction, every transition whispers  
> *"we are the absolute best at what we do."*

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVICES ECOSYSTEM                               │
│                                                                         │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────────────────────┐  │
│  │  Homepage     │    │  /services    │    │  /services/:slug         │  │
│  │  Services.tsx │───▶│  Services.tsx │───▶│  ServiceDetail.tsx       │  │
│  │  (component)  │    │  (page)       │    │  (deep-dive)             │  │
│  │              │    │              │    │                          │  │
│  │ Stacking     │    │ Immersive    │    │ ┌ Cinematic Hero        │  │
│  │ Cards +      │    │ Hero ·       │    │ ├ Interactive Scope     │  │
│  │ Scroll-Driven│    │ 3D Service   │    │ ├ Process Deep-Dive    │  │
│  │ Scale +      │    │ Explorer ·   │    │ ├ Deliverables Grid    │  │
│  │ Video-on-    │    │ Filterable   │    │ ├ Pricing Integration  │  │
│  │ Hover        │    │ Grid ·       │    │ ├ Related Case Studies │  │
│  │              │    │ Comparison   │    │ ├ Service FAQ          │  │
│  │              │    │ Matrix ·     │    │ ├ Testimonials         │  │
│  │              │    │ CTA Engine   │    │ └ Next Service Nav     │  │
│  └──────────────┘    └───────────────┘    └──────────────────────────┘  │
│                                                                         │
│  Shared: ScrollReveal · MagneticHover · CustomCursor · OptimizedImage  │
│          BeforeAfterSlider · SEO · PageTransition                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema Extensions

The existing `services` table needs new columns for the premium experience:

```sql
-- Services table extensions (run in Supabase SQL Editor)
ALTER TABLE services ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS color_accent TEXT DEFAULT '#6366f1';
ALTER TABLE services ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS related_work_slugs TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS tools_used TEXT[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
```

**JSONB Structure Examples:**

```jsonc
// features: capabilities grid items
[
  { "title": "Custom UI Systems", "description": "Bespoke design systems...", "icon": "palette" },
  { "title": "Responsive Engineering", "description": "Every breakpoint...", "icon": "monitor" }
]

// deliverables: what the client gets
[
  { "item": "Brand Style Guide", "format": "PDF + Figma" },
  { "item": "Component Library", "format": "React + Storybook" }
]

// process_steps: per-service methodology
[
  { "phase": "01", "title": "Audit & Discovery", "duration": "1-2 weeks", "description": "..." },
  { "phase": "02", "title": "Strategy & IA", "duration": "1 week", "description": "..." }
]

// faqs: per-service frequently asked questions
[
  { "question": "How long does a typical project take?", "answer": "Depending on scope..." },
  { "question": "Do you offer revisions?", "answer": "Absolutely..." }
]

// pricing_tiers: per-service pricing
[
  { "name": "Starter", "price": "₱15,000", "period": "/month", "features": ["...", "..."], "cta": "Get Started", "highlighted": false },
  { "name": "Growth", "price": "₱35,000", "period": "/month", "features": ["...", "..."], "cta": "Most Popular", "highlighted": true }
]

// testimonials: per-service client quotes
[
  { "quote": "Transformed our entire...", "author": "Maria Santos", "role": "CEO, TechPH", "avatar_url": "..." }
]

// stats: per-service impact numbers
[
  { "value": "300%", "label": "Average ROI" },
  { "value": "48hr", "label": "Response Time" }
]
```

---

## 📦 Component Map

```
src/
├── pages/
│   ├── Services.tsx          ← S-1 to S-14 (Archive page)
│   └── ServiceDetail.tsx     ← S-15 to S-28 (Detail page)
├── components/
│   ├── Services.tsx          ← S-29 to S-34 (Homepage section)
│   ├── ServiceComparison.tsx ← S-11 (NEW — Comparison matrix)
│   ├── ServicePricing.tsx    ← S-22 (NEW — Pricing integration)
│   ├── ServiceFAQ.tsx        ← S-24 (NEW — Accordion FAQ)
│   ├── ServiceScope.tsx      ← S-17 (NEW — Interactive scope)
│   ├── ScrollReveal.tsx      ← Enhanced (already done W-23)
│   ├── MagneticHover.tsx     ← Reused from Works
│   ├── BeforeAfterSlider.tsx ← Reused from Works
│   ├── OptimizedImage.tsx    ← Reused from Works
│   ├── SEO.tsx               ← Enhanced with Service schema
│   └── CustomCursor.tsx      ← Add "Explore" state for services
└── index.css                 ← S-35 to S-40 (Service-specific styles)
```

---

## ✅ Feature Catalog

> Priority: 🔴 Critical (must-have) · 🟡 High (significant impact) · 🟢 Nice-to-have (delighter)

---

## 📌 Phase 1: Services Archive Page (`/services`)

### - [x] S-1. 🔴 Immersive Kinetic Hero  ✅ DONE

**Current:** Standard parallax hero with badge, headline, subtitle, CTA buttons, scroll indicator.  
**Target:** A breathing, alive hero that makes visitors stop scrolling. Multi-layer depth with noise texture, floating geometric shapes, and a typing effect on the subtitle.

**Implementation:**
```tsx
// Hero layers (back to front):
// Layer 0: Noise texture grain overlay (CSS)
// Layer 1: Gradient mesh background pulsing slowly
// Layer 2: Floating 3D geometric shapes (rotating cubes/spheres, reduced-motion safe)
// Layer 3: Grid line overlay (existing, enhanced with scroll-parallax)
// Layer 4: Title with character-level stagger reveal
// Layer 5: Subtitle with typewriter cursor effect
// Layer 6: Smart CTAs with magnetic hover + ripple effect

// Title uses per-character animation:
"Crafting".split('').map((char, i) => (
    <motion.span
        key={i}
        initial={{ y: '120%', rotateX: -80 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-block', transformOrigin: 'bottom' }}
    >
        {char}
    </motion.span>
))
```

**Key details:**
- Each letter animates from below with a 3D rotateX flip
- On scroll, the whole hero compresses with parallax (existing) PLUS blur-on-exit
- Floating shapes use `useScroll` to rotate based on scroll velocity
- Noise texture via CSS `background-image: url("data:image/svg+xml,...")` — no extra asset
- `prefers-reduced-motion` fallback: instant reveal, no floating shapes

**Files:** `Services.tsx` (page)

---

### - [x] S-2. 🔴 Living Marquee Ticker  ✅ DONE

**Current:** Basic CSS `animate-scroll` marquee with words.  
**Target:** Velocity-reactive marquee that speeds up when the user scrolls fast and pauses on hover. Words have a mix of outlined and filled styles.

**Implementation:**
```tsx
// Hook into Lenis scroll velocity:
const { scrollY } = useScroll();
const velocity = useVelocity(scrollY);
const smoothVelocity = useSpring(velocity, { stiffness: 100, damping: 40 });
const velocityFactor = useTransform(smoothVelocity, [0, 1000], [1, 5]);

// Apply velocity to marquee speed:
// CSS custom property --marquee-speed dynamically set
// Every 3rd word: text-stroke (outlined), rest: filled

// Hover: marquee pauses, hovered word scales up 120% with accent color
```

**Files:** `Services.tsx` (page)

---

### - [x] S-3. 🔴 Immersive Service Cards with Depth  ✅ DONE

**Current:** 2-column grid of flat cards with index, title, tags, description, CTA.  
**Target:** Cards that feel 3D with parallax-within-card, glassmorphism on hover, video background reveal, and per-service accent color glow.

**Implementation:**
```tsx
// Card anatomy:
// ┌─────────────────────────────────────────────────┐
// │ ░░ glassmorphism border on hover ░░              │
// │                                                   │
// │  01 ──────────────────────                        │
// │                                                   │
// │  Service Title                                    │
// │  (3D tilt responds to mouse position)             │
// │                                                   │
// │  ┌──────┐ ┌──────┐ ┌──────┐                      │
// │  │ Tag1 │ │ Tag2 │ │ Tag3 │                      │
// │  └──────┘ └──────┘ └──────┘                      │
// │                                                   │
// │  Description text with line clamp...              │
// │                                                   │
// │  ────────────────────────────────                 │
// │  Learn More →   │ 12 projects │ ★ 4.9 rating     │
// │                                                   │
// │  (hover: video_url plays as background)           │
// └─────────────────────────────────────────────────┘
```

**New data shown:**
- Project count: query works table WHERE category matches
- Rating: from testimonials aggregate
- Video background: crossfade from static to video on hover
- Accent glow: uses service.color_accent as subtle border-glow

**Key micro-interactions:**
- 3D tilt physics (reuse from WorkCard)
- On hover: video fades in as card background (Netflix-style)
- Bottom stats bar slides up with stagger
- Tags pulse with accent color on hover
- Cursor changes to "Explore" state

**Files:** `Services.tsx` (page)

---

### - [x] S-4. 🟡 Animated Service Count Header  ✅ DONE

**Target:** Above the grid, show "We offer X services across Y categories" with animated counters.

**Implementation:**
```tsx
<div className="flex items-center gap-12 mb-16">
    <div>
        <CountUp end={services.length} /> 
        <span className="text-[10px] uppercase tracking-wider">Services</span>
    </div>
    <div className="w-[1px] h-8 bg-black/10" />
    <div>
        <CountUp end={categories.size} /> 
        <span className="text-[10px] uppercase tracking-wider">Categories</span>
    </div>
    <div className="w-[1px] h-8 bg-black/10" />
    <div>
        <CountUp end={150} suffix="+" />
        <span className="text-[10px] uppercase tracking-wider">Projects Delivered</span>
    </div>
</div>
```

**Files:** `Services.tsx` (page)

---

### - [x] S-5. 🟡 Category Filter Tabs  ✅ DONE

**Current:** No filtering — all services shown at once.  
**Target:** Horizontal pill filter (like Works page) to browse services by category.

**Implementation:**
- Extract unique categories from services
- Magnetic hover on each pill
- AnimatePresence for grid items when filtering
- "All" shows everything, categories filter with layout animation

**Files:** `Services.tsx` (page)

---

### - [x] S-6. 🟢 Search with Fuzzy Matching  ✅ DONE

**Target:** Compact search input in the filter bar (like Works W-7) that searches title, description, tags.

**Files:** `Services.tsx` (page)

---

### - [x] S-7. 🔴 Enhanced "How We Work" Process Section  ✅ DONE

**Current:** 4-step horizontal process with step circles and connector line.  
**Target:** Full-viewport scroll-driven process reveal — each step takes over the screen as you scroll.

**Implementation:**
```tsx
// Each step is a full-viewport section:
// ┌───────────────────────────────────────────────┐
// │                                               │
// │      01 ─── DISCOVERY                         │
// │                                               │
// │   ┌────────┐                                  │
// │   │ Giant  │   Deep-dive into your brand,     │
// │   │ Icon   │   audience, competitors, and     │
// │   │        │   goals to uncover the right     │
// │   └────────┘   strategic direction.           │
// │                                               │
// │   Duration: 1-2 weeks                         │
// │   Deliverables: Research Report, Personas     │
// │                                               │
// │   ●────────●────────●────────○ (progress)     │
// └───────────────────────────────────────────────┘

// Scroll behavior:
// - Container height = 4 × 100vh (one per step)
// - Each step fades in/out based on scrollYProgress
// - Background color transitions between steps
// - Icon scales up on active, shrinks on exit
// - Progress bar fills across all steps
// - Vertical line-draw animation connecting dots
```

**Key details:**
- Steps are driven by per-service `process_steps` JSONB if available, else fallback to default 4 steps
- Each step has a bespoke background color shift (e.g., warm → cool → neutral → bold)
- Mobile: stacks vertically with standard reveal animations instead of scroll-jacking

**Files:** `Services.tsx` (page)

---

### - [x] S-8. 🔴 Stats Section with Orbital Animation  ✅ DONE

**Current:** 4 stat counters in a grid.  
**Target:** Stats presented in a radial/orbital layout on desktop, with numbers orbiting a center badge. Falls back to grid on mobile.

**Implementation:**
```
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

- Each stat orbits the center using CSS transforms
- On scroll-into-view: stats fly in from edges to their orbital positions
- Center badge pulses with a subtle glow
- Numbers count up when in view (existing, enhanced)

**Files:** `Services.tsx` (page)

---

### - [x] S-9. 🔴 Split Feature Highlights with Parallax Media  ✅ DONE

**Current:** Two split-screen sections (Strategy-First / Built with Precision) with icon grids.  
**Target:** Replace icon grids with actual portfolio images/videos that parallax. Add more sections dynamically.

**Implementation:**
- Alternate left/right layout (existing)
- Replace decorative icons with real project screenshots from `works` table
- Add parallax via ScrollReveal `useParallax`
- Each section's accent color pulled from service data
- Badge pills with magnetic hover
- Add a third highlight: "Continuous Growth" with growth metrics

**Files:** `Services.tsx` (page)

---

### - [x] S-10. 🟡 Client Logos with Tooltip  ✅ DONE

**Current:** Infinite scroll marquee of grayscale logos.  
**Target:** On hover, each logo colorizes and shows a tooltip with the client name + project category.

**Implementation:**
```tsx
// Tooltip appears above logo:
// ┌──────────────────┐
// │ TechPH Corp      │
// │ Web Development  │
// └────────┬─────────┘
//          ▼
//      [LOGO IMAGE]
```

**Files:** `Services.tsx` (page), `ClientLogos.tsx`

---

### - [x] S-11. 🟡 Service Comparison Matrix  ✅ DONE

**Target:** A new section — a horizontal scrollable comparison table showing all services side by side with feature checkmarks.

**Implementation:**
```
┌────────────────┬──────────┬──────────┬──────────┐
│ Feature        │ SMM      │ Branding │ Web Dev  │
├────────────────┼──────────┼──────────┼──────────┤
│ Strategy       │    ✓     │    ✓     │    ✓     │
│ Design         │    ✓     │    ✓     │    ✓     │
│ Development    │    —     │    —     │    ✓     │
│ Content        │    ✓     │    ✓     │    —     │
│ Analytics      │    ✓     │    —     │    ✓     │
│ Monthly Report │    ✓     │    —     │    ✓     │
│                │          │          │          │
│ Starting at    │ ₱15,000  │ ₱25,000  │ ₱35,000  │
│                │ [CTA]    │ [CTA]    │ [CTA]    │
└────────────────┴──────────┴──────────┴──────────┘
```

**Key details:**
- Horizontal scroll with scroll-snap on mobile
- Sticky header row and first column
- Checkmarks animate in on scroll
- "Most Popular" badge on highlighted column
- CTAs link to individual service detail or contact

**Files:** `ServiceComparison.tsx` (NEW), `Services.tsx` (page)

---

### - [x] S-12. 🔴 Testimonials Carousel  ✅ DONE

**Current:** No testimonials on Services page.  
**Target:** Auto-rotating testimonials with avatar, quote, client name, and the service they used.

**Implementation:**
- Pull from `services.testimonials` JSONB across all services
- Swipeable on mobile (Framer Motion drag)
- Auto-advance every 6 seconds
- Pagination dots with accent color
- Large quotation mark watermark
- Avatar with ring border in service accent color
- Premium card with glassmorphism

**Files:** `Services.tsx` (page)

---

### - [x] S-13. 🔴 Final CTA — "Start a Conversation" Engine  ✅ DONE

**Current:** Standard CTA section with two buttons and trust avatars.  
**Target:** An immersive full-viewport CTA with typing effect, background video, and an embedded mini contact form.

**Implementation:**
```tsx
// ┌─────────────────────────────────────────────────────┐
// │                                                     │
// │   Background: Slow-motion video of design process   │
// │   Overlay: Dark 60%                                 │
// │                                                     │
// │          Ready to _Elevate_ your brand?             │
// │          (cursor blinks on "Elevate")               │
// │                                                     │
// │   ┌─────────────────────────────────────────────┐   │
// │   │  Your Name          │  Your Email           │   │
// │   ├─────────────────────┼───────────────────────┤   │
// │   │  Service Interest (dropdown)                │   │
// │   ├─────────────────────────────────────────────┤   │
// │   │              [ Start a Dialogue → ]         │   │
// │   └─────────────────────────────────────────────┘   │
// │                                                     │
// │   "Join 50+ Global Brands" with stacked avatars     │
// │                                                     │
// └─────────────────────────────────────────────────────┘
```

**Key details:**
- Form submits to Supabase `inquiries` table
- Service dropdown pre-selects if user came from a specific service page
- Success state: confetti micro-animation + "We'll be in touch within 24 hours"
- Magnetic hover on submit button
- Background video with lazy loading

**Files:** `Services.tsx` (page)

---

### - [x] S-14. 🟢 SEO + Structured Data for Services Archive  ✅ DONE

**Target:** JSON-LD `ItemList` schema for the services page + proper meta tags.

**Implementation:**
```jsonc
{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Services | Lovelli",
    "description": "Premium digital services...",
    "itemListElement": [
        { "@type": "Service", "name": "...", "url": "...", "description": "..." }
    ]
}
```

**Files:** `Services.tsx` (page)

---

## 📌 Phase 2: Service Detail Page (`/services/:slug`)

### - [x] S-15. 🔴 Cinematic Hero with Video Background  ✅ DONE

**Current:** Background image with blur, basic title reveal.  
**Target:** Full-viewport hero with optional background video, multi-layer parallax, per-service accent color theming, and a scroll-triggered "scope" metric strip.

**Implementation:**
```tsx
// Layer stack:
// L0: Background video (or image fallback) with parallax Y
// L1: Gradient overlay (to-t from bg to transparent)
// L2: Accent color gradient overlay (subtle, from left)
// L3: Text content with stagger reveal
// L4: Floating metrics strip (projects delivered, avg ROI, response time)

// Set accent color CSS variable (like WorkDetail):
document.documentElement.style.setProperty('--service-accent', service.color_accent);

// Title splits into words, alternating filled/stroked (like WorkDetail hero)
// Subtitle with typewriter effect (S-1 approach)
// Back button with MagneticHover
```

**Files:** `ServiceDetail.tsx`

---

### - [x] S-16. 🔴 Metrics Strip (Below Hero)  ✅ DONE

**Current:** No metrics on service detail page.  
**Target:** Horizontal stats strip with animated counters (like WorkDetail stats bar).

**Implementation:**
```tsx
// Uses service.stats JSONB:
// ┌──────────────┬──────────────┬──────────────┬──────────────┐
// │ 300%         │ 48hr         │ 98%          │ 50+          │
// │ Average ROI  │ Response     │ Satisfaction │ Delivered    │
// └──────────────┴──────────────┴──────────────┴──────────────┘
```

**Files:** `ServiceDetail.tsx`

---

### - [x] S-17. 🔴 Interactive Scope Section  ✅ DONE

**Target:** An animated scope/capabilities section that reveals what's included. Each scope item expands into details on click.

**Implementation:**
```tsx
// ┌───────────────────────────────────────────────────────┐
// │  What's Included                                      │
// │                                                       │
// │  ┌─ Strategy & Research ──────────────── ✓ ─ [▼] ──┐ │
// │  │  Market research, competitor analysis,           │ │
// │  │  user personas, brand positioning                │ │
// │  └─────────────────────────────────────────────────┘ │
// │                                                       │
// │  ┌─ Design & Prototyping ─────────────── ✓ ─ [▶] ──┐ │
// │  └─────────────────────────────────────────────────┘ │
// │                                                       │
// │  ┌─ Development & QA ────────────────── ✓ ─ [▶] ──┐  │
// │  └─────────────────────────────────────────────────┘ │
// │                                                       │
// │  ┌─ Launch & Training ───────────────── ✓ ─ [▶] ──┐  │
// │  └─────────────────────────────────────────────────┘ │
// └───────────────────────────────────────────────────────┘

// Expand/collapse with AnimatePresence height animation
// Each item has: title, icon, included items list, excluded items list
// Accent color checkmarks
// Animated height transition (not display: none — smooth)
```

**Files:** `ServiceScope.tsx` (NEW), `ServiceDetail.tsx`

---

### - [x] S-18. 🔴 Enhanced Bento Features Grid  ✅ DONE

**Current:** 2x2 grid with generic icons and descriptions.  
**Target:** Bento-grid layout with varying card sizes, each feature card has icon + title + description + hover animation.

**Implementation:**
```
┌─────────────────────┬──────────────────┐
│                     │                  │
│  Custom UI Systems  │  Responsive      │
│  (large card)       │  Engineering     │
│                     │  (medium card)   │
│                     │                  │
├──────────┬──────────┼──────────────────┤
│ SEO      │ Speed    │                  │
│ (small)  │ (small)  │  Analytics       │
│          │          │  Dashboard       │
│          │          │  (medium card)   │
└──────────┴──────────┴──────────────────┘
```

**Key details:**
- Uses `service.features` JSONB for data
- Cards have glassmorphism border on hover
- Icon animates (rotates or scales) on hover
- Large cards get a gradient background from accent color
- Small cards are minimal with icon + title only
- Stagger reveal on scroll

**Files:** `ServiceDetail.tsx`

---

### - [x] S-19. 🔴 Process Deep-Dive Timeline  ✅ DONE

**Current:** No process section in ServiceDetail.  
**Target:** Vertical timeline (like WorkDetail W-14) but per-service, using `service.process_steps` JSONB data.

**Implementation:**
- Reuse ProcessTimeline pattern from WorkDetail
- Pull data from `service.process_steps` if available
- Show phase number, title, duration, description
- SVG line-draw on scroll
- Accent color dots and line
- Each step has a duration badge

**Files:** `ServiceDetail.tsx`

---

### - [x] S-20. 🟡 Deliverables Grid  ✅ DONE

**Target:** A visual grid showing what the client receives — file types, formats, assets.

**Implementation:**
```tsx
// ┌─────────────────────────────────────────────┐
// │  What You Receive                            │
// │                                             │
// │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
// │  │ 📄       │ │ 🎨       │ │ ⚛️       │    │
// │  │ Brand    │ │ Figma    │ │ React    │    │
// │  │ Guide    │ │ Source   │ │ Codebase │    │
// │  │ PDF      │ │ Files    │ │ GitHub   │    │
// │  └──────────┘ └──────────┘ └──────────┘    │
// └─────────────────────────────────────────────┘

// Each item: icon, title, format badge
// Hover: card lifts with shadow + accent border
// Uses service.deliverables JSONB
```

**Files:** `ServiceDetail.tsx`

---

### - [x] S-21. 🔴 Tools & Technologies Used  ✅ DONE

**Target:** Display the tools/tech used for this service (like WorkDetail W-15).

**Implementation:**
- Uses `service.tools_used` text array
- Reuse TechStackDisplay pattern from WorkDetail
- Magnetic hover on each pill
- Accent color on hover

**Files:** `ServiceDetail.tsx`

---

### - [x] S-22. 🔴 Integrated Pricing Section  ✅ DONE

**Target:** Per-service pricing tiers displayed inline in the service detail page.

**Implementation:**
```tsx
// ┌─────────────────────────────────────────────────────────┐
// │  Investment                                             │
// │                                                         │
// │  ┌──────────┐  ┌ ★ POPULAR ─┐  ┌──────────┐           │
// │  │ Starter  │  │ Growth     │  │ Enterprise│           │
// │  │          │  │            │  │           │           │
// │  │ ₱15,000  │  │ ₱35,000   │  │ Custom    │           │
// │  │ /month   │  │ /month    │  │ /project  │           │
// │  │          │  │            │  │           │           │
// │  │ ✓ Item1  │  │ ✓ Item1   │  │ ✓ Item1   │           │
// │  │ ✓ Item2  │  │ ✓ Item2   │  │ ✓ Item2   │           │
// │  │ ✗ Item3  │  │ ✓ Item3   │  │ ✓ Item3   │           │
// │  │          │  │ ✓ Item4   │  │ ✓ Item4   │           │
// │  │          │  │            │  │ ✓ Item5   │           │
// │  │ [Get     │  │ [Start    │  │ [Contact  │           │
// │  │ Started] │  │ Growing]  │  │ Sales]    │           │
// │  └──────────┘  └────────────┘  └──────────┘           │
// └─────────────────────────────────────────────────────────┘

// Features:
// - Highlighted ("Most Popular") column with accent bg + shadow
// - Checkmarks animate in with stagger on scroll
// - Hover: card lifts with glow
// - CTA buttons with magnetic hover
// - "Custom" tier opens contact form
// - Toggle: Monthly / Yearly (with discount badge)
```

**Files:** `ServicePricing.tsx` (NEW), `ServiceDetail.tsx`

---

### - [x] S-23. 🔴 Related Case Studies  ✅ DONE

**Target:** Pull works associated with this service and display as a horizontal carousel (like WorkDetail W-17).

**Implementation:**
- Query `works` table WHERE `category` matches service category OR slug in `service.related_work_slugs`
- Horizontal scrollable cards with touch optimizations
- Each card shows image, title, category
- Premium image treatment + hover scale
- "See all in this category" link

**Files:** `ServiceDetail.tsx`

---

### - [x] S-24. 🔴 Service FAQ Accordion  ✅ DONE

**Target:** Per-service frequently asked questions with smooth expand/collapse animations.

**Implementation:**
```tsx
// ┌───────────────────────────────────────────────┐
// │  Frequently Asked                              │
// │                                               │
// │  ┌─ How long does this typically take? ─ [▼] ─┐
// │  │                                            │
// │  │  Depending on scope, most projects run     │
// │  │  2-6 weeks from kickoff to delivery.       │
// │  │  We'll give you a precise timeline in      │
// │  │  our discovery call.                       │
// │  │                                            │
// │  └────────────────────────────────────────────┘
// │                                               │
// │  ┌─ Do you offer revisions? ──────── [▶] ────┐
// │  └────────────────────────────────────────────┘
// │                                               │
// │  ┌─ What's your payment structure? ── [▶] ───┐
// │  └────────────────────────────────────────────┘
// └───────────────────────────────────────────────┘

// - Uses service.faqs JSONB
// - AnimatePresence for smooth height animation
// - Only one item open at a time (accordion behavior)
// - Accent color on active item's border
// - Click-anywhere-to-close
// - Plus/minus icon rotation animation
```

**Files:** `ServiceFAQ.tsx` (NEW), `ServiceDetail.tsx`

---

### - [x] S-25. 🟡 Service Testimonials Block  ✅ DONE

**Target:** Pull per-service testimonials and display in an editorial layout with large quotes.

**Implementation:**
- Uses `service.testimonials` JSONB
- Large quotation mark watermark (like WorkDetail W-13)
- Avatar with accent-colored ring
- Client name, role, company
- Star rating if available
- scaleReveal animation on scroll

**Files:** `ServiceDetail.tsx`

---

### - [x] S-26. 🟡 Next Service Navigation  ✅ DONE

**Target:** Full-viewport "Next Service" link at the bottom (like WorkDetail W-16).

**Implementation:**
```tsx
// ┌─────────────────────────────────────────────┐
// │                                             │
// │  Background image of next service           │
// │  Dark overlay                               │
// │                                             │
// │        ── Next Service ──                   │
// │                                             │
// │      Brand Strategy.                        │
// │                                             │
// │      View Service →                         │
// │                                             │
// └─────────────────────────────────────────────┘
```

- Query next service by `sort_order` or `created_at`
- Wrap-around to first if at the end
- Background image parallax on scroll
- MagneticHover on CTA
- data-cursor="view" with "Next" text

**Files:** `ServiceDetail.tsx`

---

### - [x] S-27. 🟢 Floating TOC Sidebar  ✅ DONE

**Target:** Fixed sidebar with section dots (like WorkDetail W-18) for navigating the service detail page.

**Implementation:**
- Reuse FloatingTOC pattern from WorkDetail
- Sections: Scope, Features, Process, Pricing, Case Studies, FAQ, Testimonial, Next
- IntersectionObserver for active state
- Accent-colored active dot

**Files:** `ServiceDetail.tsx`

---

### - [x] S-28. 🔴 JSON-LD Structured Data for Service Detail  ✅ DONE

**Target:** Complete `Service` schema.org markup for SEO.

**Implementation:**
```jsonc
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Social Media Management",
    "description": "...",
    "provider": { "@type": "Organization", "name": "Lovelli" },
    "areaServed": { "@type": "Country", "name": "Philippines" },
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "15000",
        "highPrice": "100000",
        "priceCurrency": "PHP"
    },
    "review": { "..." },
    "aggregateRating": { "..." }
}
```

**Files:** `ServiceDetail.tsx`

---

## 📌 Phase 3: Homepage Services Section

### - [x] S-29. 🟡 Stacking Cards with Video-on-Scroll  ✅ DONE

**Current:** Scroll-driven stacking cards with scale effects, video support.  
**Target:** Enhance with per-service accent color glow and auto-play video when card is centered.

**Implementation:**
- Add accent glow blob (like FeaturedWorks W-20)
- Video auto-plays when `isInView` is true, pauses when not
- Crossfade transition between image and video

**Files:** `Services.tsx` (component)

---

### - [x] S-30. 🟡 Inline Stats Per Card  ✅ DONE

**Target:** Show quick stats inside each stacking card — project count, rating, and response time.

**Implementation:**
```tsx
// Bottom-left of card:
// 12 projects · ★ 4.9 · 48hr response
```

**Files:** `Services.tsx` (component)

---

### - [x] S-31. 🟢 "Explore All Services" CTA Enhancement  ✅ DONE

**Target:** Add a floating CTA after the last stacking card that magnetically pulls toward the cursor.

**Files:** `Services.tsx` (component)

---

### - [x] S-32. 🟢 Card Transition to Service Detail  ✅ DONE

**Target:** Add `layoutId` on card image for shared element transition when navigating to detail page.

**Files:** `Services.tsx` (component), `ServiceDetail.tsx`

---

### - [x] S-33. 🟡 Mobile Stacking Cards Optimization  ✅ DONE

**Current:** Falls back to simple vertical layout on mobile.  
**Target:** Add swipeable horizontal carousel mode on mobile instead of plain stacking.

**Implementation:**
- On mobile (pointer: coarse): render as horizontal scroll carousel
- Touch-optimized with scroll-snap
- Pagination dots below
- Reduced card height for mobile viewport

**Files:** `Services.tsx` (component)

---

### - [x] S-34. 🟢 Section Entrance with maskReveal  ✅ DONE

**Target:** Use the new `maskReveal` ScrollReveal variant for the section header.

**Files:** `Services.tsx` (component)

---

## 📌 Phase 4: Motion & Interaction Design

### - [x] S-35. 🔴 Per-Service Accent Color System  ✅ DONE

**Target:** Like Works W-27, each service has its own accent color that themes the entire detail page.

**Implementation:**
```css
/* Service accent color utilities */
:root {
    --service-accent: #6366f1;  /* Default */
}

.service-accent-text { color: var(--service-accent); }
.service-accent-bg { background-color: var(--service-accent); }
.service-accent-border { border-color: var(--service-accent); }
.service-accent-glow {
    box-shadow: 0 0 40px color-mix(in srgb, var(--service-accent) 25%, transparent);
}
```

- Set on mount in ServiceDetail via `document.documentElement.style.setProperty`
- Clean up on unmount

**Files:** `index.css`, `ServiceDetail.tsx`

---

### - [x] S-36. 🟡 Custom Cursor "Explore" State  ✅ DONE

**Target:** When hovering over service cards, the custom cursor shows "Explore" text.

**Implementation:**
- Add `data-cursor-text="Explore"` to service cards
- CustomCursor already handles `data-cursor-text` attribute

**Files:** `Services.tsx` (page), `Services.tsx` (component)

---

### - [x] S-37. 🟢 Magnetic Hover on All CTAs  ✅ DONE

**Target:** Wrap every button, link, and CTA in Services pages with MagneticHover.

**Files:** `Services.tsx` (page), `ServiceDetail.tsx`

---

### - [x] S-38. 🟢 Scroll Progress Indicator  ✅ DONE

**Target:** A thin accent-colored progress bar at the very top of ServiceDetail, showing scroll position through the page.

**Implementation:**
```tsx
const { scrollYProgress } = useScroll();
<motion.div
    className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
    style={{ 
        scaleX: scrollYProgress,
        backgroundColor: 'var(--service-accent, #6366f1)'
    }}
/>
```

**Files:** `ServiceDetail.tsx`

---

## 📌 Phase 5: Visual Design & Polish

### - [x] S-39. 🔴 Dark Mode Polish for Services  ✅ DONE

**Target:** Intentional dark mode design for all service components.

**Implementation:**
- Dark mode gradient mesh backgrounds
- Tuned text opacity hierarchy (100%, 87%, 40%)
- Card border colors in dark mode
- Image brightness overlay
- Reuse W-30 utility classes

**Files:** `index.css`

---

### - [x] S-40. 🔴 Premium Typography Hierarchy  ✅ DONE

**Target:** Establish a clear typography system for service pages.

**Implementation:**
```css
.service-hero-title { /* 10rem, display font, -0.05em tracking */ }
.service-section-heading { /* 3xl-5xl, display font */ }
.service-body-text { /* 18px, light weight, 1.8 line-height */ }
.service-meta-label { /* 10px, bold, 0.4em tracking, uppercase */ }
.service-card-title { /* 3-4xl, display, tight tracking */ }
```

**Files:** `index.css`

---

## 📌 Phase 6: Mobile Experience

### - [x] S-41. 🔴 Mobile-Optimized Service Detail  ✅ DONE

**Target:** Ensure all ServiceDetail sections look stunning on mobile.

**Implementation:**
- Hero: responsive title sizing (5xl → 10rem)
- Metrics strip: 2×2 grid on mobile
- Features: single column bento on mobile
- Pricing: horizontal scroll with snap
- FAQ: full-width accordion
- Disable 3D tilt on touch devices
- Touch-optimized carousels for related works

**Files:** `ServiceDetail.tsx`

---

## 📌 Phase 7: Performance & SEO

### - [x] S-42. 🔴 Image & Video Loading Strategy  ✅ DONE

**Target:** Optimized loading for all service media.

**Implementation:**
- Hero image/video: `loading="eager"`, priority
- Card images: `loading="lazy"`, blur-up placeholder
- Videos: `preload="none"`, upgraded to metadata via IntersectionObserver
- Use OptimizedImage component where possible
- Background videos: reduced quality on mobile (connection-aware)

**Files:** `Services.tsx` (page), `ServiceDetail.tsx`, `Services.tsx` (component)

---

## 📊 Progress Tracker

| Section | Features | Priority | Status |
|---------|----------|----------|--------|
| **Services Archive** | S-1 to S-14 | 5🔴 4🟡 2🟢 | ██████████ 100% (14/14) |
| **Service Detail** | S-15 to S-28 | 7🔴 3🟡 1🟢 | ██████████ 100% (14/14) |
| **Homepage Services** | S-29 to S-34 | 0🔴 3🟡 3🟢 | ██████████ 100% (6/6) |
| **Motion & Interaction** | S-35 to S-38 | 1🔴 1🟡 2🟢 | ██████████ 100% (4/4) |
| **Visual Design** | S-39 to S-40 | 2🔴 0🟡 0🟢 | ██████████ 100% (2/2) |
| **Mobile Experience** | S-41 | 1🔴 0🟡 0🟢 | ██████████ 100% (1/1) |
| **Performance & SEO** | S-42 | 1🔴 0🟡 0🟢 | ██████████ 100% (1/1) |
| **TOTAL** | **42 Features** | **17🔴 11🟡 8🟢** | **██████████ 100% — All 42 Done** |

---

## 🗓 Implementation Priority Order

### Sprint 1 — Foundation (S-1, S-2, S-3, S-7, S-15, S-35, S-39, S-40)
The hero, cards, process, detail hero, and design system. This establishes the visual language.

### Sprint 2 — Detail Deep-Dive (S-16, S-17, S-18, S-19, S-21, S-22, S-24)
Stats, scope, features, process, tools, pricing, FAQ — the meat of the service detail page.

### Sprint 3 — Social Proof (S-8, S-10, S-12, S-23, S-25, S-26)
Stats orbital, client logos, testimonials, related works, next service nav.

### Sprint 4 — Interaction Polish (S-4, S-5, S-11, S-29, S-30, S-36, S-37, S-38)
Filters, comparison matrix, homepage enhancements, cursor states, magnetic hover.

### Sprint 5 — Mobile & SEO (S-6, S-9, S-13, S-14, S-27, S-28, S-31, S-32, S-33, S-34, S-41, S-42)
Search, split highlights, CTA engine, mobile optimization, structured data, performance.

---

## 🎯 Design Benchmarks

The Services section should beat these Awwwards winners for inspiration:

| Benchmark | What to steal |
|-----------|--------------|
| **Locomotive.ca** | Scroll-driven morphing reveals, kinetic typography |
| **Lusion.co** | 3D depth, floating elements, noise textures |
| **Resn.co.nz** | Playful interactions, custom cursor states |
| **Basement.studio** | Stacking cards, video-on-hover, glassmorphism |
| **Aristide Benoist** | Editorial typography, clean whitespace, parallax |
| **Linear.app** | Comparison tables, clean pricing, smooth animations |

---

## 🔑 Why This Surpasses Works

| Dimension | Works | Services |
|-----------|-------|----------|
| **Hero** | Word-level reveal | Character-level 3D flip + floating geometry |
| **Navigation** | Category filter + search | Category filter + search + comparison matrix |
| **Cards** | 3D tilt + video hover | 3D tilt + video hover + stats + glassmorphism |
| **Detail Page** | 10 sections | 12+ sections including pricing, scope, FAQ |
| **Social Proof** | Related works carousel | Testimonials + case studies + client logos |
| **Conversion** | Back to portfolio link | Integrated pricing + mini contact form |
| **Data Richness** | Gallery, results, testimonial | Features, deliverables, process, FAQ, pricing, testimonials, tools |
| **Unique Features** | Before/After slider, Floating TOC | Comparison matrix, Scope accordion, Pricing tiers, FAQ accordion, Scroll progress |
| **Business Impact** | Portfolio showcase | Revenue-driving service sales engine |

> **The Services section is designed to be a conversion machine wrapped in Awwwards-winning aesthetics.**  
> Every scroll, every hover, every reveal is engineered to make the visitor think:  
> *"I need to work with these people."*
