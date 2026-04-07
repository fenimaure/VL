# 🎨 Midnight Studio: Markdown Editor Guide

Welcome to the ultimate guide for your Case Study Markdown Editor! Because we built a custom `ComponentRenderer`, your markdown editor has super-powers. You are NOT limited to simple text; you can drop beautiful UI components directly into the editor.

Whenever you want to use one of these features, just copy and paste the snippet right into the Markdown box while managing your Works.

---

## 📸 Media & Images
*Use these to display beautiful assets throughout your case study.*

**Full Screen Edge-to-Edge Breakout Image**
```html
<FullScreenImage src="https://example.com/image.jpg" alt="Description" />
```

**Polished Image with Floating Caption**
```html
<ImageCaption src="https://example.com/image.jpg" caption="An amazing wireframe" />
```

---

## 📐 Layout & Spacing
*Control the flow and structure of your content.*

**Dynamic Spacing (Gap)**
*Sizes available: `xs`, `sm`, `md`, `lg`, `xl`*
```html
<Spacer size="xl" />
```

**Responsive Grid**
*Columns available: `2`, `3`, `4`*
```html
<Grid cols="2">
  <img src="shot1.jpg" />
  <img src="shot2.jpg" />
</Grid>
```

**Side-by-Side Flex Columns**
```html
<Columns>
  <div>Your left text goes here.</div>
  <div>Your right text goes here.</div>
</Columns>
```

**Horizontal Divider With Label**
```html
<Divider label="PROJECT KICKOFF" />
```

---

## 📦 Content Blocks & Cards
*Beautifully framed information to break up long text sections.*

**Callout / Alert Box**
*Types available: `info`, `warning`, `tip`, `caution`*
```html
<CalloutBox type="tip" title="Pro Tip!">
  Dropping this component inside your text creates a gorgeous highlighted frame.
</CalloutBox>
```

**Hoverable Feature Card**
```html
<FeatureCard icon="🚀" title="The Discovery Phase">
  We conducted massive research to figure this out.
</FeatureCard>
```

**Client Testimonial**
```html
<Testimonial author="John Doe" role="CEO, Awesome Corp" avatar="https://example.com/avatar.jpg">
  This team completely overhauled our brand identity. A masterpiece.
</Testimonial>
```

**Expandable Accordion (FAQ Style)**
```html
<Accordion title="See the Technical Requirements">
  Hidden content that will elegantly slide open when clicked!
</Accordion>
```

**Background Section Wrapper**
*Backgrounds available: `muted`, `dark`, `accent`*
```html
<Section bg="muted">
  Everything in here will have a gorgeous tinted background card format.
</Section>
```

---

## 💅 Text & Emphasis
*Make specific words pop.*

**Vibrant Highlight**
```html
Notice this <Highlight>absolutely critical text</Highlight> right here!
```

**Gradient Text**
```html
<GradientText from="#6366f1" to="#ec4899">Design System Refactor</GradientText>
```

**Pill Badges**
*Colors available: `primary`, `blue`, `green`, `amber`, `red`, `purple`*
```html
Built entirely with <Badge color="purple">Framer Motion</Badge>
```

---

## 📊 Data & Metrics
*Prove your results.*

**Floating Stat Card**
```html
<StatCard value="250%" label="Revenue Growth" />
```

**Vertical Timeline Node**
```html
<Timeline date="Q1 2024" title="The MVP Launch">
  We shipped the first version to 10k users.
</Timeline>
```

---

## 🎬 Interactivity & Motion
*Bring your static page to life.*

**Animated Infinite Scrolling Marquee Text**
```html
<Marquee>BRANDING · STRATEGY · UX DESIGN · FULLSTACK</Marquee>
```

---

## 🖱️ Actions
*Drive traffic elsewhere.*

**Interactive Button**
*Variants available: `primary`, `outline`, `ghost`*
```html
<Button href="https://live-website-url.com" variant="primary">
  View Live Project
</Button>
```
