import { useScroll, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaLinkedin, FaFacebookF, FaTiktok, FaInstagram } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Sidebars() {
    const { scrollYProgress } = useScroll();
    const location = useLocation();
    const [links, setLinks] = useState<Record<string, string>>({});

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
                    <span 
                        className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 rotate-180 select-none" 
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        Scroll
                    </span>
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
                        <FaLinkedin className="w-[18px] h-[18px]" />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href={links.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <FaFacebookF className="w-[18px] h-[18px]" />
                        <span className="sr-only">Facebook</span>
                    </a>
                    <a href={links.tiktok_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <FaTiktok className="w-[18px] h-[18px]" />
                        <span className="sr-only">TikTok</span>
                    </a>
                    <a href={links.instagram_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors hover:-translate-y-1 transform duration-300">
                        <FaInstagram className="w-[18px] h-[18px]" />
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
