import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticHover from './MagneticHover';

interface Service {
    id: string;
    title: string;
    slug: string;
    is_highlighted?: boolean;
}

const COMPARE_FEATURES = [
    'Strategy & Research',
    'Brand Identity',
    'UI/UX Design',
    'Web Development',
    'Content Creation',
    'SEO Optimisation',
    'Analytics & Reporting',
    'Ongoing Support',
];

function getServiceFeatures(title: string): boolean[] {
    const t = title.toLowerCase();
    if (t.includes('social') || t.includes('media'))
        return [true, false, true, false, true, true, true, true];
    if (t.includes('web') || t.includes('development') || t.includes('experience'))
        return [true, true, true, true, false, true, true, true];
    if (t.includes('brand') || t.includes('design'))
        return [true, true, true, false, true, false, false, false];
    if (t.includes('seo') || t.includes('search'))
        return [true, false, false, false, true, true, true, true];
    if (t.includes('ecommerce') || t.includes('shop'))
        return [true, true, true, true, true, true, true, true];
    // Default
    return [true, true, true, false, true, false, true, false];
}

export default function ServiceComparison({ services }: { services: Service[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });

    if (!services || services.length < 2) return null;

    const displayServices = services.slice(0, 5);

    return (
        <div ref={ref} className="overflow-x-auto scrollbar-hide horizontal-scroll-touch pb-4">
            <table className="w-full min-w-[640px] border-collapse">
                {/* Header */}
                <thead>
                    <tr>
                        <th className="text-left py-6 pl-6 pr-4 w-[200px] sticky left-0 bg-white dark:bg-dark-950 z-10 transition-colors">
                            <span className="service-meta-label text-black/30 dark:text-white/30">Feature</span>
                        </th>
                        {displayServices.map((service) => (
                            <th key={service.id} className="text-center py-6 px-4 relative">
                                {service.is_highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-1 rounded-full service-accent-bg text-white text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <span className="text-sm font-bold text-black dark:text-white font-display block transition-colors">
                                    {service.title}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody>
                    {COMPARE_FEATURES.map((feature, fIdx) => (
                        <motion.tr
                            key={feature}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: fIdx * 0.05 }}
                            className="border-t border-black/5 dark:border-white/5 transition-colors"
                        >
                            <td className="py-5 pl-6 pr-4 sticky left-0 bg-white dark:bg-dark-950 z-10 transition-colors">
                                <span className="text-sm text-black/70 dark:text-white/70">{feature}</span>
                            </td>
                            {displayServices.map((service) => {
                                const features = getServiceFeatures(service.title);
                                const included = features[fIdx] ?? false;
                                return (
                                    <td key={service.id} className={`py-5 px-4 text-center ${service.is_highlighted ? 'bg-black/[0.01] dark:bg-white/[0.01]' : ''}`}>
                                        {included ? (
                                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                                        ) : (
                                            <Minus className="w-4 h-4 text-black/15 dark:text-white/15 mx-auto" />
                                        )}
                                    </td>
                                );
                            })}
                        </motion.tr>
                    ))}

                    {/* CTA Row */}
                    <tr className="border-t border-black/5 dark:border-white/5 transition-colors">
                        <td className="py-8 pl-6 pr-4 sticky left-0 bg-white dark:bg-dark-950 z-10 transition-colors" />
                        {displayServices.map((service) => (
                            <td key={service.id} className="py-8 px-4 text-center">
                                <MagneticHover strength={0.1}>
                                    <Link
                                        to={`/services/${service.slug}`}
                                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 group ${
                                            service.is_highlighted
                                                ? 'service-accent-bg text-white hover:opacity-90'
                                                : 'border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                                        }`}
                                        data-cursor="pointer"
                                    >
                                        Learn More
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </MagneticHover>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
