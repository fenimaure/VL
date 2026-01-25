
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Linkedin, Youtube, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export default function FooterManager() {
    const [links, setLinks] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Manage Footer Social Links</h2>

            <div className="bg-dark-900 p-6 rounded-xl border border-white/10 space-y-4">
                {socialFields.map(({ key, label, icon: Icon }) => (
                    <div key={key}>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                            <Icon className="h-4 w-4" /> {label}
                        </label>
                        <input
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={links[key] || ''}
                            onChange={e => handleChange(key, e.target.value)}
                            placeholder={`https://...`}
                        />
                    </div>
                ))}

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
