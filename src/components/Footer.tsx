import { useEffect, useState, useRef } from 'react';
import { Linkedin, Facebook, Instagram, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { TikTokIcon, XIcon } from './icons/SocialIcons';
import { supabase } from '../lib/supabase';
import { useSmoothScroll } from './SmoothScroll';

export default function Footer() {
  const { links } = useSiteConfig();
  const { scrollTo } = useSmoothScroll();
  const [logoUrl, setLogoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const footerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: '-10%' });

  const contactEmail = links.contact_email || 'hello@lovelli.com';

  // Fetch logo
  useEffect(() => {
    async function fetchLogo() {
      try {
        const { data } = await supabase
          .from('about_content')
          .select('image_url')
          .eq('section_key', 'site_settings')
          .single();
        if (data?.image_url) setLogoUrl(data.image_url);
      } catch (e) { /* fallback */ }
    }
    fetchLogo();
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const socialLinks = [
    { Icon: Instagram, href: links.instagram_url || '#', label: 'Instagram' },
    { Icon: Linkedin, href: links.linkedin_url || '#', label: 'LinkedIn' },
    { Icon: XIcon, href: links.twitter_url || '#', label: 'X' },
    { Icon: Facebook, href: links.facebook_url || '#', label: 'Facebook' },
    { Icon: TikTokIcon, href: links.tiktok_url || '#', label: 'TikTok' },
  ];

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Work', to: '/works' },
    { label: 'Careers', to: '/careers' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-700 mt-20"
    >
      {/* ═══════════════════════════════════════════════════════════
         SECTION 1: EPIC CTA — "Let's make it Happen"
         Scroll-reveal with editorial animation
         ═══════════════════════════════════════════════════════════ */}
      <div className="border-t border-black/5 dark:border-white/5" />
      <div ref={ctaRef} className="relative pt-32 pb-40">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-[200px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/contact" className="block group">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 mb-12"
            >
              <span className="w-12 h-[1px] bg-black dark:bg-white group-hover:w-24 transition-all duration-700" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black dark:text-white">
                Get Started
              </span>
            </motion.div>

            {/* Giant headline */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-display leading-[0.8] tracking-tighter">
                {['Let\'s', 'make', 'it'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block mr-[0.2em]"
                  >
                    {word}{' '}
                  </motion.span>
                ))}
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 60 }}
                  animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-stroke-light dark:text-stroke-white italic font-light font-serif inline-block group-hover:skew-x-[-3deg] transition-transform duration-700"
                >
                  Happen
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isCtaInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-black dark:text-white inline-block"
                >
                  .
                </motion.span>
              </h2>

              {/* Magnetic circle button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isCtaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-32 h-32 md:w-40 md:h-40 shrink-0"
              >
                <div className="w-full h-full rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent group-hover:bg-black dark:group-hover:bg-white group-hover:border-black dark:group-hover:border-white transition-all duration-700 group-hover:scale-90">
                  <ArrowUpRight className="h-12 w-12 md:h-16 md:w-16 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-500 group-hover:rotate-45 transform" />
                </div>
              </motion.div>
            </div>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 2: INFINITE MARQUEE — Scroll-driven speed
         ═══════════════════════════════════════════════════════════ */}
      <div className="border-t border-black/5 dark:border-white/5 py-6 overflow-hidden">
        <motion.div
          style={{ x: marqueeX }}
          className="flex whitespace-nowrap"
        >
          {[...Array(4)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0">
              {['DESIGN', '·', 'STRATEGY', '·', 'BRANDING', '·', 'DIGITAL', '·', 'GROWTH', '·', 'EXCELLENCE', '·'].map((word, i) => (
                <span
                  key={`${setIdx}-${i}`}
                  className={`text-[clamp(0.7rem,1vw,0.85rem)] font-bold tracking-[0.4em] uppercase mx-4 md:mx-6 ${
                    word === '·' ? 'text-black/10 dark:text-white/10' : 'text-black/20 dark:text-white/20'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 3: MAIN FOOTER GRID
         Logo + Mission | Navigation | Contact + Clock
         ═══════════════════════════════════════════════════════════ */}
      <div className="border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-12">

            {/* ── COL 1: Logo + Mission Statement ── */}
            <div className="lg:col-span-5 space-y-10">
              {/* Logo */}
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Lovelli"
                    className="h-12 w-12 object-contain dark:invert transition-all duration-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-black font-black font-display text-lg">L</span>
                  </div>
                )}
                <div>
                  <span className="text-xl font-black font-display tracking-tight">Lovelli</span>
                  <span className="text-xl font-serif italic font-light text-stroke-light dark:text-stroke-white ml-1">Services</span>
                </div>
              </div>

              {/* Mission text */}
              <p className="text-base md:text-lg font-light leading-[1.9] text-black/50 dark:text-white/50 max-w-md transition-colors duration-500">
                With years of experience in the Philippine digital marketing landscape, our team combines exceptional skill, unwavering commitment, and a history of creative innovation. At Lovelli Services, we deliver results that not only meet but exceed global standards.
              </p>

              {/* Social row */}
              <div className="flex items-center gap-5">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2.5 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-all duration-500"
                    aria-label={label}
                  >
                    <Icon className="h-[18px] w-[18px] relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    {/* Hover glow dot */}
                    <div className="absolute inset-0 bg-black/[0.03] dark:bg-white/[0.03] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── COL 2: Navigation ── */}
            <div className="lg:col-span-3 lg:pl-8">
              <span className="footer-section-label">Navigation</span>
              <ul className="space-y-5">
                {navItems.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group inline-flex items-center gap-3 text-lg font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-all duration-500"
                    >
                      <span className="w-0 h-[1px] bg-black dark:bg-white group-hover:w-6 transition-all duration-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COL 3: Contact + Live Clock ── */}
            <div className="lg:col-span-4 space-y-12">
              <div>
                <span className="footer-section-label">Say Hello</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="group block text-xl md:text-2xl font-bold text-black dark:text-white hover:text-black/60 dark:hover:text-white/60 transition-colors duration-500 mb-4"
                >
                  <span className="relative">
                    {contactEmail}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black/20 dark:bg-white/20 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-500" />
                  </span>
                </a>
                <p className="text-sm text-black/30 dark:text-white/30 font-light leading-relaxed">
                  Global Reach. Local Attention.
                </p>
              </div>

              {/* Live Clock */}
              <div>
                <span className="footer-section-label">Local Time — Manila</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black font-display tracking-tighter text-black dark:text-white tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {timeString}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 dark:text-white/20">
                    PHT
                  </span>
                </div>
              </div>

              {/* Back to top */}
              <button
                onClick={() => scrollTo(0)}
                className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-all duration-500"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         SECTION 4: GIANT BRAND WATERMARK + LEGAL BAR
         Full-width typographic branding moment
         ═══════════════════════════════════════════════════════════ */}
      <div className="border-t border-black/5 dark:border-white/5">
        {/* Giant brand name watermark */}
        <div className="relative overflow-hidden py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 select-none flex items-center justify-center">
            <span className="text-[clamp(4rem,18vw,16rem)] font-black font-display leading-none tracking-tighter text-black/[0.04] dark:text-white/[0.04]">
              LOVELLI
            </span>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-black/5 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.3em] uppercase text-black/20 dark:text-white/20">
              <div>© {new Date().getFullYear()} Lovelli</div>
              <div className="flex gap-10">
                <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">Terms</a>
                <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-300">Legal</a>
              </div>
              <div className="text-black/10 dark:text-white/10">Crafted with precision</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
