
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  ArrowUpRight, ChevronLeft, ChevronRight, Zap,
  Code, Palette, Smartphone, BarChart3,
  Megaphone, Terminal, Layers, Search
} from 'lucide-react';
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
                  className="flex-shrink-0 w-[85vw] md:w-auto pr-2 md:px-2"
                  style={{ width: window.innerWidth >= 768 ? `${cardWidth}%` : undefined }}
                >
                  <ServiceCard
                    service={service}
                    index={index}
                    onClick={() => navigate(`/services/${service.slug}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper to get icon based on name
const getIcon = (name: string) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('web') || n.includes('dev')) return Code;
  if (n.includes('design') || n.includes('ui')) return Palette;
  if (n.includes('mobile') || n.includes('app')) return Smartphone;
  if (n.includes('seo') || n.includes('search')) return Search;
  if (n.includes('marketing') || n.includes('social')) return Megaphone;
  if (n.includes('data') || n.includes('analytics')) return BarChart3;
  if (n.includes('system') || n.includes('tech')) return Terminal;
  return Layers; // Default
};

// Premium 3D Card Component
function ServiceCard({ service, index, onClick }: { service: Service; index: number; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);


  const Icon = getIcon(service.icon_name || service.title);

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      className="p-4 h-full"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-[550px] flex flex-col justify-between p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/10"
        style={{ transition: 'transform 0.1s ease-out' }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-900/80 dark:via-zinc-900 dark:to-zinc-950/80 opacity-100 transition-colors duration-500" />

        {/* Hover Highlight Blob */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[80px] group-hover:bg-primary-500/20 transition-all duration-700 group-hover:scale-125" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-500/5 rounded-full blur-[60px] group-hover:bg-primary-500/15 transition-all duration-700 group-hover:scale-125" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-auto">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/5 dark:bg-white/5 border border-primary-500/10 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-primary-500 group-hover:border-primary-500 shadow-sm">
                <Icon className="w-8 h-8 text-primary-600 dark:text-white group-hover:text-white transition-colors duration-300" />
              </div>
              {/* Icon Ping Effect */}
              <div className="absolute inset-0 bg-primary-500 rounded-2xl animate-ping opacity-0 group-hover:opacity-20" />
            </div>

            <span className="font-mono text-xs font-bold tracking-widest text-black/20 dark:text-white/20 group-hover:text-primary-500 transition-colors duration-300">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Body */}
          <div className="mt-8">
            <h3 className="text-3xl font-bold font-display leading-tight mb-4 text-black dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {service.title}
            </h3>
            <div className="w-12 h-1 bg-black/10 dark:bg-white/10 rounded-full mb-6 group-hover:w-full group-hover:bg-primary-500 transition-all duration-700" />
            <p className="text-black/60 dark:text-zinc-400 leading-relaxed font-light line-clamp-3 group-hover:text-black/80 dark:group-hover:text-zinc-300 transition-colors duration-300">
              {service.description}
            </p>
          </div>

          {/* Footer - "Learn More" Button */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between group-hover:border-primary-500/20 transition-colors duration-500">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              Explore Service
            </span>
            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-all duration-300 group-hover:scale-110">
              <ArrowUpRight className="w-4 h-4 text-black/60 dark:text-white/60 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Shine Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />
        </div>
      </div>
    </div>
  );
}

