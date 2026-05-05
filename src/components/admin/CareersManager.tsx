
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Briefcase, DollarSign, Link, RefreshCw, ChevronLeft, MapPin, Clock, Check } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

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

    function handleEdit(item: Career) {
        setEditing(item);
        setFormData(item);
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
                await supabase.from('careers').insert([dataToSave]);
            } else {
                await supabase.from('careers').update(dataToSave).eq('id', editing?.id);
            }
            setEditing(null);
            fetchItems();
        } catch (e) { alert('Error saving career'); }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this listing?')) return;
        try {
            const { error } = await supabase.from('careers').delete().eq('id', id);
            if (error) throw error;
            fetchItems();
        } catch (error: any) {
            console.error('Error deleting career:', error);
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
                                {isNew ? 'New Opportunity' : `Edit Position`}
                            </h2>
                            <p className="text-sm text-gray-500">Draft the details for your next team member.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleSave}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <Save className="h-5 w-5" /> Save Posting
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: ROLE BASICS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Role Overview</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all text-lg font-medium outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="e.g. Creative Director"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Department</label>
                                        <input type="text" value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all" placeholder="e.g. Design" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Type</label>
                                        <select value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-3 text-white outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                            <input type="text" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-3 text-white outline-none focus:border-primary-500 transition-all" placeholder="Remote / Manila" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <div className="flex items-center gap-3 p-3.5 bg-primary-500/5 border border-white/5 rounded-2xl transition-all cursor-pointer hover:bg-primary-500/10" onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.is_active ? 'bg-primary-500 border-primary-500 shadow-glow' : 'border-white/20 bg-black/50'}`}>
                                                {formData.is_active && <Check className="h-4 w-4 text-white" />}
                                            </div>
                                            <label className="text-sm font-bold text-white cursor-pointer select-none uppercase tracking-tighter">Active</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Salary Range</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input type="text" value={formData.salary_range || ''} onChange={e => setFormData({ ...formData, salary_range: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-3 text-white outline-none focus:border-primary-500 transition-all" placeholder="e.g. $80k - $120k" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: APPLICATION & LINKS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Connect & Publish</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Application Email</label>
                                    <input type="email" value={formData.application_email || ''} onChange={e => setFormData({ ...formData, application_email: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500 transition-all" placeholder="careers@lovelli.com" />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center justify-between">
                                        Page Slug
                                        <button type="button" onClick={generateSlug} className="text-[9px] bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded hover:bg-primary-500/20 transition-all">Generate</button>
                                    </label>
                                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm outline-none focus:border-primary-500 transition-all" placeholder="job-slug" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: REQUIREMENTS & BENEFITS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">The Fine Print</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Key Requirements (One per line)</label>
                                <textarea
                                    value={formData.requirements ? formData.requirements.join('\n') : ''}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs h-40 font-mono outline-none focus:border-primary-500 transition-all"
                                    placeholder="5+ years of experience&#10;Expertise in Figma..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Perks & Benefits (One per line)</label>
                                <textarea
                                    value={formData.benefits ? formData.benefits.join('\n') : ''}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs h-40 font-mono outline-none focus:border-primary-500 transition-all"
                                    placeholder="Health Insurance&#10;Remote Work..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: FULL DESCRIPTION */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400 text-xs font-bold">4</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Full Posting Content</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4 ml-1">Detailed Description (Markdown)</label>
                            <div className="rounded-2xl overflow-hidden border border-white/5">
                                <MarkdownEditor
                                    value={formData.content || ''}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    height={600}
                                    placeholder="# Why work with us?..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Save Opportunity
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
                    <h2 className="text-3xl font-bold text-white font-display">Careers Management</h2>
                    <p className="text-gray-500 mt-1">{items.length} open positions in the pipeline.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Post Job Opportunity
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="bg-dark-900 border border-white/10 rounded-3xl p-6 flex flex-col hover:border-primary-500/30 transition-all group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary-600/20 transition-all"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-glow"><Briefcase className="h-6 w-6" /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{item.title}</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.department}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-grow">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <MapPin className="h-3 w-3" /> {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock className="h-3 w-3" /> {item.type}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                {item.is_active ? '● Active' : '○ Closed'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-600 font-mono tracking-tighter">/{item.slug}</span>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><Briefcase className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">No open positions at the moment.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Create a Posting →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
