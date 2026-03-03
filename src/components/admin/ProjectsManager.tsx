
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link, RefreshCw, Upload, Loader2, Check } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

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
    contact_email: string;
    challenge: string;
    is_featured?: boolean;
}

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Project | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({});

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [projectsRes, servicesRes] = await Promise.all([
                supabase.from('projects').select('*').order('created_at', { ascending: false }),
                supabase.from('services').select('title').order('title', { ascending: true })
            ]);

            if (projectsRes.error) throw projectsRes.error;
            if (servicesRes.error) throw servicesRes.error;

            setProjects(projectsRes.data || []);
            setServices(servicesRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    }

    function handleEdit(project: Project) {
        setEditing(project);
        setFormData(project);
        setIsNew(false);
    }

    function handleAddNew() {
        const defaultCategory = services.length > 0 ? services[0].title : 'General';
        setEditing({ id: '', title: '', category: '', description: '', image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', contact_email: '', challenge: '', is_featured: false });
        setFormData({ title: '', category: defaultCategory, description: '', image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', contact_email: '', challenge: '', is_featured: false });
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
            fetchData();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            const { data, error } = await supabase.from('projects').delete().eq('id', id).select();
            if (error) throw error;
            if (!data || data.length === 0) {
                alert('Delete was blocked by Supabase RLS. Please add a DELETE policy for authenticated users on the "projects" table.');
                return;
            }
            fetchData();
        } catch (error: any) {
            console.error('Error deleting project:', error);
            alert('Failed to delete: ' + (error?.message || 'Unknown error'));
        }
    }

    if (loading) return <div className="text-center p-8 text-gray-400">Loading projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-dark-900/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display mb-2">Portfolio Management</h2>
                    <p className="text-sm text-white/40 font-light uppercase tracking-widest">Active Exhibition: {projects.length} Works</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-3 bg-white text-dark-950 px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 group"
                >
                    <div className="bg-dark-950 rounded-full p-2 group-hover:rotate-90 transition-transform duration-500">
                        <Plus className="h-4 w-4 text-white" />
                    </div>
                    Curate New Project
                </button>
            </div>

            {editing && createPortal(
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100]">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 w-full h-full max-w-[1600px] max-h-[95vh] overflow-y-auto shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6 sticky top-0 bg-dark-900/95 backdrop-blur-sm z-10 py-2 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Project' : 'Edit Project'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Homepage Card Section */}
                            <div className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/5">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                    Portfolio Card
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
                                            placeholder="Project Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">Category</label>
                                        <select
                                            value={formData.category || ''}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            {services.map(s => (
                                                <option key={s.title} value={s.title}>{s.title}</option>
                                            ))}
                                            {services.length === 0 && <option value="General">No services found - using General</option>}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">Short Description</label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary-500 outline-none h-24 resize-none transition-all"
                                        placeholder="Brief summary for the project card..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">Project Image</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={formData.image_url || ''}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary-500 outline-none transition-all"
                                                        placeholder="Image URL"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-16 h-16 bg-black/50 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shrink-0 shadow-lg">
                                                {formData.image_url ? (
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-6 w-6 text-gray-600" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id="project-image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleUpload}
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="project-image-upload"
                                                className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all duration-300 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                                                        <span className="text-sm font-bold uppercase tracking-wider text-white/40">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="h-5 w-5 text-primary-500 group-hover:scale-110 transition-transform" />
                                                        <span className="text-sm font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60">Upload New Image</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">Tags</label>
                                    <input
                                        type="text"
                                        value={formData.tags ? formData.tags.join(', ') : ''}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary-500 outline-none transition-all"
                                        placeholder="React, TypeScript, Tailwind (comma separated)"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-primary-500/5 border border-primary-500/10 rounded-xl hover:bg-primary-500/10 transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.is_featured ? 'bg-primary-500 border-primary-500' : 'border-white/20 bg-black/50'}`}>
                                        {formData.is_featured && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <label className="text-white font-medium cursor-pointer select-none">
                                        Feature this project on homepage
                                    </label>
                                </div>
                            </div>

                            {/* Case Study Section */}
                            <div className="bg-white/5 p-6 rounded-2xl space-y-6 border border-white/5">
                                <h4 className="text-sm font-bold text-secondary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Link className="h-4 w-4" />
                                    Case Study Details
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2 font-medium flex items-center gap-2">
                                            Page Slug <span className="text-white/20 text-xs font-normal">(URL)</span>
                                            <button type="button" onClick={generateSlug} className="text-xs text-primary-400 hover:text-white bg-white/5 px-2 py-0.5 rounded ml-2" title="Generate from Title">Generate</button>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug || ''}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-secondary-500 outline-none transition-all"
                                            placeholder="my-project-slug"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">The Challenge</label>
                                        <textarea
                                            value={formData.challenge || ''}
                                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-secondary-500 outline-none h-24 resize-none transition-all"
                                            placeholder="Describe the main challenge or problem solved..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">Client Name</label>
                                        <input className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-secondary-500 outline-none transition-all" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">Year</label>
                                        <input className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-secondary-500 outline-none transition-all" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">My Role</label>
                                        <input className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-secondary-500 outline-none transition-all" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2 font-medium">Live URL</label>
                                        <input className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-secondary-500 outline-none transition-all" value={formData.live_url || ''} onChange={e => setFormData({ ...formData, live_url: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">Case Study Content</label>
                                    <div className="border border-white/10 rounded-lg overflow-hidden">
                                        <MarkdownEditor
                                            value={formData.content || ''}
                                            onChange={(val) => setFormData({ ...formData, content: val })}
                                            height={600}
                                            placeholder="# Project Overview\n\nTell the story of this project..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5 sticky bottom-0 bg-dark-900/95 backdrop-blur-sm p-4 -mx-6 -mb-6 rounded-b-xl z-10">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                >
                                    <Save className="h-4 w-4" /> Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
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
