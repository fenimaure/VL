import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Check, ChevronLeft, Tag, DollarSign, List } from 'lucide-react';

interface PricingPackage {
    id: string;
    category: string;
    title: string;
    price: string;
    description: string;
    features: string[];
    is_popular: boolean;
    cta_text: string;
    cta_link: string;
}

export default function PricingManager() {
    const [packages, setPackages] = useState<PricingPackage[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<PricingPackage | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<PricingPackage>>({});

    useEffect(() => {
        fetchCategories();
        fetchPackages();
    }, []);

    async function fetchCategories() {
        try {
            const { data: services } = await supabase
                .from('services')
                .select('title')
                .order('created_at', { ascending: true });
            setCategories(services?.map(s => s.title) || []);
        } catch (error) {
            console.error('Error fetching services for categories:', error);
        }
    }

    async function fetchPackages() {
        try {
            const { data, error } = await supabase
                .from('pricing_packages')
                .select('*')
                .order('category', { ascending: true })
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            setPackages(data || []);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(pkg: PricingPackage) {
        setEditing(pkg);
        setFormData({ ...pkg });
        setIsNew(false);
    }

    function handleAddNew() {
        const empty: Partial<PricingPackage> = {
            category: categories[0] || '',
            title: '', price: '', description: '', features: [], is_popular: false,
            cta_text: 'Get Started', cta_link: '/contact'
        };
        setEditing(empty as PricingPackage);
        setFormData(empty);
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('pricing_packages').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('pricing_packages').update(formData).eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchPackages();
        } catch (error) {
            console.error('Error saving package:', error);
            alert('Failed to save package');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this package?')) return;
        try {
            const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
            if (error) throw error;
            fetchPackages();
        } catch (error: any) {
            console.error('Error deleting package:', error);
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
            <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditing(null)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"><ChevronLeft className="h-6 w-6" /></button>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display">{isNew ? 'New Pricing Tier' : `Edit Tier`}</h2>
                            <p className="text-sm text-gray-500">Define the value and features of this package.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"><Save className="h-5 w-5" /> Save Tier</button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: CORE DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Package Identity</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Service Category</label>
                                    <select
                                        value={formData.category || categories[0] || ''}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tier Name</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white text-lg font-medium outline-none focus:border-primary-500" placeholder="e.g. Starter" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Price Label</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input type="text" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white text-lg font-mono outline-none focus:border-primary-500" placeholder="e.g. $1,500/mo" required />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-primary-500/5 border border-white/5 rounded-2xl transition-all cursor-pointer hover:bg-primary-500/10" onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}>
                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.is_popular ? 'bg-primary-500 border-primary-500 shadow-glow' : 'border-white/20 bg-black/50'}`}>
                                        {formData.is_popular && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                    <label className="text-sm font-bold text-white cursor-pointer select-none uppercase tracking-tighter">Mark as "Best Value"</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: DESCRIPTION & CALL TO ACTION */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Call to Action</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Short Description</label>
                                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-24 resize-none outline-none focus:border-primary-500 transition-all" placeholder="Brief summary of this package's value..." />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Button Text</label>
                                    <input type="text" value={formData.cta_text || 'Get Started'} onChange={e => setFormData({ ...formData, cta_text: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Button Link</label>
                                    <input type="text" value={formData.cta_link || '/contact'} onChange={e => setFormData({ ...formData, cta_link: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500 font-mono text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: FEATURES */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Feature List</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                            <List className="absolute -top-4 -right-4 h-32 w-32 text-white/[0.02]" />
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Included Features (One per line)</label>
                            <textarea
                                value={Array.isArray(formData.features) ? formData.features.join('\n') : ''}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) })}
                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-60 resize-none outline-none focus:border-primary-500 transition-all font-mono text-sm"
                                placeholder="Feature 1&#10;Feature 2&#10;Feature 3..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Save Pricing Tier
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
                    <h2 className="text-3xl font-bold text-white font-display">Pricing Management</h2>
                    <p className="text-gray-500 mt-1">{packages.length} packages across {categories.length} services.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Add Package
                </button>
            </div>

            <div className="space-y-12">
                {categories.map((category: string) => {
                    const categoryPackages = packages.filter(p => p.category === category);
                    if (categoryPackages.length === 0) return null;

                    return (
                        <div key={category} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500 bg-primary-500/10 px-4 py-1.5 rounded-lg">{category}</h3>
                                <div className="h-px bg-white/5 flex-1" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryPackages.map((pkg) => (
                                    <div key={pkg.id} className="bg-dark-900 border border-white/10 p-8 rounded-3xl hover:border-primary-500/30 transition-all group relative flex flex-col">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(pkg)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary-600/20 transition-all"><Edit2 className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(pkg.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                        </div>

                                        {pkg.is_popular && (
                                            <div className="absolute -top-3 left-8 bg-primary-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full shadow-glow">
                                                Best Value
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold text-white mb-1 font-display">{pkg.title}</h4>
                                            <div className="text-3xl font-black text-primary-400 font-mono tracking-tighter">{pkg.price}</div>
                                            <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-2">{pkg.description}</p>
                                        </div>

                                        <div className="space-y-3 mb-8 flex-grow">
                                            {pkg.features?.slice(0, 4).map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3 text-xs text-gray-400 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1 flex-shrink-0" />
                                                    <span className="line-clamp-1">{feature}</span>
                                                </div>
                                            ))}
                                            {pkg.features?.length > 4 && (
                                                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-4">+{pkg.features.length - 4} More Benefits</div>
                                            )}
                                        </div>

                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 border-t border-white/5 pt-4">
                                            {pkg.cta_text} →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {packages.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><Tag className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">No pricing packages found in the archive.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Create Package →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
