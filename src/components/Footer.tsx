import { Linkedin, Facebook, Instagram, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
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

  const contactEmail = links.contact_email || 'hello@lovelli.com';

  return (
    <footer className="bg-white dark:bg-black pt-40 pb-20 relative overflow-hidden text-black dark:text-white mt-20 transition-colors duration-500 border-t border-black/5 dark:border-white/5">
      <div className="absolute inset-0 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -bottom-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Epic Magnetic CTA Section */}
        <div className="mb-40 group relative border-b border-black/10 dark:border-white/10 pb-20 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          {/* Floating orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

          <Link to="/contact" className="block relative z-10">
            <div className="flex items-center gap-4 mb-8 overflow-hidden">
              <span className="w-12 h-[1px] bg-primary-500 group-hover:w-24 transition-all duration-700"></span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase group-hover:tracking-[0.5em] transition-all duration-700">Get Started</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              {/* Animated headline with character reveal */}
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-display leading-[0.8] tracking-tighter transition-all duration-700 group-hover:px-4 perspective-container">
                <div className="overflow-hidden inline-block">
                  <span className="inline-block group-hover:animate-bounce transition-all duration-300" style={{ animationDuration: '1s' }}>
                    Let's{' '}
                  </span>
                </div>
                <div className="overflow-hidden inline-block">
                  <span className="inline-block group-hover:animate-bounce transition-all duration-300" style={{ animationDuration: '1s', animationDelay: '0.1s' }}>
                    make{' '}
                  </span>
                </div>
                <div className="overflow-hidden inline-block">
                  <span className="inline-block group-hover:animate-bounce transition-all duration-300" style={{ animationDuration: '1s', animationDelay: '0.2s' }}>
                    it{' '}
                  </span>
                </div>
                <br />
                <span className="text-stroke-light dark:text-stroke-white italic font-light inline-block group-hover:skew-x-[-5deg] transition-transform duration-500">
                  Happen
                </span>
                <span className="text-primary-500 inline-block group-hover:scale-150 group-hover:rotate-180 transition-all duration-700">.</span>
              </h2>

              {/* Magnetic button with enhanced effects */}
              <div className="relative w-32 h-32 md:w-48 md:h-48">
                {/* Rotating gradient ring */}
                <div className="absolute inset-0 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 blur-md animate-spin-slow transition-opacity duration-700"></div>

                {/* Pulsing rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-ping opacity-0 group-hover:opacity-100"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.3s' }}></div>

                {/* Main button */}
                <div className="relative w-full h-full rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-white/50 dark:bg-dark-950/50 backdrop-blur-sm group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-700 group-hover:scale-90 group-hover:rotate-90 overflow-hidden">
                  {/* Gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                  {/* Arrow icon */}
                  <ArrowUpRight className="h-16 w-16 md:h-24 md:w-24 text-black dark:text-white group-hover:text-white dark:group-hover:text-dark-950 transition-all duration-300 group-hover:scale-125 relative z-10" />

                  {/* Particle burst */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary-500 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 30}deg) translateY(-${20 + Math.random() * 30}px)`,
                          animation: 'ping 1s ease-out infinite',
                          animationDelay: `${i * 0.05}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-40">
          {/* Studio Info */}
          <div className="md:col-span-4 space-y-10">
            <div>
              <span className="footer-section-label">Studio</span>
              <p className="text-xl text-black/60 dark:text-gray-400 font-light leading-relaxed max-w-xs transition-colors duration-300">
                We craft high-end digital experiences for world-class brands from our base on the digital frontier.
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { Icon: Instagram, href: links.instagram_url || '#' },
                { Icon: Linkedin, href: links.linkedin_url || '#' },
                { Icon: XIcon, href: links.twitter_url || '#' },
                { Icon: Facebook, href: links.facebook_url || '#' },
                { Icon: TikTokIcon, href: links.tiktok_url || '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"
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
                {['Social Media Management', 'Brand Strategy', 'Virtual Assistance', 'Talent Acquisition'].map((item) => (
                  <li key={item} className="text-black/40 dark:text-white/40 font-light text-lg italic tracking-wider">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="footer-section-label">Contact</span>
              <div className="space-y-6">
                <a href={`mailto:${contactEmail}`} className="block text-xl md:text-2xl font-bold hover:text-primary-500 transition-colors underline underline-offset-8">
                  {contactEmail}
                </a>
                <p className="text-black/40 dark:text-white/40 font-light max-w-[15ch]">
                  Global Reach. <br />
                  Local Attention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="relative pt-20 border-t border-black/5 dark:border-white/5 transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.4em] uppercase text-black/20 dark:text-white/20">
            <div>© 2024 lovelli digital boutique</div>
            <div className="flex gap-10">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Legal</a>
            </div>
            <div>Crafted with precision.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

