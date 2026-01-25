import { Linkedin, Facebook, Instagram, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data } = await supabase.from('footer_content').select('*');
        const map: Record<string, string> = {};
        data?.forEach((item: any) => map[item.key_name] = item.value);
        setLinks(map);
      } catch (e) {
        console.error('Error fetching footer links:', e);
      }
    }
    fetchLinks();
  }, []);

  return (
    <footer className="bg-dark-950 pt-40 pb-20 relative overflow-hidden text-white mt-20">
      <div className="absolute inset-0 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -bottom-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Massive CTA Section */}
        <div className="mb-40 group cursor-pointer border-b border-white/10 pb-20">
          <a href="#contact" className="block">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Get Started</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-display leading-[0.8] tracking-tighter transition-all duration-700 group-hover:px-4">
                Let's make it <br />
                <span className="text-stroke-white italic font-light">Happpen</span><span className="text-primary-500">.</span>
              </h2>
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700 group-hover:scale-90">
                <ArrowUpRight className="h-16 w-16 md:h-24 md:w-24 text-white group-hover:text-dark-950 transition-colors" />
              </div>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-40">
          {/* Studio Info */}
          <div className="md:col-span-4 space-y-10">
            <div>
              <span className="footer-section-label">Studio</span>
              <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xs">
                We craft high-end digital experiences for world-class brands from our base on the digital frontier.
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { Icon: Linkedin, href: links.linkedin_url || '#' },
                { Icon: TikTokIcon, href: links.tiktok_url || '#' },
                { Icon: Facebook, href: links.facebook_url || '#' },
                { Icon: Instagram, href: links.instagram_url || '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <span className="footer-section-label">Navigation</span>
              <ul className="space-y-4">
                {['Home', 'About', 'Projects', 'Careers', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="footer-link text-lg font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="footer-section-label">Expertise</span>
              <ul className="space-y-4">
                {['Web Excellence', 'Design Language', 'Brand Strategy', 'Technical Architecture'].map((item) => (
                  <li key={item} className="text-white/40 font-light text-lg italic tracking-wider">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="footer-section-label">Contact</span>
              <div className="space-y-6">
                <a href="mailto:hello@lovelli.com" className="block text-xl md:text-2xl font-bold hover:text-primary-500 transition-colors underline underline-offset-8">
                  hello@lovelli.com
                </a>
                <p className="text-white/40 font-light max-w-[15ch]">
                  Global Reach. <br />
                  Local Attention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Branding Anchor */}
        <div className="relative pt-20 border-t border-white/5 overflow-hidden">
          <div className="text-huge opacity-[0.03] select-none pointer-events-none font-display text-center">
            LOVELLI.
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">
            <div>© 2024 lovelli digital boutique</div>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
            <div>Crafted with precision.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

