import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, GripVertical, Eye, EyeOff } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    is_published: boolean;
}

export default function FAQManager() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<FAQ | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<FAQ>>({});

    useEffect(() => {
        fetchFAQs();
    }, []);

    async function fetchFAQs() {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(faq: FAQ) {
        setEditing(faq);
        setFormData({ ...faq });
        setIsNew(false);
    }

    function handleAddNew() {
        setEditing({
            id: '',
            question: '',
            answer: '',
            category: 'General',
            order_index: faqs.length,
            is_published: true
        });
        setFormData({
            question: '',
            answer: '',
            category: 'General',
            order_index: faqs.length,
            is_published: true
        });
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('faqs').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .update(formData)
                    .eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchFAQs();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Failed to save FAQ');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            const { data, error } = await supabase.from('faqs').delete().eq('id', id).select();
            if (error) throw error;
            if (!data || data.length === 0) {
                alert('Delete was blocked by Supabase RLS. Please add a DELETE policy for authenticated users on the "faqs" table.');
                return;
            }
            fetchFAQs();
        } catch (error: any) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete: ' + (error?.message || 'Unknown error'));
        }
    }

    async function togglePublished(faq: FAQ) {
        try {
            const { error } = await supabase
                .from('faqs')
                .update({ is_published: !faq.is_published })
                .eq('id', faq.id);
            if (error) throw error;
            fetchFAQs();
        } catch (error) {
            console.error('Error toggling FAQ visibility:', error);
        }
    }

    if (loading) return <div>Loading...</div>;

    // Group by category
    const groupedFAQs: Record<string, FAQ[]> = {};
    faqs.forEach(faq => {
        const cat = faq.category || 'General';
        if (!groupedFAQs[cat]) groupedFAQs[cat] = [];
        groupedFAQs[cat].push(faq);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage FAQs</h2>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" /> Add FAQ
                </button>
            </div>

            {/* Edit / Create Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New FAQ' : 'Edit FAQ'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category || ''}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g. General, Pricing, Process"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Order</label>
                                        <input
                                            type="number"
                                            value={formData.order_index ?? 0}
                                            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            checked={formData.is_published ?? true}
                                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-600 bg-dark-950 text-primary-600 focus:ring-primary-500"
                                        />
                                        <label htmlFor="is_published" className="text-sm text-gray-300 select-none cursor-pointer">
                                            Published
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Question</label>
                                <input
                                    type="text"
                                    value={formData.question || ''}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    placeholder="e.g. What services do you offer?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Answer</label>
                                <textarea
                                    value={formData.answer || ''}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-40 resize-none font-light"
                                    placeholder="Enter the answer here..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Save FAQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FAQ List by Category */}
            <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="text-lg font-bold text-primary-400 border-b border-white/10 pb-2">{category}</h3>
                        <div className="space-y-2">
                            {categoryFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`bg-dark-900 border rounded-xl p-5 transition-colors group relative flex items-start gap-4 ${faq.is_published
                                            ? 'border-white/10 hover:border-primary-500/30'
                                            : 'border-white/5 opacity-50'
                                        }`}
                                >
                                    <div className="flex-shrink-0 pt-1 text-gray-600">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold text-base truncate">{faq.question}</h4>
                                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{faq.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button
                                                    onClick={() => togglePublished(faq)}
                                                    className={`p-1.5 rounded transition-colors ${faq.is_published ? 'text-green-400 hover:text-green-300 bg-green-400/10' : 'text-gray-500 hover:text-gray-300 bg-white/5'}`}
                                                    title={faq.is_published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {faq.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                                <button onClick={() => handleEdit(faq)} className="text-gray-400 hover:text-white p-1.5 bg-white/5 rounded">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(faq.id)} className="text-red-400 hover:text-red-300 p-1.5 bg-red-400/10 rounded">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                                Order: {faq.order_index}
                                            </span>
                                            {!faq.is_published && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-dark-900/50 rounded-xl border border-dashed border-white/10">
                        No FAQs found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
