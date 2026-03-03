import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import 'highlight.js/styles/github-dark.css';
import type { Components } from 'react-markdown';
import type { ReactNode } from 'react';

/* ══════════════════════════════════════════════
   CUSTOM COMPONENT DEFINITIONS
   All styling lives here — never in stored content.
   ══════════════════════════════════════════════ */

// ── Text & Emphasis ─────────────────────────────

function Highlight({ children }: { children?: ReactNode }) {
    return (
        <span className="inline bg-gradient-to-r from-primary-500/20 to-primary-500/5 dark:from-primary-400/25 dark:to-primary-400/5 px-2 py-0.5 rounded-md text-primary-600 dark:text-primary-300 font-semibold transition-colors duration-300">
            {children}
        </span>
    );
}

function GradientText({ children, from = '#6366f1', to = '#ec4899' }: { children?: ReactNode; from?: string; to?: string }) {
    return (
        <span
            className="font-bold bg-clip-text text-transparent inline-block"
            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        >
            {children}
        </span>
    );
}

function Badge({ children, color = 'primary' }: { children?: ReactNode; color?: string }) {
    const colorMap: Record<string, string> = {
        primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors duration-300 ${colorMap[color] || colorMap.primary}`}>
            {children}
        </span>
    );
}

// ── Blocks & Callouts ───────────────────────────

function CalloutBox({
    children,
    type = 'info',
    title,
}: {
    children?: ReactNode;
    type?: string;
    title?: string;
}) {
    const styles: Record<string, { border: string; bg: string; icon: string; titleColor: string }> = {
        info: {
            border: 'border-blue-400 dark:border-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
            icon: 'ℹ️',
            titleColor: 'text-blue-700 dark:text-blue-300',
        },
        warning: {
            border: 'border-amber-400 dark:border-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
            icon: '⚠️',
            titleColor: 'text-amber-700 dark:text-amber-300',
        },
        tip: {
            border: 'border-emerald-400 dark:border-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
            icon: '💡',
            titleColor: 'text-emerald-700 dark:text-emerald-300',
        },
        caution: {
            border: 'border-red-400 dark:border-red-500',
            bg: 'bg-red-50 dark:bg-red-950/30',
            icon: '🚨',
            titleColor: 'text-red-700 dark:text-red-300',
        },
    };
    const s = styles[type] || styles.info;

    return (
        <div className={`my-6 rounded-xl border-l-4 ${s.border} ${s.bg} p-5 transition-colors duration-300`}>
            {title && (
                <p className={`mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${s.titleColor}`}>
                    <span>{s.icon}</span> {title}
                </p>
            )}
            <div className="text-black/80 dark:text-gray-300 leading-relaxed [&>p]:mb-0">{children}</div>
        </div>
    );
}

function FeatureCard({
    children,
    title,
    icon,
}: {
    children?: ReactNode;
    title?: string;
    icon?: string;
}) {
    return (
        <div className="group relative p-8 rounded-2xl bg-white dark:bg-dark-900 border border-black/5 dark:border-white/10 hover:border-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            {icon && (
                <div className="text-3xl mb-4">{icon}</div>
            )}
            {title && (
                <h4 className="text-lg font-bold text-black dark:text-white mb-3 font-display group-hover:text-primary-500 transition-colors">{title}</h4>
            )}
            <div className="text-sm text-black/60 dark:text-gray-400 leading-relaxed [&>p]:mb-0">{children}</div>
        </div>
    );
}

function Testimonial({
    children,
    author,
    role,
    avatar,
}: {
    children?: ReactNode;
    author?: string;
    role?: string;
    avatar?: string;
}) {
    return (
        <blockquote className="my-8 relative p-8 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 not-italic transition-colors duration-300">
            <div className="absolute top-4 left-6 text-6xl text-primary-500/20 font-serif leading-none select-none">"</div>
            <div className="relative text-lg text-black/80 dark:text-gray-300 leading-relaxed italic mb-6 pl-6 [&>p]:mb-0">{children}</div>
            <div className="flex items-center gap-3 pl-6">
                {avatar && (
                    <img src={avatar} alt={author || ''} className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30 !my-0" />
                )}
                <div>
                    {author && <div className="text-sm font-bold text-black dark:text-white">{author}</div>}
                    {role && <div className="text-xs text-black/50 dark:text-white/50">{role}</div>}
                </div>
            </div>
        </blockquote>
    );
}

function Accordion({
    children,
    title = 'Click to expand',
}: {
    children?: ReactNode;
    title?: string;
}) {
    return (
        <details className="group my-4 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-colors duration-300">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] font-bold text-black dark:text-white transition-all select-none list-none">
                <span>{title}</span>
                <svg className="h-5 w-5 text-black/40 dark:text-white/40 group-open:rotate-180 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </summary>
            <div className="px-6 py-4 text-black/80 dark:text-gray-300 leading-relaxed border-t border-black/5 dark:border-white/5 [&>p]:mb-0">{children}</div>
        </details>
    );
}

// ── Actions & Buttons ───────────────────────────

function Button({
    children,
    href = '#',
    variant = 'primary',
}: {
    children?: ReactNode;
    href?: string;
    variant?: string;
}) {
    const variants: Record<string, string> = {
        primary: 'bg-black dark:bg-white text-white dark:text-dark-950 hover:scale-105',
        outline: 'bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950',
        ghost: 'bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10',
    };
    return (
        <a
            href={href}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 no-underline hover:no-underline my-2 ${variants[variant] || variants.primary}`}
        >
            {children}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
        </a>
    );
}

