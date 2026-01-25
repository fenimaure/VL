
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Briefcase, DollarSign, Link, RefreshCw } from 'lucide-react';

interface Career {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    is_active: boolean;
    slug: string;
    content: string;
    salary_range: string;
    benefits: string[];
    application_email: string;
}

export default function CareersManager() {
    const [items, setItems] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Career | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<Career>>({});

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            const { data, error } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setItems(data || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }

    function handleAddNew() {
        const empty: Partial<Career> = {
            title: '', department: 'Engineering', location: 'Remote', type: 'Full-time',
            description: '', requirements: [], is_active: true,
            slug: '', content: '', salary_range: '', benefits: [], application_email: ''
        };
        setEditing(empty as Career);
        setFormData(empty);
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
            // Auto-generate slug if empty
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            if (isNew) {
                await supabase.from('careers').insert([dataToSave]);
            } else {
                await supabase.from('careers').update(dataToSave).eq('id', editing?.id);
            }
            setEditing(null);
            fetchItems();
        } catch (e) { alert('Error saving career'); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this listing?')) return;
        await supabase.from('careers').delete().eq('id', id);
        fetchItems();
    }

    if (loading) return <div>Loading Careers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Careers</h2>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" /> Post Job
                </button>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Job Posting' : 'Edit Job'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">

                            {/* Basic Details */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Job Basics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Department</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Location</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                                        <select className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                    <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                </div>
                            </div>

                            {/* Extended Details */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-secondary-400 uppercase tracking-wider mb-2">Post Details</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                            <Link className="h-3 w-3" /> Slug
                                            <button type="button" onClick={generateSlug} className="text-xs text-primary-400 hover:text-white"><RefreshCw className="h-3 w-3" /></button>
                                        </label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2"><DollarSign className="h-3 w-3" /> Salary Range</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.salary_range || ''} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} placeholder="$80k - $120k" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Application Email</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.application_email || ''} onChange={e => setFormData({ ...formData, application_email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Active?</label>
                                        <div className="flex items-center gap-2 h-10">
                                            <input type="checkbox" checked={formData.is_active || false} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 bg-dark-950 rounded border-gray-600 text-primary-600 focus:ring-primary-500" />
                                            <span className="text-white">Is Published</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Requirements (comma list)</label>
                                    <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20" value={formData.requirements?.join(', ') || ''} onChange={e => setFormData({ ...formData, requirements: e.target.value.split(',').map(s => s.trim()) })} />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Benefits (comma list)</label>
                                    <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20" value={formData.benefits?.join(', ') || ''} onChange={e => setFormData({ ...formData, benefits: e.target.value.split(',').map(s => s.trim()) })} />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Content (Markdown)</label>
                                    <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-64 font-mono text-sm" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="# Job Description..." />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg gap-2 flex items-center"><Save className="h-4 w-4" /> Save Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-dark-900 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-primary-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500"><Briefcase className="h-5 w-5" /></div>
                            <div>
                                <h3 className="font-bold text-white">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.department} • {item.location} • {item.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{item.is_active ? 'Active' : 'Closed'}</span>
                            <button onClick={() => { setEditing(item); setFormData(item); setIsNew(false); }} className="text-gray-400 hover:text-white"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
