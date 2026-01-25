import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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

  if (loading) return null;
  if (testimonials.length === 0) return null;

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-40 bg-dark-950 relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Kind Words</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none">
              <span className="text-white">Client </span>
              <span className="text-white/20 italic">Voices</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light max-w-lg">
              Partnering with brands to create meaningful impact and lasting impressions.
            </p>
          </div>
        </div>

        <div className="relative stagger-item">
          {/* Main Card */}
          <div className="relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 md:p-20 overflow-hidden">
            <Quote className="absolute top-12 left-12 h-16 w-16 text-primary-500/10" />

            <div className="relative z-10">
              <div className="flex gap-1 mb-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < (activeTestimonial.rating || 5) ? 'fill-primary-500 text-primary-500' : 'text-white/10'}`}
                  />
                ))}
              </div>

              <blockquote className="text-2xl md:text-4xl lg:text-5xl font-medium mb-12 leading-[1.2] tracking-tight">
                "{activeTestimonial.content}"
              </blockquote>

              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10">
                    <img
                      src={activeTestimonial.image_url}
                      alt={activeTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-display">{activeTestimonial.name}</div>
                    <div className="text-primary-500/60 font-bold tracking-widest text-[10px] uppercase mt-1">
                      {activeTestimonial.role}
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex gap-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-dark-950 transition-all duration-500 group"
                  >
                    <ChevronLeft className="h-6 w-6 group-hover:scale-110" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-dark-900 transition-all duration-500 group"
                  >
                    <ChevronRight className="h-6 w-6 group-hover:scale-110" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Counter Overlay */}
          <div className="absolute -bottom-6 right-12 text-6xl font-black text-white/[0.03] font-display select-none">
            {String(activeIndex + 1).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
}

