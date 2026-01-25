import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Globe, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        budget: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Fetch the set contact email from Supabase
            const { data } = await supabase.from('footer_content').select('value').eq('key_name', 'contact_email').single();
            const targetEmail = data?.value || 'hello@lovelli.com';

            // Simulate premium processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Construct professional email body
            const subject = `New Project Brief: ${formData.service} - ${formData.name}`;
            const body = `
Digital Briefing Received:
-------------------------
Client Identity: ${formData.name}
Digital Address: ${formData.email}
Project Vector: ${formData.service}
Investment Range: ${formData.budget}

The Vision:
${formData.message}
            `.trim();

            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open user's email client
            window.location.href = mailtoUrl;

            setIsSubmitting(false);
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
        }
    };

    const budgets = [
        '< $10k',
        '$10k - $25k',
        '$25k - $50k',
        '$50k+'
    ];

    const services = [
        'Web Exhibition',
        'Brand Strategy',
        'Technical Architecture',
        'Kinetic Interface Design'
    ];

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-primary-500/30 overflow-x-hidden">
            <Navbar />

            {/* Immersive Briefing Header */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 hover:text-primary-500 transition-all group mb-12">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                        Abandon Entry
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-20">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-[1px] bg-primary-500"></span>
                                <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">The Briefing</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-display leading-[0.8] tracking-tighter">
                                Start A <br />
                                <span className="text-stroke-white italic font-light">Project</span><span className="text-primary-500">.</span>
                            </h1>
                        </div>

                        <div className="lg:mb-4">
                            <p className="text-xl text-white/40 font-light max-w-xs leading-relaxed">
                                We are currently accepting select partnerships for Q3 & Q4 2024. Let's sculpt the future of your brand.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kinetic Form Section */}
            <section className="py-20 lg:py-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Collaborative Info */}
                    <div className="lg:col-span-4 space-y-20">
                        <div className="space-y-10">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary-500 block mb-6">Our Proximity</span>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 glass-card rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Globe className="h-4 w-4 text-white/60" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold tracking-widest">Global Ops</p>
                                            <p className="text-xs text-white/40">Remote First • Manila Core</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 glass-card rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Clock className="h-4 w-4 text-white/60" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold tracking-widest">Response Latency</p>
                                            <p className="text-xs text-white/40">&lt; 24 Hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 rounded-[2rem] glass-card border border-primary-500/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Sparkles className="h-8 w-8 text-primary-500 mb-8" />
                                <h3 className="text-xl font-bold font-display mb-4">Elite Partnership</h3>
                                <p className="text-sm text-white/40 font-light leading-relaxed">
                                    Our engagement model is deeply collaborative. We don't just build; we integrate as your high-end design department.
                                </p>
                            </div>
                        </div>

                        {/* Background Branding for Desktop */}
                        <div className="hidden lg:block pt-20">
                            <div className="text-[8vw] font-black font-display opacity-[0.02] rotate-90 origin-left select-none pointer-events-none">
                                COLLABORATE.
                            </div>
                        </div>
                    </div>

                    {/* The Interactive Form */}
                    <div className="lg:col-span-8">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 ml-4">01. Identity</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="What is your name?"
                                            className="w-full bg-transparent border-b border-white/10 py-6 px-4 text-2xl font-light focus:outline-none focus:border-primary-500 transition-colors placeholder:text-white/10"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 ml-4">02. Digital Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="Where can we reach you?"
                                            className="w-full bg-transparent border-b border-white/10 py-6 px-4 text-2xl font-light focus:outline-none focus:border-primary-500 transition-colors placeholder:text-white/10"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 ml-4">03. Project Vector</label>
                                    <div className="flex flex-wrap gap-4">
                                        {services.map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, service: s })}
                                                className={`px-8 py-4 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-500 ${formData.service === s ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 ml-4">04. Investment Range</label>
                                    <div className="flex flex-wrap gap-4">
                                        {budgets.map(b => (
                                            <button
                                                key={b}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, budget: b })}
                                                className={`px-8 py-4 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-500 ${formData.budget === b ? 'bg-white border-white text-dark-950' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-10">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 ml-4">05. The Vision</label>
                                    <textarea
                                        required
                                        placeholder="Tell us about the impact you wish to create..."
                                        rows={6}
                                        className="w-full bg-transparent border border-white/10 rounded-[2rem] p-8 text-xl font-light focus:outline-none focus:border-primary-500 transition-colors placeholder:text-white/10"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-10 flex items-center justify-between">
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] max-w-[20ch]">
                                        By submitting, you agree to our digital boutique standards.
                                    </p>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="group relative h-32 w-32 md:h-48 md:w-48 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-700 disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                                        <span className={`relative z-10 font-bold uppercase tracking-[0.3em] text-[10px] flex flex-col items-center gap-4 transition-colors duration-500 ${isSubmitting ? 'text-white' : 'group-hover:text-dark-950 text-white'}`}>
                                            {isSubmitting ? (
                                                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Transmit Brief
                                                    <Send className="h-6 w-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-10 glass-card rounded-[4rem] p-12 border border-primary-500/20"
                            >
                                <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/40">
                                    <Sparkles className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-5xl font-bold font-display mb-4 italic">Signal Received.</h2>
                                    <p className="text-white/40 font-light max-w-sm mx-auto">
                                        Your brief has been transmited into our studio. One of our lead designers will review your vision and reach out within 24 hours.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-xs font-bold uppercase tracking-[0.5em] text-primary-500 hover:text-white transition-colors underline underline-offset-8"
                                >
                                    Modify Briefing
                                </button>
                            </motion.div>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
