import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, DollarSign, Check } from 'lucide-react';

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

const CATEGORIES = [
    'Social Media Management',
    'Web Development',
    'Virtual Assistants',
    'Talent Acquisition'
];

export default function PricingManager() {
    const [packages, setPackages] = useState<PricingPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<PricingPackage | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<PricingPackage>>({});

    useEffect(() => {
        fetchPackages();
    }, []);

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
        setEditing({
            id: '',
            category: CATEGORIES[0],
            title: '',
            price: '',
            description: '',
            features: [],
            is_popular: false,
            cta_text: 'Get Started',
            cta_link: '/contact'
        });
        setFormData({
            category: CATEGORIES[0],
            title: '',
            price: '',
            description: '',
            features: [],
            is_popular: false,
            cta_text: 'Get Started',
            cta_link: '/contact'
        });
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('pricing_packages').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('pricing_packages')
                    .update(formData)
                    .eq('id', editing?.id);
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
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
            if (error) throw error;
            fetchPackages();
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Pricing Packages</h2>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" /> Add Package
                </button>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Package' : 'Edit Package'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        value={formData.category || CATEGORIES[0]}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id="is_popular"
                                        checked={formData.is_popular || false}
                                        onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-dark-950 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_popular" className="text-sm text-gray-300 select-none cursor-pointer">
                                        Mark as Popular / Best Value
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Package Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g. Starter"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price</label>
                                    <input
                                        type="text"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g. $1,000/mo"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                                    placeholder="Brief summary of the package..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Features (One per line)</label>
                                <textarea
                                    value={Array.isArray(formData.features) ? formData.features.join('\n') : ''}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n') })}
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-32 font-mono text-sm"
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">CTA Text</label>
                                    <input
                                        type="text"
                                        value={formData.cta_text || 'Get Started'}
                                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">CTA Link</label>
                                    <input
                                        type="text"
                                        value={formData.cta_link || '/contact'}
                                        onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Save Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {CATEGORIES.map(category => {
                    const categoryPackages = packages.filter(p => p.category === category);
                    if (categoryPackages.length === 0) return null;

                    return (
                        <div key={category} className="space-y-4">
                            <h3 className="text-lg font-bold text-primary-400 border-b border-white/10 pb-2">{category}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryPackages.map((pkg) => (
                                    <div key={pkg.id} className="bg-dark-900 border border-white/10 p-6 rounded-xl hover:border-primary-500/30 transition-colors group relative flex flex-col">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(pkg)} className="text-gray-400 hover:text-white p-1 bg-black/50 rounded"><Edit2 className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(pkg.id)} className="text-red-400 hover:text-red-300 p-1 bg-black/50 rounded"><Trash2 className="h-4 w-4" /></button>
                                        </div>

                                        {pkg.is_popular && (
                                            <div className="absolute top-0 left-0 bg-primary-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-br-lg rounded-tl-xl">
                                                Popular
                                            </div>
                                        )}

                                        <div className="mb-4 mt-2">
                                            <h4 className="text-xl font-bold text-white">{pkg.title}</h4>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-2xl font-bold text-primary-400">{pkg.price}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{pkg.description}</p>
                                        </div>

                                        <div className="space-y-2 mb-6 flex-grow">
                                            {pkg.features?.slice(0, 3).map((feature, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                                                    <span className="line-clamp-1">{feature}</span>
                                                </div>
                                            ))}
                                            {pkg.features?.length > 3 && (
                                                <div className="text-xs text-gray-500 italic pl-6">+{pkg.features.length - 3} more features</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {packages.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-dark-900/50 rounded-xl border border-dashed border-white/10">
                        No pricing packages found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
