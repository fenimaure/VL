import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';


export default function Hero() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        // Fetch home_hero (separate from about page hero)
        const { data } = await supabase.from('about_content').select('*').eq('section_key', 'home_hero').single();
        if (data) {
          setHeroData(data);
        } else {
          // Fallback to legacy 'hero' key if home_hero doesn't exist yet
          const { data: fallback } = await supabase.from('about_content').select('*').eq('section_key', 'hero').single();
          if (fallback) setHeroData(fallback);
        }
      } catch (error) {
        // Fallback to legacy 'hero' key
        try {
          const { data: fallback } = await supabase.from('about_content').select('*').eq('section_key', 'hero').single();
          if (fallback) setHeroData(fallback);
        } catch (e) {
          console.error('Error fetching hero data:', e);
        }
      } finally {
        setLoading(false);
      }
    }

    // Fetch and apply dynamic favicon from site_settings
    async function fetchFavicon() {
      try {
        const { data } = await supabase.from('about_content').select('image_url').eq('section_key', 'site_settings').single();
        if (data?.image_url) {
          const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
          const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
          if (link) link.href = data.image_url;
          if (appleLink) appleLink.href = data.image_url;
        }
      } catch (error) {
        // Keep default favicon
      }
    }

    fetchHero();
    fetchFavicon();
  }, []);

  if (loading && !heroData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 text-black dark:text-white overflow-hidden transition-colors duration-500">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white overflow-hidden selection:bg-gray-500/30 transition-colors duration-500"
    >
      {/* Aurora Background Effect - Grayscale */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-gray-500/5 to-transparent animate-spin-slow opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-bl from-transparent via-gray-400/5 to-transparent animate-spin-slow opacity-30 blur-[100px]" style={{ animationDirection: 'reverse' }}></div>
      </div>

      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        {heroData?.media_type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'contrast(1.1) brightness(0.9)' }}
          >
            <source src={heroData.image_url} type="video/mp4" />
          </video>
        ) : heroData?.image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroData.image_url})`,
              filter: 'contrast(1.1) brightness(0.9)'
            }}
          ></div>
        ) : null}

        {/* Premium Overlays - Subtle when media present, stronger without */}
        {heroData?.image_url ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 dark:from-black/60 dark:via-black/30 dark:to-black/70"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white dark:from-black/90 dark:via-black/50 dark:to-black"></div>
            <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px]"></div>
          </>
        )}
      </div>

      <div className="relative max-w-[90rem] mx-auto px-6 lg:px-8 pt-32 pb-40 z-10 w-full">

        {/* Main Content Grid */}
        <div className="flex flex-col items-center text-center">

          {/* Main Headline - Massive & Editorial */}
          {(() => {
            const hasMedia = !!heroData?.image_url;
            const rawTitle = heroData?.title || 'Digital Excellence';
            // Support **bold part** syntax — text inside ** is bold, rest is outline italic
            const boldMatch = rawTitle.match(/\*\*(.*?)\*\*/);
            const boldPart = boldMatch
              ? boldMatch[1]
              : rawTitle.split(' ')[0];
            const outlinePart = boldMatch
              ? rawTitle.replace(/\*\*.*?\*\*/, '').trim()
              : rawTitle.split(' ').slice(1).join(' ');

            // Read title_size from items settings object
            const items: any[] = Array.isArray(heroData?.items) ? heroData.items : [];
            const settingsObj = items.find((i: any) => i._settings);
            const titleSize: string = settingsObj?.title_size || 'xl';
            const sizeMap: Record<string, string> = {
              xs: 'text-[5vw]',
              sm: 'text-[7vw]',
              md: 'text-[9vw]',
              lg: 'text-[11vw]',
              xl: 'text-[13vw]',
            };
            const sizeClass = sizeMap[titleSize] ?? 'text-[13vw]';

            return (
              <div className="relative mb-16 flex flex-col items-center leading-[0.9]">
                <h1 className="flex flex-col items-center">
                  <span className="sr-only">{rawTitle.replace(/\*\*/g, '')}</span>

                  {/* Bold Line */}
                  {boldPart && (
                    <div className="flex overflow-hidden flex-wrap justify-center">
                      {boldPart.split('').map((char: string, i: number) => (
                        <motion.span
                          key={i}
                          initial={{ y: 200 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1, delay: i * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
                          className={`${sizeClass} font-black tracking-tighter ${hasMedia ? 'text-white hover:text-primary-300' : 'text-black dark:text-white hover:text-primary-500 dark:hover:text-primary-400'} transition-colors duration-300 cursor-default select-none`}
                          whileHover={{ scale: 1.1, y: -20 }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Outline Italic Line */}
                  {outlinePart && (
                    <div className="flex overflow-hidden mt-2 md:mt-4 flex-wrap justify-center">
                      {outlinePart.split('').map((char: string, i: number) => (
                        <motion.span
                          key={i}
                          initial={{ y: 200 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.05), ease: [0.2, 0.65, 0.3, 0.9] }}
                          className={`${sizeClass} font-serif italic font-light tracking-tighter ${hasMedia ? 'text-stroke-white hover:text-primary-300' : 'text-stroke-light dark:text-stroke-white hover:text-primary-500 dark:hover:text-primary-400'} transition-colors duration-300 cursor-default select-none`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </h1>
              </div>
            );
          })()}

          {/* Editable Tagline / Subtitle */}
          {heroData?.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`text-2xl md:text-3xl ${heroData?.image_url ? 'text-primary-300' : 'text-primary-500'} font-medium max-w-3xl mx-auto mb-6 tracking-wide`}
            >
              {heroData.subtitle}
            </motion.p>
          )}

          {/* Minimal Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className={`text-xl md:text-2xl ${heroData?.image_url ? 'text-white/80' : 'text-black/60 dark:text-gray-400'} max-w-2xl mx-auto font-light leading-relaxed mb-12 tracking-wide`}
          >
            {heroData?.content || 'We craft immersive digital experiences that blur the line between utility and art.'}
          </motion.p>

          {/* Magnetic CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-8 items-center"
          >
            <Link
              to="/contact"
              className={`group relative px-10 py-4 ${heroData?.image_url ? 'bg-white text-black hover:shadow-white/20' : 'bg-black dark:bg-white text-white dark:text-black hover:shadow-black/20 dark:hover:shadow-white/20'} rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-2xl active:scale-95`}
            >
              <span className="font-medium text-lg tracking-wide flex items-center gap-2">
                Start Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <a
              href="#projects"
              className={`group flex items-center gap-3 text-lg font-bold uppercase tracking-widest ${heroData?.image_url ? 'text-white/60 hover:text-white' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'} transition-colors duration-500`}
            >
              <span className="w-12 h-[1px] bg-current transition-all duration-500 group-hover:w-20"></span>
              View Work
            </a>
          </motion.div>

        </div>
      </div>



      {/* Scroll Indicator - Minimal Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-10 hidden md:flex items-center gap-4 rotate-90 origin-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30">Scroll</span>
        <div className="w-20 h-[1px] bg-black/10 dark:bg-white/10 overflow-hidden">
          <div className="w-full h-full bg-primary-500/50 -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </motion.div>

    </section>
  );
}
