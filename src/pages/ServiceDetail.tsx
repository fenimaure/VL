import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowUpRight, Sparkles, Zap, Shield, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchService() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('services').select('*').eq('slug', slug).single();
                if (error) throw error;
                setService(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchService();
        window.scrollTo(0, 0);
    }, [slug]);

    // Intersection Observer for reveal animations
    useEffect(() => {
        if (loading || !service) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        const items = document.querySelectorAll('.stagger-item');
        items.forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, [loading, service]);

    if (loading) return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!service) return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
                <Link to="/" className="text-primary-500 hover:underline">Return to Home</Link>
            </div>
        </div>
    );

    const featureIcons = [Sparkles, Zap, Shield, Target];

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 selection:bg-primary-500/30 overflow-x-hidden transition-colors duration-500" ref={mainRef}>
            <Navbar />

            {/* Immersive Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col justify-end pt-40 pb-20">
                {/* Dynamic Background Media */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 opacity-40 blur-sm"
                        style={{
                            backgroundImage: `url(${service.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072'})`,
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-dark-950 dark:via-dark-950/80 dark:to-transparent transition-colors duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent dark:from-dark-950 dark:to-transparent transition-colors duration-500"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                    <Link to="/" className="stagger-item inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white mb-12 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                        Back to Exploration
                    </Link>

                    <div className="space-y-4 mb-20 max-w-4xl">
                        <div className="stagger-item flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 font-bold tracking-[0.3em] text-[10px] uppercase">Service Excellence</span>
                        </div>
                        <h1 className="stagger-item text-6xl md:text-8xl lg:text-[10rem] font-bold font-display text-black dark:text-white leading-[0.85] tracking-tighter mb-12 transition-colors duration-500">
                            {service.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? 'text-stroke-light dark:text-stroke-white italic font-light block transition-colors duration-500' : 'block'}>
                                    {word}{i === service.title.split(' ').length - 1 ? '.' : ''}
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>

                {/* Animated Scroll Badge */}
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-10 stagger-item">
                    <div className="h-20 w-[1px] bg-gradient-to-b from-primary-500 to-transparent"></div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-black/20 dark:text-white/20 font-bold vertical-text transition-colors duration-500">Infinite Craft</span>
                </div>
            </section>

            {/* Core Narrative Section */}
            <section className="py-40 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                        <div className="lg:col-span-4 stagger-item">
                            <h2 className="text-xs uppercase tracking-[0.5em] text-primary-500 font-bold mb-10">Narrative & Purpose</h2>
                            <p className="text-2xl md:text-3xl text-black dark:text-white font-light leading-relaxed font-display transition-colors duration-500">
                                {service.description}
                            </p>
                        </div>
                        <div className="lg:col-span-7 lg:offset-1 stagger-item">
                            <div className="prose prose-lg max-w-none dark:prose-invert prose-p:text-black/60 dark:prose-p:text-gray-400 transition-colors duration-500">
                                <div className="whitespace-pre-wrap font-light leading-[1.8]">
                                    {service.content || 'Our architectural approach ensures that every pixel and line of code serves a higher brand purpose...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Features Grid */}
            <section className="py-40 bg-black/[0.01] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] text-[20vw] font-black font-display leading-[0.8] select-none pointer-events-none">
                    CRAFT.
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
                        <div className="max-w-2xl stagger-item">
                            <h2 className="text-5xl lg:text-7xl font-bold font-display text-black dark:text-white mb-8 leading-none transition-colors duration-500">
                                Defining <span className="text-stroke-light dark:text-stroke-white italic font-light">Capabilities</span>
                            </h2>
                            <p className="text-xl text-black/60 dark:text-gray-400 font-light max-w-lg transition-colors duration-500">
                                We've refined the core pillars of our {service.title.toLowerCase()} service to deliver unparalleled value.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[3rem] overflow-hidden stagger-item transition-colors duration-500">
                        {(service.features || ['Premium Integration', 'Strategic Thinking', 'Technical Excellence', 'Measured Results']).map((feature: string, idx: number) => {
                            const Icon = featureIcons[idx % featureIcons.length];
                            return (
                                <div key={idx} className="group bg-white dark:bg-dark-950 p-12 md:p-20 hover:bg-gray-50 dark:hover:bg-white transition-all duration-700">
                                    <Icon className="h-10 w-10 text-primary-500 mb-10 group-hover:scale-110 transition-transform duration-500" />
                                    <h3 className="text-3xl font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-dark-950 transition-colors mb-6 font-display">
                                        {feature}
                                    </h3>
                                    <p className="text-black/60 dark:text-gray-400 group-hover:text-black/80 dark:group-hover:text-dark-950/60 transition-colors leading-relaxed">
                                        Implementing world-class standards through rigorous testing and human-centered design principles.
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Aesthetic CTA */}
            <section className="py-60 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center stagger-item">
                    <h2 className="text-5xl md:text-8xl font-bold font-display text-black dark:text-white mb-16 tracking-tighter leading-none transition-colors duration-500">
                        Ready to <span className="text-stroke-light dark:text-stroke-white italic font-light">Evolve</span> your vision?
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                        <a
                            href={`mailto:${service.contact_email || 'hello@lovelli.com'}`}
                            className="group relative px-12 py-6 bg-black text-white dark:bg-white dark:text-dark-950 rounded-full font-bold text-xl hover:scale-105 transition-all duration-500 flex items-center gap-4"
                        >
                            Start a Dialogue
                            <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-950 bg-gray-200 dark:bg-gray-800 transition-colors duration-500"></div>
                                ))}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 transition-colors duration-500">Join 50+ Global Brands</span>
                        </div>
                    </div>
                </div>

                {/* Background Branding Anchor */}
                <div className="absolute bottom-0 left-0 right-0 py-20 border-t border-black/5 dark:border-white/5 opacity-40 transition-colors duration-500">
                    <div className="text-huge opacity-[0.03] select-none pointer-events-none font-display text-center">
                        LOVELLI.
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
