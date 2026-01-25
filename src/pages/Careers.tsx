import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, ArrowUpRight } from 'lucide-react';

interface Career {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    description: string;
}

export default function Careers() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCareers() {
            try {
                const { data, error } = await supabase.from('careers').select('*').eq('is_active', true).order('created_at', { ascending: false });
                if (error) throw error;
                setCareers(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCareers();
    }, []);

    // Intersection Observer for scroll reveal
    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        const items = document.querySelectorAll('.stagger-item');
        items.forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, [loading, careers]);

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300 selection:bg-primary-500/30">
            <Navbar />

            {/* Hero Section - Boutique Style */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-primary-500/10 blur-[120px] rounded-full floating-element"></div>
                    <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl stagger-item">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Careers</span>
                        </div>
                        <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-bold font-display text-white mb-10 leading-[0.85] tracking-tighter">
                            Shape the <br />
                            <span className="text-stroke-white italic font-light">Digital</span> Era<span className="text-primary-500">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12">
                            We're a collective of designers, engineers, and visionaries redefining the boundaries of digital craft. Join us on the frontier.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cinematic Agency Banner */}
            <section className="px-6 lg:px-8 stagger-item mb-20">
                <div className="max-w-[1600px] mx-auto">
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                        {/* Immersive Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent z-10 opacity-80"></div>
                        <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay z-10"></div>

                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                            alt="Agency Studio Culture"
                            className="parallax-image w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[6s] ease-out opacity-60 group-hover:opacity-100 transition-opacity"
                        />

                        {/* Banner Caption */}
                        <div className="absolute bottom-12 left-12 z-20 flex flex-col md:flex-row md:items-end justify-between right-12 gap-8">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-2 w-2 bg-primary-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Studio Sanctuary</span>
                                </div>
                                <h2 className="text-4xl md:text-7xl font-bold font-display text-white italic tracking-tighter shadow-text">The Art of <span className="text-stroke-white not-italic">Co</span>llaboration.</h2>
                            </div>

                            <div className="glass-card px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                                <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500 mb-2">Location Status</span>
                                <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    Manila Studios <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> Open
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Openings - Minimalist Elite Style */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 stagger-item">
                        <div>
                            <h2 className="text-4xl lg:text-6xl font-bold font-display text-white mb-6">Open Roles</h2>
                            <p className="text-gray-400 font-light tracking-wide italic">Current opportunities to join our studio.</p>
                        </div>
                        <div className="text-6xl font-black text-white/5 font-display select-none">
                            {careers.length.toString().padStart(2, '0')}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Fetching Roles...</p>
                        </div>
                    ) : careers.length > 0 ? (
                        <div className="border-t border-white/10">
                            {careers.map((job) => (
                                <Link to={`/careers/${job.slug}`} key={job.id} className="group block border-b border-white/10 stagger-item">
                                    <div className="py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 group-hover:px-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-xs font-bold tracking-[0.3em] text-primary-500 uppercase">
                                                <span>{job.department}</span>
                                                <span className="w-8 h-[1px] bg-white/20"></span>
                                                <span>{job.location}</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/40 group-hover:text-white transition-all duration-700 font-display">
                                                {job.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="hidden lg:block text-right">
                                                <span className="block text-white/20 text-xs font-bold uppercase tracking-widest mb-1">Contract Type</span>
                                                <span className="text-gray-400 font-light">{job.type}</span>
                                            </div>
                                            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                                                <ArrowUpRight className="h-8 w-8 text-white group-hover:text-dark-950 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 rounded-3xl border border-white/5 bg-white/[0.01] stagger-item">
                            <Briefcase className="h-10 w-10 text-gray-700 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">The studio is currently at full capacity.</h3>
                            <p className="text-gray-500 font-light">Follow our socials to be the first to know about new openings.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