// ── Layout Components ───────────────────────────

function Grid({ children, cols = '2' }: { children?: ReactNode; cols?: string }) {
    const colsMap: Record<string, string> = {
        '2': 'grid-cols-1 sm:grid-cols-2',
        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };
    return (
        <div className={`grid ${colsMap[cols] || colsMap['2']} gap-6 my-8`}>
            {children}
        </div>
    );
}

function Columns({ children }: { children?: ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row gap-8 my-8 [&>*]:flex-1">
            {children}
        </div>
    );
}

function Spacer({ size = 'md' }: { size?: string; children?: ReactNode }) {
    const sizeMap: Record<string, string> = {
        xs: 'h-4',
        sm: 'h-8',
        md: 'h-16',
        lg: 'h-24',
        xl: 'h-32',
    };
    return <div className={sizeMap[size] || sizeMap.md} aria-hidden="true" />;
}

function Divider({ children, label }: { children?: ReactNode; label?: string }) {
    const text = label || (typeof children === 'string' ? children : null);
    if (text) {
        return (
            <div className="flex items-center gap-4 my-10">
                <div className="flex-1 h-px bg-black/10 dark:bg-white/10 transition-colors duration-300" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30 transition-colors duration-300">{text}</span>
                <div className="flex-1 h-px bg-black/10 dark:bg-white/10 transition-colors duration-300" />
            </div>
        );
    }
    return (
        <div className="my-10">
            <div className="h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent transition-colors duration-300" />
        </div>
    );
}

// ── Data & Stats ────────────────────────────────

function StatCard({
    children,
    value,
    label,
}: {
    children?: ReactNode;
    value?: string;
    label?: string;
}) {
    return (
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 min-w-[140px] transition-all duration-300 hover:scale-105 hover:border-primary-500/30 hover:shadow-lg">
            <span className="text-4xl md:text-5xl font-bold text-black dark:text-white font-display mb-1 transition-colors duration-300">
                {value || children}
            </span>
            {label && (
                <span className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-medium transition-colors duration-300">
                    {label}
                </span>
            )}
        </div>
    );
}

function Timeline({
    children,
    date,
    title,
}: {
    children?: ReactNode;
    date?: string;
    title?: string;
}) {
    return (
        <div className="relative pl-8 pb-8 border-l-2 border-black/10 dark:border-white/10 last:pb-0 transition-colors duration-300">
            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-dark-950 transition-colors duration-300" />
            {date && (
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500 mb-1 block">{date}</span>
            )}
            {title && (
                <h4 className="text-lg font-bold text-black dark:text-white mb-2 font-display">{title}</h4>
            )}
            <div className="text-sm text-black/70 dark:text-gray-400 leading-relaxed [&>p]:mb-0">{children}</div>
        </div>
    );
}

