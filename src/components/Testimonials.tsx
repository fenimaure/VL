import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(0);

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

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading && testimonials.length === 0) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex];

  if (!activeTestimonial) return null;

  return (
    <section id="testimonials" className="py-40 relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-dark-950 text-black dark:text-white">
      {/* Immersive Background Blur */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-primary-500/10 blur-[180px] rounded-full pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">Appreciation</span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-bold font-display leading-[0.8] tracking-tighter text-black dark:text-white">
              Kind <br />
              <span className="text-black/50 dark:text-white/30 italic font-light font-serif">Words</span><span className="text-primary-500">.</span>
            </h2>
          </div>
        </div>

        <div className="relative stagger-item">
          {/* Main Cinematic Card */}
          <div className="relative border rounded-[3rem] p-12 md:p-24 overflow-hidden shadow-2xl transition-colors duration-300 bg-white dark:bg-[#080808] border-black/5 dark:border-white/5">

            {/* Massive Background Quote Icon */}
            <div className="absolute top-10 left-12 text-[15rem] font-serif leading-none select-none pointer-events-none transition-colors duration-300 text-black/[0.03] dark:text-white/[0.03]">
              "
            </div>

            <div className="relative z-10">
              {/* Star Rating Section */}
              <div className="flex gap-2 mb-12">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 w-6 flex items-center justify-center">
                    <Star
                      className={`h-4 w-4 ${i < (activeTestimonial.rating || 5) ? 'fill-black dark:fill-white text-black dark:text-white' : 'text-black/10 dark:text-white/10'}`}
                      strokeWidth={0}
                      fill="currentColor"
                    />
                  </div>
                ))}
              </div>

              {/* The Bold Statement */}
              <blockquote className="text-4xl md:text-6xl lg:text-7xl font-bold mb-20 leading-[1.1] tracking-tighter max-w-5xl">
                "{activeTestimonial.content}"
              </blockquote>

              {/* Author & Control Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">

                {/* Profile Identity Pillar */}
                <div className="flex items-center gap-8 group">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 transition-colors duration-500 border-black/10 dark:border-white/10 group-hover:border-primary-500/50">
                    <img
                      src={activeTestimonial.image_url}
                      alt={activeTestimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold font-display tracking-tight text-black dark:text-white">{activeTestimonial.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans text-black/30 dark:text-white/30">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Kinetic Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 group active:scale-90 border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950"
                  >
                    <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 group active:scale-90 border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950"
                  >
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Faded Legacy Counter */}
            <div className="absolute bottom-6 right-16 text-[10vw] font-black font-display select-none pointer-events-none tracking-tighter transition-colors duration-300 text-black/[0.02] dark:text-white/[0.02]">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

