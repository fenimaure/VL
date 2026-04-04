
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon,
    Home, FileText, BookOpen, Users, Award, Trophy, Settings,
    ChevronDown, ChevronUp, GripVertical, Eye
} from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';
import { createContext, useContext } from 'react';

const AboutManagerContext = createContext<{ saving: string | null, onSave: (key: string) => void, onBatchSave: (keys: string[]) => void } | null>(null);

// ═══════════════════════════════════════════
//  SHARED UI HELPERS
// ═══════════════════════════════════════════

const SectionCard = ({ sectionKey, title, hint, children, saveKeys }: {
    sectionKey: string; title: string; hint?: string; children: React.ReactNode; saveKeys?: string[];
}) => {
    const ctx = useContext(AboutManagerContext)!;
    return (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                    {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
                </div>
                <button
                    onClick={() => saveKeys ? ctx.onBatchSave(saveKeys) : ctx.onSave(sectionKey)}
                    disabled={ctx.saving !== null}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    {ctx.saving === sectionKey || ctx.saving === 'batch' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                </button>
            </div>
            <div className="p-6 space-y-5">
                {children}
            </div>
        </div>
    );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-gray-600 mt-1">{hint}</p>}
    </div>
);

const Input = ({ value, onChange, placeholder, multiline }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) => {
    const cls = "w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-gray-700";
    return multiline ? (
        <textarea className={`${cls} h-24 resize-none`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
        <input className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    );
};

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <select
        className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
    >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
);

const ImagePreview = ({ url, size = 'md' }: { url?: string; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeMap = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-full h-48' };
    return (
        <div className={`${sizeMap[size]} rounded-xl border border-dashed border-white/10 overflow-hidden bg-dark-950 flex items-center justify-center`}>
            {url ? <img src={url} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="h-6 w-6 text-gray-700" />}
        </div>
    );
};

interface AboutSection {
    id?: string;
    section_key: string;
    title: string;
    subtitle: string;
    content: string;
    image_url: string;
    media_type: 'image' | 'video';
    items: any[];
}

type TabId = 'homepage' | 'about_hero' | 'story' | 'people' | 'proof' | 'journey' | 'settings';

const TABS: { id: TabId; label: string; icon: any; description: string }[] = [
    { id: 'homepage', label: 'Homepage', icon: Home, description: 'Hero, Manifesto & Stats shown on the Home page' },
    { id: 'about_hero', label: 'About Hero', icon: FileText, description: 'About page hero + featured image' },
    { id: 'story', label: 'Story & Narrative', icon: BookOpen, description: 'Our Story, Split Narrative Blocks' },
    { id: 'people', label: 'People', icon: Users, description: 'Team members & Founder spotlight' },
    { id: 'proof', label: 'Proof & Culture', icon: Award, description: 'Stats, Culture Bento & Testimonials' },
    { id: 'journey', label: 'Journey & Awards', icon: Trophy, description: 'Timeline, Values & Awards' },
    { id: 'settings', label: 'Site Settings', icon: Settings, description: 'Logo / Favicon configuration' },
];

export default function AboutManager() {
    const [sections, setSections] = useState<Record<string, AboutSection>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('homepage');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchContent(); }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    async function fetchContent() {
        try {
            const { data, error } = await supabase.from('about_content').select('*');
            if (error) throw error;
            const sectionsMap: Record<string, AboutSection> = {};
            data?.forEach(item => { sectionsMap[item.section_key] = item; });
            setSections(sectionsMap);
        } catch (error) {
            console.error(error);
            showToast('Failed to load content', 'error');
        } finally {
            setLoading(false);
        }
    }

    function showToast(message: string, type: 'success' | 'error' = 'success') {
        setToast({ message, type });
    }

    async function handleSave(sectionKey: string) {
        setSaving(sectionKey);
        try {
            const section = sections[sectionKey];
            if (!section) throw new Error('Section not found');
            const payload = { ...section, section_key: sectionKey };
            const { error } = await supabase.from('about_content').upsert(payload, { onConflict: 'section_key' });
            if (error) throw error;
            showToast(`"${sectionKey}" saved successfully!`);
        } catch (error) {
            console.error(error);
            showToast(`Error saving "${sectionKey}"`, 'error');
        } finally {
            setSaving(null);
        }
    }

    async function handleSaveMultiple(keys: string[]) {
        setSaving('batch');
        try {
            const payloads = keys.map(key => {
                const section = sections[key];
                return section ? { ...section, section_key: key } : { section_key: key };
            }).filter(s => s);
            for (const payload of payloads) {
                const { error } = await supabase.from('about_content').upsert(payload, { onConflict: 'section_key' });
                if (error) throw error;
            }
            showToast(`All sections saved!`);
        } catch (error) {
            console.error(error);
            showToast('Error saving sections', 'error');
        } finally {
            setSaving(null);
        }
    }

    const updateSection = (key: string, field: keyof AboutSection, value: any) => {
        setSections(prev => ({
            ...prev,
            [key]: { ...(prev[key] || { section_key: key }), section_key: key, [field]: value } as AboutSection
        }));
    };

    const getTitleSize = (sectionKey: string): string => {
        const items = sections[sectionKey]?.items || [];
        const settings = items.find((i: any) => i._settings);
        return settings?.title_size || 'xl';
    };

    const setTitleSize = (sectionKey: string, size: string) => {
        setSections(prev => {
            const section = prev[sectionKey] || { items: [], section_key: sectionKey } as any;
            const currentItems: any[] = Array.isArray(section.items) ? section.items : [];
            const withoutSettings = currentItems.filter((i: any) => !i._settings);
            return {
                ...prev,
                [sectionKey]: { ...section, items: [...withoutSettings, { _settings: true, title_size: size }] }
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
            return { ...prev, [sectionKey]: { ...section, items: newItems } as AboutSection };
        });
    };

    const addItem = (sectionKey: string, initialItem: any) => {
        setSections(prev => {
            const section = prev[sectionKey] || { items: [], section_key: sectionKey } as any;
            const currentItems = section.items || [];
            return { ...prev, [sectionKey]: { ...section, items: [...currentItems, initialItem] } };
        });
    };

    const deleteItem = (sectionKey: string, index: number) => {
        setSections(prev => {
            const newItems = [...(prev[sectionKey]?.items || [])];
            newItems.splice(index, 1);
            return { ...prev, [sectionKey]: { ...prev[sectionKey], items: newItems } as AboutSection };
        });
    };

    const moveItem = (sectionKey: string, from: number, to: number) => {
        setSections(prev => {
            const items = [...(prev[sectionKey]?.items || [])];
            if (from < 0 || to < 0 || from >= items.length || to >= items.length) return prev;
            const [moved] = items.splice(from, 1);
            items.splice(to, 0, moved);
            return { ...prev, [sectionKey]: { ...prev[sectionKey], items } as AboutSection };
        });
    };

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `site-logo-${Date.now()}.${fileExt}`;
            const filePath = `branding/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('assets').getPublicUrl(filePath);
            if (urlData?.publicUrl) {
                updateSection('site_settings', 'image_url', urlData.publicUrl);
                const section = { ...(sections.site_settings || {}), section_key: 'site_settings', image_url: urlData.publicUrl };
                await supabase.from('about_content').upsert(section, { onConflict: 'section_key' });
                showToast('Logo uploaded & saved!');
                fetchContent();
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            showToast('Failed to upload logo', 'error');
        } finally {
            setUploading(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
    );

    // UI helpers moved to top level

    // ═══════════════════════════════════════════
    //  TAB 1: HOMEPAGE
    // ═══════════════════════════════════════════
    const renderHomepage = () => (
        <div className="space-y-6">
            {/* Home Hero */}
            <SectionCard sectionKey="home_hero" title="🏠 Homepage Hero">
                <Field label="Headline" hint="Wrap words in **double asterisks** for bold style. Example: **Smart Solutions** for Modern Businesses">
                    <Input value={sections.home_hero?.title || ''} onChange={v => updateSection('home_hero', 'title', v)} placeholder="**Smart Solutions** for Modern Businesses" />
                </Field>
                <Field label="Title Size">
                    <Select value={getTitleSize('home_hero')} onChange={v => setTitleSize('home_hero', v)} options={[
                        { value: 'xs', label: 'XS — Extra Small (long sentences)' },
                        { value: 'sm', label: 'SM — Small' },
                        { value: 'md', label: 'MD — Medium' },
                        { value: 'lg', label: 'LG — Large' },
                        { value: 'xl', label: 'XL — Extra Large (default, 2 short words)' },
                    ]} />
                </Field>
                <Field label="Tagline / Subtitle">
                    <Input value={sections.home_hero?.subtitle || ''} onChange={v => updateSection('home_hero', 'subtitle', v)} placeholder="Where Innovation Meets Artistry" />
                </Field>
                <Field label="Description">
                    <Input multiline value={sections.home_hero?.content || ''} onChange={v => updateSection('home_hero', 'content', v)} placeholder="We craft immersive digital experiences..." />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Media Type">
                        <Select value={sections.home_hero?.media_type || 'image'} onChange={v => updateSection('home_hero', 'media_type', v)} options={[
                            { value: 'image', label: 'Image (Photo)' },
                            { value: 'video', label: 'Video (MP4/WebM)' },
                        ]} />
                    </Field>
                    <Field label="Hero Media URL">
                        <Input value={sections.home_hero?.image_url || ''} onChange={v => updateSection('home_hero', 'image_url', v)} placeholder="https://example.com/media.jpg" />
                    </Field>
                </div>
            </SectionCard>

            {/* Manifesto */}
            <SectionCard sectionKey="manifesto" title="📜 Homepage Manifesto" hint="The scroll-scrubbed text block on both Home & About pages">
                <Field label="Manifesto Text" hint="This text is revealed word-by-word as users scroll. Keep it punchy and impactful.">
                    <Input multiline value={sections.manifesto?.content || ''} onChange={v => updateSection('manifesto', 'content', v)} placeholder="We don't build websites. We engineer digital gravity..." />
                </Field>
                <Field label="Background Image (optional)" hint="Shown as a subtle parallax behind the manifesto">
                    <Input value={sections.manifesto?.image_url || ''} onChange={v => updateSection('manifesto', 'image_url', v)} placeholder="https://example.com/bg.jpg" />
                </Field>
            </SectionCard>

            {/* Homepage Stats */}
            <SectionCard sectionKey="stats" title="📊 Homepage Stats" hint="Stats shown alongside the story block on the Home page">
                <div className="space-y-3">
                    {(sections.stats?.items || []).filter((i: any) => !i._settings).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-dark-950 p-3 rounded-xl border border-white/[0.06]">
                            <GripVertical className="h-4 w-4 text-gray-600 flex-shrink-0" />
                            <input className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Value (e.g. 150+)" value={item.value || ''} onChange={e => updateItem('stats', idx, 'value', e.target.value)} />
                            <input className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Suffix (e.g. +, %)" value={item.suffix || ''} onChange={e => updateItem('stats', idx, 'suffix', e.target.value)} />
                            <input className="flex-[2] bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Label" value={item.label || ''} onChange={e => updateItem('stats', idx, 'label', e.target.value)} />
                            <button onClick={() => deleteItem('stats', idx)} className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('stats', { value: '', suffix: '', label: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Stat
                    </button>
                </div>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 2: ABOUT PAGE HERO
    // ═══════════════════════════════════════════
    const renderAboutHero = () => (
        <div className="space-y-6">
            <SectionCard sectionKey="hero" title="📄 About Page Hero" hint="The cinematic hero section on the /about page">
                <Field label="Headline" hint="Use **asterisks** for bold/outline split typography">
                    <Input value={sections.hero?.title || ''} onChange={v => updateSection('hero', 'title', v)} placeholder="**Crafting** Legacies." />
                </Field>
                <Field label="Title Size">
                    <Select value={getTitleSize('hero')} onChange={v => setTitleSize('hero', v)} options={[
                        { value: 'xs', label: 'XS — Extra Small (text-5xl / text-6xl)' },
                        { value: 'sm', label: 'SM — Small (text-6xl / text-7xl)' },
                        { value: 'md', label: 'MD — Medium (text-7xl / text-8xl)' },
                        { value: 'lg', label: 'LG — Large (text-8xl / text-9xl)' },
                        { value: 'xl', label: 'XL — Extra Large (default, text-9xl+)' },
                    ]} />
                </Field>
                <Field label="Tagline / Subtitle">
                    <Input value={sections.hero?.subtitle || ''} onChange={v => updateSection('hero', 'subtitle', v)} placeholder="Where Innovation Meets Artistry" />
                </Field>
                <Field label="Description">
                    <Input multiline value={sections.hero?.content || ''} onChange={v => updateSection('hero', 'content', v)} placeholder="We are a collective of digital artisans..." />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Media Type">
                        <Select value={sections.hero?.media_type || 'image'} onChange={v => updateSection('hero', 'media_type', v)} options={[
                            { value: 'image', label: 'Image (Photo)' },
                            { value: 'video', label: 'Video (MP4/WebM)' },
                        ]} />
                    </Field>
                    <Field label="Hero Media URL">
                        <Input value={sections.hero?.image_url || ''} onChange={v => updateSection('hero', 'image_url', v)} placeholder="https://example.com/about-hero.jpg" />
                    </Field>
                </div>
                {sections.hero?.image_url && <ImagePreview url={sections.hero.image_url} size="lg" />}
            </SectionCard>

            <SectionCard sectionKey="fullscreen_image" title="🖼️ Featured Full-Screen Image" hint="Full-bleed image between Hero and Story sections">
                <Field label="Image URL">
                    <Input value={sections.fullscreen_image?.image_url || ''} onChange={v => updateSection('fullscreen_image', 'image_url', v)} placeholder="https://example.com/featured-image.jpg" />
                </Field>
                {sections.fullscreen_image?.image_url && <ImagePreview url={sections.fullscreen_image.image_url} size="lg" />}
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 3: STORY & NARRATIVE
    // ═══════════════════════════════════════════
    const renderStory = () => (
        <div className="space-y-6">
            <SectionCard sectionKey="story" title="📖 Our Story" hint="The main story block, also used on the Home page split layout">
                <Field label="Title">
                    <Input value={sections.story?.title || ''} onChange={v => updateSection('story', 'title', v)} placeholder="Our Story" />
                </Field>
                <Field label="Story Content (Markdown)">
                    <MarkdownEditor
                        value={sections.story?.content || ''}
                        onChange={(val) => updateSection('story', 'content', val)}
                        height={400}
                    />
                </Field>
                <Field label="Story Image URL (optional)">
                    <Input value={sections.story?.image_url || ''} onChange={v => updateSection('story', 'image_url', v)} placeholder="https://example.com/story.jpg" />
                </Field>
            </SectionCard>

            <SectionCard sectionKey="split_narrative" title="📐 Split Narrative Blocks" hint="Alternating image/text chapters. Each block tells a chapter of the agency origin story.">
                <div className="space-y-4">
                    {(sections.split_narrative?.items || []).map((block: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={block.title || `Chapter ${idx + 1}`}
                            subtitle={`Layout: ${block.layout || 'auto'}`}
                            onDelete={() => deleteItem('split_narrative', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('split_narrative', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.split_narrative?.items || []).length - 1 ? () => moveItem('split_narrative', idx, idx + 1) : undefined}
                        >
                            <Field label="Chapter Title">
                                <Input value={block.title || ''} onChange={v => updateItem('split_narrative', idx, 'title', v)} placeholder="Our Beginning" />
                            </Field>
                            <Field label="Content">
                                <Input multiline value={block.content || ''} onChange={v => updateItem('split_narrative', idx, 'content', v)} placeholder="It started with a single laptop..." />
                            </Field>
                            <Field label="Image URL">
                                <Input value={block.image_url || ''} onChange={v => updateItem('split_narrative', idx, 'image_url', v)} placeholder="https://example.com/chapter.jpg" />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Image Position">
                                    <Select value={block.layout || 'left'} onChange={v => updateItem('split_narrative', idx, 'layout', v)} options={[
                                        { value: 'left', label: 'Image Left / Text Right' },
                                        { value: 'right', label: 'Image Right / Text Left' },
                                    ]} />
                                </Field>
                                <Field label="Pull-Quote Stat (optional)">
                                    <Input value={block.stat || ''} onChange={v => updateItem('split_narrative', idx, 'stat', v)} placeholder="150+" />
                                </Field>
                            </div>
                            <Field label="Stat Label (optional)">
                                <Input value={block.stat_label || ''} onChange={v => updateItem('split_narrative', idx, 'stat_label', v)} placeholder="Projects Delivered" />
                            </Field>
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('split_narrative', { title: '', content: '', image_url: '', layout: 'left', stat: '', stat_label: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Narrative Block
                    </button>
                </div>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 4: PEOPLE
    // ═══════════════════════════════════════════
    const renderPeople = () => (
        <div className="space-y-6">
            <SectionCard sectionKey="team" title="👥 Team Members" hint="The editorial team roster with 3D tilt cards">
                <Field label="Section Title (optional)">
                    <Input value={sections.team?.title || ''} onChange={v => updateSection('team', 'title', v)} placeholder="The Minds Behind It" />
                </Field>
                <div className="space-y-3">
                    {(sections.team?.items || []).map((member: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={member.name || `Member ${idx + 1}`}
                            subtitle={member.role || 'No role set'}
                            onDelete={() => deleteItem('team', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('team', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.team?.items || []).length - 1 ? () => moveItem('team', idx, idx + 1) : undefined}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Name">
                                    <Input value={member.name || ''} onChange={v => updateItem('team', idx, 'name', v)} placeholder="Full Name" />
                                </Field>
                                <Field label="Role">
                                    <Input value={member.role || ''} onChange={v => updateItem('team', idx, 'role', v)} placeholder="CEO & Creative Director" />
                                </Field>
                            </div>
                            <Field label="Photo URL">
                                <Input value={member.image || ''} onChange={v => updateItem('team', idx, 'image', v)} placeholder="https://example.com/photo.jpg" />
                            </Field>
                            <Field label="Video URL (optional)" hint="Short loop video that plays on hover crossfading over the photo">
                                <Input value={member.video_url || ''} onChange={v => updateItem('team', idx, 'video_url', v)} placeholder="https://example.com/clip.mp4" />
                            </Field>
                            <Field label="Stat / Bio line (optional)">
                                <Input value={member.stat || ''} onChange={v => updateItem('team', idx, 'stat', v)} placeholder="10+ years experience" />
                            </Field>
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('team', { name: '', role: '', image: '', video_url: '', stat: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Team Member
                    </button>
                </div>
            </SectionCard>

            <SectionCard sectionKey="founder" title="🎤 Founder Spotlight" hint="The featured letter/quote from the founder">
                <Field label="Title">
                    <Input value={sections.founder?.title || ''} onChange={v => updateSection('founder', 'title', v)} placeholder="Why We Do What We Do" />
                </Field>
                <Field label="Role / Subtitle">
                    <Input value={sections.founder?.subtitle || ''} onChange={v => updateSection('founder', 'subtitle', v)} placeholder="CEO & Creative Director" />
                </Field>
                <Field label="Founder Quote / Letter" hint="Use line breaks for multiple paragraphs">
                    <Input multiline value={sections.founder?.content || ''} onChange={v => updateSection('founder', 'content', v)} placeholder="I started this agency because I believed design could change..." />
                </Field>
                <Field label="Founder Photo URL">
                    <Input value={sections.founder?.image_url || ''} onChange={v => updateSection('founder', 'image_url', v)} placeholder="https://example.com/founder.jpg" />
                </Field>
                {sections.founder?.image_url && <ImagePreview url={sections.founder.image_url} size="lg" />}
                <Field label="Signature Image URL (optional)" hint="PNG of founder's signature, shown below the quote">
                    <Input
                        value={(sections.founder?.items || [])[0]?.signature_url || ''}
                        onChange={v => {
                            const currentItems = sections.founder?.items || [];
                            const newItems = currentItems.length > 0
                                ? [{ ...currentItems[0], signature_url: v }, ...currentItems.slice(1)]
                                : [{ signature_url: v }];
                            updateSection('founder', 'items', newItems);
                        }}
                        placeholder="https://example.com/signature.png"
                    />
                </Field>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 5: PROOF & CULTURE
    // ═══════════════════════════════════════════
    const renderProof = () => (
        <div className="space-y-6">
            {/* Orbital Stats */}
            <SectionCard sectionKey="about_stats" title="📊 About Page Stats" hint="Animated counter stats on the About page (separate from Homepage stats)">
                <div className="space-y-3">
                    {(sections.about_stats?.items || []).map((stat: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-dark-950 p-3 rounded-xl border border-white/[0.06]">
                            <GripVertical className="h-4 w-4 text-gray-600 flex-shrink-0" />
                            <input className="w-20 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50 text-center font-bold" placeholder="150" value={stat.value || ''} onChange={e => updateItem('about_stats', idx, 'value', e.target.value)} />
                            <input className="w-12 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50 text-center" placeholder="+" value={stat.suffix || ''} onChange={e => updateItem('about_stats', idx, 'suffix', e.target.value)} />
                            <input className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Label (e.g. Works Delivered)" value={stat.label || ''} onChange={e => updateItem('about_stats', idx, 'label', e.target.value)} />
                            <button onClick={() => deleteItem('about_stats', idx)} className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('about_stats', { value: '', suffix: '+', label: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Stat
                    </button>
                </div>
            </SectionCard>

            {/* Culture Bento */}
            <SectionCard sectionKey="culture" title="🎨 Studio Culture Bento Grid" hint="Bento box grid with stats, quotes, locations, and media">
                <div className="space-y-3">
                    {(sections.culture?.items || []).map((item: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={item.label || item.value || `Cell ${idx + 1}`}
                            subtitle={`Type: ${item.type || 'text'}`}
                            onDelete={() => deleteItem('culture', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('culture', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.culture?.items || []).length - 1 ? () => moveItem('culture', idx, idx + 1) : undefined}
                        >
                            <Field label="Cell Type">
                                <Select value={item.type || 'stat'} onChange={v => updateItem('culture', idx, 'type', v)} options={[
                                    { value: 'stat', label: '📊 Stat (number + label)' },
                                    { value: 'quote', label: '💬 Quote' },
                                    { value: 'location', label: '📍 Location' },
                                    { value: 'video', label: '🎬 Video' },
                                    { value: 'text', label: '📝 Text' },
                                ]} />
                            </Field>
                            <Field label="Value">
                                <Input value={item.value || ''} onChange={v => updateItem('culture', idx, 'value', v)} placeholder={item.type === 'stat' ? '99%' : 'Content...'} />
                            </Field>
                            <Field label="Label">
                                <Input value={item.label || ''} onChange={v => updateItem('culture', idx, 'label', v)} placeholder="Client Retention" />
                            </Field>
                            {item.type === 'video' && (
                                <Field label="Video URL">
                                    <Input value={item.media_url || ''} onChange={v => updateItem('culture', idx, 'media_url', v)} placeholder="https://example.com/behind-scenes.mp4" />
                                </Field>
                            )}
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('culture', { type: 'stat', value: '', label: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Bento Cell
                    </button>
                </div>
            </SectionCard>

            {/* About Testimonials */}
            <SectionCard sectionKey="about_testimonials" title="💬 About Page Testimonials" hint="Masonry wall of client quotes (separate from the global Testimonials component)">
                <div className="space-y-3">
                    {(sections.about_testimonials?.items || []).map((t: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={t.author || `Testimonial ${idx + 1}`}
                            subtitle={t.role ? `${t.role}${t.company ? `, ${t.company}` : ''}` : 'No role set'}
                            onDelete={() => deleteItem('about_testimonials', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('about_testimonials', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.about_testimonials?.items || []).length - 1 ? () => moveItem('about_testimonials', idx, idx + 1) : undefined}
                        >
                            <Field label="Quote">
                                <Input multiline value={t.quote || ''} onChange={v => updateItem('about_testimonials', idx, 'quote', v)} placeholder="Working with your team was extraordinary..." />
                            </Field>
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Author">
                                    <Input value={t.author || ''} onChange={v => updateItem('about_testimonials', idx, 'author', v)} placeholder="Maria Santos" />
                                </Field>
                                <Field label="Role">
                                    <Input value={t.role || ''} onChange={v => updateItem('about_testimonials', idx, 'role', v)} placeholder="CEO" />
                                </Field>
                                <Field label="Company">
                                    <Input value={t.company || ''} onChange={v => updateItem('about_testimonials', idx, 'company', v)} placeholder="TechPH Corp" />
                                </Field>
                            </div>
                            <Field label="Avatar URL (optional)">
                                <Input value={t.avatar_url || ''} onChange={v => updateItem('about_testimonials', idx, 'avatar_url', v)} placeholder="https://example.com/avatar.jpg" />
                            </Field>
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('about_testimonials', { quote: '', author: '', role: '', company: '', avatar_url: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Testimonial
                    </button>
                </div>
            </SectionCard>

            {/* Client Logos */}
            <SectionCard sectionKey="clients" title="🏢 Client Logos" hint="Logo marquee shown on the About page">
                <div className="space-y-3">
                    {(sections.clients?.items || []).map((client: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-dark-950 p-3 rounded-xl border border-white/[0.06]">
                            <div className="w-10 h-10 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                                {client.logo_url ? <img src={client.logo_url} className="w-full h-full object-contain p-1" alt="" /> : <ImageIcon className="h-4 w-4 text-gray-600" />}
                            </div>
                            <input className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Client Name" value={client.name || ''} onChange={e => updateItem('clients', idx, 'name', e.target.value)} />
                            <input className="flex-[2] bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Logo URL" value={client.logo_url || ''} onChange={e => updateItem('clients', idx, 'logo_url', e.target.value)} />
                            <button onClick={() => deleteItem('clients', idx)} className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('clients', { name: '', logo_url: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Client Logo
                    </button>
                </div>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 6: JOURNEY & AWARDS
    // ═══════════════════════════════════════════
    const renderJourney = () => (
        <div className="space-y-6">
            {/* Timeline */}
            <SectionCard sectionKey="timeline" title="⏱️ Timeline / Journey" hint="Scroll-driven vertical timeline of company milestones">
                <div className="space-y-3">
                    {(sections.timeline?.items || []).map((event: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={`${event.year || '????'} — ${event.title || 'Untitled'}`}
                            onDelete={() => deleteItem('timeline', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('timeline', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.timeline?.items || []).length - 1 ? () => moveItem('timeline', idx, idx + 1) : undefined}
                        >
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <Field label="Year">
                                    <Input value={event.year || ''} onChange={v => updateItem('timeline', idx, 'year', v)} placeholder="2024" />
                                </Field>
                                <Field label="Title">
                                    <Input value={event.title || ''} onChange={v => updateItem('timeline', idx, 'title', v)} placeholder="Studio Founded" />
                                </Field>
                            </div>
                            <Field label="Description">
                                <Input multiline value={event.description || ''} onChange={v => updateItem('timeline', idx, 'description', v)} placeholder="What happened during this milestone..." />
                            </Field>
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('timeline', { year: '', title: '', description: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Timeline Event
                    </button>
                </div>
            </SectionCard>

            {/* Core Values */}
            <SectionCard sectionKey="values" title="💎 Core Values" hint="Auto-rotating carousel of company values">
                <div className="space-y-3">
                    {(sections.values?.items || []).map((value: any, idx: number) => (
                        <CollapsibleCard
                            key={idx}
                            title={`${value.icon || '•'} ${value.title || `Value ${idx + 1}`}`}
                            onDelete={() => deleteItem('values', idx)}
                            onMoveUp={idx > 0 ? () => moveItem('values', idx, idx - 1) : undefined}
                            onMoveDown={idx < (sections.values?.items || []).length - 1 ? () => moveItem('values', idx, idx + 1) : undefined}
                        >
                            <div className="grid grid-cols-[80px_1fr] gap-4">
                                <Field label="Icon" hint="Emoji">
                                    <Input value={value.icon || ''} onChange={v => updateItem('values', idx, 'icon', v)} placeholder="🎯" />
                                </Field>
                                <Field label="Title">
                                    <Input value={value.title || ''} onChange={v => updateItem('values', idx, 'title', v)} placeholder="Precision" />
                                </Field>
                            </div>
                            <Field label="Description">
                                <Input multiline value={value.description || ''} onChange={v => updateItem('values', idx, 'description', v)} placeholder="Every pixel, every interaction..." />
                            </Field>
                        </CollapsibleCard>
                    ))}
                    <button onClick={() => addItem('values', { icon: '✨', title: '', description: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Value
                    </button>
                </div>
            </SectionCard>

            {/* Awards */}
            <SectionCard sectionKey="awards" title="🏆 Awards & Recognition" hint="Horizontal scrolling awards wall (only shows if entries exist)">
                <div className="space-y-3">
                    {(sections.awards?.items || []).map((award: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-dark-950 p-3 rounded-xl border border-white/[0.06]">
                            <GripVertical className="h-4 w-4 text-gray-600 flex-shrink-0" />
                            <input className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Award Title" value={award.title || ''} onChange={e => updateItem('awards', idx, 'title', e.target.value)} />
                            <input className="w-40 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50" placeholder="Organization" value={award.organization || ''} onChange={e => updateItem('awards', idx, 'organization', e.target.value)} />
                            <input className="w-20 bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-primary-500/50 text-center" placeholder="Year" value={award.year || ''} onChange={e => updateItem('awards', idx, 'year', e.target.value)} />
                            <button onClick={() => deleteItem('awards', idx)} className="p-1.5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                    ))}
                    <button onClick={() => addItem('awards', { title: '', organization: '', year: '' })} className="flex items-center gap-2 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors py-2">
                        <Plus className="h-3.5 w-3.5" /> Add Award
                    </button>
                </div>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB 7: SITE SETTINGS
    // ═══════════════════════════════════════════
    const renderSettings = () => (
        <div className="space-y-6">
            <SectionCard sectionKey="site_settings" title="⚙️ Logo / Favicon">
                <div className="flex items-start gap-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center overflow-hidden bg-dark-950">
                            {sections.site_settings?.image_url ? (
                                <img src={sections.site_settings.image_url} className="w-full h-full object-contain p-3" alt="Site logo" />
                            ) : (
                                <ImageIcon className="h-10 w-10 text-gray-700" />
                            )}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Current Logo</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <Field label="Logo URL" hint="Auto-filled when you upload a new logo">
                            <Input value={sections.site_settings?.image_url || ''} onChange={v => updateSection('site_settings', 'image_url', v)} placeholder="https://your-supabase-url.../logo.png" />
                        </Field>
                        <div>
                            <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/x-icon,image/webp" onChange={handleLogoUpload} className="hidden" />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {uploading ? 'Uploading...' : 'Upload New Logo'}
                            </button>
                            <p className="text-[11px] text-gray-600 mt-2">Accepted: PNG, JPG, SVG, ICO, WEBP — Used as site favicon and logo.</p>
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );

    // ═══════════════════════════════════════════
    //  TAB CONTENT ROUTER
    // ═══════════════════════════════════════════
    const tabContent: Record<TabId, () => JSX.Element> = {
        homepage: renderHomepage,
        about_hero: renderAboutHero,
        story: renderStory,
        people: renderPeople,
        proof: renderProof,
        journey: renderJourney,
        settings: renderSettings,
    };

    return (
        <AboutManagerContext.Provider value={{ saving, onSave: handleSave, onBatchSave: handleSaveMultiple }}>
        <div className="space-y-6 pb-20 relative">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-24 right-8 z-[9999] px-6 py-3.5 rounded-2xl text-sm font-bold shadow-2xl border transition-all animate-fade-in ${
                    toast.type === 'success'
                        ? 'bg-green-500 text-white border-green-400/30 shadow-green-500/30'
                        : 'bg-red-500 text-white border-red-400/30 shadow-red-500/30'
                }`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white font-display tracking-tight">About & Site Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all content sections for the Homepage, About page, and site-wide settings.</p>
                </div>
                <a href="/about" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary-400 transition-colors px-4 py-2 rounded-xl border border-white/10 hover:border-primary-500/30">
                    <Eye className="h-3.5 w-3.5" /> Preview About Page
                </a>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06] overflow-x-auto scrollbar-hide">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                                isActive
                                    ? 'bg-primary-500/15 text-primary-400 shadow-sm'
                                    : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                            }`}
                            title={tab.description}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? 'text-primary-400' : 'text-gray-600'}`} />
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Description */}
            <p className="text-xs text-gray-500 px-1">
                {TABS.find(t => t.id === activeTab)?.description}
            </p>

            {/* Active Tab Content */}
            <div className="animate-fade-in">
                {tabContent[activeTab]()}
            </div>
        </div>
        </AboutManagerContext.Provider>
    );
}


// ═══════════════════════════════════════════════
//  COLLAPSIBLE CARD SUB-COMPONENT
// ═══════════════════════════════════════════════
function CollapsibleCard({ title, subtitle, children, onDelete, onMoveUp, onMoveDown }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-dark-950 rounded-xl border border-white/[0.06] overflow-hidden">
            <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-col gap-0.5">
                    {onMoveUp && (
                        <button onClick={e => { e.stopPropagation(); onMoveUp(); }} className="p-0.5 text-gray-600 hover:text-white transition-colors">
                            <ChevronUp className="h-3 w-3" />
                        </button>
                    )}
                    {onMoveDown && (
                        <button onClick={e => { e.stopPropagation(); onMoveDown(); }} className="p-0.5 text-gray-600 hover:text-white transition-colors">
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                    {subtitle && <p className="text-[11px] text-gray-500 truncate">{subtitle}</p>}
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-red-500/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/[0.04] pt-4">
                    {children}
                </div>
            )}
        </div>
    );
}
