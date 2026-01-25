
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchService() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('services').select('*').eq('slug', slug).single();
                if (error) throw error;
                setService(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchService();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;
    if (!service) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Service not found.</div>;

    const Icon = (Icons as any)[service.icon_name] || Icons.HelpCircle;

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none"></div>
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${service.color_theme || 'from-primary-500 to-secondary-500'} opacity-10 blur-[100px] rounded-full`}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color_theme || 'from-gray-700 to-gray-600'} mb-6 shadow-lg shadow-primary-500/20`}>
                                <Icon className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white font-display mb-6 leading-tight">
                                {service.title}
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                {service.description}
                            </p>
                            <button className="bg-white text-dark-950 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                                Get Started
                            </button>
                        </div>
                        <div>
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color_theme} opacity-20 group-hover:opacity-10 transition-opacity`}></div>
                                <img
                                    src={service.image_url || 'https://via.placeholder.com/800x600?text=Service+Image'}
                                    alt={service.title}
                                    className="w-full h-full object-cover aspect-video"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
                                <div className="whitespace-pre-wrap">{service.content || 'Content coming soon...'}</div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="bg-dark-950 border border-white/10 rounded-2xl p-8 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Key Features</h3>
                                <ul className="space-y-4">
                                    {service.features && service.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-400">
                                            <div className="mt-1 p-1 rounded-full bg-green-500/20 text-green-500">
                                                <Check className="h-3 w-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                    {!service.features && <li className="text-gray-500">No specific features listed.</li>}
                                </ul>

                                <div className="border-t border-white/10 my-8"></div>

                                <h4 className="font-bold text-white mb-2">Ready to start?</h4>
                                <p className="text-sm text-gray-400 mb-6">Contact us today to discuss how we can help you achieve your goals.</p>
                                <a href="mailto:contact@lovelli.services" className="block w-full text-center py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-white font-medium">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
