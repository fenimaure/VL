
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

    if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;
    if (!post) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Article not found.</div>;

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300">
            <Navbar />

            <article className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-6 leading-tight">{post.title}</h1>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 border-b border-white/10 pb-8">
                        <span className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString()}</span>
                        <button className="ml-auto text-primary-400 hover:text-primary-300 flex items-center gap-2">
                            <Share2 className="h-4 w-4" /> Share
                        </button>
                    </div>

                    <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={post.image_url || 'https://via.placeholder.com/1200x600'} alt={post.title} className="w-full h-auto" />
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="whitespace-pre-wrap">{post.content}</div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
