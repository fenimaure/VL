import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Filter, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    challenge?: string;
    content?: string;
    client?: string;
    role?: string;
    duration?: string;
    live_url?: string;
    contact_email?: string;
    image_url: string;
    tags: string[];
    slug: string;
    is_featured?: boolean;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setProjects(data || []);
                setFilteredProjects(data || []);

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(data?.map(p => p.category) || [])];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, projects]);

    // Intersection Observer for reveal animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                }
            });
        }, { threshold: 0.1 });

        const items = document.querySelectorAll('.reveal-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, [filteredProjects]);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-500 relative overflow-hidden">
            {/* Animated background gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <Navbar />

            {/* Cinematic Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                {/* Radial gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Floating badge */}
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-full mb-12 border border-primary-500/20 reveal-item">
                            <Sparkles className="h-4 w-4 text-primary-500 dark:text-primary-400 animate-pulse" />
                            <span className="text-sm font-bold tracking-wider text-black dark:text-white">Portfolio Showcase</span>
                            <Zap className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                        </div>

                        {/* Massive headline */}
                        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold font-display mb-8 leading-[0.9] tracking-tighter reveal-item">
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-black to-black/60 dark:from-white dark:to-white/60 animate-fade-in-up">
                                Our
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 animate-gradient-xy animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Projects
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-black/70 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-16 reveal-item font-light" style={{ animationDelay: '0.2s' }}>
                            Explore our complete portfolio of <span className="text-primary-500 font-bold">transformative</span> projects and creative solutions delivered to clients worldwide.
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto reveal-item" style={{ animationDelay: '0.3s' }}>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-500 mb-2">{projects.length}+</div>
                                <div className="text-sm text-black/70 dark:text-gray-400 uppercase tracking-wider">Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-500 mb-2">{categories.length - 1}</div>
                                <div className="text-sm text-black/70 dark:text-gray-400 uppercase tracking-wider">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
                                <div className="text-sm text-black/70 dark:text-gray-400 uppercase tracking-wider">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative scroll indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 reveal-item" style={{ animationDelay: '0.4s' }}>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50">Scroll</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-black/50 to-transparent dark:from-white/50 dark:to-transparent animate-bounce" />
                </div>
            </section>

            {/* Premium Filter Section */}
            <section className="py-8 sticky top-24 z-40 backdrop-blur-2xl bg-white/70 dark:bg-dark-950/70 border-y border-black/10 dark:border-white/10 shadow-lg transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center gap-3 text-black/60 dark:text-gray-400 flex-shrink-0">
                            <Filter className="h-5 w-5" />
                            <span className="font-bold text-sm uppercase tracking-wider">Filter:</span>
                        </div>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`group relative px-6 py-3 rounded-full font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black border border-black/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white dark:border-white/10'
                                    }`}
                            >
                                {/* Shine effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative text-sm">{category}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Projects Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-500 animate-pulse" />
                            </div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-40">
                            <div className="inline-flex items-center gap-3 text-xl text-black/40 dark:text-gray-500 mb-4">
                                <Filter className="h-6 w-6" />
                                <p>No projects found in this category</p>
                            </div>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="text-primary-500 hover:text-primary-400 font-bold underline underline-offset-4"
                            >
                                View all projects
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Results count */}
                            <div className="flex items-center justify-between mb-16">
                                <div className="text-black/50 dark:text-gray-400 font-medium">
                                    Showing <span className="text-primary-500 font-bold">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
                                </div>
                            </div>

                            {/* Masonry-inspired grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Separate component for each project card with advanced effects
function ProjectCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // 3D tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        setIsHovered(false);
    };

    return (
        <Link
            to={`/projects/${project.slug}`}
            className="reveal-item block"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-dark-900 dark:to-dark-900/50 border border-black/10 dark:border-white/10 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-primary-500/20"
                style={{ transition: 'transform 0.1s ease-out' }}
            >
                {/* Featured Badge */}
                {project.is_featured && (
                    <div className="absolute top-4 right-4 z-30 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                        ⭐ FEATURED
                    </div>
                )}

                {/* Luminous glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />
                </div>

                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 group-hover:from-black/60 transition-all duration-700" />

                    {/* Main image */}
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out filter group-hover:brightness-110"
                    />

                    {/* Sparkle effect on hover */}
                    {isHovered && (
                        <div className="absolute inset-0 z-20">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: `${1 + Math.random()}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                        {project.tags?.slice(0, 2).map((tag, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-black/40 backdrop-blur-xl rounded-full border border-white/20"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Hover icon */}
                    <div className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-white dark:bg-dark-950 rounded-full flex items-center justify-center transform translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                        <ArrowUpRight className="h-5 w-5 text-primary-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-10">
                    <div className="text-primary-500 dark:text-primary-400 text-sm font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary-500 dark:bg-primary-400" />
                        {project.category}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4 font-display group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-500 leading-tight">
                        {project.title}
                    </h3>

                    <p className="text-black/70 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3 font-light">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary-500 dark:text-primary-400 font-bold group-hover:gap-4 transition-all duration-300 text-sm uppercase tracking-wider">
                        View Project
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
                    </div>
                </div>

                {/* Shine effect on card */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                </div>
            </div>
        </Link>
    );
}
