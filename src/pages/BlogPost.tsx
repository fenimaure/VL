
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';
import ComponentRenderer from '../components/ComponentRenderer';

/* ═══════════════════════════════════════════════════════════════
   Helper: estimate reading time from content
   ═══════════════════════════════════════════════════════════════ */
function estimateReadTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').length;
    return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Parallax for background image
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.8]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

    useEffect(() => {
        async function fetchPost() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).eq('published', true).single();
                if (error) throw error;
                setPost(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white transition-colors duration-500">Loading...</div>;
    if (!post) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white transition-colors duration-500">Article not found.</div>;

    const readTime = estimateReadTime(post.content || '');
    const publishDate = new Date(post.published_at);
    const formattedDate = publishDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const hasImage = !!post.image_url;

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <SEO
                title={post.title}
                description={post.excerpt || post.content?.substring(0, 160) || ''}
                image={post.image_url}
                url={`/blog/${post.slug}`}
                type="article"
                author={post.author}
                publishedTime={post.published_at}
            />
            <Navbar />

            {/* ═══════════════════════════════════════════════════════════
               CINEMATIC COVER PHOTO HERO
               Full-viewport image with parallax, gradient overlay,
               and editorial typography layered on top.
               ═══════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative w-full min-h-[85vh] md:min-h-screen flex items-end overflow-hidden"
            >
                {/* ── L0: Background Image with Parallax ── */}
                {hasImage ? (
                    <motion.div
                        style={{ y: bgY, scale: bgScale }}
                        className="absolute inset-0 z-0 will-change-transform"
                    >
                        <img
                            src={post.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ filter: 'contrast(1.05) brightness(0.95)' }}
                        />
                    </motion.div>
                ) : (
                    /* Fallback: dark gradient mesh when no image */
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
                )}

                {/* ── L1: Gradient Overlay ── */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-black/20"
                />

                {/* ── L2: Film grain noise ── */}
                <div
                    className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '128px 128px',
                    }}
                />

                {/* ── L3: Content ── */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="relative z-10 w-full pb-16 md:pb-20 pt-40"
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Top meta row: category + read time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 mb-8"
                        >
                            {post.category && (
                                <>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/90 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                        {post.category}
                                    </span>
                                    <span className="text-white/30">·</span>
                                </>
                            )}
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                                {readTime} min read
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-[1.05] tracking-tight max-w-5xl mb-12"
                        >
                            {post.title}
                        </motion.h1>

                        {/* Author + Date row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-wrap items-center gap-8"
                        >
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm font-display">
                                        {(post.author || 'A').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-0.5">Author</p>
                                    <p className="text-sm font-medium text-white">{post.author || 'Lovelli'}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-0.5">Published</p>
                                <p className="text-sm font-medium text-white">{formattedDate}</p>
                            </div>

                            {/* Share */}
                            <div className="ml-auto">
                                <SocialShare
                                    title={post.title}
                                    description={post.excerpt || post.content?.substring(0, 160) || ''}
                                    hashtags={post.category ? [post.category] : []}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
               ARTICLE BODY
               Clean editorial layout with proper prose styling
               ═══════════════════════════════════════════════════════════ */}
            <article className="relative bg-white dark:bg-black transition-colors duration-500">
                {/* Back to blog link */}
                <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-16">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors duration-300 mb-12"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>
                </div>

                {/* Article content */}
                <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-32">
                    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-[1.9] prose-p:font-light prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-a:decoration-black/20 dark:prose-a:decoration-white/20 hover:prose-a:decoration-black dark:hover:prose-a:decoration-white prose-blockquote:border-l-black/20 dark:prose-blockquote:border-l-white/20 prose-blockquote:text-black/60 dark:prose-blockquote:text-white/60 prose-blockquote:font-serif prose-blockquote:italic prose-img:rounded-2xl prose-img:border prose-img:border-black/5 dark:prose-img:border-white/5 transition-colors duration-500">
                        <ComponentRenderer content={post.content || ''} />
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
