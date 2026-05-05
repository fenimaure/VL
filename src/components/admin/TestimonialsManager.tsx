
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, User as UserIcon, ChevronLeft, Star, Image as ImageIcon, Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image_url: string;
}

export default function TestimonialsManager() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<Testimonial>>({});

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(item: Testimonial) {
        setEditing(item);
        setFormData(item);
        setIsNew(false);
    }

    function handleAddNew() {
        setEditing({ id: '', name: '', role: '', content: '', rating: 5, image_url: '' });
        setFormData({ name: '', role: '', content: '', rating: 5, image_url: '' });
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (isNew) {
                const { error } = await supabase.from('testimonials').insert([formData]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('testimonials').update(formData).eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchItems();
        } catch (error) {
            console.error('Error saving testimonial:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            fetchItems();
        } catch (error: any) {
            console.error('Error deleting:', error);
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
            <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                {isNew ? 'New Testimonial' : `Edit Review`}
                            </h2>
                            <p className="text-sm text-gray-500">Capture the kind words from your clients.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleSave}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <Save className="h-5 w-5" /> Save Review
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-10">
                    {/* SECTION 1: CLIENT INFO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Client Profile</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Client Name</label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all text-lg font-medium outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Role / Company</label>
                                    <input
                                        type="text"
                                        value={formData.role || ''}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="e.g. CEO of TechCorp"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Avatar URL</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.image_url || ''}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary-500 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden shrink-0 bg-black/50 shadow-2xl">
                                            {formData.image_url ? <img src={formData.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700"><UserIcon className="h-6 w-6" /></div>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Rating</label>
                                    <div className="flex items-center gap-2 bg-dark-950 border border-white/5 rounded-2xl px-5 py-4">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: num })}
                                                className={`p-1 transition-all ${formData.rating && formData.rating >= num ? 'text-yellow-500 scale-110' : 'text-gray-700 hover:text-gray-500'}`}
                                            >
                                                <Star className="h-6 w-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: THE CONTENT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">The Review</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                            <Quote className="absolute -top-4 -right-4 h-32 w-32 text-white/[0.02]" />
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Testimonial Content</label>
                            <textarea
                                value={formData.content || ''}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-40 resize-none outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all text-lg leading-relaxed italic font-serif"
                                placeholder="What did they say about your work?..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button type="button" onClick={() => setEditing(null)} className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all">Discard</button>
                        <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Save className="h-5 w-5" /> Save Review
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
                    <h2 className="text-3xl font-bold text-white font-display">Testimonials</h2>
                    <p className="text-gray-500 mt-1">{items.length} success stories from your clients.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Add New Story
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="bg-dark-900 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-primary-500/30 transition-all group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary-600/20 transition-all"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-primary-500/30 transition-all">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-600"><UserIcon className="h-6 w-6" /></div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-1">{item.role}</p>
                            </div>
                        </div>

                        <div className="flex gap-1 text-yellow-500 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'fill-current' : 'text-gray-800'}`} />
                            ))}
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed italic flex-grow">"{item.content}"</p>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto"><Quote className="h-8 w-8 text-gray-700" /></div>
                        <p className="text-gray-500 font-medium">No testimonials yet.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">Add Your First Story →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
