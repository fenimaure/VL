import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedProjects from '../components/FeaturedProjects';
import FeaturedCareers from '../components/FeaturedCareers';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <Navbar />
            <Hero />
            <Services />
            <FeaturedProjects />
            <FeaturedCareers />
            <Testimonials />
            <Footer />
        </div>
    );
}
