
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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
  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2; // md
    return 1; // mobile - we'll handle peek with custom width
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

  // Auto-play carousel - DISABLED
  // Carousel only moves on manual interaction

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Touch handlers for swipe with direction detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);

    // Calculate swipe direction
    const touchDiff = touchStart - e.targetTouches[0].clientX;
    const isHorizontalSwipe = Math.abs(touchDiff) > 10;

    // Prevent vertical scroll if user is swiping horizontally
    if (isHorizontalSwipe && touchStart !== 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
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

  const handleArrowClick = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    navigate(`/services/${slug}`);
  };

  if (loading) return null;
  if (services.length === 0) return null;

  const cardWidth = 100 / cardsPerView;
  const translateX = -(currentIndex * cardWidth);

  return (
    <section id="services" className="py-40 bg-dark-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full floating-element"></div>
      </div>

      <div className="relative max-w-7xl mx-auto md:px-4 md:sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Capabilities</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none">
              <span className="text-white">Expert </span>
              <span className="text-white/20 italic">Solutions</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light max-w-lg">
              Crafting scalable digital ecosystems through architectural excellence and rigorous design.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Desktop Only */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Carousel Viewport */}
          <div className="overflow-hidden stagger-item">
            <div
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex transition-transform duration-500 ease-out touch-pan-y md:touch-auto pl-4 md:pl-0"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-[85vw] md:w-auto pr-4 md:px-4"
                  style={{ width: window.innerWidth >= 768 ? `${cardWidth}%` : undefined }}
                >
                  <div className="group relative glass-card rounded-[2rem] overflow-hidden md:hover:-translate-y-2 transition-all duration-300 h-full border border-white/5">
                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color_theme || 'from-gray-700 to-gray-600'} opacity-0 md:group-hover:opacity-10 transition-opacity duration-500`}></div>

                    {/* Card Content */}
                    <div className="relative z-10 h-full flex flex-col p-10 md:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-primary-500 font-bold font-mono text-xs tracking-widest uppercase">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="w-8 h-[1px] bg-white/20"></span>
                      </div>

                      {/* Title with Arrow Button */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <h3 className="text-3xl md:text-4xl font-bold text-white md:group-hover:text-primary-400 transition-all font-display leading-tight">
                          {service.title}
                        </h3>
                        <button
                          onClick={(e) => handleArrowClick(e, service.slug)}
                          className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white hover:text-dark-950 transition-all group/arrow"
                          aria-label={`View ${service.title}`}
                        >
                          <ArrowUpRight className="h-5 w-5 transform group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
                        </button>
                      </div>

                      <p className="text-lg text-gray-400 leading-relaxed font-light mb-8 max-w-sm">
                        {service.description}
                      </p>

                      <Link
                        to={`/services/${service.slug}`}
                        className="mt-auto inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-bold tracking-[0.3em] uppercase"
                      >
                        Learn More <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
