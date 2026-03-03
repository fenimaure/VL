import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';

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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [links, setLinks] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data } = await supabase.from('footer_content').select('*');
        const map: Record<string, string> = {};
        data?.forEach((item: any) => map[item.key_name] = item.value);
        setLinks(map);
      } catch (e) {
        console.error('Error fetching navbar links:', e);
      }
    }
    fetchLinks();
  }, []);

  const contactEmail = links.contact_email || 'hello@lovelli.com';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Projects', path: '/projects' },
    { title: 'Services', path: '/services' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'Careers', path: '/careers' },
    { title: 'Blog', path: '/blog' },
    { title: 'Contact', path: '/contact' },
  ];

  // Check if a nav link is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.slice(1);
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] flex justify-center transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-6'
          }`}
      >
        <div
          className={`hidden lg:flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-500 ${scrolled
            ? 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150'
            : 'bg-dark-950/80 dark:bg-dark-950/80 border-white/5 shadow-xl shadow-black/20 backdrop-blur-xl'
            }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center px-4 py-1.5 transition-all duration-300 hover:opacity-80 shrink-0">
            <img
              src="/logo.png"
              alt="Lovelli"
              className={`h-7 w-auto transition-all duration-300 ${scrolled ? 'dark:invert' : 'invert'}`}
            />
          </Link>

          {/* Divider */}
          <div className={`w-[1px] h-6 mx-1 shrink-0 transition-colors duration-300 ${scrolled ? 'bg-black/10 dark:bg-white/10' : 'bg-white/10'}`}></div>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const scrolledLinkClasses = `px-5 py-2 rounded-full text-[12px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${active
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                : 'text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`;
              const defaultLinkClasses = `px-5 py-2 rounded-full text-[12px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${active
                ? 'bg-white/15 text-white shadow-inner shadow-white/10'
                : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                }`;
              const linkClasses = scrolled ? scrolledLinkClasses : defaultLinkClasses;

              return link.path.startsWith('/#') ? (
                <a key={link.title} href={link.path} className={linkClasses}>
                  {link.title}
                </a>
              ) : (
                <Link key={link.title} to={link.path} className={linkClasses}>
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <div className="ml-1 shrink-0">
            <ThemeToggle className={`w-9 h-9 border-0 bg-transparent hover:bg-white/5 ${scrolled
              ? 'text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white'
              : 'text-white/80 hover:text-white'}`} />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between w-full px-5">
          <Link to="/" className="z-[70] transition-all duration-300 hover:opacity-80">
            <img
              src="/logo.png"
              alt="Lovelli"
              className="h-8 w-auto invert transition-all duration-300"
            />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-[70] flex items-center justify-center w-11 h-11 rounded-full bg-dark-950 border border-white/10 transition-all duration-500 hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
            aria-label="Toggle Menu"
          >
            <div className="relative h-3 w-5 flex flex-col justify-between">
              <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay (Mobile) */}
      <div className={`menu-overlay fixed inset-0 z-[50] bg-black flex flex-col pt-24 md:pt-40 px-6 sm:px-12 ${isOpen ? 'is-open' : ''}`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />

        {/* Decorative L-Brackets for premium feel */}
        <div className="absolute top-10 left-10 w-12 h-12 border-l border-t border-white/10 pointer-events-none md:block hidden"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 border-r border-b border-white/10 pointer-events-none md:block hidden"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between h-full pb-6 relative z-10 overflow-hidden">
          {/* Main Navigation Links Container */}
          <div className="flex-1 flex flex-col justify-center space-y-2 md:space-y-6 lg:space-y-12 overflow-y-auto pr-4 scrollbar-hide py-2 md:py-10">
            {navLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <div key={link.title} className="nav-link-reveal shrink-0">
                  {link.path.startsWith('/#') ? (
                    <a
                      href={link.path}
                      className={`nav-link-text text-3xl sm:text-7xl lg:text-[100px] font-black font-display tracking-tighter transition-all duration-700 block uppercase ${active ? 'text-white' : 'text-white/20 hover:text-white/60'
                        }`}
                      style={{ transitionDelay: `${0.1 + idx * 0.04}s` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`nav-link-text text-3xl sm:text-7xl lg:text-[100px] font-black font-display tracking-tighter transition-all duration-700 block uppercase ${active ? 'text-white' : 'text-white/20 hover:text-white/60'
                        }`}
                      style={{ transitionDelay: `${0.1 + idx * 0.04}s` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 lg:mt-0 flex flex-col justify-end space-y-8 pb-4 lg:pb-0">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-bold block">Follow Us</span>
                <div className="flex gap-8">
                  {[
                    { icon: Instagram, href: links.instagram_url },
                    { icon: Linkedin, href: links.linkedin_url },
                    { icon: XIcon, href: links.twitter_url },
                    { icon: Facebook, href: links.facebook_url },
                    { icon: TikTokIcon, href: links.tiktok_url }
                  ].filter(s => s.href).map((social, idx) => (
                    <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="nav-link-text text-white/50 hover:text-white transition-all transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-white/5" style={{ transitionDelay: `${0.5 + idx * 0.05}s` }}>
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-bold block">Connect</span>
                <a href={`mailto:${contactEmail}`} className="nav-link-text block text-base font-bold text-white/80 hover:text-white transition-colors" style={{ transitionDelay: '0.6s' }}>
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Decorative Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.015] text-[40vw] font-black font-display leading-[1] whitespace-nowrap text-white z-0">
          VL.
        </div>
      </div>
    </>
  );
}
