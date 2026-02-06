import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowUpRight, Globe, User, Calendar, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProject() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
                if (error) throw error;
                setProject(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
        window.scrollTo(0, 0);
    }, [slug]);

    // Intersection Observer for reveal animations
    useEffect(() => {
        if (loading || !project) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        const items = document.querySelectorAll('.stagger-item');
        items.forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, [loading, project]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center transition-colors duration-500">
            <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center text-black dark:text-white transition-colors duration-500">
            <div className="text-center px-6">
                <h1 className="text-4xl font-bold mb-4 font-display">Exhibition Not Found</h1>
                <Link to="/projects" className="text-primary-500 hover:tracking-widest transition-all duration-300 uppercase text-xs font-bold font-mono">Return to Portfolio</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 selection:bg-primary-500/30 overflow-x-hidden transition-colors duration-500" ref={mainRef}>
            <SEO
                title={project.title}
                description={project.description}
                image={project.image_url}
                url={`/projects/${project.slug}`}
                type="article"
            />
            <Navbar />

            {/* Cinematic Exhibition Hero */}
            <section className="relative min-h-screen flex flex-col justify-end pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-100 opacity-60 animate-ken-burns"
                        style={{ backgroundImage: `url(${project.image_url})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-dark-950 dark:via-dark-950/60 dark:to-transparent transition-colors duration-500"></div>
                    {/* Atmospheric Overlay */}
                    <div className="absolute inset-0 bg-mesh opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full mb-10">
                    <Link to="/projects" className="stagger-item inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white mb-12 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                        The Selection
                    </Link>

                    <div className="space-y-4">
                        <div className="stagger-item flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">
                                Case Study • {project.category}
                            </span>
                        </div>

                        <h1 className="stagger-item text-6xl md:text-8xl lg:text-[10rem] font-bold font-display text-black dark:text-white leading-[0.8] tracking-tighter mb-16 transition-colors duration-500">
                            {project.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? 'text-stroke-light dark:text-stroke-white italic font-light block transition-colors duration-500' : 'block'}>
                                    {word}{i === project.title.split(' ').length - 1 ? '.' : ''}
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>

                {/* Floating Navigation Prompt */}
                <div className="absolute bottom-20 right-10 flex flex-col items-end gap-10 stagger-item">
                    <div className="h-32 w-[1px] bg-gradient-to-b from-primary-500 to-transparent"></div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-black/20 dark:text-white/20 font-bold vertical-text transition-colors duration-500">Explore Findings</span>
                </div>
            </section>

            {/* Performance Metrics Bar (Stat Bar) */}
            <section className="relative z-20 -mt-10 border-y border-black/5 dark:border-white/5 bg-white/80 dark:bg-dark-950/80 backdrop-blur-2xl transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10">
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2 transition-colors duration-500">
                                <User className="h-3 w-3" /> Client
                            </div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider transition-colors duration-500">{project.client || 'Confidential'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2 transition-colors duration-500">
                                <Layers className="h-3 w-3" /> Role
                            </div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider transition-colors duration-500">{project.role || 'Digital Production'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2 transition-colors duration-500">
                                <Calendar className="h-3 w-3" /> Year
                            </div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider transition-colors duration-500">{project.duration || '2024'}</div>
                        </div>
                        <div className="stagger-item flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                {project.live_url && (
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-3 text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em] hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <Globe className="h-3 w-3" /> View Deployment <ArrowUpRight className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                )}
                                <SocialShare
                                    title={project.title}
                                    description={project.description}
                                    hashtags={project.tags ? project.tags.slice(0, 3) : []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Narrative */}
            <section className="py-40 relative">
                {/* Vertical Background Text */}
                <div className="absolute top-0 left-0 h-full w-20 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden select-none">
                    <span className="text-[10vw] font-black font-display vertical-text tracking-widest leading-none">STRATEGY</span>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                        <div className="lg:col-span-4 stagger-item">
                            <h2 className="text-xs uppercase tracking-[0.5em] text-primary-500 font-bold mb-10">The Challenge</h2>
                            <p className="text-3xl md:text-4xl text-black dark:text-white font-light leading-snug font-display transition-colors duration-500">
                                {project.challenge || project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-16">
                                {project.tags?.map((tag: string, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-dark-950 transition-all duration-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-7 lg:offset-1 stagger-item">
                            <MarkdownRenderer
                                content={project.content || 'Our architectural approach ensures that every pixel and line of code serves a higher brand purpose...'}
                                className="font-light leading-[1.8] text-lg md:text-xl text-black/80 dark:text-gray-300 transition-colors duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>





            <Footer />
        </div>
    );
}
