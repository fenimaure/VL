
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, ChevronLeft, Calendar, User, Image as ImageIcon, Link, Check } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    image_url: string;
    published: boolean;
}

export default function BlogsManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleAddNew() {
        setEditing({ id: '', title: '', slug: '', excerpt: '', content: '', author: '', image_url: '', published: false });
        setFormData({ title: '', slug: '', excerpt: '', content: '', author: '', image_url: '', published: false });
        setIsNew(true);
    }

    function handleEdit(post: BlogPost) {
        setEditing(post);
        setFormData(post);
        setIsNew(false);
    }

    function generateSlug() {
        if (!formData.title) return;
        const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            const dataToSave = { ...formData };
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            if (isNew) {
                const { error } = await supabase.from('blogs').insert([dataToSave]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('blogs').update(dataToSave).eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchPosts();
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Failed to save blog post');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            const { data, error } = await supabase.from('blogs').delete().eq('id', id).select();
            if (error) throw error;
            fetchPosts();
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete: ' + (error?.message || 'Unknown error'));
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
    );

    // FULL PAGE EDITOR VIEW
    if (editing) {
        return (
            <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setEditing(null)}
                            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display">
                                {isNew ? 'New Blog Post' : `Edit Post`}
                            </h2>
                            <p className="text-sm text-gray-500">Compose and publish your latest thoughts.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleSave}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <Save className="h-5 w-5" /> Save Post
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: HEADER INFO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Post Metadata</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Article Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all text-lg font-medium outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="Enter title..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center justify-between">
                                        URL Slug
                                        <button type="button" onClick={generateSlug} className="text-[9px] bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded hover:bg-primary-500/20 transition-all">Generate</button>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="blog-post-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Author</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                            <input
                                                type="text"
                                                value={formData.author || ''}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                                placeholder="Author name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <div className="flex items-center gap-3 p-4 bg-primary-500/5 border border-white/5 rounded-2xl transition-all cursor-pointer hover:bg-primary-500/10" onClick={() => setFormData({ ...formData, published: !formData.published })}>
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.published ? 'bg-primary-500 border-primary-500' : 'border-white/20 bg-black/50'}`}>
                                                {formData.published && <Check className="h-4 w-4 text-white" />}
                                            </div>
                                            <label className="text-sm font-bold text-white cursor-pointer select-none uppercase tracking-tighter">Published</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Featured Image URL</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.image_url || ''}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary-500 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden shrink-0 bg-black/50 shadow-2xl">
                                            {formData.image_url && <img src={formData.image_url} className="w-full h-full object-cover" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: EXCERPT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Excerpt & Summary</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Quick Summary (Shown on feed)</label>
                            <textarea
                                value={formData.excerpt || ''}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-24 resize-none outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                placeholder="A short hook to get readers interested..."
                            />
                        </div>
                    </div>

                    {/* SECTION 3: CONTENT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Main Story</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4 ml-1">Article Content (Markdown)</label>
                            <div className="rounded-2xl overflow-hidden border border-white/5">
                                <MarkdownEditor
                                    value={formData.content || ''}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    height={600}
                                    placeholder="# The journey begins..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Publish Update
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display">Blog Management</h2>
                    <p className="text-gray-500 mt-1">{posts.length} articles in your collection.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Write New Post
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <div key={post.id} className="bg-dark-900 border border-white/10 rounded-3xl p-6 flex items-center gap-6 hover:border-primary-500/30 transition-all group relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img
                                src={post.image_url || 'https://via.placeholder.com/200x200?text=Blog'}
                                alt=""
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{post.title}</h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-gray-500 flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                                <span className={post.published ? "text-green-500" : "text-yellow-500"}>
                                    {post.published ? '● Published' : '○ Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(post)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary-600/20 transition-all"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-3 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><Calendar className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">Your blog is currently empty.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Write Your First Post →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