// ── Motion & Animation ──────────────────────────

function Marquee({ children }: { children?: ReactNode }) {
    return (
        <div className="my-8 overflow-hidden relative py-4 border-y border-black/10 dark:border-white/10 transition-colors duration-300">
            <div className="flex animate-marquee whitespace-nowrap">
                <span className="mx-8 text-2xl md:text-4xl font-display font-bold text-black/10 dark:text-white/10 uppercase tracking-widest transition-colors duration-300">
                    {children}
                </span>
                <span className="mx-8 text-2xl md:text-4xl font-display font-bold text-black/10 dark:text-white/10 uppercase tracking-widest transition-colors duration-300" aria-hidden="true">
                    {children}
                </span>
                <span className="mx-8 text-2xl md:text-4xl font-display font-bold text-black/10 dark:text-white/10 uppercase tracking-widest transition-colors duration-300" aria-hidden="true">
                    {children}
                </span>
            </div>
        </div>
    );
}

// ── Media ───────────────────────────────────────

function ImageCaption({
    children,
    src,
    alt = '',
    caption,
}: {
    children?: ReactNode;
    src?: string;
    alt?: string;
    caption?: string;
}) {
    const captionText = caption || (typeof children === 'string' ? children : null);
    return (
        <figure className="my-8 group">
            {src && (
                <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                    <img
                        src={src}
                        alt={alt || captionText || ''}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 !my-0"
                    />
                </div>
            )}
            {captionText && (
                <figcaption className="mt-3 text-center text-sm text-black/50 dark:text-white/50 italic transition-colors duration-300">{captionText}</figcaption>
            )}
        </figure>
    );
}

// ── Section Wrapper ─────────────────────────────

