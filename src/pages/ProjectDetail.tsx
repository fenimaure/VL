import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowUpRight, Globe, User, Clock, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        <div className="min-h-screen bg-dark-950 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
            <div className="text-center px-6">
                <h1 className="text-4xl font-bold mb-4 font-display">Exhibition Not Found</h1>
                <Link to="/projects" className="text-primary-500 hover:tracking-widest transition-all duration-300 uppercase text-xs font-bold font-mono">Return to Portfolio</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300 selection:bg-primary-500/30 overflow-x-hidden" ref={mainRef}>
            <Navbar />

            {/* Cinematic Exhibition Hero */}
            <section className="relative min-h-screen flex flex-col justify-end pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-100 opacity-60 animate-ken-burns"
                        style={{ backgroundImage: `url(${project.image_url})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent"></div>
                    {/* Atmospheric Overlay */}
                    <div className="absolute inset-0 bg-mesh opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full mb-10">
                    <Link to="/projects" className="stagger-item inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white mb-12 transition-all group">
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

                        <h1 className="stagger-item text-6xl md:text-8xl lg:text-[10rem] font-bold font-display text-white leading-[0.8] tracking-tighter mb-16">
                            {project.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? 'text-stroke-white italic font-light block' : 'block'}>
                                    {word}{i === project.title.split(' ').length - 1 ? '.' : ''}
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>

                {/* Floating Navigation Prompt */}
                <div className="absolute bottom-20 right-10 flex flex-col items-end gap-10 stagger-item">
                    <div className="h-32 w-[1px] bg-gradient-to-b from-primary-500 to-transparent"></div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold vertical-text">Explore Findings</span>
                </div>
            </section>

            {/* Performance Metrics Bar (Stat Bar) */}
            <section className="relative z-20 -mt-10 border-y border-white/5 bg-dark-950/80 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10">
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-3 flex items-center gap-2">
                                <User className="h-3 w-3" /> Client
                            </div>
                            <div className="text-sm font-bold text-white uppercase tracking-wider">{project.client || 'Confidential'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-3 flex items-center gap-2">
                                <Layers className="h-3 w-3" /> Role
                            </div>
                            <div className="text-sm font-bold text-white uppercase tracking-wider">{project.role || 'Digital Production'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold mb-3 flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Duration
                            </div>
                            <div className="text-sm font-bold text-white uppercase tracking-wider">{project.duration || '3 Months'}</div>
                        </div>
                        <div className="stagger-item flex flex-col justify-center">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                                >
                                    <Globe className="h-3 w-3" /> View Deployment <ArrowUpRight className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            )}
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
                            <p className="text-3xl md:text-4xl text-white font-light leading-snug font-display">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-16">
                                {project.tags?.map((tag: string, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-white hover:text-dark-950 transition-all duration-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-7 lg:offset-1 stagger-item">
                            <div className="prose prose-invert prose-2xl max-w-none">
                                <div className="whitespace-pre-wrap text-gray-400 font-light leading-[1.8] text-xl md:text-2xl">
                                    {project.content || 'Our architectural approach ensures that every pixel and line of code serves a higher brand purpose...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exhibition Gallery Preview */}
            <section className="px-6 lg:px-8 mb-40">
                <div className="max-w-7xl mx-auto stagger-item">
                    <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <img
                            src={project.image_url}
                            alt={`${project.title} detailed shot`}
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-[3s] ease-out"
                        />

                        {/* Interactive Tooltip */}
                        <div className="absolute bottom-10 left-10 p-6 bg-dark-950/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
                            <span className="text-[10px] uppercase tracking-widest text-primary-500 font-bold block mb-2 underline underline-offset-4">Interactive Component</span>
                            <p className="text-sm text-white/70 max-w-xs font-light">Custom kinetic interface designed for seamless user engagement across all viewports.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Project / CTA Anchor */}
            <section className="py-60 relative overflow-hidden bg-white/[0.01]">
                <div className="max-w-4xl mx-auto px-6 text-center stagger-item">
                    <h2 className="text-5xl md:text-8xl font-bold font-display text-white mb-16 tracking-tighter leading-none">
                        Witnessed the <span className="text-stroke-white italic font-light">Evo</span>lution?
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                        <Link
                            to="/projects"
                            className="group relative px-12 py-6 bg-white text-dark-950 rounded-full font-bold text-xl hover:scale-105 transition-all duration-500 flex items-center gap-4"
                        >
                            Back To Exhibition
                            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                        </Link>

                        <a
                            href={`mailto:${project.contact_email || 'hello@lovelli.com'}`}
                            className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all underline underline-offset-8"
                        >
                            Discuss Your Project
                        </a>
                    </div>
                </div>

                {/* Aesthetic Background Branding */}
                <div className="absolute bottom-0 left-0 right-0 py-20 border-t border-white/5 opacity-40">
                    <div className="text-huge opacity-[0.03] select-none pointer-events-none font-display text-center">
                        LOVELLI.
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
