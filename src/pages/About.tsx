
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Users } from 'lucide-react';

interface AboutSection {
    content: string;
    image_url: string;
    items: any[];
    title: string;
    subtitle: string;
}

export default function About() {
    const [data, setData] = useState<Record<string, AboutSection>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                const { data, error } = await supabase.from('about_content').select('*');
                if (error) throw error;
                const map: any = {};
                data?.forEach((item: any) => map[item.section_key] = item);
                setData(map);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        fetchContent();
    }, []);

    if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300">
            <Navbar />

            {/* 1. Hero (Above the Fold) */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-transparent to-dark-950 z-10"></div>
                <div className="absolute inset-0 z-0">
                    {data.hero?.image_url && <img src={data.hero.image_url} className="w-full h-full object-cover opacity-30" alt="About Hero" />}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
                    <h1 className="text-6xl md:text-8xl font-bold font-display text-white mb-6 tracking-tight leading-none">
                        {data.hero?.title || 'Our Vision'}
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-400 font-medium max-w-3xl mx-auto">
                        {data.hero?.subtitle || 'Clear One-Line Positioning'}
                    </p>
                    <p className="mt-8 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        {data.hero?.content}
                    </p>
                </div>
            </section>

            {/* 2. Our Story */}
            <section className="py-32 bg-dark-900/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-8 font-display">{data.story?.title || 'Our Story'}</h2>
                    <div className="prose prose-invert prose-lg mx-auto">
                        <div className="whitespace-pre-wrap">{data.story?.content}</div>
                    </div>
                </div>
            </section>

            {/* 3. What We Believe */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4 font-display">{data.beliefs?.title || 'What We Believe'}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.beliefs?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Who We Work With */}
            <section className="py-20 border-y border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-500 mb-12 uppercase tracking-widest">{data.who_we_work_with?.title || 'Trusted By'}</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-70">
                        {data.who_we_work_with?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                                {item.logo ? <img src={item.logo} alt={item.name} className="h-8 grayscale hover:grayscale-0 transition-all" /> : <span className="text-xl font-bold text-white">{item.name}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. The Team */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-16 font-display text-center">{data.team?.title || 'Meet the Team'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.team?.items?.map((member: any, idx: number) => (
                            <div key={idx} className="text-center group">
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary-500 transition-colors">
                                    <img src={member.image || 'https://via.placeholder.com/400'} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-primary-400 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Why Choose Us */}
            <section className="py-32 bg-primary-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6 font-display">{data.why_us?.title || 'Why Choose Us'}</h2>
                            <p className="text-lg text-gray-300 mb-8">{data.why_us?.content}</p>
                            <ul className="space-y-6">
                                {data.why_us?.items?.map((item: any, idx: number) => (
                                    <li key={idx} className="flex gap-4">
                                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl rotate-3 opacity-20 blur-xl"></div>
                            <div className="relative bg-dark-900 border border-white/10 p-8 rounded-3xl">
                                <Users className="h-12 w-12 text-primary-400 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Partner with Excellence</h3>
                                <p className="text-gray-400 mb-6">
                                    We don't just build software; we build lasting partnerships that drive growth.
                                </p>
                                <button className="w-full py-4 bg-white text-dark-950 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                    Start a Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
