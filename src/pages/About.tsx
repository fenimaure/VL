import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Users, Target, Heart, Award,
    ArrowRight, Sparkles
} from 'lucide-react';
import ComponentRenderer from '../components/ComponentRenderer';

interface AboutSection {
    content: string;
    image_url: string;
    items: any[];
    title: string;
    subtitle: string;
}

export default function About() {
    const [data, setData] = useState<Record<string, AboutSection>>({});
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    useEffect(() => {
        async function fetchContent() {
            try {
                const { data, error } = await supabase.from('about_content').select('*');
                if (error) throw error;
                const map: any = {};
                data?.forEach((item: any) => map[item.section_key] = item);
                setData(map);
            } catch (e) {
                console.error('Error fetching about content:', e);
            }
        }
        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <Navbar />

            {/* CINEMATIC HERO with Parallax */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
                {/* Parallax Background */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    {data.hero?.image_url ? (
                        <img
                            src={data.hero.image_url}
                            className="w-full h-full object-cover scale-110"
                            alt="About Hero"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary-500/20"></div>
                    )}
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-dark-950/90 dark:via-dark-950/70 dark:to-dark-950 z-10 transition-colors duration-500"></div>

                {/* Animated Mesh Pattern */}
                <div className="absolute inset-0 bg-mesh opacity-10 animate-pulse-glow z-10"></div>

                <motion.div
                    style={{ opacity }}
                    className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full mb-8 border border-black/10 dark:border-white/10"
                    >
                        <Sparkles className="h-4 w-4 text-primary-500 animate-pulse" />
                        <span className="text-sm font-bold tracking-wider uppercase text-primary-500">About Us</span>
                    </motion.div>

                    {/* Main Headline */}
                    {data.hero?.title && (
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`font-bold font-display text-black dark:text-white mb-8 tracking-tighter leading-[0.9] ${(() => {
                                const items: any[] = Array.isArray(data.hero?.items) ? data.hero.items : [];
                                const settings = items.find((i: any) => i._settings);
                                const sizeMap: Record<string, string> = {
                                    xs: 'text-3xl md:text-4xl lg:text-5xl',
                                    sm: 'text-4xl md:text-5xl lg:text-6xl',
                                    md: 'text-5xl md:text-6xl lg:text-7xl',
                                    lg: 'text-6xl md:text-7xl lg:text-8xl',
                                    xl: 'text-6xl md:text-8xl lg:text-9xl',
                                };
                                return sizeMap[settings?.title_size || 'xl'] ?? 'text-6xl md:text-8xl lg:text-9xl';
                            })()
                                }`}
                        >
                            {data.hero.title}
                        </motion.h1>
                    )}

                    {/* Subtitle */}
                    {data.hero?.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-2xl md:text-3xl text-primary-500 font-medium max-w-4xl mx-auto mb-6"
                        >
                            {data.hero.subtitle}
                        </motion.p>
                    )}

                    {/* Description */}
                    {data.hero?.content && (
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-lg md:text-xl text-black/60 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
                        >
                            {data.hero.content}
                        </motion.p>
                    )}

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#team"
                            className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-dark-950 rounded-full font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Meet the Team
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#story"
                            className="group px-8 py-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm text-black dark:text-white rounded-full font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                        >
                            Our Story
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40">Scroll</span>
                        <div className="w-[2px] h-12 bg-gradient-to-b from-black/20 to-transparent dark:from-white/20"></div>
                    </div>
                </div>
            </section>

            {/* FEATURED FULL SCREEN IMAGE */}
            {data.fullscreen_image?.image_url && (
                <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.div
                            initial={{ scale: 1.1 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <img
                                src={data.fullscreen_image.image_url}
                                alt="Featured"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
                    </div>
                </section>
            )}

            {/* ANIMATED STATS SECTION */}
            <StatsSection />

            {/* TRUSTED BY / CLIENTS - REMOVED TO MOVE TO HERO */}


            {/* OUR STORY with Rich Animation */}
            <section id="story" className="py-32 bg-gray-50/50 dark:bg-dark-900/30 relative overflow-hidden transition-colors duration-500">
                {/* Background Decorations */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-4 block">Our Journey</span>
                            {data.story?.title && (
                                <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                                    {data.story.title}
                                </h2>
                            )}
                        </div>

                        {data.story?.content && (
                            <ComponentRenderer
                                content={data.story.content}
                                className="text-xl leading-relaxed text-black/70 dark:text-gray-300 text-center"
                            />
                        )}
                    </AnimatedSection>
                </div>
            </section>



            {/* TEAM SECTION - Premium 3D Cards */}
            <section id="team" className="py-32 bg-gray-50 dark:bg-dark-900 relative overflow-hidden transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="text-center mb-20">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-4 block">The Dream Team</span>
                            {data.team?.title && (
                                <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white font-display tracking-tight">
                                    {data.team.title}
                                </h2>
                            )}
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(data.team?.items || []).map((member: any, idx: number) => (
                            <TeamMemberCard key={idx} member={member} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// REUSABLE COMPONENTS

function AnimatedSection({ children }: { children: React.ReactNode }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
        >
            {children}
        </motion.div>
    );
}

function StatsSection() {
    const stats = [
        { number: 150, suffix: '+', label: 'Projects Delivered', icon: Target },
        { number: 98, suffix: '%', label: 'Client Satisfaction', icon: Heart },
        { number: 50, suffix: '+', label: 'Team Members', icon: Users },
        { number: 10, suffix: '+', label: 'Years Experience', icon: Award }
    ];

    return (
        <section className="py-20 border-y border-black/10 dark:border-white/10 bg-white dark:bg-dark-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <StatCounter key={idx} stat={stat} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatCounter({ stat, index }: { stat: any; index: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = stat.number;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, stat.number]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center group"
        >
            <stat.icon className="h-8 w-8 mx-auto mb-4 text-black dark:text-white group-hover:scale-125 transition-transform" />
            <div className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-2">
                {count}{stat.suffix}
            </div>
            <div className="text-sm uppercase tracking-wider text-black/60 dark:text-white/60 font-medium">
                {stat.label}
            </div>
        </motion.div>
    );
}



function TeamMemberCard({ member, index }: { member: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group text-center"
        >
            {/* Image Container with 3D Effect */}
            <div className="relative mb-6 perspective-container">
                <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-black/10 dark:border-white/10 group-hover:border-primary-500 transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                    {/* Image */}
                    <img
                        src={member.image || 'https://via.placeholder.com/400'}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Hover overlay with social links (optional) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                        <div className="flex gap-3">
                            {/* Add social icons here if needed */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info */}
            <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                {member.name}
            </h3>
            <p className="text-primary-500 font-medium text-sm uppercase tracking-wider">
                {member.role}
            </p>
        </motion.div>
    );
}
