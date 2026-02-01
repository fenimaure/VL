import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';

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
    { title: 'Services', path: '/#services' },
    { title: 'Careers', path: '/careers' },
    { title: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-[60] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <Link to="/" className="z-[70] transition-all duration-300 hover:opacity-80">
            <img
              src="/logo.png"
              alt="Lovelli"
              className="h-8 md:h-10 w-auto dark:invert transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.title}
                  href={link.path}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors relative group"
                >
                  {link.title}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary-500 group-hover:w-full transition-all duration-500"></span>
                </a>
              ) : (
                <Link
                  key={link.title}
                  to={link.path}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors relative group"
                >
                  {link.title}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary-500 group-hover:w-full transition-all duration-500"></span>
                </Link>
              )
            ))}
            <Link
              to="/contact"
              className="ml-4 px-6 py-2 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950 text-black dark:text-white transition-all duration-500"
            >
              Start Project
            </Link>
            <ThemeToggle className="ml-4 w-10 h-10 border border-black/10 dark:border-white/10 hidden lg:flex" />
          </div>

          {/* Modern Menu Button (Mobile/Tablet Only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden group relative z-[70] flex items-center gap-4 transition-all duration-300"
            aria-label="Toggle Menu"
          >
            <span className={`text-xs uppercase tracking-[0.3em] font-bold text-black dark:text-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
              Menu
            </span>
            <div className="relative h-2 w-8 flex flex-col justify-between overflow-hidden">
              <span className={`burger-line burger-line-1 bg-black dark:bg-white ${isOpen ? 'is-open !bg-black dark:!bg-white' : ''}`} />
              <span className={`burger-line burger-line-2 bg-black dark:bg-white ${isOpen ? 'is-open !bg-black dark:!bg-white' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className={`menu-overlay fixed inset-0 z-[50] bg-white/98 dark:bg-dark-950/98 backdrop-blur-3xl flex flex-col pt-32 md:pt-40 px-6 sm:px-20 ${isOpen ? 'is-open' : ''}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between h-full pb-20">

          <div className="flex flex-col space-y-6 lg:space-y-12">
            {navLinks.map((link, idx) => (
              <div key={link.title} className="nav-link-reveal">
                {link.path.startsWith('/#') ? (
                  <a
                    href={link.path}
                    className="nav-link-text text-5xl sm:text-7xl lg:text-[90px] font-bold font-display text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-all duration-700 block"
                    style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className="nav-link-text text-5xl sm:text-7xl lg:text-[90px] font-bold font-display text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-all duration-700 block"
                    style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 lg:mt-0 flex flex-col justify-end space-y-10 mb-20 lg:mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center pb-6">
              <ThemeToggle className="relative" />
            </div>

            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.4em] text-black/20 dark:text-white/20 font-bold block">Follow Us</span>
              <div className="flex justify-center lg:justify-start gap-8">
                {[
                  { icon: Instagram, href: links.instagram_url },
                  { icon: Linkedin, href: links.linkedin_url },
                  { icon: Twitter, href: links.twitter_url }
                ].filter(s => s.href).map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-primary-500 dark:text-white/60 dark:hover:text-primary-400 transition-colors flex items-center gap-2 text-sm font-bold tracking-widest">
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.4em] text-black/20 dark:text-white/20 font-bold block">Get in Touch</span>
              <a href={`mailto:${contactEmail}`} className="block text-2xl lg:text-3xl font-bold text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-400 transition-colors">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute bottom-0 right-0 p-10 select-none pointer-events-none opacity-[0.012] text-[15vw] font-black font-display leading-[0.8] whitespace-nowrap text-black dark:text-white">
          LOVELLI.
        </div>
      </div >
    </>
  );
}