function Section({
    children,
    bg = 'default',
}: {
    children?: ReactNode;
    bg?: string;
}) {
    const bgMap: Record<string, string> = {
        default: '',
        muted: 'bg-black/[0.02] dark:bg-white/[0.02] -mx-4 px-4 py-8 rounded-2xl',
        dark: 'bg-black dark:bg-white text-white dark:text-dark-950 -mx-4 px-8 py-10 rounded-2xl [&_*]:!text-inherit',
        accent: 'bg-primary-500/5 dark:bg-primary-400/5 -mx-4 px-8 py-10 rounded-2xl border border-primary-500/10',
    };
    return (
        <div className={`my-8 transition-colors duration-300 ${bgMap[bg] || bgMap.default}`}>
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════════
   Component Registry (exported for the editor guide)
   ══════════════════════════════════════════════ */

export interface ComponentMeta {
    name: string;
    description: string;
    snippet: string;
    category: string;
}

export const CUSTOM_COMPONENTS: ComponentMeta[] = [
    // Text & Emphasis
    {
        name: 'Highlight',
        description: 'Inline emphasis with gradient background',
        snippet: '<Highlight>Your text here</Highlight>',
        category: 'Text',
    },
    {
        name: 'GradientText',
        description: 'Text with custom gradient colors',
        snippet: '<GradientText from="#6366f1" to="#ec4899">Bold gradient text</GradientText>',
        category: 'Text',
    },
    {
        name: 'Badge',
        description: 'Pill label (primary/blue/green/amber/red/purple)',
        snippet: '<Badge color="blue">Label</Badge>',
        category: 'Text',
    },
    // Blocks
    {
        name: 'CalloutBox',
        description: 'Info / warning / tip / caution card',
        snippet: '<CalloutBox type="info" title="Title">Content here</CalloutBox>',
        category: 'Blocks',
    },
    {
        name: 'FeatureCard',
        description: 'Icon + title + description card',
        snippet: '<FeatureCard icon="🚀" title="Feature Name">Description of feature</FeatureCard>',
        category: 'Blocks',
    },
    {
        name: 'Testimonial',
        description: 'Quote card with author info',
        snippet: '<Testimonial author="John Doe" role="CEO">Amazing work that exceeded our expectations.</Testimonial>',
        category: 'Blocks',
    },
    {
        name: 'Accordion',
        description: 'Collapsible content section',
        snippet: '<Accordion title="Click to expand">Hidden content goes here</Accordion>',
        category: 'Blocks',
    },
    {
        name: 'Section',
        description: 'Background wrapper (default/muted/dark/accent)',
        snippet: '<Section bg="muted">Content inside a styled section</Section>',
        category: 'Blocks',
    },
    // Actions
    {
        name: 'Button',
        description: 'CTA button (primary/outline/ghost)',
        snippet: '<Button href="/contact" variant="primary">Get Started</Button>',
        category: 'Actions',
    },
    // Layout
    {
        name: 'Grid',
        description: 'Responsive grid (2–4 columns)',
        snippet: '<Grid cols="3">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</Grid>',
        category: 'Layout',
    },
    {
        name: 'Columns',
        description: 'Side-by-side two-column layout',
        snippet: '<Columns>\n  <div>Left column content</div>\n  <div>Right column content</div>\n</Columns>',
        category: 'Layout',
    },
    {
        name: 'Spacer',
        description: 'Vertical spacing (xs/sm/md/lg/xl)',
        snippet: '<Spacer size="md" />',
        category: 'Layout',
    },
    {
        name: 'Divider',
        description: 'Horizontal rule with optional label',
        snippet: '<Divider label="Section Name" />',
        category: 'Layout',
    },
    // Data & Stats
    {
        name: 'StatCard',
        description: 'Metric card with value and label',
        snippet: '<StatCard value="99%" label="Satisfaction">99%</StatCard>',
        category: 'Data',
    },
    {
        name: 'Timeline',
        description: 'Timeline entry with date and title',
        snippet: '<Timeline date="2024" title="Milestone">Description of the event</Timeline>',
        category: 'Data',
    },
    // Motion
    {
        name: 'Marquee',
        description: 'Animated scrolling text banner',
        snippet: '<Marquee>Your scrolling text</Marquee>',
        category: 'Motion',
    },
    // Media
    {
        name: 'ImageCaption',
        description: 'Image with caption overlay',
        snippet: '<ImageCaption src="https://example.com/image.jpg" alt="description" caption="Photo caption" />',
        category: 'Media',
    },
];

/* ══════════════════════════════════════════════
   react-markdown component map
   ══════════════════════════════════════════════ */

const componentMap: Components = {
    highlight: Highlight as any,
    gradienttext: GradientText as any,
    badge: Badge as any,
    calloutbox: CalloutBox as any,
    featurecard: FeatureCard as any,
    testimonial: Testimonial as any,
    accordion: Accordion as any,
    section: Section as any,
    button: Button as any,
    grid: Grid as any,
    columns: Columns as any,
    spacer: Spacer as any,
    divider: Divider as any,
    statcard: StatCard as any,
    timeline: Timeline as any,
    marquee: Marquee as any,
    imagecaption: ImageCaption as any,
};

/* ══════════════════════════════════════════════
   rehype-sanitize schema
   ══════════════════════════════════════════════ */

const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'highlight',
        'gradienttext',
        'badge',
        'calloutbox',
        'featurecard',
        'testimonial',
        'accordion',
        'section',
        'button',
        'grid',
        'columns',
        'spacer',
        'divider',
        'statcard',
        'timeline',
        'marquee',
        'imagecaption',
    ],
    attributes: {
        ...defaultSchema.attributes,
        // Custom component attributes
        gradienttext: ['from', 'to'],
        badge: ['color'],
        calloutbox: ['type', 'title'],
        featurecard: ['title', 'icon'],
        testimonial: ['author', 'role', 'avatar'],
        accordion: ['title'],
        section: ['bg'],
        button: ['href', 'variant'],
        grid: ['cols'],
        spacer: ['size'],
        divider: ['label'],
        statcard: ['value', 'label'],
        timeline: ['date', 'title'],
        imagecaption: ['src', 'alt', 'caption'],
        // Keep code/pre highlighting classes
        code: ['className'],
        span: ['className'],
    },
};

