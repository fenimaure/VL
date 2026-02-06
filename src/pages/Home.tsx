import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedProjects from '../components/FeaturedProjects';
import FeaturedCareers from '../components/FeaturedCareers';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedImage() {
            try {
                const { data } = await supabase
                    .from('about_content')
                    .select('image_url')
                    .eq('section_key', 'fullscreen_image')
                    .single();

                if (data) {
                    setFeaturedImage(data.image_url);
                }
            } catch (error) {
                console.error('Error fetching featured image:', error);
            }
        }
        fetchFeaturedImage();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <Navbar />
            <Hero />

            {featuredImage && (
                <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.div
                            initial={{ scale: 1.1 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <img
                                src={featuredImage}
                                alt="Featured"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
                    </div>
                </section>
            )}

            <Services />
            <FeaturedProjects />
            <FeaturedCareers />
            <Testimonials />
            <Footer />
        </div>
    );
}
