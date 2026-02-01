
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center text-black dark:text-white transition-colors duration-500">Loading...</div>;
    if (!post) return <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center text-black dark:text-white transition-colors duration-500">Article not found.</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
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

            <article className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-black/40 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white font-display mb-6 leading-tight transition-colors duration-500">{post.title}</h1>

                    <div className="flex items-center gap-6 text-sm text-black/60 dark:text-gray-500 mb-8 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-500">
                        <span className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString()}</span>
                        <SocialShare
                            title={post.title}
                            description={post.excerpt || post.content?.substring(0, 160) || ''}
                            hashtags={post.category ? [post.category] : []}
                            className="ml-auto"
                        />
                    </div>

                    <div className="mb-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl transition-all duration-500">
                        <img src={post.image_url || 'https://via.placeholder.com/1200x600'} alt={post.title} className="w-full h-auto" />
                    </div>

                    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-black dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 transition-colors duration-500">
                        <MarkdownRenderer content={post.content || ''} />
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
