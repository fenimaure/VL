
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

interface AboutSection {
    id: string;
    section_key: string;
    title: string;
    subtitle: string;
    content: string;
    image_url: string;
    media_type: 'image' | 'video';
    items: any[];
}

export default function AboutManager() {
    const [sections, setSections] = useState<Record<string, AboutSection>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        try {
            const { data, error } = await supabase.from('about_content').select('*');
            if (error) throw error;

            const sectionsMap: Record<string, AboutSection> = {};
            data?.forEach(item => {
                sectionsMap[item.section_key] = item;
            });
            setSections(sectionsMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(sectionKey: string) {
        setSaving(true);
        try {
            const section = sections[sectionKey];
            const { error } = await supabase.from('about_content').upsert(section);
            if (error) throw error;
            alert('Section saved!');
        } catch (error) {
            console.error(error);
            alert('Error saving section');
        } finally {
            setSaving(false);
        }
    }

    const updateSection = (key: string, field: keyof AboutSection, value: any) => {
        setSections(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] || {}),
                section_key: key,
                [field]: value
            }
        }));
    };

    const updateItem = (sectionKey: string, index: number, field: string, value: any) => {
        setSections(prev => {
            const section = prev[sectionKey] || { items: [] };
            const newItems = [...(section.items || [])];
            if (newItems[index]) {
                newItems[index] = { ...newItems[index], [field]: value };
            }
            return {
                ...prev,
                [sectionKey]: { ...section, items: newItems }
            };
        });
    };

    const addItem = (sectionKey: string, initialItem: any) => {
        setSections(prev => {
            const section = prev[sectionKey] || { items: [], section_key: sectionKey };
            const currentItems = section.items || [];
            return {
                ...prev,
                [sectionKey]: {
                    ...section,
                    items: [...currentItems, initialItem]
                }
            };
        });
    };

    const deleteItem = (sectionKey: string, index: number) => {
        setSections(prev => {
            const newItems = [...(prev[sectionKey].items || [])];
            newItems.splice(index, 1);
            return { ...prev, [sectionKey]: { ...prev[sectionKey], items: newItems } };
        });
    };

    if (loading) return <div>Loading...</div>;

    const renderSectionHeader = (key: string, label: string) => (
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 mt-8">
            <h3 className="text-lg font-bold text-primary-400 uppercase tracking-wider">{label}</h3>
            <button onClick={() => handleSave(key)} disabled={saving} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-white mb-6">Manage About Page</h2>

            {/* Hero Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('hero', '1. Hero (Above the Fold)')}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Headline (Positioning)</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.title || ''}
                            onChange={e => updateSection('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.subtitle || ''}
                            onChange={e => updateSection('hero', 'subtitle', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Media Type</label>
                        <select
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.media_type || 'image'}
                            onChange={e => updateSection('hero', 'media_type', e.target.value)}
                        >
                            <option value="image">Image (Photo)</option>
                            <option value="video">Video (MP4/WebM)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Hero Media URL</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.image_url || ''}
                            onChange={e => updateSection('hero', 'image_url', e.target.value)}
                            placeholder={sections.hero?.media_type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                        />
                    </div>
                </div>
            </div>

            {/* Featured Image Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('fullscreen_image', '2. Featured Full Screen Image')}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.fullscreen_image?.image_url || ''}
                            onChange={e => updateSection('fullscreen_image', 'image_url', e.target.value)}
                            placeholder="https://example.com/featured-image.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('story', '2. Our Story')}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.story?.title || ''}
                            onChange={e => updateSection('story', 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Story Content (Markdown)</label>
                        <MarkdownEditor
                            value={sections.story?.content || ''}
                            onChange={(val) => updateSection('story', 'content', val)}
                            height={500}
                        />
                    </div>
                </div>
            </div>





            {/* The Team */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('team', '5. The Team')}
                <div className="grid grid-cols-1 gap-4">
                    {(sections.team?.items || []).map((item, idx) => (
                        <div key={idx} className="bg-dark-950 p-4 rounded border border-white/10 flex gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <input className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-white" placeholder="Name" value={item.name} onChange={e => updateItem('team', idx, 'name', e.target.value)} />
                                <input className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-white" placeholder="Role" value={item.role} onChange={e => updateItem('team', idx, 'role', e.target.value)} />
                                <input className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-white" placeholder="Image URL" value={item.image} onChange={e => updateItem('team', idx, 'image', e.target.value)} />
                            </div>
                            <button onClick={() => deleteItem('team', idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded h-fit"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('team', { name: '', role: '', image: '' })} className="text-sm text-primary-400 flex items-center gap-1 hover:text-white mt-2"><Plus className="h-4 w-4" /> Add Team Member</button>
                </div>
            </div>

            {/* Clients / Logos Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-8">
                {renderSectionHeader('clients', '3. Trusted By (Logos)')}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Section Title</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.clients?.title || ''}
                            onChange={e => updateSection('clients', 'title', e.target.value)}
                            placeholder="e.g. Trusted By"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {(sections.clients?.items || []).map((item, idx) => (
                        <div key={idx} className="bg-dark-950 p-4 rounded border border-white/10 flex flex-col gap-2">
                            <input className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-white" placeholder="Client Name" value={item.name} onChange={e => updateItem('clients', idx, 'name', e.target.value)} />
                            <input className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-white" placeholder="Logo URL" value={item.logo_url} onChange={e => updateItem('clients', idx, 'logo_url', e.target.value)} />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">Preview:</span>
                                {item.logo_url && <img src={item.logo_url} className="h-6 w-auto object-contain bg-white/10 p-1 rounded" alt="Preview" />}
                                <button onClick={() => deleteItem('clients', idx)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => addItem('clients', { name: '', logo_url: '' })} className="col-span-1 border border-dashed border-white/20 rounded flex items-center justify-center p-8 text-primary-400 hover:text-white hover:border-white/40 transition-colors gap-2">
                        <Plus className="h-5 w-5" /> Add Client Logo
                    </button>
                </div>
            </div>



        </div >
    );
}
