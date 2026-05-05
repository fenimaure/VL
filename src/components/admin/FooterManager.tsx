import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Linkedin, Youtube, Facebook, Instagram, Twitter, Mail, MessageCircle, MessageSquare, Image, Upload, Send, ChevronRight } from 'lucide-react';

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
            alert('Configuration saved successfully!');
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

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
    );

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
        { key: 'whatsapp_url', label: 'WhatsApp Link', icon: MessageCircle, placeholder: 'https://wa.me/...' },
        { key: 'messenger_url', label: 'Messenger Link', icon: MessageSquare, placeholder: 'https://m.me/...' },
    ];

    const contactFormFields = [
        { key: 'whatsapp_number', label: 'WhatsApp Direct (API)', icon: MessageCircle, placeholder: '639123456789' },
        { key: 'messenger_id', label: 'Facebook ID/User', icon: MessageSquare, placeholder: 'your.page.username' },
        { key: 'contact_email', label: 'Contact Destination', icon: Mail, placeholder: 'hello@example.com' },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between mb-12 sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md py-4 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-bold text-white font-display">Branding & Interaction</h2>
                    <p className="text-sm text-gray-500">Configure how your brand connects with the world.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-3 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-primary-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Branding
                </button>
            </div>

            <div className="space-y-16">
                {/* SECTION 1: INTERACTION HUB */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">1</div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Floating Interaction (FAB)</h4>
                    </div>

                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4 ml-1 flex items-center gap-2">
                                <Image className="h-3 w-3" /> Floating Button Profile
                            </label>
                            <div className="flex items-center gap-8">
                                <div className="h-24 w-24 rounded-full bg-dark-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center shadow-2xl relative group">
                                    {links.fab_icon_url ? (
                                        <img src={links.fab_icon_url} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <Send className="h-8 w-8 text-white/10" />
                                    )}
                                </div>
                                <div className="flex-1 max-w-sm">
                                    <input type="file" id="fab-upload" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                                    <label htmlFor="fab-upload" className={`flex items-center justify-center gap-3 w-full py-5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50' : ''}`}>
                                        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary-500" /> : <Upload className="h-5 w-5 text-primary-500" />}
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Update Profile Pic</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {fabFields.map(({ key, label, icon: Icon, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <Icon className="h-3 w-3" /> {label}
                                    </label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all font-mono"
                                        value={links[key] || ''}
                                        onChange={e => handleChange(key, e.target.value)}
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: MESSAGING LOGIC */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-600/20 flex items-center justify-center text-secondary-400 text-xs font-bold">2</div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Inquiry Routing</h4>
                    </div>

                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactFormFields.map(({ key, label, icon: Icon, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <Icon className="h-3 w-3" /> {label}
                                    </label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
                                        value={links[key] || ''}
                                        onChange={e => handleChange(key, e.target.value)}
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1 uppercase font-bold text-xs">!</div>
                            <div className="space-y-2">
                                <p className="text-xs text-blue-400/80 font-bold uppercase tracking-widest">Setup Guide</p>
                                <p className="text-xs text-blue-400/60 leading-relaxed">
                                    <strong>WhatsApp:</strong> Use international format (639123456789). No + or spaces.<br />
                                    <strong>Messenger:</strong> Use your Facebook Page username (found in page settings).<br />
                                    <strong>Email:</strong> Primary address for system notifications and client replies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: SOCIAL CONTEXT */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 text-xs font-bold">3</div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Global Social Links</h4>
                    </div>

                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {socialFields.map(({ key, label, icon: Icon }) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                        <Icon className="h-3.5 w-3.5" /> {label}
                                    </label>
                                    <input
                                        className="w-full bg-dark-950 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary-500 outline-none focus:ring-1 focus:ring-primary-500/50 transition-all font-mono"
                                        value={links[key] || ''}
                                        onChange={e => handleChange(key, e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
