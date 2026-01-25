
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link, RefreshCw } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string;
    tags: string[];
    slug: string;
    content: string;
    client: string;
    duration: string;
    role: string;
    live_url: string;
    is_featured?: boolean;
}

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isNew, setIsNew] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({});

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(project: Project) {
        setEditing(project);
        setFormData(project);
        setIsNew(false);
    }

    function handleAddNew() {
        setEditing({ id: '', title: '', category: '', description: '', image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', is_featured: false });
        setFormData({ title: '', category: 'Web Development', description: '', image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', is_featured: false });
        setIsNew(true);
    }

    function generateSlug() {
        if (!formData.title) return;
        const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            // Auto-generate slug if empty
            const dataToSave = { ...formData };
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            if (isNew) {
                const { error } = await supabase.from('projects').insert([dataToSave]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .update(dataToSave)
                    .eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }

    if (loading) return <div className="text-center p-8 text-gray-400">Loading projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Projects</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Project
                </button>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Project' : 'Edit Project'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Homepage Card Section */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Portfolio Card</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                                        <select
                                            value={formData.category || ''}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                                        >
                                            <option value="Web Development">Web Development</option>
                                            <option value="Mobile Development">Mobile Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Consulting">Consulting</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none h-24"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Main Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.image_url || ''}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                                            placeholder="https://..."
                                        />
                                        <div className="w-10 h-10 bg-dark-950 rounded flex items-center justify-center border border-white/10 overflow-hidden">
                                            {formData.image_url ? (
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags ? formData.tags.join(', ') : ''}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                                        placeholder="React, TypeScript, Tailwind"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured || false}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-dark-950 text-primary-500 focus:ring-2 focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_featured" className="text-white font-medium cursor-pointer">
                                        ⭐ Feature this project on homepage
                                    </label>
                                </div>
                            </div>

                            {/* Case Study Section */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-secondary-400 uppercase tracking-wider mb-2">Case Study Details</h4>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <Link className="h-3 w-3" /> Page Slug
                                        <button type="button" onClick={generateSlug} className="text-xs text-primary-400 hover:text-white" title="Generate from Title"><RefreshCw className="h-3 w-3" /></button>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm"
                                        placeholder="my-project-slug"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Duration</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3 Months" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">My Role</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Live URL</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.live_url || ''} onChange={e => setFormData({ ...formData, live_url: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Case Study Content (Markdown)</label>
                                    <textarea
                                        value={formData.content || ''}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-64 font-mono text-sm"
                                        placeholder="# Project Overview..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" /> Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-dark-900 border border-white/10 rounded-xl overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={project.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white truncate">{project.title}</h3>
                                <div className="flex gap-2 items-center">
                                    {project.is_featured && (
                                        <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded font-bold">⭐ FEATURED</span>
                                    )}
                                    <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded">{project.category}</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
                            {project.slug && <div className="text-xs text-gray-500 font-mono flex items-center gap-1"><Link className="h-3 w-3" /> /{project.slug}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
