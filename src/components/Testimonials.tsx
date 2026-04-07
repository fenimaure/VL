import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Quote } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
}

/* ═══════════════════════════════════════
   Floating Testimonial Card
   Each card floats with its own parallax
   ═══════════════════════════════════════ */
function FloatingCard({
  testimonial,
  index,
  scrollYProgress,
  variant,
}: {
  testimonial: Testimonial;
  index: number;
  scrollYProgress: any;
  variant: 'hero' | 'float-left' | 'float-right' | 'standard';
}) {
  // Each card gets a unique parallax speed
  const speeds: Record<string, [number, number]> = {
    'hero': [0, -60],
    'float-left': [0, -40 - index * 15],
    'float-right': [0, -30 - index * 10],
    'standard': [0, -20 - index * 8],
  };
  const y = useTransform(scrollYProgress, [0, 1], speeds[variant] || [0, -30]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, variant === 'float-left' ? -2 : variant === 'float-right' ? 2 : 0]);

  if (variant === 'hero') {
    return (
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20"
      >
        <div className="relative p-10 md:p-14 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/8 shadow-2xl shadow-black/[0.06] dark:shadow-black/40 max-w-3xl mx-auto">
          {/* Giant quote mark */}
          <Quote className="h-16 w-16 text-primary-500/15 mb-6 -ml-2" strokeWidth={1} />

          {/* Content */}
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-[1.25] tracking-tight text-black dark:text-white mb-10">
            "{testimonial.content}"
          </blockquote>

          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < (testimonial.rating || 5) ? 'fill-primary-500 text-primary-500' : 'text-black/10 dark:text-white/10'}`}
                strokeWidth={0}
                fill="currentColor"
              />
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-black/5 dark:border-white/10 ring-4 ring-primary-500/10">
              <img
                src={testimonial.image_url}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-base font-bold tracking-tight text-black dark:text-white">{testimonial.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 dark:text-white/30 mt-0.5">
                {testimonial.role}
              </p>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden rounded-tr-3xl">
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary-500/15 rounded-tr-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Floating satellite cards
  return (
    <motion.div
      style={{ y, rotate }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="group relative p-7 md:p-8 rounded-2xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/5 dark:border-white/8 shadow-lg shadow-black/[0.03] dark:shadow-black/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-700">
        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 ${i < (testimonial.rating || 5) ? 'fill-primary-500/70 text-primary-500/70' : 'text-black/8 dark:text-white/8'}`}
              strokeWidth={0}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-sm md:text-base font-light leading-relaxed text-black/70 dark:text-white/60 mb-6 line-clamp-4">
          "{testimonial.content}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-black/5 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
            <img
              src={testimonial.image_url}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-black dark:text-white">{testimonial.name}</h4>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/25 dark:text-white/25">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Parallax for decorative elements
  const orbY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.04, 0.04, 0]);
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Split: first = hero, rest = floating
  const heroTestimonial = testimonials[0] || null;
  const floatingLeft = testimonials.slice(1).filter((_, i) => i % 2 === 0);
  const floatingRight = testimonials.slice(1).filter((_, i) => i % 2 !== 0);

  if ((loading && testimonials.length === 0) || testimonials.length === 0) return null;



  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-40 md:py-56 overflow-hidden bg-white dark:bg-black transition-colors duration-500"
    >
      {/* ── Decorative floating orbs ── */}
      <motion.div
        style={{ y: orbY }}
        className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary-500/[0.04] blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ y: orbY2 }}
        className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-primary-500/[0.04] blur-[100px] pointer-events-none"
      />

      {/* ── Subtle dot grid texture ── */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </motion.div>

      {/* ── Large decorative quote mark ── */}
      <div className="absolute top-20 right-[10%] pointer-events-none select-none hidden lg:block">
        <motion.div
          style={{ y: quoteY }}
        >
          <Quote className="h-64 w-64 text-black/[0.015] dark:text-white/[0.03] -rotate-12" strokeWidth={0.5} />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-16 h-[1px] bg-primary-500" />
            <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">
              Testimonials
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.9] tracking-tighter text-black dark:text-white"
          >
            Words that<br />
            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Resonate.</span>
          </motion.h2>
        </div>

        {/* ── Floating Layered Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">

          {/* Left column — floating cards */}
          <div className="lg:col-span-3 space-y-6 lg:pt-20">
            {floatingLeft.slice(0, 2).map((t, i) => (
              <FloatingCard
                key={t.id}
                testimonial={t}
                index={i}
                scrollYProgress={scrollYProgress}
                variant="float-left"
              />
            ))}
          </div>

          {/* Center — Hero testimonial (large featured) */}
          <div className="lg:col-span-6">
            <FloatingCard
              testimonial={heroTestimonial}
              index={0}
              scrollYProgress={scrollYProgress}
              variant="hero"
            />

            {/* Extra floating cards below hero on mobile, or additional ones */}
            {floatingLeft.length > 2 && (
              <div className="mt-6 lg:hidden">
                {floatingLeft.slice(2).map((t, i) => (
                  <div key={t.id} className="mb-6">
                    <FloatingCard
                      testimonial={t}
                      index={i + 2}
                      scrollYProgress={scrollYProgress}
                      variant="standard"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — floating cards */}
          <div className="lg:col-span-3 space-y-6 lg:pt-40">
            {floatingRight.slice(0, 2).map((t, i) => (
              <FloatingCard
                key={t.id}
                testimonial={t}
                index={i}
                scrollYProgress={scrollYProgress}
                variant="float-right"
              />
            ))}
          </div>
        </div>

        {/* ── Additional row for remaining testimonials (if many) ── */}
        {(floatingLeft.length > 2 || floatingRight.length > 2) && (
          <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
            {[...floatingLeft.slice(2), ...floatingRight.slice(2)].map((t, i) => (
              <FloatingCard
                key={t.id}
                testimonial={t}
                index={i + 4}
                scrollYProgress={scrollYProgress}
                variant="standard"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
