import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import MagneticHover from './MagneticHover';

interface PricingTier {
    name: string;
    price: string;
    period?: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
}

export default function ServicePricing({ tiers, onContact }: {
    tiers: PricingTier[];
    onContact?: (tier: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });

    if (!tiers || tiers.length === 0) return null;

    // Find max features count for alignment
    const maxFeatures = Math.max(...tiers.map(t => t.features.length));

    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`pricing-card bg-white dark:bg-dark-950 ${tier.highlighted ? 'highlighted' : ''} relative`}
                >
                    {/* Popular badge */}
                    {tier.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1.5 rounded-full service-accent-bg text-white text-[10px] font-bold uppercase tracking-widest">
                                Most Popular
                            </span>
                        </div>
                    )}

                    {/* Tier name */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold font-display text-black dark:text-white mb-1">
                            {tier.name}
                        </h3>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                        <span className="text-4xl md:text-5xl font-bold font-display text-black dark:text-white tracking-tight">
                            {tier.price}
                        </span>
                        {tier.period && (
                            <span className="text-sm text-black/40 dark:text-white/40 ml-1 font-light">
                                {tier.period}
                            </span>
                        )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-10">
                        {tier.features.map((feature, j) => {
                            const isIncluded = !feature.startsWith('!');
                            const featureText = isIncluded ? feature : feature.slice(1);
                            return (
                                <motion.div
                                    key={j}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: i * 0.15 + j * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    {isIncluded ? (
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <X className="w-4 h-4 text-black/15 dark:text-white/15 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm ${isIncluded ? 'text-black/70 dark:text-white/70' : 'text-black/25 dark:text-white/25 line-through'}`}>
                                        {featureText}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <MagneticHover strength={0.15}>
                        <button
                            onClick={() => onContact?.(tier.name)}
                            className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 group ${
                                tier.highlighted
                                    ? 'service-accent-bg text-white hover:opacity-90'
                                    : 'border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                            data-cursor="pointer"
                        >
                            {tier.cta}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </MagneticHover>
                </motion.div>
            ))}
        </div>
    );
}
