# 🔍 Lovelli Website — Full Audit Report

> **Audited:** April 5, 2026  
> **Scope:** All pages, components, configuration, and infrastructure  
> **Total Items:** 50

---

## Legend

| Symbol | Priority | Description |
|--------|----------|-------------|
| 🔴 | **Critical** | Must fix — blocks users, breaks core functionality, or is a security risk |
| 🟠 | **High** | Should fix soon — significantly degrades UX, SEO, or performance |
| 🟡 | **Medium** | Plan to fix — improves quality, maintainability, or polish |
| 🟢 | **Low** | Nice to have — minor improvements and future enhancements |

| Tag | Category |
|-----|----------|
| `SEO` | Search Engine Optimization |
| `PERF` | Performance |
| `A11Y` | Accessibility |
| `SEC` | Security |
| `UX` | User Experience / UI |
| `CODE` | Code Quality / Maintainability |
| `ARCH` | Architecture / Infrastructure |
| `CONTENT` | Content & Copy |

---

## 🔴 Critical Priority

### 1. `SEC` — Supabase Credentials Fallback to Placeholder
- [ ] **Problem:** In [supabase.ts](file:///c:/Users/Ky/VL/src/lib/supabase.ts#L11-L14), when env vars are missing, the client initializes with `'https://placeholder-url.supabase.co'` and `'placeholder-key'`. This silently creates a non-functional client that makes failed API calls on every page load instead of failing fast.
- **Suggestion:** Throw a clear error or render a maintenance page when env vars are missing.
- **Solution:** Replace placeholder fallback with `throw new Error('Missing Supabase config')` or gate the entire app with a config check before rendering.

---

### 2. `SEC` — SQL Files Exposed in Repository Root
- [ ] **Problem:** Files `supabase_complete.sql`, `supabase_schema.sql`, `supabase_faqs.sql`, `supabase_inquiries.sql`, `supabase_pricing.sql`, and `update_projects_table.sql` are committed to the repo root. These expose your entire database schema, table structures, and RLS policies to anyone with access.
- **Suggestion:** Move SQL migration files to a private directory or remove from version control.
- **Solution:** Add `*.sql` to `.gitignore`, move migrations to a `database/migrations/` directory that is gitignored, or use Supabase CLI migrations which are handled separately.

---

### 3. `SEC` — Admin Routes Have No Authentication Guard
- [ ] **Problem:** In [App.tsx](file:///c:/Users/Ky/VL/src/App.tsx#L48-L49), `/admin` and `/admin/dashboard` routes are publicly accessible lazy-loaded pages. There is no route guard, auth check, or protected route wrapper.
- **Suggestion:** Implement a `ProtectedRoute` component that checks Supabase auth state before rendering admin pages.
- **Solution:** Create `<ProtectedRoute>` wrapper that redirects to `/admin` (login) if no authenticated session exists. Wrap the Dashboard route with it.

---

### 4. `PERF` — About.tsx is 1,385 Lines / 76KB Single File
- [ ] **Problem:** [About.tsx](file:///c:/Users/Ky/VL/src/pages/About.tsx) is a monolithic 76KB file containing 15+ sub-components (`CinematicHero`, `ManifestoSection`, `SplitNarrative`, `TeamMemberCard`, `FounderSpotlight`, `CultureBento`, `OrbitalStats`, `TestimonialsWall`, `TimelineSection`, `ValuesCarousel`, `AwardsWall`, `FinalCTA`, etc.). This causes massive bundle size even with lazy loading.
- **Suggestion:** Extract each section into individual components in an `about/` directory.
- **Solution:** Create `src/components/about/` folder and split each ACT section into its own file. The main `About.tsx` should only compose them together.

---

### 5. `A11Y` — Contact Form Has No Client-Side Validation Feedback
- [ ] **Problem:** In [Contact.tsx](file:///c:/Users/Ky/VL/src/pages/Contact.tsx#L62-L88), `handleSubmit` sends data to Supabase but only uses `alert()` for error feedback. There is no form validation for email format, no required field indicators, and no accessible error messages.
- **Suggestion:** Add inline validation errors, `aria-invalid` attributes, and visual feedback for required fields.
- **Solution:** Implement proper form validation with inline error messages using `aria-describedby` pattern, highlight invalid fields with red borders, and show toast notifications instead of `alert()`.

---

## 🟠 High Priority

### 6. `SEO` — Home Page Missing SEO Component
- [ ] **Problem:** [Home.tsx](file:///c:/Users/Ky/VL/src/pages/Home.tsx) does not use the `<SEO>` component. It relies entirely on the static `index.html` meta tags. This means dynamic title/description changes won't happen, and the page uses the generic site title.
- **Suggestion:** Add `<SEO title="Home" description="..." />` to the Home page.
- **Solution:** Import and add `<SEO title="Premium Digital Experiences" description="..." url="/" type="website" />` at the top of the Home component's return.

---

### 7. `SEO` — Missing SEO on Blog, Careers, Pricing, FAQ Pages
- [ ] **Problem:** [Blog.tsx](file:///c:/Users/Ky/VL/src/pages/Blog.tsx), [Careers.tsx](file:///c:/Users/Ky/VL/src/pages/Careers.tsx), [Pricing.tsx](file:///c:/Users/Ky/VL/src/pages/Pricing.tsx), [FAQ.tsx](file:///c:/Users/Ky/VL/src/pages/FAQ.tsx), and [NotFound.tsx](file:///c:/Users/Ky/VL/src/pages/NotFound.tsx) all lack the `<SEO>` component. These pages have no dynamic `<title>` or `<meta description>`.
- **Suggestion:** Add `<SEO>` component to every page.
- **Solution:** Import and add the `<SEO>` component with appropriate title and description to each page listed above.

---

### 8. `PERF` — Services.tsx is 1,034 Lines / 60KB Single File
- [ ] **Problem:** [Services.tsx](file:///c:/Users/Ky/VL/src/pages/Services.tsx) contains 8+ inline components (`CharacterReveal`, `VelocityMarquee`, `ServiceCard`, `ProcessSection`, `StatsSection`, `FeatureHighlights`, `TestimonialsSection`, `CTASection`). Similar monolith problem as About.tsx.
- **Suggestion:** Extract sub-components into `src/components/services/` directory.
- **Solution:** Move each section component to its own file under `src/components/services/`. Keep `Services.tsx` as a composition component.

---

### 9. `PERF` — Works.tsx is 863 Lines / 49KB Single File
- [ ] **Problem:** [Works.tsx](file:///c:/Users/Ky/VL/src/pages/Works.tsx) has the same monolith pattern with `HorizontalShowcase`, `FeaturedSpotlight`, `WorkListRow`, `WorkCard` all inlined. 49KB of code in a single file.
- **Suggestion:** Extract sub-components into `src/components/works/` directory.
- **Solution:** Move card components and showcase sections to separate files. Keep `Works.tsx` as the page-level orchestrator.

---

### 10. `PERF` — Duplicate Supabase Calls — Navbar & Footer Both Fetch `footer_content`
- [ ] **Problem:** Both [Navbar.tsx](file:///c:/Users/Ky/VL/src/components/Navbar.tsx#L26-L38) and [Footer.tsx](file:///c:/Users/Ky/VL/src/components/Footer.tsx#L21-L33) independently fetch from the `footer_content` table. Since both appear on every page, this means **2 redundant API calls per page load**.
- **Suggestion:** Create a shared context or data hook that fetches site-wide config once.
- **Solution:** Create a `SiteConfigContext` that fetches `footer_content` once at app level and provides it via context to both Navbar and Footer.

---

### 11. `PERF` — No Image Optimization or Responsive Sizes
- [ ] **Problem:** Throughout the site (Home, About, Works, Blog, Careers), images are rendered as plain `<img>` tags with no `srcset`, `sizes`, or next-gen format handling. Large hero images load at full resolution on mobile.
- **Suggestion:** Use responsive image techniques with `srcset` and `sizes` attributes, or leverage Supabase image transforms.
- **Solution:** Upgrade the `OptimizedImage.tsx` component to include `srcset` for multiple breakpoints, add `sizes` attribute, and use WebP format where possible via Supabase transforms.

---

### 12. `A11Y` — Marquee Components Lack `aria-hidden` and `role` Attributes
- [ ] **Problem:** Both `VelocityMarquee` (Services) and `AboutMarquee` (About) are purely decorative scrolling text elements but have no `aria-hidden="true"` or `role="presentation"`. Screen readers will read repeated text like "STRATEGY DESIGN CRAFT..." three times.
- **Suggestion:** Add `aria-hidden="true"` to marquee containers.
- **Solution:** Add `aria-hidden="true"` and `role="presentation"` to the marquee section elements and remove them from the accessibility tree.

---

### 13. `UX` — Footer Copyright Says "© 2024"
- [ ] **Problem:** In [Footer.tsx](file:///c:/Users/Ky/VL/src/components/Footer.tsx#L202), the copyright year is hardcoded to `2024`. It's now 2026.
- **Suggestion:** Use dynamic year.
- **Solution:** Replace `© 2024` with `© {new Date().getFullYear()}` to keep it always current.

---

### 14. `UX` — Footer Links "Privacy", "Terms", "Legal" Are Dead Anchors
- [ ] **Problem:** In [Footer.tsx](file:///c:/Users/Ky/VL/src/components/Footer.tsx#L204-L206), Privacy, Terms, and Legal links all point to `#` — they go nowhere.
- **Suggestion:** Either create actual policy pages or remove the links.
- **Solution:** Create `/privacy`, `/terms`, and `/legal` pages with proper content, or hide these links until the pages are ready.

---

### 15. `UX` — Loading States Show Empty Divs or "Loading..." Text
- [ ] **Problem:** Multiple pages have inconsistent loading states: About shows `"Loading..."` text, Blog returns `null`, Careers returns `null`, FAQ shows empty div. There are no skeleton loaders or branded loading animations.
- **Suggestion:** Create a consistent, branded loading component.
- **Solution:** Build a `<PageLoader>` component with the Lovelli logo animation and use it consistently across all pages. Replace `null` loading returns with proper skeletons.

---

### 16. `PERF` — Home Page Fetches `about_content` On Every Load
- [ ] **Problem:** [Home.tsx](file:///c:/Users/Ky/VL/src/pages/Home.tsx#L18-L34) makes a Supabase query just to get a featured image URL. Combined with the Hero component doing its own fetch and HomeAbout doing another, the home page makes 3+ Supabase calls for about content alone.
- **Suggestion:** Consolidate all home page data fetching into a single query.
- **Solution:** Create a `useHomeData` hook that fetches all needed data in one go, or batch queries at the page level and pass data down as props.

---

### 17. `A11Y` — Testimonial Auto-Carousel Has No Pause Control
- [ ] **Problem:** In [Services.tsx](file:///c:/Users/Ky/VL/src/pages/Services.tsx#L490-L494), the testimonials carousel auto-rotates every 6 seconds with no way to pause. This violates WCAG 2.2.2 (Pause, Stop, Hide) for users with cognitive disabilities.
- **Suggestion:** Add a pause/play button and stop auto-rotation on hover/focus.
- **Solution:** Add a pause button, pause on hover (`onMouseEnter`), pause on focus, and ensure users can navigate testimonials manually at their own pace.

---

## 🟡 Medium Priority

### 18. `CODE` — Duplicated TikTokIcon and XIcon Components
- [ ] **Problem:** `TikTokIcon` and `XIcon` are defined identically in both [Navbar.tsx](file:///c:/Users/Ky/VL/src/components/Navbar.tsx#L8-L18) and [Footer.tsx](file:///c:/Users/Ky/VL/src/components/Footer.tsx#L6-L16). Same SVG, same code, duplicated.
- **Suggestion:** Create a shared `Icons.tsx` component for custom social icons.
- **Solution:** Create `src/components/icons/SocialIcons.tsx` exporting `TikTokIcon` and `XIcon`, then import from there in both Navbar and Footer.

---

### 19. `CODE` — Duplicated `CountUp` Component
- [ ] **Problem:** `CountUp` is defined separately in both [Services.tsx](file:///c:/Users/Ky/VL/src/pages/Services.tsx#L72-L90) and [Works.tsx](file:///c:/Users/Ky/VL/src/pages/Works.tsx#L36-L62) with slightly different implementations but the same purpose.
- **Suggestion:** Create a single shared `CountUp` component.
- **Solution:** Move `CountUp` to `src/components/CountUp.tsx` with configurable duration, and import it in both Services and Works.

---

### 20. `CODE` — Duplicated VelocityMarquee / AboutMarquee
- [ ] **Problem:** `VelocityMarquee` in Services.tsx and `AboutMarquee` in About.tsx are 90% identical — same scroll-velocity logic, same rendering pattern. Only the word list differs.
- **Suggestion:** Create a reusable `VelocityMarquee` component that accepts words as props.
- **Solution:** Extract to `src/components/VelocityMarquee.tsx` with a `words` prop, import and use in both pages.

---

### 21. `SEO` — Services JSON-LD Uses Wrong Domain
- [ ] **Problem:** In [Services.tsx](file:///c:/Users/Ky/VL/src/pages/Services.tsx#L725), the JSON-LD structured data hardcodes `https://lovelli.ph/services/` but the OG tags and site URL use `https://lovelli.services`. Inconsistent domain in structured data.
- **Suggestion:** Use `window.location.origin` consistently for all structured data URLs.
- **Solution:** Replace `https://lovelli.ph/services/` with `${window.location.origin}/services/` in the JSON-LD generation.

---

### 22. `UX` — Navbar Hides "Blog" and "Careers" Links on Desktop
- [ ] **Problem:** In [Navbar.tsx](file:///c:/Users/Ky/VL/src/components/Navbar.tsx#L106), desktop navigation filters out `'Blog'` and `'Careers'` links (`.filter(link => !['Blog', 'Careers'].includes(link.title))`). These are only accessible via mobile menu or direct URL.
- **Suggestion:** Show all important navigation links on desktop, or add them to a "More" dropdown.
- **Solution:** Remove the filter or add a "More" dropdown menu that reveals Blog and Careers links on desktop. These are legitimate pages that should be discoverable.

---

### 23. `UX` — Blog Post Uses Placeholder Image from via.placeholder.com
- [ ] **Problem:** In [BlogPost.tsx](file:///c:/Users/Ky/VL/src/pages/BlogPost.tsx#L69), the fallback image is `'https://via.placeholder.com/1200x600'`. Same in [Blog.tsx](file:///c:/Users/Ky/VL/src/pages/Blog.tsx#L94) with `'https://via.placeholder.com/800x400'`. This looks unprofessional if blog images are missing.
- **Suggestion:** Create a branded fallback image.
- **Solution:** Design a Lovelli-branded placeholder image, save it to `/public/`, and use `/placeholder-blog.webp` as the fallback.

---

### 24. `A11Y` — No `<h1>` on Home Page
- [ ] **Problem:** The Home page ([Home.tsx](file:///c:/Users/Ky/VL/src/pages/Home.tsx)) delegates to `<Hero>` component which has the heading. While the Hero has an `<h1>`, it's dynamically generated from CMS data and may not always be present. The heading hierarchy depends entirely on CMS content.
- **Suggestion:** Ensure a guaranteed `<h1>` exists with an `sr-only` fallback.
- **Solution:** Add a fallback `<h1 className="sr-only">Lovelli - Premium Digital Experiences</h1>` if CMS data is unavailable.

---

### 25. `PERF` — `lucide-react` Excluded from Vite Optimized Dependencies
- [ ] **Problem:** In [vite.config.ts](file:///c:/Users/Ky/VL/vite.config.ts#L7-L9), `lucide-react` is excluded from `optimizeDeps`. This was likely a workaround for an old issue but now causes this large icon library to not be pre-bundled, potentially slowing dev server startup.
- **Suggestion:** Remove the `optimizeDeps` exclusion and test if the dev server works correctly without it.
- **Solution:** Remove the `optimizeDeps: { exclude: ['lucide-react'] }` config line and test. Modern versions of lucide-react work fine with Vite's dependency optimization.

---

### 26. `UX` — Contact Form Submits to `project_inquiries` but Services CTA Submits to `inquiries`
- [ ] **Problem:** [Contact.tsx](file:///c:/Users/Ky/VL/src/pages/Contact.tsx#L66) inserts into `project_inquiries` table, while the Services CTA form at [Services.tsx](file:///c:/Users/Ky/VL/src/pages/Services.tsx#L559) inserts into `inquiries` table. Two separate tables for essentially the same purpose — leads get fragmented.
- **Suggestion:** Consolidate to a single inquiries table with a `source` field to distinguish origin.
- **Solution:** Migrate all inquiry submissions to one table (e.g., `inquiries`) with a `source` column ('contact-page', 'services-page', etc.) to track where the lead came from.

---

### 27. `A11Y` — FAQ Contact CTA Uses `<a href="/contact">` Instead of `<Link>`
- [ ] **Problem:** In [FAQ.tsx](file:///c:/Users/Ky/VL/src/pages/FAQ.tsx#L248-L254), the "Contact Us" CTA uses a plain `<a href="/contact">` tag instead of React Router's `<Link>`. This causes a full page reload instead of client-side navigation.
- **Suggestion:** Replace `<a href>` with `<Link to>` for internal navigation.
- **Solution:** Import `Link` from `react-router-dom` and replace `<a href="/contact">` with `<Link to="/contact">` for seamless SPA navigation.

---

### 28. `A11Y` — Pricing CTA Links Use `<a href>` Instead of `<Link>`
- [ ] **Problem:** Across [Pricing.tsx](file:///c:/Users/Ky/VL/src/pages/Pricing.tsx#L166-L177), CTA buttons use `<a href={pkg.cta_link || '/contact'}>` causing full reloads for internal navigation.
- **Suggestion:** Use `<Link>` for internal routes and `<a>` for external links.
- **Solution:** Conditionally render `<Link to>` for internal paths (starting with `/`) and `<a href>` for external URLs.

---

### 29. `PERF` — Blog Page Uses Manual IntersectionObserver Instead of Framer Motion
- [ ] **Problem:** [Blog.tsx](file:///c:/Users/Ky/VL/src/pages/Blog.tsx#L37-L49) and [Careers.tsx](file:///c:/Users/Ky/VL/src/pages/Careers.tsx#L37-L49) use raw `IntersectionObserver` with `classList.add('visible')` for scroll animations, while the rest of the site uses Framer Motion's `whileInView`. This is inconsistent and adds styling overhead.
- **Suggestion:** Migrate to Framer Motion for consistency with the rest of the codebase.
- **Solution:** Replace raw IntersectionObserver usage with `<motion.div whileInView={{ opacity: 1, y: 0 }}>` pattern used everywhere else in the app.

---

### 30. `UX` — Theme Default Ignores System Preference
- [ ] **Problem:** In [ThemeContext.tsx](file:///c:/Users/Ky/VL/src/contexts/ThemeContext.tsx#L16), the theme defaults to `'light'` if no localStorage value exists. It does not check `prefers-color-scheme` media query for user's OS preference.
- **Suggestion:** Check `window.matchMedia('(prefers-color-scheme: dark)')` as the initial fallback.
- **Solution:** Update the initial theme logic: `const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');`

---

### 31. `PERF` — Marquee Uses `setState` on Every Animation Frame
- [ ] **Problem:** Both [VelocityMarquee](file:///c:/Users/Ky/VL/src/pages/Services.tsx#L131-L143) and [AboutMarquee](file:///c:/Users/Ky/VL/src/pages/About.tsx#L716-L727) call `setTickerX()` on every `requestAnimationFrame`. This triggers a React re-render 60 times per second, which is extremely wasteful.
- **Suggestion:** Use CSS transforms via `useRef` instead of state-driven re-renders.
- **Solution:** Use `useRef` to store the transform value and apply it directly to the DOM element's `style.transform` — bypass React's render cycle entirely. Or use Framer Motion's `useAnimationFrame` hook.

---

### 32. `CODE` — `any` Type Used Extensively Throughout Codebase
- [ ] **Problem:** Across the codebase, `any` is used excessively: `AboutSection.items: any[]`, `heroData: any`, `member: any`, `block: any`, `map: any`, `item: any`, etc. This defeats TypeScript's safety guarantees.
- **Suggestion:** Define proper TypeScript interfaces for all data shapes.
- **Solution:** Create a `src/types/` directory with interfaces like `TeamMember`, `NarrativeBlock`, `TimelineEvent`, `Testimonial`, `HeroData`, etc. Replace all `any` types with proper interfaces.

---

### 33. `UX` — Careers Page Uses Hardcoded Unsplash Image
- [ ] **Problem:** [Careers.tsx](file:///c:/Users/Ky/VL/src/pages/Careers.tsx#L88) uses a hardcoded Unsplash URL (`images.unsplash.com/...`) for the team/studio banner. This loads a third-party image on every visit and could break if Unsplash changes their CDN.
- **Suggestion:** Host the image locally or use Supabase storage.
- **Solution:** Download the image, optimize it, upload to Supabase storage, and reference the Supabase URL. This also improves page load control.

---

### 34. `PERF` — No Error Boundary Around Individual Page Sections
- [ ] **Problem:** The [ErrorBoundary](file:///c:/Users/Ky/VL/src/components/ErrorBoundary.tsx) only wraps the entire app. If a single component like `OrbitalStats` or `TestimonialsWall` throws, the entire app crashes and shows the error screen.
- **Suggestion:** Add section-level error boundaries for graceful degradation.
- **Solution:** Create a `<SectionErrorBoundary>` component that catches errors per-section, shows a minimal fallback (or hides the section), while the rest of the page keeps working.

---

## 🟢 Low Priority

### 35. `SEO` — Missing `robots.txt`
- [ ] **Problem:** There is no `robots.txt` file in the `public/` directory. Search engine crawlers have no explicit crawling instructions.
- **Suggestion:** Create a `robots.txt` that allows all crawling and points to a sitemap.
- **Solution:** Create `public/robots.txt` with: `User-agent: *\nAllow: /\nSitemap: https://lovelli.services/sitemap.xml`

---

### 36. `SEO` — Missing `sitemap.xml`
- [ ] **Problem:** No sitemap exists for the site. This reduces search engine discoverability, especially for dynamic pages like individual works, services, and blog posts.
- **Suggestion:** Generate a sitemap.xml either statically or dynamically at build time.
- **Solution:** Create a build script or Netlify function that generates `sitemap.xml` from all known routes plus dynamic Supabase content (works slugs, blog slugs, service slugs).

---

### 37. `PERF` — Package Name is Still "vite-react-typescript-starter"
- [ ] **Problem:** In [package.json](file:///c:/Users/Ky/VL/package.json#L2), the project name is `"vite-react-typescript-starter"` — the boilerplate default. This is unprofessional and could cause confusion in tooling and logs.
- **Suggestion:** Rename to project name.
- **Solution:** Change `"name"` to `"lovelli-website"` or `"lovelli-services"`.

---

### 38. `CONTENT` — About Page JSON-LD Has Incorrect Contact Email
- [ ] **Problem:** In [About.tsx](file:///c:/Users/Ky/VL/src/pages/About.tsx#L79), the JSON-LD Organization schema hardcodes `"email": "hello@lovelli.com"`. This may not be the actual email (footer fetches it dynamically from Supabase).
- **Suggestion:** Fetch and use the actual contact email from Supabase for JSON-LD.
- **Solution:** Either make the JSON-LD build dynamically after data fetch, or ensure the hardcoded email matches the actual business email.

---

### 39. `CODE` — Test Script Files in Repository Root
- [ ] **Problem:** `test-md.mjs` and `test-md2.mjs` are test/debug scripts left in the project root. They should not be in production code.
- **Suggestion:** Remove or move to a `scripts/` directory.
- **Solution:** Either delete these files if no longer needed, or move to `scripts/` and add to `.gitignore`.

---

### 40. `CODE` — Markdown Documentation Files in Repository Root
- [ ] **Problem:** `About.md`, `Branding.md`, `Services.md`, `git-tutorial.md`, `netlify.md` are all in the project root. While useful for planning, they clutter the root directory and may contain internal strategy details.
- **Suggestion:** Move to a `docs/` directory.
- **Solution:** Create `docs/` folder. Move `About.md`, `Branding.md`, `Services.md`, `git-tutorial.md`, `netlify.md` into it. Update any references.

---

### 41. `UX` — No "Back to Top" Button on Long Pages
- [ ] **Problem:** Pages like About (ACT I through ACT VI), Services, and Works are extremely long scrolling experiences. There's no quick way to return to top other than scrolling back.
- **Suggestion:** Add a floating "Back to Top" button that appears after scrolling past the first viewport.
- **Solution:** Create a `<BackToTop>` component using Framer Motion that fades in after 500px scroll and smoothly scrolls to top on click.

---

### 42. `UX` — Mobile Navbar Menu Filter Excludes Contact
- [ ] **Problem:** In [Navbar.tsx](file:///c:/Users/Ky/VL/src/components/Navbar.tsx#L183), the mobile menu filters out the "Contact" link (`.filter(link => link.title !== 'Contact')`). The Contact page is only accessible via footer or direct URL from mobile.
- **Suggestion:** Include Contact in the mobile menu, or add a prominent CTA button for it.
- **Solution:** Remove the Contact filter from the mobile menu, or add a separate "Start Project" CTA button at the bottom of the mobile menu that links to `/contact`.

---

### 43. `A11Y` — Team Member Cards Missing Alt Text for Dynamic Images
- [ ] **Problem:** In About.tsx's `TeamMemberCard`, member photos use CMS image URLs but the alt text defaults to `member.name` which may be empty or undefined from the CMS.
- **Suggestion:** Provide meaningful fallback alt text.
- **Solution:** Use `alt={member.name || 'Team member'}` and ensure the CMS always requires a name field.

---

### 44. `PERF` — Manifest.json Uses Single 1024x1024 Icon
- [ ] **Problem:** The [manifest.json](file:///c:/Users/Ky/VL/public/manifest.json#L9-L15) only provides one icon at 1024x1024 resolution. PWA best practices require multiple sizes (192x192, 512x512 at minimum).
- **Suggestion:** Generate multiple icon sizes for proper PWA support.
- **Solution:** Create icon variants at 192x192, 384x384, 512x512, and 1024x1024. Also split `"purpose": "any maskable"` — `any` and `maskable` should be separate icon entries per spec.

---

### 45. `UX` — No 404 SEO Handling
- [ ] **Problem:** [NotFound.tsx](file:///c:/Users/Ky/VL/src/pages/NotFound.tsx) has a beautiful 404 page but doesn't use the `<SEO>` component, and the page doesn't set any `noindex` meta tag or proper HTTP status signaling.
- **Suggestion:** Add `<SEO>` with `noindex` meta and a descriptive title.
- **Solution:** Add `<SEO title="Page Not Found" description="..." />` and include `<meta name="robots" content="noindex" />` via Helmet.

---

### 46. `CODE` — `react-icons` Package Installed but Not Used
- [ ] **Problem:** `react-icons` is listed in [package.json](file:///c:/Users/Ky/VL/package.json#L22) dependencies, but the codebase exclusively uses `lucide-react` for icons and custom SVGs. `react-icons` adds unnecessary bundle weight.
- **Suggestion:** Remove unused dependency.
- **Solution:** Run `npm uninstall react-icons` to save bundle size. Verify no imports exist first with a grep search.

---

### 47. `UX` — Hero "View Work" Button Links to `#works` But No Section Has That ID
- [ ] **Problem:** In [Hero.tsx](file:///c:/Users/Ky/VL/src/components/Hero.tsx#L231), the "View Work" CTA links to `#works`, but on the Home page, the `FeaturedWorks` component likely doesn't have an `id="works"` attribute. The anchor link may not scroll to the right section.
- **Suggestion:** Ensure the target section has the matching `id`.
- **Solution:** Add `id="works"` to the `FeaturedWorks` component's wrapper section, or change the link to `/works` for the portfolio page.

---

### 48. `PERF` — Unused `Projects` Page Route Still Exists
- [ ] **Problem:** `Projects.tsx` and `ProjectDetail.tsx` exist in the pages directory, but no route in [App.tsx](file:///c:/Users/Ky/VL/src/App.tsx) references them. These are dead files that were likely replaced by Works.
- **Suggestion:** Remove unused page files.
- **Solution:** Delete `src/pages/Projects.tsx` and `src/pages/ProjectDetail.tsx` if they're confirmed to be deprecated replacements. This saves ~31KB of dead code.

---

### 49. `ARCH` — No Environment Variable Type Definitions
- [ ] **Problem:** [vite-env.d.ts](file:///c:/Users/Ky/VL/src/vite-env.d.ts) only contains the default Vite reference. Custom env variables like `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` have no type declarations, so TypeScript can't validate their usage.
- **Suggestion:** Add environment variable type declarations.
- **Solution:** Extend `vite-env.d.ts` with:
```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}
```

---

### 50. `UX` — Navbar Logo Inversion Logic May Cause Flash
- [ ] **Problem:** In [Navbar.tsx](file:///c:/Users/Ky/VL/src/components/Navbar.tsx#L96-L97), the logo uses CSS `invert` filter conditionally based on scroll state and theme (`scrolled ? 'dark:invert' : 'invert'`). On initial page load, there may be a brief flash as the scroll state initializes.
- **Suggestion:** Use two separate logo assets (light/dark) instead of CSS filter inversion.
- **Solution:** Provide `logo-dark.png` and `logo-light.png` variants in `/public/` and conditionally render the correct one based on theme and scroll state. This eliminates the filter-based approach and prevents visual artifacts.

---

## 📊 Summary by Category

| Category | Count |
|----------|-------|
| 🔒 Security (`SEC`) | 3 |
| 🔍 SEO (`SEO`) | 5 |
| ⚡ Performance (`PERF`) | 10 |
| ♿ Accessibility (`A11Y`) | 6 |
| 🎨 UX/UI (`UX`) | 11 |
| 🧹 Code Quality (`CODE`) | 7 |
| 🏗️ Architecture (`ARCH`) | 2 |
| 📝 Content (`CONTENT`) | 2 |
| **TOTAL** | **50** |

## 📊 Summary by Priority

| Priority | Count |
|----------|-------|
| 🔴 Critical | 5 |
| 🟠 High | 12 |
| 🟡 Medium | 17 |
| 🟢 Low | 16 |
| **TOTAL** | **50** |
