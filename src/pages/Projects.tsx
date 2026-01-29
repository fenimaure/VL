import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
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

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-500">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl lg:text-6xl font-bold font-display mb-6">
                            <span className="text-black dark:text-white">Our </span>
                            <span className="text-gradient-purple">Projects</span>
                        </h1>
                        <p className="text-xl text-black/60 dark:text-gray-400 leading-relaxed">
                            Explore our complete portfolio of successful projects and creative solutions delivered to clients worldwide.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-8 bg-white dark:bg-dark-950 sticky top-0 z-30 border-b border-black/10 dark:border-white/10 backdrop-blur-lg bg-white/80 dark:bg-dark-950/80 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center gap-2 text-black/60 dark:text-gray-400 flex-shrink-0">
                            <Filter className="h-5 w-5" />
                            <span className="font-medium">Filter:</span>
                        </div>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black border border-black/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white dark:border-white/10'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        null
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-400">No projects found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 text-black/50 dark:text-gray-400">
                                Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        to={`/projects/${project.slug}`}
                                        className="group relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-900 border border-black/10 dark:border-white/10 hover:border-primary-500/30 transition-all duration-500 block"
                                    >
                                        {/* Featured Badge */}
                                        {project.is_featured && (
                                            <div className="absolute top-4 right-4 z-30 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-primary-500 to-purple-600 rounded-full">
                                                FEATURED
                                            </div>
                                        )}

                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-dark-950 dark:via-transparent dark:to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />

                                            {/* Tags */}
                                            <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                                                {project.tags?.slice(0, 2).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-md rounded-full border border-white/10"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="text-primary-400 text-sm font-semibold mb-2 uppercase tracking-wider">
                                                {project.category}
                                            </div>
                                            <h3 className="text-2xl font-bold text-black dark:text-white mb-3 font-display group-hover:text-primary-500 dark:group-hover:text-primary-200 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-black/60 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                                                {project.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-primary-400 font-medium group-hover:text-primary-300 transition-colors">
                                                View Project <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
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
