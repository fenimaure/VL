import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
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

export default function LatestBlogs() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('published', true)
                    .order('published_at', { ascending: false })
                    .limit(3);
                if (error) throw error;
                setPosts(data || []);
            } catch (error) {
                console.error('Error fetching latest blogs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    // Intersection Observer for scroll reveal
    useEffect(() => {
        if (loading || posts.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const items = document.querySelectorAll('.stagger-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, [loading, posts]);

    if (loading && posts.length === 0) return null;
    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-40 bg-white dark:bg-dark-950 relative overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-2xl stagger-item">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">Journal</span>
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none transition-colors duration-300">
                            <span className="text-black dark:text-white">Latest </span>
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Insights</span>
                        </h2>
                        <p className="text-xl text-black/70 dark:text-gray-400 leading-relaxed font-light max-w-lg transition-colors duration-300">
                            Thought leadership at the intersection of design methodology and engineering precision.
                        </p>
                    </div>

                    <Link
                        to="/blog"
                        className="stagger-item group flex items-center gap-4 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white text-black dark:text-white dark:hover:text-dark-950 transition-all duration-500 font-bold uppercase tracking-widest text-xs"
                    >
                        View All News
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post, idx) => (
                        <Link
                            to={`/blog/${post.slug}`}
                            key={post.id}
                            className="group flex flex-col stagger-item"
                            style={{ transitionDelay: `${idx * 0.1}s` }}
                        >
                            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/5 mb-8 bg-black/5 dark:bg-white/5 transition-colors duration-500 shadow-xl shadow-black/5 group-hover:shadow-2xl group-hover:shadow-black/10 dark:group-hover:shadow-black/40">
                                <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img
                                    src={post.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
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
            </div>
        </section>
    );
}
