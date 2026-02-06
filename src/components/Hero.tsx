import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, useSpring } from 'framer-motion';

export default function Hero() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move effect for parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePosition({ x, y });
  };



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
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 text-black dark:text-white overflow-hidden selection:bg-primary-500/30 transition-colors duration-500"
    >
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-primary-500/10 to-transparent animate-spin-slow opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-bl from-transparent via-indigo-500/10 to-transparent animate-spin-slow opacity-30 blur-[100px]" style={{ animationDirection: 'reverse' }}></div>
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
            style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.8)' }}
          >
            <source src={heroData.image_url} type="video/mp4" />
          </video>
        ) : heroData?.image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroData.image_url})`,
              filter: 'grayscale(100%) contrast(1.1) brightness(0.7)'
            }}
          ></div>
        ) : null}

        {/* Premium Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white dark:from-dark-950/90 dark:via-dark-950/40 dark:to-dark-950 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-white/60 dark:bg-dark-950/60"></div>

        {/* Noise Grain Texture - Essential for Premium Feel */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>



      <div className="relative max-w-[90rem] mx-auto px-6 lg:px-8 py-32 z-10 w-full">

        {/* Main Content Grid */}
        <div className="flex flex-col items-center text-center">

          {/* Main Headline - Massive & Editorial */}
          <div className="relative mb-16 flex flex-col items-center leading-[0.9]">
            <h1 className="flex flex-col items-center">
              <span className="sr-only">{heroData?.title || 'Digital Excellence'}</span>

              {/* First Word */}
              <div className="flex overflow-hidden">
                {(heroData?.title ? heroData.title.split(' ')[0] : 'Digital').split('').map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: i * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-[13vw] font-black tracking-tighter text-black dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 cursor-default select-none"
                    whileHover={{ scale: 1.1, y: -20 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Second Word */}
              <div className="flex overflow-hidden mt-2 md:mt-4">
                {(heroData?.title ? heroData.title.split(' ').slice(1).join(' ') : 'Excellence').split('').map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.2 + (i * 0.05), ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-[13vw] font-serif italic font-light tracking-tighter text-black/80 dark:text-white/80 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 cursor-default select-none"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </h1>
          </div>

          {/* Minimal Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-black/60 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-16 tracking-wide"
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
              className="group relative px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-none skew-x-[-12deg] hover:skew-x-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div className="skew-x-[12deg] group-hover:skew-x-0 transition-transform duration-500">
                <span className="font-bold text-lg tracking-wider uppercase flex items-center gap-2">
                  Start Project <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

            <a
              href="#projects"
              className="group flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-500"
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
