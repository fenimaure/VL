import { useEffect, useState, useRef } from 'react';
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    useSpring,
    useMotionTemplate,
    useVelocity,
} from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import MagneticHover from '../components/MagneticHover';
import ScrollReveal from '../components/ScrollReveal';
import {
    Users, Target, Heart, Award,
    ArrowRight,
} from 'lucide-react';
import ClientLogos from '../components/ClientLogos';

interface AboutSection {
    content: string;
    image_url: string;
    items: any[];
    title: string;
    subtitle: string;
    media_type?: string;
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT PAGE — Phase 1 + Phase 2 (Sprint 1 + 2)
   A-1: Cinematic Hero with Bold+Outline Split Typography
   A-2: Scroll-Driven Unblur Transition
   A-3: Scroll-Scrubbed Manifesto
   A-4: Split Narrative Blocks
   A-5: Velocity-Reactive Marquee
   A-17: SEO + JSON-LD Organization Schema
   A-18: Dark Mode Polish
   ═══════════════════════════════════════════════════════════════ */

export default function About() {
    const [data, setData] = useState<Record<string, AboutSection>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                const { data, error } = await supabase.from('about_content').select('*');
                if (error) throw error;
                const map: any = {};
                data?.forEach((item: any) => map[item.section_key] = item);
                setData(map);
            } catch (e) {
                console.error('Error fetching about content:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    // A-17: JSON-LD Organization
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Lovelli",
        "url": window.location.origin,
        "description": "Premium digital boutique crafting award-winning experiences for global brands.",
        "foundingDate": "2014",
        "foundingLocation": { "@type": "Place", "name": "Manila, Philippines" },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "hello@lovelli.com",
            "contactType": "sales"
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-700 relative">
            <SEO
                title="About Us"
                description="We are Lovelli — a Manila-based digital boutique crafting award-winning experiences for global brands since 2014."
                url="/about"
                type="website"
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <ScrollProgressBar />
            <Navbar />

            {/* ACT I: THE HOOK */}
            <CinematicHero data={data} />

            {data.fullscreen_image?.image_url && (
                <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.div initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full h-full">
                            <img src={data.fullscreen_image.image_url} alt="Featured" className="w-full h-full object-cover" loading="lazy" />
                        </motion.div>
                        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                    </div>
                </section>
            )}

            {/* ACT II: THE NARRATIVE */}
            <ManifestoSection data={data} />
            <SplitNarrative data={data} />
            <AboutMarquee />

            {/* ACT III: THE HUMANS */}
            <section id="team" className="py-32 relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-20 right-20 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-3 mb-8">
                                <span className="w-12 h-[1px] bg-primary-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">The Dream Team</span>
                                <span className="w-12 h-[1px] bg-primary-500" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                                {data.team?.title || <>The Minds <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Behind It</span></>}
                            </h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(data.team?.items || []).map((member: any, idx: number) => (
                            <TeamMemberCard key={idx} member={member} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            <FounderSpotlight data={data} />
            <CultureBento data={data} />

            {/* ACT IV: THE PROOF */}
            <OrbitalStats data={data} />
            <ClientLogoSection />
            <TestimonialsWall data={data} />

            {/* ACT V: THE JOURNEY */}
            <TimelineSection data={data} />
            <ValuesCarousel data={data} />



            {/* ACT VI: THE EXIT */}
            <AwardsWall data={data} />
            <FinalCTA />

            <Footer />
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-22: SCROLL PROGRESS BAR
   Thin accent-colored bar at top of page (same as Services S-38)
   ═══════════════════════════════════════════════════════════════ */
function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-primary-500"
            style={{ scaleX: scrollYProgress }}
        />
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-1 + A-2: CINEMATIC HERO
   Bold+Outline split typography (matching Works hero exactly)
   Aurora mesh background · Scroll-driven unblur · Parallax
   ═══════════════════════════════════════════════════════════════ */
function CinematicHero({ data }: { data: Record<string, AboutSection> }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // A-2: Parallax Y for background
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    // A-2: Scroll-driven unblur (30px → 0px)
    const blurRaw = useTransform(scrollYProgress, [0, 0.7], [20, 0]);
    const blurSmooth = useSpring(blurRaw, { stiffness: 100, damping: 30 });
    const blurFilter = useMotionTemplate`blur(${blurSmooth}px)`;

    // A-2: Text scale-up and fade-out on scroll
    const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Parse hero title with **bold** / outline split (matching Hero.tsx pattern)
    const rawTitle = data.hero?.title || '**Smart Solutions** for Modern';
    const boldMatch = rawTitle.match(/\*\*(.*?)\*\*/);
    const boldPart = boldMatch ? boldMatch[1] : rawTitle.split(' ').slice(0, 2).join(' ');
    const outlinePart = boldMatch
        ? rawTitle.replace(/\*\*.*?\*\*/, '').trim()
        : rawTitle.split(' ').slice(2).join(' ') || 'Legacies.';

    const hasMedia = !!data.hero?.image_url;

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* ── L0: Background media with unblur ── */}
            <motion.div
                style={{ y: bgY, filter: hasMedia ? blurFilter : undefined }}
                className="absolute inset-0 z-0 will-change-[filter,transform]"
            >
                {data.hero?.media_type === 'video' ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-110"
                        style={{ filter: 'contrast(1.1) brightness(0.85)' }}
                    >
                        <source src={data.hero.image_url} type="video/mp4" />
                    </video>
                ) : data.hero?.image_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110"
                        style={{
                            backgroundImage: `url(${data.hero.image_url})`,
                            filter: 'contrast(1.1) brightness(0.85)'
                        }}
                    />
                ) : null}
            </motion.div>

            {/* ── L1: Aurora gradient mesh ── */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-gray-500/5 to-transparent animate-spin-slow opacity-30 blur-[100px]" />
                <div
                    className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-bl from-transparent via-gray-400/5 to-transparent animate-spin-slow opacity-30 blur-[100px]"
                    style={{ animationDirection: 'reverse' }}
                />
            </div>

            {/* ── L2: Film grain noise overlay ── */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none opacity-[0.035]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />

            {/* ── L3: Gradient overlays ── */}
            {hasMedia ? (
                <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
            ) : (
                <>
                    <div className="absolute inset-0 z-[3] bg-gradient-to-b from-white/90 via-white/50 to-white dark:from-black/90 dark:via-black/50 dark:to-black transition-colors duration-500" />
                    <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_60%)]" />
                </>
            )}

            {/* ── L4: Content ── */}
            <motion.div
                style={{ scale: textScale, opacity: textOpacity }}
                className="relative z-10 max-w-[90rem] mx-auto px-6 lg:px-8 pt-40 pb-32 w-full"
            >
                <div className="flex flex-col items-center text-center">

                    {/* Section label (matching Works hero exactly) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 mb-12"
                    >
                        <span className="w-12 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
                            About · Est. 2014
                        </span>
                        <span className="w-12 h-[1px] bg-primary-500" />
                    </motion.div>

                    {/* ═══ Bold + Outline Split Title (A-1) ═══ */}
                    <div className="relative mb-16 flex flex-col items-center leading-[0.85]">
                        <h1 className="flex flex-col items-center">
                            <span className="sr-only">{rawTitle.replace(/\*\*/g, '')}</span>

                            {/* Bold Line */}
                            <div className="overflow-hidden">
                                <motion.span
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className={`block text-[clamp(3.5rem,12vw,10rem)] font-black tracking-tighter font-display ${
                                        hasMedia ? 'text-white' : 'text-black dark:text-white'
                                    }`}
                                >
                                    {boldPart}
                                </motion.span>
                            </div>

                            {/* Outline Italic Line */}
                            {outlinePart && (
                                <div className="overflow-hidden">
                                    <motion.span
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                        className={`block text-[clamp(3.5rem,12vw,10rem)] italic font-light font-serif ${
                                            hasMedia ? 'text-stroke-white' : 'text-stroke-light dark:text-stroke-white'
                                        }`}
                                    >
                                        {outlinePart}
                                    </motion.span>
                                </div>
                            )}
                        </h1>
                    </div>

                    {/* Subtitle */}
                    {data.hero?.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-2xl md:text-3xl font-medium max-w-4xl mx-auto mb-6 tracking-wide ${
                                hasMedia ? 'text-primary-300' : 'text-primary-500'
                            }`}
                        >
                            {data.hero.subtitle}
                        </motion.p>
                    )}

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-12 tracking-wide ${
                            hasMedia ? 'text-white/80' : 'text-black/60 dark:text-gray-400'
                        }`}
                    >
                        {data.hero?.content || 'We craft immersive digital experiences that blur the line between utility and art.'}
                    </motion.p>

                    {/* CTA Buttons with MagneticHover */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-8 items-center"
                    >
                        <MagneticHover strength={0.3}>
                            <a
                                href="#team"
                                className={`group relative px-10 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-2xl active:scale-95 flex ${
                                    hasMedia
                                        ? 'bg-white text-black hover:shadow-white/20'
                                        : 'bg-black dark:bg-white text-white dark:text-black hover:shadow-black/20 dark:hover:shadow-white/20'
                                }`}
                            >
                                <span className="font-medium text-lg tracking-wide flex items-center gap-2">
                                    Meet the Team <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                        </MagneticHover>

                        <MagneticHover strength={0.15}>
                            <a
                                href="#story"
                                className={`group flex items-center gap-3 text-lg font-bold uppercase tracking-widest transition-colors duration-500 p-4 rounded-xl ${
                                    hasMedia
                                        ? 'text-white/60 hover:text-white'
                                        : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <span className="w-12 h-[1px] bg-current transition-all duration-500 group-hover:w-20" />
                                Our Story
                            </a>
                        </MagneticHover>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── L5: Scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-10 hidden md:flex items-center gap-4 rotate-90 origin-left z-10"
            >
                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${hasMedia ? 'text-white/30' : 'text-black/30 dark:text-white/30'}`}>
                    Scroll
                </span>
                <div className={`w-20 h-[1px] overflow-hidden ${hasMedia ? 'bg-white/10' : 'bg-black/10 dark:bg-white/10'}`}>
                    <div className="w-full h-full bg-primary-500/50 -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
            </motion.div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-3: SCROLL-SCRUBBED MANIFESTO
   Giant text block where each word fills from dim to full opacity
   as the user scrolls through. 150vh container, sticky inner.
   ═══════════════════════════════════════════════════════════════ */
function ManifestoSection({ data }: { data: Record<string, AboutSection> }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.6", "end 0.4"]
    });

    // Manifesto text — from CMS or fallback
    const manifestoText = data.manifesto?.content ||
        "We don't build websites. We engineer digital gravity. Brands come to us when they can no longer afford to be ignored. We are architects of obsession — crafting every pixel, every interaction, every moment with the precision of people who believe design can change how the world feels about a brand.";

    const words = manifestoText.split(/\s+/).filter(Boolean);

    // Optional parallax background image
    const bgImageUrl = data.manifesto?.image_url;
    const bgParallax = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.08, 0.08, 0]);

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: '150vh' }}
        >
            {/* Optional parallax background image */}
            {bgImageUrl && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ y: bgParallax, opacity: bgOpacity }}
                >
                    <img
                        src={bgImageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </motion.div>
            )}

            {/* Sticky inner container */}
            <div className="sticky top-0 h-screen flex items-center justify-center z-10">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    {/* Section label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 mb-12"
                    >
                        <span className="w-12 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
                            Our Manifesto
                        </span>
                    </motion.div>

                    {/* Manifesto words */}
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-black dark:text-white leading-[1.15] tracking-tight flex flex-wrap gap-x-[0.3em] gap-y-1">
                        {words.map((word, i) => (
                            <ManifestoWord
                                key={i}
                                word={word}
                                index={i}
                                total={words.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </p>
                </div>
            </div>
        </section>
    );
}

/* Individual word with scroll-driven opacity */
function ManifestoWord({
    word,
    index,
    total,
    scrollYProgress,
}: {
    word: string;
    index: number;
    total: number;
    scrollYProgress: any;
}) {
    const start = index / total;
    const end = Math.min(start + 1.5 / total, 1);
    const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);

    return (
        <motion.span
            style={{ opacity }}
            className="inline-block will-change-[opacity] transition-none"
        >
            {word}
        </motion.span>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-4: SPLIT NARRATIVE BLOCKS
   Alternating left-image/right-text story panels with parallax.
   Each block tells a chapter of the agency's origin story.
   ═══════════════════════════════════════════════════════════════ */

const FALLBACK_NARRATIVE = [
    {
        title: 'Our Beginning',
        content: 'It started with a single laptop in a Manila apartment. No office, no team — just a relentless belief that Filipino design could compete on the world stage. The first project was a local café rebrand. The second was an international SaaS platform. The gap between those two taught us everything.',
        image_url: '',
        layout: 'left',
    },
    {
        title: 'The Growth',
        content: 'By year three, we had outgrown the apartment. But we never outgrew the hunger. Every project was a chance to prove that craft trumps convenience, that strategy outlasts trends, and that a boutique team — invested and obsessive — will always outperform the assembly line.',
        image_url: '',
        layout: 'right',
    },
    {
        title: 'Where We Stand',
        content: '150+ projects delivered. 50+ brands transformed. A portfolio that spans continents and industries. But the metric we track most? How many clients come back. The answer: almost all of them. Because we don\'t build for launches — we build for legacies.',
        image_url: '',
        layout: 'left',
    },
];

function SplitNarrative({ data }: { data: Record<string, AboutSection> }) {
    const blocks = (data.split_narrative?.items as any[]) || FALLBACK_NARRATIVE;

    if (blocks.length === 0) return null;

    return (
        <section className="py-32 relative overflow-hidden transition-colors duration-500">
            {/* Ambient gradient mesh */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
                <div className="absolute bottom-1/4 left-0 w-[30rem] h-[30rem] bg-primary-500/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
                                Our Story
                            </span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            How We{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">
                                Got Here
                            </span>
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Narrative Blocks */}
                <div className="space-y-32 md:space-y-40">
                    {blocks.map((block: any, idx: number) => {
                        const isImageLeft = (block.layout || (idx % 2 === 0 ? 'left' : 'right')) === 'left';
                        return (
                            <NarrativeBlock
                                key={idx}
                                block={block}
                                index={idx}
                                isImageLeft={isImageLeft}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function NarrativeBlock({ block, index, isImageLeft }: {
    block: any; index: number; isImageLeft: boolean;
}) {
    const blockRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: blockRef,
        offset: ["start end", "end start"],
    });

    // Parallax for the image
    const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const imageYSpring = useSpring(imageY, { stiffness: 100, damping: 30 });

    const hasImage = !!block.image_url;

    return (
        <div
            ref={blockRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${
                !isImageLeft ? 'md:[direction:rtl]' : ''
            }`}
        >
            {/* Image Side */}
            <ScrollReveal variant="maskReveal" delay={0.1}>
                <div className={`relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden ${!isImageLeft ? 'md:[direction:ltr]' : ''}`}>
                    {hasImage ? (
                        <motion.div
                            style={{ y: imageYSpring }}
                            className="absolute inset-0 will-change-transform"
                        >
                            <img
                                src={block.image_url}
                                alt={block.title || `Chapter ${index + 1}`}
                                className="w-full h-[120%] object-cover"
                                loading="lazy"
                            />
                        </motion.div>
                    ) : (
                        /* Elegant placeholder with chapter number */
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black flex items-center justify-center transition-colors duration-500">
                            <span className="text-[12rem] md:text-[16rem] font-black font-display text-black/[0.04] dark:text-white/[0.04] select-none leading-none">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    )}

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

                    {/* Border treatment */}
                    <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl z-20 pointer-events-none" />
                </div>
            </ScrollReveal>

            {/* Text Side */}
            <ScrollReveal
                variant="slideReveal"
                slideFrom={isImageLeft ? 'right' : 'left'}
                delay={0.2}
            >
                <div className={`${!isImageLeft ? 'md:[direction:ltr]' : ''}`}>
                    {/* Chapter label */}
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
                            Chapter {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Title */}
                    {block.title && (
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-black dark:text-white tracking-tight mb-8 leading-[0.95]">
                            {block.title}
                        </h3>
                    )}

                    {/* Content */}
                    <p className="text-lg md:text-xl font-light leading-relaxed text-black/60 dark:text-white/[0.65] mb-8">
                        {block.content}
                    </p>

                    {/* Optional pull-quote stat */}
                    {block.stat && (
                        <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                            <span className="text-3xl font-bold font-display text-primary-500">{block.stat}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">{block.stat_label || ''}</span>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-5: VELOCITY-REACTIVE MARQUEE
   Horizontal infinite scrolling ticker between narrative and team.
   Words alternate filled/outlined. Speed reacts to scroll velocity.
   Exact pattern from Services.tsx VelocityMarquee (S-2).
   ═══════════════════════════════════════════════════════════════ */

const ABOUT_MARQUEE_WORDS = [
    'STRATEGY', 'DESIGN', 'CRAFT', 'BRANDING', 'EXCELLENCE',
    'DIGITAL', 'GROWTH', 'INNOVATION', 'CULTURE', 'LEGACY',
];

function AboutMarquee() {
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(velocity, { stiffness: 100, damping: 40 });
    const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [3, 1, 3]);
    const x = useRef(0);
    const [tickerX, setTickerX] = useState(0);

    useEffect(() => {
        let animId: number;
        const tick = () => {
            const currentVelocity = velocityFactor.get();
            x.current -= 0.06 * currentVelocity;
            if (x.current <= -50) x.current = 0;
            setTickerX(x.current);
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
    }, [velocityFactor]);

    const tripled = [...ABOUT_MARQUEE_WORDS, ...ABOUT_MARQUEE_WORDS, ...ABOUT_MARQUEE_WORDS];

    return (
        <section className="py-6 border-y border-black/5 dark:border-white/5 overflow-hidden bg-black dark:bg-white transition-colors duration-500">
            <div className="relative flex overflow-hidden">
                <div
                    className="velocity-marquee flex shrink-0"
                    style={{ transform: `translateX(${tickerX}%)` }}
                >
                    {tripled.map((word, i) => (
                        <span
                            key={i}
                            className={`marquee-word text-sm md:text-base font-bold tracking-[0.3em] uppercase whitespace-nowrap mx-8 md:mx-12 cursor-default ${
                                i % 3 === 0
                                    ? 'marquee-word-outlined text-white/60 dark:text-black/60'
                                    : 'text-white/60 dark:text-black/60'
                            }`}
                        >
                            {word}
                            <span className="ml-8 md:ml-12 text-white/20 dark:text-black/20">·</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* Old StatsSection & AnimatedSection removed — replaced by OrbitalStats (A-9) & ScrollReveal */



/* ═══════════════════════════════════════════════════════════════
   A-6: EDITORIAL TEAM ROSTER with 3D Tilt & Video Crossfade
   ═══════════════════════════════════════════════════════════════ */
function TeamMemberCard({ member, index }: { member: any; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isTouch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isTouch || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const rx = ((e.clientY - rect.top - rect.height / 2) / 20).toFixed(2);
        const ry = ((rect.width / 2 - (e.clientX - rect.left)) / 20).toFixed(2);
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) { videoRef.current.play().catch(() => {}); }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (cardRef.current) cardRef.current.style.transform = '';
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group"
            data-cursor="view"
            data-cursor-text="Bio"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 hover:border-primary-500/30 transition-[border-color] duration-500"
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
            >
                {/* Portrait */}
                <img
                    src={member.image || 'https://via.placeholder.com/400x500'}
                    alt={member.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100 grayscale'}`}
                    loading="lazy"
                />

                {/* Video layer */}
                {member.video_url && (
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="none"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <source src={member.video_url} type="video/mp4" />
                    </video>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

                {/* Glassmorphism bio panel */}
                <motion.div
                    initial={false}
                    animate={isHovered || isTouch ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-0 inset-x-0 p-6 z-20 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-t border-white/20"
                >
                    <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60 mb-3">{member.role}</p>
                    {member.stat && (
                        <p className="text-sm text-white/50">{member.stat}</p>
                    )}
                </motion.div>

                {/* Default name (visible when not hovered) */}
                <div className={`absolute bottom-0 inset-x-0 p-6 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{member.role}</p>
                </div>
            </div>
        </motion.div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-7: FOUNDER SPOTLIGHT
   ═══════════════════════════════════════════════════════════════ */
function FounderSpotlight({ data }: { data: Record<string, AboutSection> }) {
    const founder = data.founder;
    const content = founder?.content || "I started this agency because I believed design could change how people feel about a brand. Every pixel, every interaction, every moment should make someone stop and think: 'Whoever made this, cares.'";
    const signatureUrl = founder?.items?.[0]?.signature_url;

    return (
        <section className="py-32 relative overflow-hidden border-y border-black/5 dark:border-white/5 transition-colors duration-500">
            <div className="absolute top-10 left-10 w-[30rem] h-[30rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[25rem] h-[25rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-3 mb-12">
                        <span className="w-12 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">A Letter from Our Founder</span>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
                    <ScrollReveal variant="maskReveal">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden premium-image-treatment">
                            <img
                                src={founder?.image_url || 'https://via.placeholder.com/600x800'}
                                alt="Founder"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="slideReveal" slideFrom="right">
                        <div>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-black dark:text-white tracking-tight mb-8 leading-[0.95]">
                                {founder?.title || "Why We Do What We Do"}
                            </h3>
                            <div className="text-lg md:text-xl font-light leading-relaxed text-black/60 dark:text-white/[0.65] mb-10 space-y-4">
                                {content.split('\n').filter(Boolean).map((p: string, i: number) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                            {signatureUrl && (
                                <img src={signatureUrl} alt="Signature" className="w-48 opacity-70 dark:invert dark:opacity-60 mb-4" loading="lazy" />
                            )}
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                                {founder?.subtitle || 'CEO & Creative Director'}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-8: STUDIO CULTURE BENTO BOX
   ═══════════════════════════════════════════════════════════════ */
function CultureBento({ data }: { data: Record<string, AboutSection> }) {
    const gridRef = useRef<HTMLDivElement>(null);

    const items = (data.culture?.items as any[]) || [
        { type: 'video', label: 'Behind the Scenes', media_url: '' },
        { type: 'location', value: 'Manila, PH', label: 'Where We\'re Based' },
        { type: 'stat', value: '12', label: 'Industry Awards' },
        { type: 'stat', value: '99%', label: 'Client Retention' },
        { type: 'quote', value: 'Good design is invisible. Great design is inevitable.' },
    ];

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        gridRef.current.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
        gridRef.current.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    };

    return (
        <section className="py-32 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Studio Culture</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            More Than{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">An Agency</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div
                    ref={gridRef}
                    onMouseMove={handleMouseMove}
                    className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {items.map((item: any, i: number) => (
                        <ScrollReveal key={i} delay={i * 0.08}>
                            <div className={`bento-cell p-6 md:p-8 flex flex-col justify-end min-h-[200px] ${
                                i === 0 ? 'md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[420px]' :
                                i === items.length - 1 ? 'md:col-span-2' : ''
                            }`}>
                                {item.type === 'video' && item.media_url ? (
                                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 z-0">
                                        <source src={item.media_url} type="video/mp4" />
                                    </video>
                                ) : item.type === 'stat' ? (
                                    <>
                                        <span className="text-5xl md:text-6xl font-bold font-display text-black dark:text-white mb-2">{item.value}</span>
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40">{item.label}</span>
                                    </>
                                ) : item.type === 'quote' ? (
                                    <div>
                                        <span className="text-6xl font-serif text-primary-500/20 leading-none block mb-2">"</span>
                                        <p className="text-xl md:text-2xl font-display font-bold text-black dark:text-white leading-snug italic">{item.value}</p>
                                    </div>
                                ) : item.type === 'location' ? (
                                    <>
                                        <span className="text-3xl mb-2">📍</span>
                                        <span className="text-2xl font-bold font-display text-black dark:text-white">{item.value}</span>
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mt-1">{item.label}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg font-bold text-black dark:text-white">{item.value || item.label}</span>
                                    </>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-9: ORBITAL STATS VISUALIZATION
   ═══════════════════════════════════════════════════════════════ */
function OrbitalStats({ data }: { data: Record<string, AboutSection> }) {
    const stats = (data.about_stats?.items as any[]) || [
        { value: 150, suffix: '+', label: 'Works Delivered' },
        { value: 98, suffix: '%', label: 'Client Satisfaction' },
        { value: 50, suffix: '+', label: 'Global Brands' },
        { value: 10, suffix: '+', label: 'Years Experience' },
    ];

    return (
        <section className="py-32 relative overflow-hidden transition-colors duration-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none animate-pulse-glow" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Proven Results</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            Numbers That{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Speak</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat: any, idx: number) => (
                        <StatCounter key={idx} stat={{ number: stat.value, suffix: stat.suffix, label: stat.label, icon: [Target, Heart, Users, Award][idx] }} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatCounter({ stat, index }: { stat: any; index: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let t0: number | null = null;
            const duration = 2000;
            const step = (ts: number) => {
                if (!t0) t0 = ts;
                const p = Math.min((ts - t0) / duration, 1);
                setCount(Math.round((1 - Math.pow(1 - p, 3)) * stat.number));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
    }, [isInView, stat.number]);

    const Icon = stat.icon;
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-center group"
        >
            {Icon && <Icon className="h-6 w-6 mx-auto mb-4 text-black/20 dark:text-white/20 group-hover:text-primary-500 group-hover:scale-110 transition-all duration-500" />}
            <div className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-3 font-display" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {count}{stat.suffix}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold">{stat.label}</div>
        </motion.div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-10: CLIENT LOGO MARQUEE
   ═══════════════════════════════════════════════════════════════ */
function ClientLogoSection() {
    return (
        <section className="py-16 border-y border-black/5 dark:border-white/5 transition-colors duration-500 overflow-hidden">
            <ClientLogos />
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-11: TESTIMONIALS MASONRY WALL
   ═══════════════════════════════════════════════════════════════ */
const FALLBACK_TESTIMONIALS = [
    { quote: 'Lovelli transformed our entire digital presence. The attention to detail was extraordinary — every interaction felt intentional.', author: 'Maria Santos', role: 'CEO', company: 'TechPH Corp' },
    { quote: 'Working with Lovelli felt like having an in-house creative team that truly understood our vision. They didn\'t just build a website — they built an experience.', author: 'James Chen', role: 'Head of Marketing', company: 'Horizon Labs' },
    { quote: 'The ROI from our rebrand exceeded every projection. Lovelli doesn\'t just design — they engineer outcomes.', author: 'Sarah Kim', role: 'Founder', company: 'Bloom Studio' },
    { quote: 'Three agencies told us what we wanted to hear. Lovelli told us what we needed to hear — and then delivered beyond it.', author: 'David Park', role: 'CTO', company: 'NexGen AI' },
    { quote: 'Premium isn\'t a word I use lightly. But every pixel of our new site earned it.', author: 'Ana Reyes', role: 'Brand Director', company: 'Luxe Holdings' },
];

function TestimonialsWall({ data }: { data: Record<string, AboutSection> }) {
    const testimonials = (data.about_testimonials?.items as any[]) || FALLBACK_TESTIMONIALS;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-32 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">What They Say</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            Client{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Voices</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="masonry-grid">
                    {testimonials.map((t: any, i: number) => (
                        <ScrollReveal key={i} delay={i * 0.08}>
                            <MagneticHover strength={0.1}>
                                <div className="glass-card rounded-2xl p-8 hover:border-primary-500/30 transition-all duration-500 hover:-translate-y-1">
                                    <span className="text-5xl font-serif text-primary-500/10 leading-none block mb-4">"</span>
                                    <p className="text-lg font-light leading-relaxed text-black/70 dark:text-white/[0.75] mb-6">{t.quote}</p>
                                    <div className="flex items-center gap-3">
                                        {t.avatar_url && <img src={t.avatar_url} alt={t.author} className="w-10 h-10 rounded-full object-cover" loading="lazy" />}
                                        <div>
                                            <p className="text-sm font-bold text-black dark:text-white">{t.author}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </MagneticHover>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-12: STACKED SCROLL-DRIVEN TIMELINE
   ═══════════════════════════════════════════════════════════════ */
const FALLBACK_TIMELINE = [
    { year: '2014', title: 'The Beginning', description: 'Started with a laptop and a dream in a Manila apartment.', },
    { year: '2016', title: 'First International Client', description: 'Landed our first overseas project — a complete rebrand for a Singapore fintech.', },
    { year: '2018', title: 'Studio Founded', description: 'Opened our first official studio in Makati with a team of 8.', },
    { year: '2020', title: 'Pivoted to Remote-First', description: 'Built a distributed workflow that unlocked global talent.', },
    { year: '2022', title: '100th Project Milestone', description: 'Delivered 100+ projects across 12 countries.', },
    { year: '2024', title: '50th Brand Partnership', description: 'Celebrated 50 long-term brand relationships worldwide.', },
];

function TimelineSection({ data }: { data: Record<string, AboutSection> }) {
    const items = (data.timeline?.items as any[]) || FALLBACK_TIMELINE;
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section className="py-32 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Our Journey</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            The Road{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">So Far</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div ref={containerRef} className="relative">
                    {/* Timeline line */}
                    <div className="timeline-line">
                        <div className="timeline-line-bg" />
                        <motion.div className="absolute top-0 left-0 right-0 bg-primary-500" style={{ height: lineHeight }} />
                    </div>

                    <div className="space-y-16 md:space-y-24">
                        {items.map((item: any, i: number) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <ScrollReveal key={i} delay={0.1}>
                                    <div className={`relative flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                                        {/* Dot */}
                                        <div className="absolute left-1/2 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary-500 bg-white dark:bg-black z-10 hidden md:block" />

                                        {/* Content */}
                                        <div className={`md:w-[calc(50%-2rem)] ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-10 md:pl-0 w-full`}>
                                            <span className="text-primary-500 font-bold text-sm tracking-widest">{item.year}</span>
                                            <h3 className="text-2xl md:text-3xl font-bold font-display text-black dark:text-white mt-2 mb-3">{item.title}</h3>
                                            <p className="text-base font-light text-black/60 dark:text-white/[0.6]">{item.description}</p>
                                        </div>

                                        {/* Spacer for other side */}
                                        <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                                    </div>
                                </ScrollReveal>
                            );
                        })}

                        {/* Final CTA dot */}
                        <div className="relative flex justify-center">
                            <div className="w-4 h-4 rounded-full border-2 border-dashed border-primary-500/50 bg-transparent z-10 hidden md:block absolute left-1/2 -translate-x-1/2" />
                            <p className="text-sm font-bold uppercase tracking-widest text-primary-500/60 mt-8 md:mt-0 md:absolute md:left-[calc(50%+2rem)] md:top-0">
                                Your story starts here →
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-13: CORE VALUES CAROUSEL
   ═══════════════════════════════════════════════════════════════ */
const FALLBACK_VALUES = [
    { icon: '🎯', title: 'Precision', description: 'Every pixel, every interaction, every line of code — crafted with obsessive detail.' },
    { icon: '🤝', title: 'Partnership', description: 'We don\'t work for clients. We work with them. Shared ownership, shared victories.' },
    { icon: '🔬', title: 'Innovation', description: 'We study what\'s next so our clients never fall behind. Research-led, future-proof.' },
    { icon: '♻️', title: 'Sustainability', description: 'Code that lasts. Designs that scale. Systems that grow with you.' },
    { icon: '💡', title: 'Transparency', description: 'No black boxes. Clear timelines, honest feedback, open communication.' },
];

function ValuesCarousel({ data }: { data: Record<string, AboutSection> }) {
    const values = (data.values?.items as any[]) || FALLBACK_VALUES;
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setActive(prev => (prev + 1) % values.length), 6000);
        return () => clearInterval(timer);
    }, [values.length]);

    return (
        <section className="py-32 relative overflow-hidden border-y border-black/5 dark:border-white/5 transition-colors duration-500">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">What We Believe</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                            Core{' '}
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Values</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="relative overflow-hidden">
                    <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${active * 100}%)` }}>
                        {values.map((v: any, i: number) => (
                            <div key={i} className="min-w-full px-4">
                                <div className="glass-card rounded-2xl p-12 md:p-16 text-center max-w-2xl mx-auto">
                                    <span className="text-5xl block mb-6">{v.icon}</span>
                                    <h3 className="text-3xl md:text-4xl font-bold font-display text-black dark:text-white mb-4">{v.title}</h3>
                                    <p className="text-lg font-light leading-relaxed text-black/60 dark:text-white/[0.6]">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {values.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-primary-500' : 'w-2 bg-black/15 dark:bg-white/15'}`}
                                aria-label={`Value ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}



/* ═══════════════════════════════════════════════════════════════
   A-15: AWARDS & RECOGNITION WALL
   ═══════════════════════════════════════════════════════════════ */
function AwardsWall({ data }: { data: Record<string, AboutSection> }) {
    const awards = (data.awards?.items as any[]) || [];
    if (awards.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Recognition</span>
                            <span className="w-12 h-[1px] bg-primary-500" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white font-display tracking-tight">Awards</h2>
                    </div>
                </ScrollReveal>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-snap-x-mandatory pb-4">
                    {awards.map((award: any, i: number) => (
                        <MagneticHover key={i} strength={0.15}>
                            <div className="glass-card rounded-2xl p-8 text-center min-w-[200px] snap-center flex-shrink-0">
                                <span className="text-3xl block mb-3">🏆</span>
                                <h3 className="text-sm font-bold text-black dark:text-white mb-1">{award.title}</h3>
                                <p className="text-xs text-black/40 dark:text-white/40">{award.organization} · {award.year}</p>
                            </div>
                        </MagneticHover>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════
   A-16: FINAL CTA — "Start a Dialogue"
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
    return (
        <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
            {/* Ambient gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_60%)]" />

            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-3 mb-12">
                        <span className="w-12 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Ready?</span>
                        <span className="w-12 h-[1px] bg-primary-500" />
                    </div>

                    <h2 className="flex flex-col items-center leading-[0.85] mb-12">
                        <span className="block text-[clamp(2.5rem,8vw,7rem)] font-black tracking-tighter text-white font-display">
                            Let's build something
                        </span>
                        <span className="block text-[clamp(2.5rem,8vw,7rem)] text-stroke-white italic font-light font-serif">
                            Extraordinary.
                        </span>
                    </h2>

                    <MagneticHover strength={0.3}>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-white text-black font-bold text-lg tracking-wide hover:bg-primary-500 hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20 active:scale-95"
                            data-cursor="view"
                            data-cursor-text="Go"
                        >
                            Start a Dialogue <ArrowRight className="w-5 h-5" />
                        </a>
                    </MagneticHover>

                    <p className="mt-10 text-sm text-white/30 font-light">
                        Join 50+ brands that chose craft over commodity.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

