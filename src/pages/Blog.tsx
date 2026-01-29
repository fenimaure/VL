import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    author: string;
    published_at: string;
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase.from('blogs').select('*').eq('published', true).order('published_at', { ascending: false });
                if (error) throw error;
                setPosts(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
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
    }, [loading, posts]);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 selection:bg-primary-500/30 transition-colors duration-500">
            <Navbar />

            {/* Hero Section - Boutique Style */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full floating-element"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl stagger-item">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Newsroom</span>
                        </div>
                        <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-bold font-display text-black dark:text-white mb-10 leading-[0.85] tracking-tighter transition-colors duration-500">
                            Latest <br />
                            <span className="text-stroke-light dark:text-stroke-white italic font-light">Insights</span><span className="text-primary-500">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black/60 dark:text-gray-400 max-w-2xl leading-relaxed font-light transition-colors duration-500">
                            Thought leadership at the intersection of design methodology and engineering precision.
                        </p>
                    </div>
                </div>
            </section>

            {/* Article Grid */}
            <section className="pb-40 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        null
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {posts.map((post) => (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="group flex flex-col stagger-item"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/5 mb-8 bg-black/5 dark:bg-white/5 transition-colors duration-500">
                                        <div className="absolute inset-0 bg-primary-500/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <img
                                            src={post.image_url || 'https://via.placeholder.com/800x400'}
                                            alt={post.title}
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-primary-500 uppercase mb-4">
                                            <span>{post.author}</span>
                                            <span className="w-4 h-[1px] bg-black/20 dark:bg-white/20"></span>
                                            <span className="text-black/40 dark:text-white/40">{new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors font-display leading-tight mb-4">
                                            {post.title}
                                        </h3>

                                        <p className="text-black/60 dark:text-gray-400 font-light leading-relaxed mb-8 line-clamp-2 transition-colors duration-500">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-3 text-black dark:text-white font-bold tracking-[0.2em] text-[10px] uppercase transition-colors duration-500">
                                            <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary-500 after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left">
                                                Discover
                                            </span>
                                            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-primary-500" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 rounded-3xl border border-black/10 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] stagger-item transition-colors duration-500">
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No transmissions recorded.</h3>
                            <p className="text-black/60 dark:text-gray-500 font-light">The journal is currently clear. Check back shortly.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

