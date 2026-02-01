
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data } = await supabase.from('about_content').select('*').eq('section_key', 'hero').single();
        if (data) setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHero();
  }, []);

  if (loading && !heroData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 text-black dark:text-white overflow-hidden transition-colors duration-500">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 text-black dark:text-white overflow-hidden selection:bg-primary-500/30 transition-colors duration-500">

      {/* Dynamic Background Media */}
      <div className="absolute inset-0 z-0">
        {heroData?.media_type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src={heroData.image_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroData?.image_url || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200'})` }}
          ></div>
        )}
        {/* Overlay Gradient for readability - adapted for light/dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white dark:from-dark-950/80 dark:via-dark-950/50 dark:to-dark-950 transition-colors duration-500"></div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-mesh opacity-20 animate-pulse-glow z-0"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10 flex flex-col items-center">

        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full mb-12 border border-black/10 dark:border-white/10 shadow-glass animate-fade-in-up transition-colors duration-500">
          <Sparkles className="h-4 w-4 text-primary-500 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-black/80 dark:text-gray-200">{heroData?.subtitle || 'Agency of the Future'}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold font-display mb-12 leading-[0.9] tracking-tighter mix-blend-normal dark:mix-blend-color-dodge text-black dark:text-white transition-colors duration-500">
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {heroData?.title ? heroData.title.split(' ')[0] : 'Digital'}
          </span>
          {((heroData?.title && heroData.title.split(' ').length > 1) || !heroData?.title) && (
            <span className="block animate-fade-in-up text-black dark:text-white" style={{ animationDelay: '0.2s' }}>
              {heroData?.title ? heroData.title.split(' ').slice(1).join(' ') : 'Perfection'}
            </span>
          )}
        </h1>

        <p className="text-xl sm:text-2xl text-black/70 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light transition-colors duration-500" style={{ animationDelay: '0.4s' }}>
          {heroData?.content || 'We craft immersive digital experiences that blur the line between utility and art.'}
        </p>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up z-20" style={{ animationDelay: '0.6s' }}>
          {/* Primary CTA - Start Project */}
          <a
            href="#contact"
            className="group relative px-12 py-6 bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white text-white dark:text-dark-950 rounded-full font-bold text-lg transition-all duration-700 flex items-center gap-3 overflow-hidden shadow-2xl hover:shadow-black/50 dark:hover:shadow-white/50 hover:scale-110 hover:-rotate-1"
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              const ripple = document.createElement('div');
              ripple.className = 'absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 rounded-full animate-ping';
              btn.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
            }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 animate-pulse"></div>

            {/* Moving gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-black/10 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>

            {/* Spotlight effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.1),transparent_50%)] transition-opacity duration-500"></div>

            <span className="relative z-10 flex items-center font-extrabold tracking-wide">
              Start Project
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
            </span>

            {/* Particle effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white dark:bg-black rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.8 + Math.random() * 0.4}s`
                  }}
                ></div>
              ))}
            </div>
          </a>

          {/* Secondary CTA - Explore Work */}
          <a
            href="#projects"
            className="group relative px-12 py-6 rounded-full font-bold text-lg text-black dark:text-white border-2 border-black/20 dark:border-white/20 transition-all duration-700 backdrop-blur-sm flex items-center gap-3 overflow-hidden hover:scale-105 hover:border-primary-500 dark:hover:border-primary-500 hover:rotate-1"
          >
            {/* Gradient fill on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>

            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 animate-spin-slow" style={{ padding: '2px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' }}></div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

            <span className="relative z-10 font-extrabold tracking-wide">Explore Work</span>

            {/* Animated dot */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute w-3 h-3 rounded-full bg-primary-500 group-hover:animate-ping"></div>
              <div className="w-2 h-2 rounded-full bg-black dark:bg-white group-hover:bg-primary-500 transition-colors duration-300"></div>
            </div>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black to-transparent dark:from-white dark:to-transparent"></div>
      </div>
    </section>
  );
}
