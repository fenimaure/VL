
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Linkedin, Youtube, Facebook, Instagram, Twitter, Mail, MessageCircle, MessageSquare, Image, Upload, Send } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export default function FooterManager() {
    const [links, setLinks] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        try {
            const { data, error } = await supabase.from('footer_content').select('*');
            if (error) throw error;
            const map: Record<string, string> = {};
            data?.forEach(item => map[item.key_name] = item.value);
            setLinks(map);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `fab-${Math.random()}.${fileExt}`;
            const filePath = `branding/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            handleChange('fab_icon_url', publicUrl);
            alert('FAB Icon uploaded!');
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error uploading icon!');
        } finally {
            setUploading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const updates = Object.entries(links).map(([key, value]) => ({
                key_name: key,
                value: value
            }));

            const { error } = await supabase.from('footer_content').upsert(updates, { onConflict: 'key_name' });
            if (error) throw error;
            alert('Settings saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (key: string, value: string) => {
        setLinks(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div>Loading...</div>;

    const socialFields = [
        { key: 'contact_email', label: 'Contact Email', icon: Mail },
        { key: 'linkedin_url', label: 'LinkedIn URL', icon: Linkedin },
        { key: 'twitter_url', label: 'Twitter URL', icon: Twitter },
        { key: 'instagram_url', label: 'Instagram URL', icon: Instagram },
        { key: 'facebook_url', label: 'Facebook URL', icon: Facebook },
        { key: 'youtube_url', label: 'YouTube URL', icon: Youtube },
        { key: 'tiktok_url', label: 'TikTok URL', icon: TikTokIcon },
    ];

    const fabFields = [
        { key: 'whatsapp_url', label: 'WhatsApp URL (e.g. https://wa.me/...)', icon: MessageCircle },
        { key: 'messenger_url', label: 'Messenger URL (e.g. https://m.me/...)', icon: MessageSquare },
    ];

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Interaction Hub (FAB)</h2>
                <div className="bg-dark-900 p-8 rounded-2xl border border-white/10 space-y-8">
                    {/* FAB Icon Upload */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-4 flex items-center gap-2">
                            <Image className="h-4 w-4" /> Floating Button Picture
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-dark-950 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                {links.fab_icon_url ? (
                                    <img src={links.fab_icon_url} alt="FAB Icon" className="h-full w-full object-cover" />
                                ) : (
                                    <Send className="h-8 w-8 text-white/20" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="fab-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="fab-upload"
                                    className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50' : ''}`}
                                >
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-primary-500" />}
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Upload Brand Icon</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fabFields.map(({ key, label, icon: Icon }) => (
                            <div key={key}>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <Icon className="h-3 w-3" /> {label}
                                </label>
                                <input
                                    className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary-500 transition-colors"
                                    value={links[key] || ''}
                                    onChange={e => handleChange(key, e.target.value)}
                                    placeholder={`https://...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Social Context</h2>
                <div className="bg-dark-900 p-8 rounded-2xl border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {socialFields.map(({ key, label, icon: Icon }) => (
                            <div key={key}>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <Icon className="h-3 w-3" /> {label}
                                </label>
                                <input
                                    className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary-500 transition-colors"
                                    value={links[key] || ''}
                                    onChange={e => handleChange(key, e.target.value)}
                                    placeholder={`https://...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky bottom-10 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-full flex items-center gap-3 shadow-2xl shadow-primary-500/20 font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Lock In Configuration
                </button>
            </div>
        </div>
    );
}
