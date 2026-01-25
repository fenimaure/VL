import { useState, useEffect } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      <nav className={`fixed w-full z-[60] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold font-display tracking-tighter text-white z-[70]">
            lovelli<span className="text-primary-500">.</span>
          </Link>

          {/* Modern Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative z-[70] flex items-center gap-4 transition-all duration-300"
            aria-label="Toggle Menu"
          >
            <span className={`text-xs uppercase tracking-[0.3em] font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
              Menu
            </span>
            <div className="relative h-2 w-8 flex flex-col justify-between overflow-hidden">
              <span className={`burger-line burger-line-1 ${isOpen ? 'is-open' : ''}`} />
              <span className={`burger-line burger-line-2 ${isOpen ? 'is-open' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className={`menu-overlay fixed inset-0 z-[50] bg-dark-950/98 backdrop-blur-3xl flex flex-col pt-32 md:pt-48 px-6 sm:px-20 ${isOpen ? 'is-open' : ''}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between h-full pb-20">

          <div className="flex flex-col space-y-2 md:space-y-6 lg:space-y-8">
            {navLinks.map((link, idx) => (
              <div key={link.title} className="nav-link-reveal group py-2">
                {link.path.startsWith('/#') ? (
                  <a
                    href={link.path}
                    className="nav-link-text block text-5xl sm:text-7xl lg:text-[85px] font-bold font-display text-white/40 hover:text-white transition-all duration-700 hover:translate-x-6 flex items-center gap-6"
                    style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                    <ArrowUpRight className="h-10 w-10 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-500 text-primary-500" />
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className="nav-link-text block text-5xl sm:text-7xl lg:text-[85px] font-bold font-display text-white/40 hover:text-white transition-all duration-700 hover:translate-x-6 flex items-center gap-6"
                    style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
                  >
                    {link.title}
                    <ArrowUpRight className="h-10 w-10 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-500 text-primary-500" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 lg:mt-0 flex flex-col justify-end space-y-10 mb-20 lg:mb-10 text-center lg:text-left">
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 font-bold block">Follow Us</span>
              <div className="flex justify-center lg:justify-start gap-8">
                {[
                  { icon: Instagram, label: 'IG' },
                  { icon: Linkedin, label: 'LN' },
                  { icon: Twitter, label: 'TW' }
                ].map((social, idx) => (
                  <a key={idx} href="#" className="text-white/60 hover:text-primary-400 transition-colors flex items-center gap-2 text-sm font-bold tracking-widest">
                    <social.icon className="h-5 w-5" />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6 border-l border-white/5 pl-8 md:border-0 md:pl-0">
              <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 font-bold block">Get in Touch</span>
              <a href="mailto:hello@lovelli.com" className="block text-2xl lg:text-3xl font-bold text-white hover:text-primary-400 transition-colors">
                hello@lovelli.com
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute bottom-0 right-0 p-10 select-none pointer-events-none opacity-[0.015] text-[15vw] font-black font-display leading-[0.8] whitespace-nowrap">
          LOVELLI.
        </div>
      </div>
    </>
  );
}
