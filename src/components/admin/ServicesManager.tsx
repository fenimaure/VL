
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
        setFormData(service);
        setIsNew(false);
    }

    function handleAddNew() {
        setEditing({ id: '', title: '', description: '', icon_name: 'Code', color_theme: 'from-blue-500 to-cyan-500', slug: '', content: '', image_url: '', features: [] });
        setFormData({ title: '', description: '', icon_name: 'Code', color_theme: 'from-blue-500 to-cyan-500', slug: '', content: '', image_url: '', features: [] });
        setIsNew(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        try {
            // Auto-generate slug if empty
            const dataToSave = { ...formData };
            if (!dataToSave.slug && dataToSave.title) {
                dataToSave.slug = dataToSave.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

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
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    }

    const IconPreview = ({ name, className }: { name: string; className?: string }) => {
        // @ts-ignore
        const Icon = Icons[name] as any;
        return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
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
                            {/* Basic Info Section */}
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Card Details (Homepage)</h4>
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
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-[42px] resize-none overflow-hidden"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Banner Image (or Fallback Icon)</label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                                    placeholder="Lucide Icon Name (e.g. Code)"
                                                    value={formData.icon_name || ''}
                                                    onChange={e => setFormData({ ...formData, icon_name: e.target.value, icon_url: '' })}
                                                />
                                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-dark-950 rounded border border-white/10">
                                                    <IconPreview name={formData.icon_name || ''} className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-center text-xs text-gray-500">- OR -</div>
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                                    placeholder="Icon Image URL (https://...)"
                                                    value={formData.icon_url || ''}
                                                    onChange={e => setFormData({ ...formData, icon_url: e.target.value, icon_name: '' })}
                                                />
                                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-dark-950 rounded border border-white/10 overflow-hidden">
                                                    {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-600">Img</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Theme Gradient</label>
                                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={formData.color_theme || ''} onChange={e => setFormData({ ...formData, color_theme: e.target.value })} />
                                    </div>
                                </div>
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
