import { useScroll, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSmoothScroll } from './SmoothScroll';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Sidebars() {
    const { scrollYProgress } = useScroll();
    const location = useLocation();
    const [links, setLinks] = useState<Record<string, string>>({});
    const [isPast70, setIsPast70] = useState(false);
    const { scrollTo } = useSmoothScroll();

    useEffect(() => {
        return scrollYProgress.onChange((latest) => {
            setIsPast70(latest > 0.7);
        });
    }, [scrollYProgress]);

    useEffect(() => {
        async function fetchLinks() {
            try {
                const { data } = await supabase.from('footer_content').select('*');
                const map: Record<string, string> = {};
                data?.forEach((item: any) => map[item.key_name] = item.value);
                setLinks(map);
            } catch (e) {
                console.error('Error fetching sidebar links:', e);
            }
        }
        fetchLinks();
    }, []);

    // Do not show on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-40 hidden lg:block">
            {/* Left Sidebar: Scroll Progress */}
            <div className="absolute left-0 top-0 bottom-0 w-24 flex flex-col items-center justify-end pb-[140px] pointer-events-auto">
                <div className="flex flex-col items-center gap-4 h-[40vh]">
                    <button 
                        onClick={() => {
                            if (isPast70) {
                                scrollTo(0);
                            }
                        }}
                        className={`uppercase tracking-[0.3em] rotate-180 select-none transition-all duration-300 whitespace-nowrap ${
                            isPast70 
                                ? 'text-[12px] font-bold text-black dark:text-white cursor-pointer hover:text-primary-500 dark:hover:text-primary-400' 
                                : 'text-[10px] font-bold text-gray-400 dark:text-gray-500 cursor-default pointer-events-none'
                        }`}
                        style={{ writingMode: 'vertical-rl' }}
                        disabled={!isPast70}
                        aria-label={isPast70 ? "Scroll to top" : "Scroll progress"}
                    >
                        {isPast70 ? 'Scroll To Top' : 'Scroll'}
                    </button>
                    <div className="w-[1px] flex-1 bg-black/10 dark:bg-white/10 relative overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-black dark:bg-white origin-top"
                            style={{ 
                                height: '100%',
                                scaleY: scrollYProgress 
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Socials */}
            <div className="absolute right-0 top-0 bottom-0 w-24 flex flex-col items-center justify-end pb-[140px] pointer-events-auto">
                <div className="flex flex-col items-center gap-4">
                    <a href={links.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <Linkedin className="w-[18px] h-[18px]" />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href={links.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <Facebook className="w-[18px] h-[18px]" />
                        <span className="sr-only">Facebook</span>
                    </a>
                    <a href={links.tiktok_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <TikTokIcon className="w-[18px] h-[18px]" />
                        <span className="sr-only">TikTok</span>
                    </a>
                    <a href={links.instagram_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <Instagram className="w-[18px] h-[18px]" />
                        <span className="sr-only">Instagram</span>
                    </a>
                    
                    <div className="w-[1px] h-12 bg-black/20 dark:bg-white/20 my-2"></div>

                    <span 
                        className="text-[12px] uppercase font-bold tracking-[0.3em] text-black dark:text-white rotate-180 mt-2 select-none" 
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        Follow Us
                    </span>
                </div>
            </div>
        </div>
    );
}
