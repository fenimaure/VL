
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  color_theme: string;
  slug: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    if (loading || services.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('#services .stagger-item');
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [loading, services]);

  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2; // md
    return 1; // mobile
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, services.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  /* Removed unused goToSlide */

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    const touchDiff = touchStart - e.targetTouches[0].clientX;
    const isHorizontalSwipe = Math.abs(touchDiff) > 10;
    if (isHorizontalSwipe && touchStart !== 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) nextSlide();
    if (isRightSwipe && currentIndex > 0) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, maxIndex]);

  /* Removed unused handleArrowClick */

  if (loading && services.length === 0) {
    return (
      <section className="py-40 bg-white dark:bg-dark-950 flex items-center justify-center transition-colors duration-500 min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse text-sm tracking-widest uppercase text-black/50 dark:text-white/50">Loading Excellence...</p>
        </div>
      </section>
    );
  }

  const cardWidth = 100 / cardsPerView;
  const translateX = -(currentIndex * cardWidth);

  return (
    <section id="services" className="py-40 bg-white dark:bg-dark-950 relative overflow-hidden transition-colors duration-500">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-mesh opacity-[0.03] z-0"></div>
      </div>

      <div className="relative max-w-7xl mx-auto md:px-4 md:sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 px-6 lg:px-0">
          <div className="max-w-3xl stagger-item">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 text-primary-500">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">
                Our Capabilities
              </span>
            </div>

            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold font-display mb-8 leading-[0.9] tracking-tighter transition-colors duration-300">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-black/50 dark:from-white dark:via-white dark:to-white/50 animate-gradient-x">
                Expert
              </span>
              <span className="block text-black/50 dark:text-white/30 italic font-light font-serif transform translate-x-4">
                Solutions
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-black/60 dark:text-gray-400 leading-relaxed font-light max-w-xl transition-colors duration-300 border-l-2 border-primary-500/30 pl-6">
              We architect digital ecosystems that blend <span className="text-black dark:text-white font-medium">high-performance utility</span> with <span className="text-black dark:text-white font-medium">breathtaking aesthetics</span>.
            </p>
          </div>

          <div className="stagger-item hidden lg:flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="w-16 h-16 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
              >
                <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className="w-16 h-16 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
              >
                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-primary-500' : 'w-2 bg-black/10 dark:bg-white/10'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="relative z-10">
          <div className="overflow-visible stagger-item">
            <div
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1) touch-pan-y md:touch-auto pl-6 md:pl-0"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-[85vw] md:w-auto pr-6 md:px-4"
                  style={{ width: window.innerWidth >= 768 ? `${cardWidth}%` : undefined }}
                >
                  <div
                    onClick={() => navigate(`/services/${service.slug}`)}
                    className="group relative h-full min-h-[500px] flex flex-col justify-between p-10 md:p-12 rounded-[2.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 dark:hover:shadow-black/50"
                  >
                    {/* Animated Background Gradients on Hover */}
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700 group-hover:scale-150"></div>

                    {/* Card Top */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <span className="text-6xl font-display font-bold text-black/20 dark:text-white/20 group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 group-hover:rotate-45 shadow-inner">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-4xl font-bold font-display leading-[1.1] mb-6 text-black dark:text-white group-hover:text-primary-500 transition-all duration-300">
                        {service.title}
                      </h3>

                      <div className="w-12 h-1 bg-black/10 dark:bg-white/10 rounded-full group-hover:w-24 group-hover:bg-primary-500 transition-all duration-500 mb-8"></div>

                      <p className="text-lg text-black/60 dark:text-gray-400 font-light leading-relaxed mb-8 line-clamp-3 group-hover:text-black/80 dark:group-hover:text-gray-200 transition-colors">
                        {service.description}
                      </p>
                    </div>

                    {/* Card Bottom / Footer */}
                    <div className="relative z-10 pt-8 mt-auto border-t border-black/5 dark:border-white/5 group-hover:border-primary-500/20 transition-colors duration-500">
                      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-black/40 dark:text-white/40 group-hover:text-primary-500 transition-colors">
                        View details
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