/* ══════════════════════════════════════════════
   Content Preprocessor
   Fixes HTML parsing issues so authors can write
   content naturally without worrying about HTML5 rules.
   ══════════════════════════════════════════════ */

const CUSTOM_TAG_NAMES = [
    'Highlight', 'GradientText', 'Badge',
    'CalloutBox', 'FeatureCard', 'Testimonial', 'Accordion', 'Section',
    'Button',
    'Grid', 'Columns', 'Spacer', 'Divider',
    'StatCard', 'Timeline',
    'Marquee',
    'ImageCaption',
];

function preprocessContent(raw: string): string {
    let content = raw;

    // 1. Convert self-closing custom tags to paired open+close tags.
    //    HTML5 only allows void elements (br, img, hr, etc.) to self-close.
    //    <Spacer size="md" />  →  <Spacer size="md"></Spacer>
    const tagPattern = CUSTOM_TAG_NAMES.join('|');
    const selfClosingRe = new RegExp(
        `<(${tagPattern})(\\s[^>]*?)?\\s*/>`,
        'gi',
    );
    content = content.replace(selfClosingRe, (_, tag, attrs) => {
        return `<${tag}${attrs || ''}></${tag}>`;
    });

    // 2. Ensure block-level custom tags have blank lines around them
    //    so that the Markdown parser treats them as HTML blocks.
    const blockTags = [
        'Section', 'Grid', 'Columns', 'Spacer', 'Divider',
        'CalloutBox', 'FeatureCard', 'Testimonial', 'Accordion',
        'StatCard', 'Timeline', 'Marquee', 'ImageCaption', 'Button',
    ];
    const blockPattern = blockTags.join('|');

    // Add blank line BEFORE opening block tags (if not already preceded by one)
    content = content.replace(
        new RegExp(`([^\n])\n?(<(?:${blockPattern})(?:\\s|>))`, 'gi'),
        '$1\n\n$2',
    );

    // Add blank line AFTER closing block tags (if not already followed by one)
    content = content.replace(
        new RegExp(`(<\/(?:${blockPattern})>)\n?([^\n])`, 'gi'),
        '$1\n\n$2',
    );

    // Add blank line AFTER paired self-close expansions (e.g. <Spacer></Spacer>)
    content = content.replace(
        new RegExp(`(<(?:${blockPattern})[^>]*><\/(?:${blockPattern})>)\n?([^\n])`, 'gi'),
        '$1\n\n$2',
    );

    return content;
}

/* ══════════════════════════════════════════════
   ComponentRenderer
   ══════════════════════════════════════════════ */

export default function ComponentRenderer({
    content,
    className = '',
}: {
    content: string;
    className?: string;
}) {
    if (!content) return null;

    console.log("Raw Markdown Content:", JSON.stringify(content));
    const processed = preprocessContent(content);
    console.log("Processed Content:", JSON.stringify(processed));

    return (
        <article
            className={`prose prose-lg max-w-none 
                prose-headings:font-display prose-headings:font-bold 
                prose-headings:text-black dark:prose-headings:text-white
                prose-p:text-black/80 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-primary-500 prose-a:no-underline hover:prose-a:text-primary-600 dark:prose-a:text-primary-400 dark:hover:prose-a:text-primary-300 hover:prose-a:underline
                prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
                prose-code:text-primary-600 dark:prose-code:text-primary-300 prose-code:bg-black/5 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-gray-100 dark:prose-pre:bg-dark-900 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10
                prose-img:rounded-xl prose-img:border prose-img:border-black/10 dark:prose-img:border-white/10 prose-img:shadow-lg
                prose-li:text-black/80 dark:prose-li:text-gray-300
                prose-ul:text-black/80 dark:prose-ul:text-gray-300
                prose-ol:text-black/80 dark:prose-ol:text-gray-300
                transition-colors duration-300
                ${className}`}
        >
            <ReactMarkdown
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, sanitizeSchema],
                    rehypeHighlight,
                ]}
                components={componentMap}
            >
                {processed}
            </ReactMarkdown>
        </article>
    );
}

