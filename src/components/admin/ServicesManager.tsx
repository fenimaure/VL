
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link, List, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';
import * as Icons from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    color_theme: string;
    slug: string;
    content: string;
    image_url: string;
    icon_url?: string;
    features: any[];
    subtitle?: string;
    color_accent?: string;
    tools_used?: string[];
    stats?: any[];
    pricing_tiers?: any[];
    process_steps?: any[];
    deliverables?: any[];
    faqs?: any[];
    card_media_type?: 'image' | 'video';
    card_tags?: string;
}

/** 
 * HELPER COMPONENT: ListEditor
 * Provides a user-friendly UI for managing arrays of objects (JSONB)
 */
function ListEditor<T extends Record<string, any>>({
    label,
    items = [],
    onChange,
    fields,
    itemLabelField
}: {
    label: string;
    items: T[];
    onChange: (items: T[]) => void;
    fields: { key: keyof T; label: string; type: 'text' | 'textarea' | 'checkbox' | 'list' }[];
    itemLabelField: keyof T;
}) {
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [tempItem, setTempItem] = useState<Partial<T>>({});

    const handleAdd = () => {
        setEditingIdx(-1);
        setTempItem({});
    };

    const handleEdit = (idx: number) => {
        setEditingIdx(idx);
        setTempItem({ ...items[idx] });
    };

    const handleRemove = (idx: number) => {
        const newItems = [...items];
        newItems.splice(idx, 1);
        onChange(newItems);
    };

    const handleSaveItem = () => {
        const newItems = [...items];
        if (editingIdx === -1) {
            newItems.push(tempItem as T);
        } else if (editingIdx !== null) {
            newItems[editingIdx] = tempItem as T;
        }
        onChange(newItems);
        setEditingIdx(null);
    };

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase bg-primary-600/20 text-primary-400 px-2 py-1 rounded hover:bg-primary-600/40 transition-colors"
                >
                    <Plus className="h-3 w-3" /> Add Item
                </button>
            </div>

            {/* List of items */}
            <div className="space-y-2">
                {items.length === 0 && !editingIdx && (
                    <p className="text-xs text-gray-600 italic">No items added yet.</p>
                )}
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-dark-950/50 rounded-lg border border-white/5 group">
                        <span className="text-sm text-gray-300 font-medium">
                            {String(item[itemLabelField] || `Item ${idx + 1}`)}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => handleEdit(idx)} className="p-1 hover:text-white transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => handleRemove(idx)} className="p-1 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline Editor Modal/Overlay */}
            {editingIdx !== null && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl">
                        <h5 className="text-lg font-bold text-white mb-6">
                            {editingIdx === -1 ? `Add ${label} Item` : `Edit ${label} Item`}
                        </h5>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                            {fields.map(f => (
                                <div key={String(f.key)}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{f.label}</label>
                                    {f.type === 'text' && (
                                        <input
                                            type="text"
                                            value={tempItem[f.key] || ''}
                                            onChange={e => setTempItem({ ...tempItem, [f.key]: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                        />
                                    )}
                                    {f.type === 'textarea' && (
                                        <textarea
                                            value={tempItem[f.key] || ''}
                                            onChange={e => setTempItem({ ...tempItem, [f.key]: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm h-24 resize-none"
                                        />
                                    )}
                                    {f.type === 'checkbox' && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!tempItem[f.key]}
                                                onChange={e => setTempItem({ ...tempItem, [f.key]: e.target.checked })}
                                                className="w-4 h-4 rounded bg-dark-950 border-white/10 text-primary-600"
                                            />
                                            <span className="text-xs text-gray-400">Yes / Enable</span>
                                        </div>
                                    )}
                                    {f.type === 'list' && (
                                        <div className="space-y-2">
                                            <textarea
                                                value={Array.isArray(tempItem[f.key]) ? (tempItem[f.key] as string[]).join('\n') : ''}
                                                onChange={e => setTempItem({ ...tempItem, [f.key]: e.target.value.split('\n').filter(Boolean) })}
                                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-xs h-20 font-mono"
                                                placeholder="Enter items, one per line..."
                                            />
                                            <p className="text-[10px] text-gray-600">Enter each feature/item on a new line.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                            <button type="button" onClick={() => setEditingIdx(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button
                                type="button"
                                onClick={handleSaveItem}
                                className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary-600/20"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/** Decode tags that were encoded into icon_name as "tags:Tag1,Tag2,Tag3" */
function decodeIconName(iconName: string): { tags: string; clean_icon_name: string } {
    if (iconName.startsWith('tags:')) {
        return { tags: iconName.slice(5), clean_icon_name: '' };
    }
    return { tags: '', clean_icon_name: iconName };
}

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Service | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [formData, setFormData] = useState<Partial<Service>>({});

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try {
            const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(service: Service) {
        setEditing(service);
        // Decode tags from icon_name
        const { tags, clean_icon_name } = decodeIconName(service.icon_name || '');
        setFormData({ ...service, icon_name: clean_icon_name, card_tags: tags });
        setIsNew(false);
    }

    function handleAddNew() {
        setEditing({ id: '', title: '', description: '', icon_name: 'Code', color_theme: 'from-blue-500 to-cyan-500', slug: '', content: '', image_url: '', icon_url: '', features: [] });
        setFormData({ title: '', description: '', icon_name: 'Code', color_theme: 'from-blue-500 to-cyan-500', slug: '', content: '', image_url: '', icon_url: '', features: [], card_tags: '' });
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            const dataToSave: any = { ...formData };
            // Auto-generate slug if empty
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            // Encode tags into icon_name if icon_url is set (card media is shown, not lucide icon)
            if (dataToSave.icon_url && dataToSave.card_tags) {
                dataToSave.icon_name = `tags:${dataToSave.card_tags}`;
            }
            // Remove UI-only fields before saving
            delete dataToSave.card_media_type;
            delete dataToSave.card_tags;

            if (isNew) {
                const { error } = await supabase.from('services').insert([dataToSave]);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('services').update(dataToSave).eq('id', editing?.id);
                if (error) throw error;
            }
            setEditing(null);
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save service');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const { data, error } = await supabase.from('services').delete().eq('id', id).select();
            if (error) throw error;
            if (!data || data.length === 0) {
                alert('Delete was blocked by Supabase RLS. Please add a DELETE policy for authenticated users on the "services" table.');
                return;
            }
            fetchServices();
        } catch (error: any) {
            console.error('Error deleting service:', error);
            alert('Failed to delete: ' + (error?.message || 'Unknown error'));
        }
    }

    const IconPreview = ({ name, className }: { name: string; className?: string }) => {
        // @ts-ignore
        const Icon = Icons[name] as any;
        return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
    };

    // Detect media type from URL (strips prefix first)
    const detectMediaType = (rawUrl: string): 'video' | 'image' => {
        if (!rawUrl) return 'image';
        // Explicit prefix override
        if (rawUrl.startsWith('video::')) return 'video';
        if (rawUrl.startsWith('image::')) return 'image';
        const lower = rawUrl.toLowerCase();
        // Extension-based
        if (lower.match(/\.(mp4|webm|mov|ogg|avi)([?#]|$)/)) return 'video';
        // Pexels video patterns
        if (lower.includes('pexels.com/download/video') || lower.includes('pexels.com/video')) return 'video';
        // Common video CDN patterns
        if (lower.includes('/video/') && (lower.includes('cloudinary') || lower.includes('mux') || lower.includes('vimeo') || lower.includes('bunny'))) return 'video';
        return 'image';
    };

    // Strip prefix to get raw URL for src
    const getRawUrl = (url: string): string => {
        if (!url) return '';
        if (url.startsWith('video::') || url.startsWith('image::')) return url.slice(7);
        return url;
    };

    // Get stored media type override label
    const getMediaTypeOverride = (url: string): 'auto' | 'video' | 'image' => {
        if (!url) return 'auto';
        if (url.startsWith('video::')) return 'video';
        if (url.startsWith('image::')) return 'image';
        return 'auto';
    };

    // Apply override prefix to URL
    const applyMediaTypeOverride = (rawUrl: string, override: 'auto' | 'video' | 'image'): string => {
        const clean = getRawUrl(rawUrl); // strip any existing prefix
        if (override === 'video') return `video::${clean}`;
        if (override === 'image') return `image::${clean}`;
        return clean;
    };

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
                                {isNew ? 'Create New Service' : `Edit ${editing.title}`}
                            </h2>
                            <p className="text-sm text-gray-500">Configure your service offerings and appearance.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                        >
                            <Save className="h-5 w-5" /> Save Changes
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-12">
                    {/* SECTION 1: CORE CARD INFO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Card Appearance</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Service Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary-500 transition-all text-lg font-medium outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="e.g. Social Media Management"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Short Description</label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white h-32 resize-none focus:border-primary-500 transition-all outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="A brief summary that appears on the homepage card..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Card Tags (Pills)</label>
                                    <input
                                        type="text"
                                        value={(formData as any).card_tags || ''}
                                        onChange={(e) => setFormData({ ...formData, card_tags: e.target.value } as any)}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="e.g. Content Strategy, Monthly Audit"
                                    />
                                    <p className="text-[10px] text-gray-600 mt-2 px-1">Separate tags with commas.</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Brand Color Accent</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.color_accent || '#6366f1'}
                                                onChange={(e) => setFormData({ ...formData, color_accent: e.target.value })}
                                                className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                            />
                                            <input
                                                type="color"
                                                value={formData.color_accent || '#6366f1'}
                                                onChange={(e) => setFormData({ ...formData, color_accent: e.target.value })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl mt-6 border border-white/10 shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: formData.color_accent || '#6366f1' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: MEDIA & HERO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Visuals & Hero</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Card Media URL (Image/Video)</label>
                                    <input
                                        type="text"
                                        value={getRawUrl(formData.icon_url || '')}
                                        onChange={(e) => {
                                            const override = getMediaTypeOverride(formData.icon_url || '');
                                            setFormData({ ...formData, icon_url: applyMediaTypeOverride(e.target.value, override) });
                                        }}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-gray-600 mt-2 px-1">Supports Pexels, Cloudinary, and Supabase Storage.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Hero Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image_url || ''}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Hero Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle || ''}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="The catchy phrase below the title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Slug (URL Path)</label>
                                    <input
                                        type="text"
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: STRUCTURED OFFERINGS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Offerings & Details</h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ListEditor
                                label="Pricing Tiers"
                                items={formData.pricing_tiers || []}
                                onChange={(items) => setFormData({ ...formData, pricing_tiers: items })}
                                itemLabelField="name"
                                fields={[
                                    { key: 'name', label: 'Tier Name', type: 'text' },
                                    { key: 'price', label: 'Price (e.g. ₱15,000)', type: 'text' },
                                    { key: 'period', label: 'Period (e.g. /mo)', type: 'text' },
                                    { key: 'features', label: 'Included Features', type: 'list' },
                                    { key: 'cta', label: 'Button Text', type: 'text' },
                                    { key: 'highlighted', label: 'Highlight as "Best Value"', type: 'checkbox' },
                                ]}
                            />

                            <ListEditor
                                label="Process Steps"
                                items={formData.process_steps || []}
                                onChange={(items) => setFormData({ ...formData, process_steps: items })}
                                itemLabelField="title"
                                fields={[
                                    { key: 'title', label: 'Step Title', type: 'text' },
                                    { key: 'phase', label: 'Phase (e.g. 01)', type: 'text' },
                                    { key: 'duration', label: 'Duration (e.g. 1 Week)', type: 'text' },
                                    { key: 'description', label: 'Description', type: 'textarea' },
                                ]}
                            />

                            <ListEditor
                                label="Key Stats"
                                items={formData.stats || []}
                                onChange={(items) => setFormData({ ...formData, stats: items })}
                                itemLabelField="label"
                                fields={[
                                    { key: 'value', label: 'Big Number (e.g. 300%)', type: 'text' },
                                    { key: 'label', label: 'Label (e.g. ROI)', type: 'text' },
                                ]}
                            />

                            <ListEditor
                                label="Deliverables"
                                items={formData.deliverables || []}
                                onChange={(items) => setFormData({ ...formData, deliverables: items })}
                                itemLabelField="item"
                                fields={[
                                    { key: 'item', label: 'Deliverable Name', type: 'text' },
                                    { key: 'format', label: 'Format (e.g. PDF/Figma)', type: 'text' },
                                ]}
                            />

                            <ListEditor
                                label="FAQs"
                                items={formData.faqs || []}
                                onChange={(items) => setFormData({ ...formData, faqs: items })}
                                itemLabelField="question"
                                fields={[
                                    { key: 'question', label: 'Question', type: 'text' },
                                    { key: 'answer', label: 'Answer', type: 'textarea' },
                                ]}
                            />

                            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tools & Capabilities</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Tools Used (One per line)</label>
                                    <textarea
                                        value={formData.tools_used ? formData.tools_used.join('\n') : ''}
                                        onChange={(e) => setFormData({ ...formData, tools_used: e.target.value.split('\n').filter(Boolean) })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs h-32 font-mono outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="Figma&#10;Canva&#10;Buffer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Search Keywords (CSV)</label>
                                    <textarea
                                        value={formData.features ? (Array.isArray(formData.features) ? formData.features.join(', ') : '') : ''}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-xs h-32 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        placeholder="Strategy, Content, Audit, Monthly..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: LONG CONTENT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400 text-xs font-bold">4</div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">In-Depth Content</h4>
                        </div>

                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4 ml-1">Detailed Page Content (Markdown)</label>
                            <div className="rounded-2xl overflow-hidden border border-white/5">
                                <MarkdownEditor
                                    value={formData.content || ''}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    height={600}
                                    placeholder="# Start typing your detailed service breakdown..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="px-8 py-4 text-gray-400 hover:text-white font-bold transition-all"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-500 text-white px-12 py-4 rounded-full flex items-center gap-2 font-bold shadow-2xl shadow-primary-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Save className="h-5 w-5" /> Save All Progress
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
                    <h2 className="text-3xl font-bold text-white font-display">Manage Services</h2>
                    <p className="text-gray-500 mt-1">Design and configure your service portfolio.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> Create New Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service.id} className="bg-dark-900 border border-white/10 p-6 rounded-2xl hover:border-primary-500/30 transition-all group relative flex flex-col h-full">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={() => handleEdit(service)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-gray-300 hover:text-white transition-colors"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(service.id)} className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-400 hover:text-red-300 transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>

                        <div className="h-40 mb-6 rounded-xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                            {service.icon_url ? (
                                <div className="w-full h-full">
                                    {detectMediaType(service.icon_url) === 'video' ? (
                                        <video src={getRawUrl(service.icon_url)} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                    ) : (
                                        <img src={getRawUrl(service.icon_url)} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${service.color_theme || 'from-gray-700 to-gray-600'} flex items-center justify-center`}>
                                    <IconPreview name={service.icon_name} className="h-10 w-10 text-white" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                                    {service.slug}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 font-display">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{service.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: service.color_accent || '#6366f1' }} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex gap-1">
                                {service.pricing_tiers && service.pricing_tiers.length > 0 && <AlertCircle className="h-3.5 w-3.5 text-primary-400" title="Has Pricing" />}
                                {service.faqs && service.faqs.length > 0 && <CheckCircle2 className="h-3.5 w-3.5 text-green-400" title="Has FAQs" />}
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-dark-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                            <List className="h-8 w-8 text-gray-700" />
                        </div>
                        <p className="text-gray-500 font-medium">No services found. Start by adding your first digital expertise.</p>
                        <button onClick={handleAddNew} className="text-primary-400 hover:text-primary-300 font-bold uppercase text-xs tracking-widest">
                            Add Service →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
