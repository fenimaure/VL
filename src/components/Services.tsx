
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  color_theme: string;
  slug: string;
  tags?: string[];
}

// Palette of subtle background colors per card (cycles)
const CARD_COLORS = [
  { bg: 'bg-white dark:bg-zinc-900', accent: 'bg-violet-100 dark:bg-violet-900/30' },
  { bg: 'bg-gray-50 dark:bg-zinc-950', accent: 'bg-rose-100 dark:bg-rose-900/30' },
  { bg: 'bg-white dark:bg-zinc-900', accent: 'bg-sky-100 dark:bg-sky-900/30' },
  { bg: 'bg-gray-50 dark:bg-zinc-950', accent: 'bg-amber-100 dark:bg-amber-900/30' },
  { bg: 'bg-white dark:bg-zinc-900', accent: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { bg: 'bg-gray-50 dark:bg-zinc-950', accent: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-40 bg-white dark:bg-dark-950 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="services" className="bg-white dark:bg-dark-950 transition-colors duration-500">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 dark:bg-white/10 text-primary-500 dark:text-white">
            <Zap className="w-4 h-4 fill-current" />
          </span>
          <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
            Our Capabilities
          </span>
        </div>

        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.9] tracking-tighter mb-6 transition-colors duration-300">
          <span className="block text-black dark:text-white">Expert</span>
          <span className="block text-stroke-light dark:text-stroke-white italic font-light font-serif translate-x-4">
            Solutions
          </span>
        </h2>

        <p className="text-xl text-black/50 dark:text-gray-400 max-w-xl font-light leading-relaxed border-l-2 border-primary-500/30 pl-6">
          We architect digital ecosystems that blend{' '}
          <span className="text-black dark:text-white font-medium">high-performance utility</span>{' '}
          with <span className="text-black dark:text-white font-medium">breathtaking aesthetics</span>.
        </p>
      </div>

      {/* Stacking Cards */}
      <div ref={containerRef} className="relative">
        {services.map((service, index) => (
          <StackingServiceCard
            key={service.id}
            service={service}
            index={index}
            colors={CARD_COLORS[index % CARD_COLORS.length]}
            onClick={() => navigate(`/services/${service.slug}`)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-24" />
    </section>
  );
}

// Individual stacking card with scroll-driven sticky + scale-out effect
function StackingServiceCard({
  service,
  index,
  colors,
  onClick,
  isMobile,
}: {
  service: Service;
  index: number;
  colors: { bg: string; accent: string };
  onClick: () => void;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start', 'end start'],
  });

  // Focal Scale Effect: 
  // 1. Approaching: 0.95 -> 1.05
  // 2. Active/At top: 1.05
  // 3. Leaving/Scrolled past: 1.05 -> 0.9 (and fade)
  const scale = useTransform(scrollYProgress,
    [0, 0.45, 0.55, 1],
    [0.92, 1.05, 1.05, 0.9]
  );

  const opacity = useTransform(scrollYProgress,
    [0, 0.4, 0.5, 0.8, 1],
    [0, 1, 1, 0.8, 0]
  );

  const y = useTransform(scrollYProgress, [0.5, 1], ['0%', '-10%']);
  const filter = useTransform(scrollYProgress, [0.7, 1], ['blur(0px)', 'blur(8px)']);

  // Parse tags from description or use icon_name as tag hint
  const tags = parseTags(service);

  // Top offset so cards stack — each card is sticky a bit lower than the previous
  const stickyTop = 80 + index * 20;

  // On mobile: plain relative layout, no scroll effects
  if (isMobile) {
    return (
      <div ref={ref} className="relative" style={{ zIndex: 10 + index }}>
        <div className="mx-auto max-w-6xl px-4 pb-6">
          {/* Card */}
          <div
            onClick={onClick}
            className={`
              group relative flex flex-col gap-0 rounded-[2rem] overflow-hidden cursor-pointer
              border border-black/5 dark:border-white/5
              shadow-xl shadow-black/5 dark:shadow-black/30
              transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/50
              ${colors.bg}
            `}
          >
            {/* Left Content */}
            <div className="flex-1 p-8 flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs font-bold tracking-widest text-black/20 dark:text-white/20">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black font-display leading-[1] tracking-tighter text-black dark:text-white mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 bg-white/60 dark:bg-white/5 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-base text-black/60 dark:text-gray-400 leading-relaxed font-light line-clamp-3">
                  {stripMarkdown(service.description)}
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white font-semibold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group/btn"
                >
                  Find out more
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            {/* Right Visual */}
            <div className={`relative min-h-[220px] flex items-center justify-center overflow-hidden ${colors.accent}`}>
              {service.icon_url ? (
                <div className="relative w-full h-full">
                  {isVideoUrl(service.icon_url) ? (
                    <video
                      src={getRawMediaUrl(service.icon_url)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getRawMediaUrl(service.icon_url)}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 dark:to-black/10" />
                </div>
              ) : (
                <div className="relative flex items-center justify-center w-full h-full p-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-white/30 dark:bg-white/5 blur-xl" />
                  </div>
                  <div className="relative flex flex-col items-center gap-4">
                    <span className="text-[80px] font-black font-display leading-none text-black/10 dark:text-white/10 select-none">
                      {service.title.charAt(0)}
                    </span>
                    <div className="flex gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${stickyTop}px`, zIndex: 10 + index }}
    >
      <motion.div
        style={{ scale, opacity, y, filter }}
        className="mx-auto max-w-6xl px-4 md:px-6 pb-6"
      >
        {/* Card */}
        <div
          onClick={onClick}
          className={`
            group relative flex flex-col md:flex-row gap-0 rounded-[2rem] overflow-hidden cursor-pointer
            border border-black/5 dark:border-white/5
            shadow-xl shadow-black/5 dark:shadow-black/30
            transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/50
            ${colors.bg}
          `}
        >
          {/* Left Content */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-between min-h-[400px] md:min-h-[480px]">
            {/* Index tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-xs font-bold tracking-widest text-black/20 dark:text-white/20">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10" />
            </div>

            {/* Title */}
            <div className="flex-1">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black font-display leading-[1] tracking-tighter text-black dark:text-white mb-8 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {service.title}
              </h3>

              {/* Tags / Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 bg-white/60 dark:bg-white/5 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-black/60 dark:text-gray-400 leading-relaxed font-light max-w-md line-clamp-3">
                {stripMarkdown(service.description)}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 text-black dark:text-white font-semibold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group/btn"
              >
                Find out more
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative md:w-[45%] min-h-[300px] md:min-h-0 flex items-center justify-center overflow-hidden ${colors.accent}`}>
            {service.icon_url ? (
              <div className="relative w-full h-full">
                {isVideoUrl(service.icon_url) ? (
                  <video
                    src={getRawMediaUrl(service.icon_url)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={getRawMediaUrl(service.icon_url)}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {/* Soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 dark:to-black/10" />
              </div>
            ) : (
              /* Decorative placeholder with service initials */
              <div className="relative flex items-center justify-center w-full h-full p-12">
                {/* Geometric shapes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-white/30 dark:bg-white/5 blur-xl" />
                </div>
                <div className="relative flex flex-col items-center gap-4">
                  <span className="text-[120px] font-black font-display leading-none text-black/10 dark:text-white/10 select-none">
                    {service.title.charAt(0)}
                  </span>
                  {/* Decorative blocks inspired by reference */}
                  <div className="flex gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 group-hover:scale-110 transition-transform duration-500"
                        style={{ transitionDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Strip video:: / image:: prefix to get actual src URL
function getRawMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('video::') || url.startsWith('image::')) return url.slice(7);
  return url;
}

// Detect video from URL or explicit prefix
function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('video::')) return true;
  if (url.startsWith('image::')) return false;
  const lower = url.toLowerCase();
  if (/\.(mp4|webm|mov|ogg|avi)([?#]|$)/i.test(lower)) return true;
  // Pexels video patterns
  if (lower.includes('pexels.com/download/video') || lower.includes('pexels.com/video')) return true;
  return false;
}

// Extract tags from service data
function parseTags(service: Service): string[] {
  // Priority 1: tags encoded in icon_name as "tags:Tag1,Tag2,..."
  if (service.icon_name?.startsWith('tags:')) {
    return service.icon_name.slice(5).split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);
  }

  // Priority 2: derive from icon_name or title as fallback hints
  const name = (service.icon_name || service.title).toLowerCase();
  const map: Record<string, string[]> = {
    web: ['Web Design', 'Development', 'Responsive'],
    design: ['UI/UX Design', 'Branding', 'Visual Identity'],
    seo: ['SEO', 'Analytics', 'Growth'],
    mobile: ['iOS', 'Android', 'React Native'],
    marketing: ['Social Media', 'Content', 'Strategy'],
    brand: ['Brand Strategy', 'Identity', 'Tone of voice'],
    ecommerce: ['E-Commerce', 'Shopify', 'Conversion'],
  };

  for (const [key, tags] of Object.entries(map)) {
    if (name.includes(key)) return tags;
  }

  return [service.title, 'Strategy', 'Execution'];
}

// Strip basic markdown for plain text preview
function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}
