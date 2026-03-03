
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Link, List } from 'lucide-react';
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
    features: string[];
    card_media_type?: 'image' | 'video'; // UI-only field, encoded into icon_name
    card_tags?: string; // UI-only field, encoded into icon_name
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Services</h2>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" /> Add Service
                </button>
            </div>

            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{isNew ? 'New Service' : 'Edit Service'}</h3>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Card Info</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-[42px] resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Card Tags <span className="text-gray-600">(comma-separated, shown as pills on card)</span></label>
                                    <input
                                        type="text"
                                        value={(formData as any).card_tags || ''}
                                        onChange={(e) => setFormData({ ...formData, card_tags: e.target.value } as any)}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g. Web Design, Development, Copywriting"
                                    />
                                </div>
                            </div>

                            {/* Card Right Panel Media */}
                            <div className="bg-primary-500/5 border border-primary-500/20 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">🖼️ Card Right Panel — Image or Video</h4>
                                <p className="text-xs text-gray-500 -mt-2">This appears on the right side of the service card on the homepage.</p>

                                {/* URL Guidance */}
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-200 space-y-1.5">
                                    <p className="font-bold text-yellow-300">⚠️ URL Requirements</p>
                                    <p>✅ <strong>Pexels images:</strong> Right-click the photo → "Copy image address" → use that CDN url<br />
                                        <span className="text-yellow-400/70 font-mono">https://images.pexels.com/photos/ID/photo.jpeg</span></p>
                                    <p>✅ <strong>Pexels videos:</strong> Paste the video page URL below and set type to <strong>Video</strong>. Or download and upload to Supabase Storage.</p>
                                    <p>❌ <strong>Does NOT work:</strong> <span className="font-mono text-red-400/80">pexels.com/download/video/...</span> — requires login to serve.</p>
                                    <p>✅ <strong>Best option:</strong> Upload to <strong>Supabase Storage → assets bucket</strong> → paste public URL here.</p>
                                </div>

                                {/* Media URL + Type Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-1">Media URL</label>
                                        <input
                                            type="text"
                                            value={getRawUrl(formData.icon_url || '')}
                                            onChange={(e) => {
                                                const override = getMediaTypeOverride(formData.icon_url || '');
                                                setFormData({ ...formData, icon_url: applyMediaTypeOverride(e.target.value, override) });
                                            }}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                            placeholder="https://images.pexels.com/photos/.../photo.jpeg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Media Type</label>
                                        <select
                                            value={getMediaTypeOverride(formData.icon_url || '')}
                                            onChange={(e) => {
                                                const raw = getRawUrl(formData.icon_url || '');
                                                setFormData({ ...formData, icon_url: applyMediaTypeOverride(raw, e.target.value as 'auto' | 'video' | 'image') });
                                            }}
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                        >
                                            <option value="auto">🔍 Auto-detect</option>
                                            <option value="image">🖼️ Force Image</option>
                                            <option value="video">🎬 Force Video</option>
                                        </select>
                                        {/* Effective type badge */}
                                        {formData.icon_url && (
                                            <p className={`text-xs mt-1 font-medium ${detectMediaType(formData.icon_url) === 'video' ? 'text-blue-400' : 'text-green-400'
                                                }`}>
                                                {detectMediaType(formData.icon_url) === 'video' ? '🎬 Will render as Video' : '🖼️ Will render as Image'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Live Preview */}
                                {getRawUrl(formData.icon_url || '') && (
                                    <div className="rounded-xl overflow-hidden border border-white/10 bg-dark-950">
                                        <p className="text-xs text-gray-500 px-3 py-1.5 border-b border-white/5">Preview (if URL fails to load, it's blocked by CORS/hotlink protection)</p>
                                        <div className="h-40 flex items-center justify-center">
                                            {detectMediaType(formData.icon_url || '') === 'video' ? (
                                                <video
                                                    src={getRawUrl(formData.icon_url || '')}
                                                    className="max-h-40 max-w-full object-cover rounded"
                                                    muted autoPlay loop playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={getRawUrl(formData.icon_url || '')}
                                                    className="max-h-40 max-w-full object-cover rounded"
                                                    alt="Preview"
                                                    onError={(e) => {
                                                        const el = e.target as HTMLImageElement;
                                                        el.style.display = 'none';
                                                        el.parentElement!.innerHTML = '<p class="text-xs text-red-400 p-4 text-center">⚠️ Image failed to load — URL may be blocked or invalid. Try a different source.</p>';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Fallback: Lucide icon if no URL */}
                                {!formData.icon_url && (
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Fallback: Lucide Icon Name <span className="text-gray-600">(used when no media URL is set)</span></label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                                placeholder="e.g. Code, Palette, Smartphone"
                                                value={formData.icon_name || ''}
                                                onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                                            />
                                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-dark-950 rounded border border-white/10">
                                                <IconPreview name={formData.icon_name || ''} className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Page Details Section */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-secondary-400 uppercase tracking-wider mb-2">Page Details (Service Page)</h4>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <Link className="h-3 w-3" /> Page Slug (URL)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm"
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <ImageIcon className="h-3 w-3" /> Hero Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image_url || ''}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <List className="h-3 w-3" /> Key Features (Comma separated)
                                    </label>
                                    <textarea
                                        value={formData.features ? formData.features.join(', ') : ''}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(s => s.trim()) })}
                                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                                        placeholder="Strategy, Content Creation, Analytics Reporting"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Detailed Content (Markdown)</label>
                                    <MarkdownEditor
                                        value={formData.content || ''}
                                        onChange={(val) => setFormData({ ...formData, content: val })}
                                        height={500}
                                        placeholder="# Detailed Service Information..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Save Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-dark-900 border border-white/10 p-6 rounded-xl hover:border-primary-500/30 transition-colors group relative">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(service)} className="text-gray-400 hover:text-white"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="h-32 mb-4 rounded-lg overflow-hidden relative group-hover:opacity-80 transition-opacity">
                            {service.icon_url ? (
                                <img src={service.icon_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${service.color_theme || 'from-gray-700 to-gray-600'} flex items-center justify-center`}>
                                    <IconPreview name={service.icon_name} className="h-8 w-8 text-white" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                        {service.slug && <span className="text-xs font-mono text-primary-400 bg-primary-500/10 px-2 py-1 rounded">/{service.slug}</span>}
                    </div>
                ))}
                {services.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-dark-900/50 rounded-xl border border-dashed border-white/10">
                        No services found.
                    </div>
                )}
            </div>
        </div>
    );
}
