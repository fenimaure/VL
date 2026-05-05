import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, GripVertical, Eye, EyeOff, ChevronLeft, HelpCircle, Hash, Check } from 'lucide-react';

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
        const empty: Partial<FAQ> = {
            question: '', answer: '', category: 'General',
            order_index: faqs.length, is_published: true
        };
        setEditing(empty as FAQ);
        setFormData(empty);
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('faqs').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('faqs').update(formData).eq('id', editing?.id);
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
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) throw error;
            fetchFAQs();
        } catch (error: any) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete: ' + (error?.message || 'Unknown error'));
        }
    }

    async function togglePublished(faq: FAQ) {
        try {
            const { error } = await supabase.from('faqs').update({ is_published: !faq.is_published }).eq('id', faq.id);
            if (error) throw error;
            fetchFAQs();
        } catch (error) {
            console.error('Error toggling FAQ visibility:', error);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
    );

    // Group by category
    const groupedFAQs: Record<string, FAQ[]> = {};
    faqs.forEach(faq => {
        const cat = faq.category || 'General';
        if (!groupedFAQs[cat]) groupedFAQs[cat] = [];
        groupedFAQs[cat].push(faq);
    });

    // FULL PAGE EDITOR VIEW
    if (editing) {
        return (
            <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditing(null)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"><ChevronLeft className="h-6 w-6" /></button>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display">{isNew ? 'New FAQ' : `Edit FAQ`}</h2>
                            <p className="text-sm text-gray-500">Answer common questions for your clients.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"><Save className="h-5 w-5" /> Save FAQ</button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: CORE DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">FAQ Context</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Category</label>
                                    <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all outline-none" placeholder="e.g. Services / General" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Display Order</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                            <input type="number" value={formData.order_index ?? 0} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} className="w-full bg-dark-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-primary-500" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <div className="flex items-center gap-3 p-3.5 bg-primary-500/5 border border-white/5 rounded-2xl transition-all cursor-pointer hover:bg-primary-500/10" onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}>
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.is_published ? 'bg-primary-500 border-primary-500 shadow-glow' : 'border-white/20 bg-black/50'}`}>
                                                {formData.is_published && <Check className="h-4 w-4 text-white" />}
                                            </div>
                                            <label className="text-sm font-bold text-white cursor-pointer select-none uppercase tracking-tighter">Published</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: THE CONTENT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Question & Answer</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">The Question</label>
                                <input type="text" value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-lg font-medium outline-none focus:border-primary-500 transition-all" placeholder="What is the meaning of life?" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">The Answer</label>
                                <textarea value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-48 resize-none outline-none focus:border-primary-500 transition-all leading-relaxed" placeholder="Type your answer here..." required />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Save FAQ Item
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
                    <h2 className="text-3xl font-bold text-white font-display">FAQ Management</h2>
                    <p className="text-gray-500 mt-1">{faqs.length} questions across {Object.keys(groupedFAQs).length} categories.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Add New Question
                </button>
            </div>

            <div className="space-y-12">
                {Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
                    <div key={category} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500 bg-primary-500/10 px-4 py-1.5 rounded-lg">{category}</h3>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>
                        <div className="space-y-3">
                            {categoryFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`bg-dark-900 border rounded-[2rem] p-6 transition-all group relative flex items-center gap-6 ${faq.is_published ? 'border-white/10 hover:border-primary-500/30' : 'border-white/5 opacity-50'}`}
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 flex-shrink-0">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-lg truncate pr-20">{faq.question}</h4>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{faq.answer}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pr-2">
                                        <button onClick={() => togglePublished(faq)} className={`p-3 rounded-xl transition-all ${faq.is_published ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>{faq.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                                        <button onClick={() => handleEdit(faq)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(faq.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><HelpCircle className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">No FAQs found in the archive.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Create FAQ →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
