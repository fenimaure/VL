
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Check, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CareerDetail() {
    const { slug } = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('careers').select('*').eq('slug', slug).single();
                if (error) throw error;
                setJob(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Loading...</div>;
    if (!job) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Job not found.</div>;

    return (
        <div className="min-h-screen bg-dark-950 text-gray-300">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/careers" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Careers
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-6">{job.title}</h1>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary-400" /> {job.department}
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary-400" /> {job.location}
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary-400" /> {job.type}
                        </span>
                        {job.salary_range && (
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" /> {job.salary_range}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">About the Role</h2>
                                <div className="prose prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap">{job.content || job.description}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                                <ul className="space-y-3">
                                    {job.requirements?.map((req: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-gray-300">
                                            <div className="mt-1 min-w-[20px]"><Check className="h-5 w-5 text-primary-500" /></div>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {job.benefits && job.benefits.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Benefits</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {job.benefits.map((benefit: string, i: number) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 text-gray-300">
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-2">Apply Now</h3>
                                <p className="text-gray-400 text-sm mb-6">Interested in this role? Send your resume and portfolio to our team.</p>

                                <a href={`mailto:${job.application_email || 'careers@company.com'}?subject=Application for ${job.title}`} className="block w-full bg-white text-black font-bold text-center py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Mail className="h-4 w-4" /> Apply via Email
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
