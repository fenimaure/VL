
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link, Upload, Loader2, Check, ChevronLeft } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

interface Work {
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
    brand_requirements?: string;
    what_we_did?: string;
    client_description?: string;
    is_featured?: boolean;
    hero_image_url?: string;
}

export default function WorksManager() {
    const [works, setWorks] = useState<Work[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Work | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Work>>({});

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [worksRes, servicesRes] = await Promise.all([
                supabase.from('works').select('*').order('created_at', { ascending: false }),
                supabase.from('services').select('title').order('title', { ascending: true })
            ]);

            if (worksRes.error) throw worksRes.error;
            if (servicesRes.error) throw servicesRes.error;

            setWorks(worksRes.data || []);
            setServices(servicesRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'hero_image_url' = 'image_url') => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `works/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    function handleEdit(work: Work) {
        setEditing(work);
        setFormData(work);
        setIsNew(false);
    }

    function handleAddNew() {
        const defaultCategory = services.length > 0 ? services[0].title : 'General';
        setEditing({ id: '', title: '', category: '', description: '', image_url: '', hero_image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', contact_email: '', challenge: '', brand_requirements: '', what_we_did: '', client_description: '', is_featured: false });
        setFormData({ title: '', category: defaultCategory, description: '', image_url: '', hero_image_url: '', tags: [], slug: '', content: '', client: '', duration: '', role: '', live_url: '', contact_email: '', challenge: '', brand_requirements: '', what_we_did: '', client_description: '', is_featured: false });
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
            const dataToSave = { ...formData };
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            if (isNew) {
                const { error } = await supabase.from('works').insert([dataToSave]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('works').update(dataToSave).eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchData();
        } catch (error) {
            console.error('Error saving work:', error);
            alert('Failed to save work');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this work?')) return;
        try {
            const { data, error } = await supabase.from('works').delete().eq('id', id).select();
            if (error) throw error;
            if (!data || data.length === 0) {
                alert('Delete was blocked by Supabase RLS.');
                return;
            }
            fetchData();
        } catch (error: any) {
            console.error('Error deleting work:', error);
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
                                {isNew ? 'New Portfolio Piece' : `Edit ${editing.title}`}
                            </h2>
                            <p className="text-sm text-gray-500">Curate the details of your latest project.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleSave}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <Save className="h-5 w-5" /> Save Work
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: CORE CARD INFO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Portfolio Card</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all text-lg font-medium outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="e.g. Modern E-commerce"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Service Category</label>
                                    <select
                                        value={formData.category || ''}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        {services.map(s => (
                                            <option key={s.title} value={s.title}>{s.title}</option>
                                        ))}
                                        {services.length === 0 && <option value="General">No services found</option>}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Project Summary</label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-32 resize-none focus:border-primary-500 transition-all outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="Brief overview for the card..."
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-primary-500/5 border border-white/5 rounded-2xl transition-all cursor-pointer hover:bg-primary-500/10" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}>
                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.is_featured ? 'bg-primary-500 border-primary-500 shadow-glow' : 'border-white/20 bg-black/50'}`}>
                                        {formData.is_featured && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                    <label className="text-sm font-bold text-white cursor-pointer select-none">Feature on Homepage</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: VISUALS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Visual Assets</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            {/* Thumbnail */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Thumbnail Image</label>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.image_url || ''}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white text-xs outline-none focus:border-primary-500 transition-all"
                                            placeholder="URL..."
                                        />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0 bg-black/50">
                                        {formData.image_url && <img src={formData.image_url} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <input type="file" id="thumb-upload" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'image_url')} />
                                    <label htmlFor="thumb-upload" className={`flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary-500" /> : <Upload className="h-5 w-5 text-gray-500 group-hover:text-primary-400 transition-colors" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-gray-500">Upload Thumbnail</span>
                                    </label>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Hero Background</label>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.hero_image_url || ''}
                                            onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white text-xs outline-none focus:border-primary-500 transition-all"
                                            placeholder="Hero URL..."
                                        />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0 bg-black/50">
                                        {formData.hero_image_url && <img src={formData.hero_image_url} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <input type="file" id="hero-upload" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'hero_image_url')} />
                                    <label htmlFor="hero-upload" className={`flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary-500" /> : <Upload className="h-5 w-5 text-gray-500 group-hover:text-primary-400 transition-colors" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-gray-500">Upload Hero Image</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CASE STUDY DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Case Study Context</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center justify-between">
                                        URL Slug
                                        <button type="button" onClick={generateSlug} className="text-[9px] bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded hover:bg-primary-500/20 transition-all">Generate</button>
                                    </label>
                                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white font-mono text-sm outline-none focus:border-primary-500 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Client Name</label>
                                        <input type="text" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Year</label>
                                        <input type="text" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" placeholder="e.g. 2024" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Role</label>
                                        <input type="text" value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Live Link</label>
                                        <input type="text" value={formData.live_url || ''} onChange={e => setFormData({ ...formData, live_url: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tech Tags (CSV)</label>
                                    <input type="text" value={formData.tags ? formData.tags.join(', ') : ''} onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" placeholder="React, Figma, API..." />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">The Challenge</label>
                                    <textarea value={formData.challenge || ''} onChange={e => setFormData({ ...formData, challenge: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white h-24 resize-none outline-none focus:border-primary-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Brand Requirements</label>
                                    <textarea value={formData.brand_requirements || ''} onChange={e => setFormData({ ...formData, brand_requirements: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white h-24 resize-none outline-none focus:border-primary-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">What We Did</label>
                                    <textarea value={formData.what_we_did || ''} onChange={e => setFormData({ ...formData, what_we_did: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white h-24 resize-none outline-none focus:border-primary-500 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: DETAILED NARRATIVE */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400 text-xs font-bold">4</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Case Study Narrative</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4 ml-1">In-Depth Project Breakdown (Markdown)</label>
                            <div className="rounded-2xl overflow-hidden border border-white/5">
                                <MarkdownEditor
                                    value={formData.content || ''}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    height={600}
                                    placeholder="# Work Overview\n\nTell the story of this work..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard Changes</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Save Progress
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
                    <h2 className="text-3xl font-bold text-white font-display">Portfolio Management</h2>
                    <p className="text-gray-500 mt-1">Active Exhibition: {works.length} Projects</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Curate New Work
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {works.map((work) => (
                    <div key={work.id} className="bg-dark-900 border border-white/10 rounded-3xl overflow-hidden hover:border-primary-500/30 transition-all group relative flex flex-col">
                        <div className="h-56 overflow-hidden relative">
                            <img
                                src={work.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                                alt={work.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                <button onClick={() => handleEdit(work)} className="p-3 bg-white text-black rounded-xl hover:bg-primary-500 hover:text-white transition-all transform hover:scale-110"><Edit2 className="h-5 w-5" /></button>
                                <button onClick={() => handleDelete(work.id)} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-110"><Trash2 className="h-5 w-5" /></button>
                            </div>
                            <div className="absolute top-4 left-4 flex gap-2">
                                {work.is_featured && <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">Featured</span>}
                                <span className="bg-primary-500 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">{work.category}</span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2 font-display">{work.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">{work.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Link className="h-3 w-3" /> /{work.slug}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{work.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {works.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><ImageIcon className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">No works found in the collection.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Start Curating →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

