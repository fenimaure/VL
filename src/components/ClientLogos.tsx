
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Client {
    name: string;
    logo_url: string;
}

export default function ClientLogos() {
    const [clients, setClients] = useState<Client[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
            try {
                const { data } = await supabase
                    .from('about_content')
                    .select('*')
                    .eq('section_key', 'clients')
                    .single();

                if (data) {
                    setClients(data.items || []);
                    setTitle(data.title || 'Trusted By');
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    if (loading || clients.length === 0) return null;

    return (
        <section className="py-6 md:py-8 bg-transparent transition-colors duration-500 overflow-hidden w-full">
            <div className="max-w-[100vw] mx-auto px-6 lg:px-8">
                <div className="text-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 dark:text-white/20 block">
                        {title}
                    </span>
                </div>

                <div className="relative w-full overflow-hidden mask-linear-fade">
                    {/* Infinite Scroll Container */}
                    <div className="flex w-max animate-scroll">
                        {/* First Copy */}
                        <div className="flex items-center gap-16 md:gap-32 px-8 md:px-16">
                            {clients.map((client, index) => (
                                <div
                                    key={`logo-1-${index}`}
                                    className="relative flex items-center justify-center min-w-[120px] md:min-w-[160px] grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-110 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                                >
                                    <img
                                        src={client.logo_url}
                                        alt={client.name}
                                        className="h-8 md:h-12 w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Second Copy (for seamless loop) */}
                        <div className="flex items-center gap-16 md:gap-32 px-8 md:px-16">
                            {clients.map((client, index) => (
                                <div
                                    key={`logo-2-${index}`}
                                    className="relative flex items-center justify-center min-w-[120px] md:min-w-[160px] grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-110 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                                >
                                    <img
                                        src={client.logo_url}
                                        alt={client.name}
                                        className="h-8 md:h-12 w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fade Edges */}
                    <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white dark:from-dark-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white dark:from-dark-950 to-transparent z-10 pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
}
