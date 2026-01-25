
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
      <section className="relative min-h-screen flex items-center justify-center bg-dark-950 text-white overflow-hidden">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-dark-950 text-white overflow-hidden selection:bg-primary-500/30">

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
        {/* Overlay Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950"></div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-mesh opacity-20 animate-pulse-glow z-0"></div>



      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10 flex flex-col items-center">

        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full mb-12 border border-white/10 shadow-glass animate-fade-in-up">
          <Sparkles className="h-4 w-4 text-primary-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-gray-200">{heroData?.subtitle || 'Agency of the Future'}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold font-display mb-12 leading-[0.9] tracking-tighter mix-blend-color-dodge">
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {heroData?.title ? heroData.title.split(' ')[0] : 'Digital'}
          </span>
          {((heroData?.title && heroData.title.split(' ').length > 1) || !heroData?.title) && (
            <span className="block animate-fade-in-up text-white" style={{ animationDelay: '0.2s' }}>
              {heroData?.title ? heroData.title.split(' ').slice(1).join(' ') : 'Perfection'}
            </span>
          )}
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.4s' }}>
          {heroData?.content || 'We craft immersive digital experiences that blur the line between utility and art.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <a
            href="#contact"
            className="group relative px-10 py-5 bg-white text-dark-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-500 flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Start Project
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </a>
          <a
            href="#projects"
            className="group px-10 py-5 rounded-full font-bold text-lg text-white border border-white/10 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
          >
            Explore Work
            <div className="w-2 h-2 rounded-full bg-white group-hover:animate-ping"></div>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
}
