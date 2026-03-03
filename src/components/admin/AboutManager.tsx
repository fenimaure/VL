
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
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
    const [uploading, setUploading] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

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

    // Read/write title_size from the items JSONB settings object
    const getTitleSize = (sectionKey: string): string => {
        const items = sections[sectionKey]?.items || [];
        const settings = items.find((i: any) => i._settings);
        return settings?.title_size || 'xl';
    };

    const setTitleSize = (sectionKey: string, size: string) => {
        setSections(prev => {
            const section = prev[sectionKey] || { items: [], section_key: sectionKey };
            const currentItems: any[] = Array.isArray(section.items) ? section.items : [];
            // Update or insert the _settings entry
            const withoutSettings = currentItems.filter((i: any) => !i._settings);
            return {
                ...prev,
                [sectionKey]: {
                    ...section,
                    items: [...withoutSettings, { _settings: true, title_size: size }]
                }
            };
        });
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

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `site-logo-${Date.now()}.${fileExt}`;
            const filePath = `branding/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
                updateSection('site_settings', 'image_url', urlData.publicUrl);
                // Auto-save site settings after upload
                const section = {
                    ...(sections.site_settings || {}),
                    section_key: 'site_settings',
                    image_url: urlData.publicUrl
                };
                await supabase.from('about_content').upsert(section);
                alert('Logo uploaded & saved!');
                fetchContent();
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo. Make sure the "assets" storage bucket exists in Supabase.');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-white mb-6">Manage About & Site Settings</h2>

            {/* Site Settings — Logo / Favicon */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('site_settings', '⚙️ Site Settings — Logo / Favicon')}
                <div className="space-y-4">
                    <div className="flex items-start gap-6">
                        {/* Current Logo Preview */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-dark-950">
                                {sections.site_settings?.image_url ? (
                                    <img src={sections.site_settings.image_url} className="w-full h-full object-contain p-2" alt="Site logo" />
                                ) : (
                                    <ImageIcon className="h-8 w-8 text-gray-600" />
                                )}
                            </div>
                            <span className="text-xs text-gray-500">Current Logo</span>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Logo URL (auto-filled on upload)</label>
                                <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                    value={sections.site_settings?.image_url || ''}
                                    onChange={e => updateSection('site_settings', 'image_url', e.target.value)}
                                    placeholder="https://your-supabase-url.../logo.png"
                                />
                            </div>
                            <div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/svg+xml,image/x-icon,image/webp"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    {uploading ? 'Uploading...' : 'Upload New Logo'}
                                </button>
                                <p className="text-xs text-gray-500 mt-2">Accepted: PNG, JPG, SVG, ICO, WEBP • This will be used as the site favicon and logo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Homepage Hero Section (separate from About page hero) */}
            <div className="bg-white/5 p-6 rounded-xl border border-primary-500/20">
                {renderSectionHeader('home_hero', '🏠 Homepage Hero Section')}
                <p className="text-xs text-gray-500 mb-4 -mt-2">This controls the main homepage hero — separate from the About page hero below.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Headline (Big Title)</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.home_hero?.title || ''}
                            onChange={e => updateSection('home_hero', 'title', e.target.value)}
                            placeholder="e.g. **Smart Solutions** for Modern Businesses"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            💡 Tip: Wrap words in <code className="bg-white/10 px-1 rounded text-primary-400">**double asterisks**</code> to make them <strong className="text-white">bold black</strong>. Everything else renders as the outline italic style.
                            <br />Example: <code className="bg-white/10 px-1 rounded text-primary-400">**Smart Solutions** for Modern Businesses</code>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title Size</label>
                        <select
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={getTitleSize('home_hero')}
                            onChange={e => setTitleSize('home_hero', e.target.value)}
                        >
                            <option value="xs">XS — Extra Small (great for long sentences)</option>
                            <option value="sm">SM — Small</option>
                            <option value="md">MD — Medium</option>
                            <option value="lg">LG — Large</option>
                            <option value="xl">XL — Extra Large (default, 2 short words)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Use smaller sizes when your headline has many words.</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Tagline / Subtitle</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.home_hero?.subtitle || ''}
                            onChange={e => updateSection('home_hero', 'subtitle', e.target.value)}
                            placeholder="e.g. Where Innovation Meets Artistry"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                            value={sections.home_hero?.content || ''}
                            onChange={e => updateSection('home_hero', 'content', e.target.value)}
                            placeholder="We craft immersive digital experiences..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Media Type</label>
                        <select
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.home_hero?.media_type || 'image'}
                            onChange={e => updateSection('home_hero', 'media_type', e.target.value)}
                        >
                            <option value="image">Image (Photo)</option>
                            <option value="video">Video (MP4/WebM)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Hero Media URL</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.home_hero?.image_url || ''}
                            onChange={e => updateSection('home_hero', 'image_url', e.target.value)}
                            placeholder={sections.home_hero?.media_type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                        />
                    </div>
                </div>
            </div>

            {/* About Page Hero Section */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                {renderSectionHeader('hero', '📄 About Page Hero')}
                <p className="text-xs text-gray-500 mb-4 -mt-2">This controls the hero shown on the About page only.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Headline (Positioning)</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.title || ''}
                            onChange={e => updateSection('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title Size</label>
                        <select
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={getTitleSize('hero')}
                            onChange={e => setTitleSize('hero', e.target.value)}
                        >
                            <option value="xs">XS — Extra Small (text-5xl / text-6xl)</option>
                            <option value="sm">SM — Small (text-6xl / text-7xl)</option>
                            <option value="md">MD — Medium (text-7xl / text-8xl)</option>
                            <option value="lg">LG — Large (text-8xl / text-9xl)</option>
                            <option value="xl">XL — Extra Large (default, text-9xl+)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Tagline / Subtitle</label>
                        <input className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={sections.hero?.subtitle || ''}
                            onChange={e => updateSection('hero', 'subtitle', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                            value={sections.hero?.content || ''}
                            onChange={e => updateSection('hero', 'content', e.target.value)}
                            placeholder="We are a collective of digital artisans..."
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




        </div >
    );
}
