
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, Calendar, User, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Project not found.</div>;

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>

                    <div className="max-w-4xl">
                        <span className="text-primary-400 font-bold tracking-wider uppercase text-sm mb-4 block">{project.category}</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6 leading-tight">{project.title}</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">{project.description}</p>
                    </div>
                </div>
            </section>

            {/* Main Image */}
            <section className="px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Sidebar Info */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-dark-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-6">Project Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-2"><User className="h-3 w-3" /> Client</div>
                                        <div className="text-white font-medium">{project.client || 'Confidential'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Calendar className="h-3 w-3" /> Duration</div>
                                        <div className="text-white font-medium">{project.duration || 'Ongoing'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Briefcase className="h-3 w-3" /> My Role</div>
                                        <div className="text-white font-medium">{project.role || 'Lead Developer'}</div>
                                    </div>
                                    {project.live_url && (
                                        <div className="pt-4">
                                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                                Visit Live Site <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-dark-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags?.map((tag: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Case Study Content */}
                        <div className="lg:col-span-8">
                            <div className="prose prose-invert max-w-none prose-lg">
                                <div className="whitespace-pre-wrap">{project.content || 'Case study details coming soon...'}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
