import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Intersection Observer for scroll reveal
  useEffect(() => {
    if (loading || testimonials.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('#testimonials .stagger-item');
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [loading, testimonials]);

  if (loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-40 relative overflow-hidden transition-colors duration-500 bg-white dark:bg-black text-black dark:text-white border-t border-black/5 dark:border-white/5">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Decorative Accents */}
      <div className="absolute top-10 left-10 w-16 h-16 border-l border-t border-black/10 dark:border-white/10 pointer-events-none md:block hidden"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-r border-b border-black/10 dark:border-white/10 pointer-events-none md:block hidden"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-24 stagger-item">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-primary-500"></span>
            <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">Testimonials</span>
          </div>
          <h2 className="text-6xl lg:text-8xl font-bold font-display leading-none tracking-tighter text-black dark:text-white">
            Kind <br />
            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Aura</span><span className="text-primary-500">.</span>
          </h2>
          <p className="mt-8 text-lg text-black/60 dark:text-gray-400 font-light max-w-xl transition-colors duration-300">
            A small selection of words from our global network of creative partners and industry leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className="group relative stagger-item flex flex-col p-8 rounded-[2rem] bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
            >
              {/* Star Rating - Subtle */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < (testimonial.rating || 5) ? 'fill-primary-500 text-primary-500' : 'text-black/10 dark:text-white/10'}`}
                    strokeWidth={0}
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="flex-1 text-lg italic font-light leading-relaxed text-black/80 dark:text-gray-300 mb-8 border-l border-primary-500/20 pl-6 h-full transition-colors duration-300">
                "{testimonial.content}"
              </blockquote>

              {/* Author Pillar */}
              <div className="flex items-center gap-4 mt-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-black/5 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700 ring-2 ring-transparent group-hover:ring-primary-500/20">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold tracking-tight text-black dark:text-white">{testimonial.name}</h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 truncate max-w-[150px]">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Big decorative number in background */}
              <div className="absolute -bottom-4 -right-2 text-[6rem] font-black font-display pointer-events-none opacity-[0.015] text-black dark:text-white select-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Massive Watermark */}
        <div className="absolute -bottom-20 left-0 w-full text-center pointer-events-none select-none opacity-[0.012] text-[20vw] font-black font-display text-black dark:text-white overflow-hidden whitespace-nowrap">
          TRUSTED.
        </div>
      </div>
    </section>

  );
}

