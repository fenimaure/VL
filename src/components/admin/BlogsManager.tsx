
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
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

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('blogs').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('blogs').update(formData).eq('id', editing?.id);
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
        if (!confirm('Convert this post to history? (Delete)')) return;
        try {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    }

    if (loading) return <div>Loading Blogs...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Blog Posts</h2>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" /> New Post
                </button>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Post' : 'Edit Post'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        value={formData.slug || ''}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
                                <textarea
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                                    value={formData.excerpt || ''}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Content (Markdown)</label>
                                <MarkdownEditor
                                    value={formData.content || ''}
                                    onChange={val => setFormData({ ...formData, content: val })}
                                    height={500}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Author</label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        value={formData.author || ''}
                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        value={formData.image_url || ''}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published || false}
                                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-dark-950"
                                />
                                <label htmlFor="published" className="text-white">Published</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Save Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-dark-900 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-primary-500/30 transition-colors">
                        <div>
                            <h3 className="font-bold text-white text-lg">{post.title}</h3>
                            <div className="flex gap-3 text-sm text-gray-400">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span className={post.published ? "text-green-500" : "text-yellow-500"}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(post)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && <div className="text-center text-gray-500 py-12">No blog posts yet.</div>}
            </div>
        </div>
    );
}
