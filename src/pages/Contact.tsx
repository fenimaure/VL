import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Step = 'identity' | 'intent' | 'scope' | 'vision' | 'review';

export default function Contact() {
    const [currentStep, setCurrentStep] = useState<Step>('identity');
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: [] as string[],
        budget: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Auto-focus input on step change
    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (currentStep === 'identity') {
            setTimeout(() => nameInputRef.current?.focus(), 500);
        } else if (currentStep === 'vision') {
            setTimeout(() => messageInputRef.current?.focus(), 500);
        }
    }, [currentStep]);

    const stepOrder: Step[] = ['identity', 'intent', 'scope', 'vision', 'review'];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    const nextStep = () => {
        if (currentStepIndex < stepOrder.length - 1) {
            setDirection(1);
            setCurrentStep(stepOrder[currentStepIndex + 1]);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setDirection(-1);
            setCurrentStep(stepOrder[currentStepIndex - 1]);
        }
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => {
            const newServices = prev.service.includes(service)
                ? prev.service.filter(s => s !== service)
                : [...prev.service, service];
            return { ...prev, service: newServices };
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Fetch contact email
            const { data } = await supabase.from('footer_content').select('value').eq('key_name', 'contact_email').single();
            const targetEmail = data?.value || 'hello@lovelli.com';

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const subject = `Project Initiation: ${formData.name}`;
            const body = `
Project Initiation Report
-------------------------
Client Identity: ${formData.name}
Contact: ${formData.email}

 Intent / Services:
${formData.service.map(s => `- ${s}`).join('\n')}

Scope / Investment: ${formData.budget}

The Vision:
${formData.message}
            `.trim();

            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;

            setIsSubmitting(false);
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    const budgets = ['< $10k', '$10k - $25k', '$25k - $50k', '$50k+'];
    const services = ['Web Development', 'Brand Strategy', 'Mobile App', 'Marketing', 'UI/UX Design', 'Other'];

    // Progress percentage
    const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-black dark:text-white selection:bg-primary-500/30 overflow-x-hidden transition-colors duration-500 flex flex-col">
            <Navbar />

            {/* Immersive Header / Nav Controls */}
            <div className="pt-32 px-6 lg:px-12 max-w-7xl mx-auto w-full flex justify-between items-end mb-12 relative z-10">
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors mb-4 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Abort Mission
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight leading-none">
                        Start A Project
                    </h1>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 dark:text-white/40 mb-2">Progress</p>
                    <div className="text-2xl font-mono font-bold text-primary-500">
                        {String(currentStepIndex + 1).padStart(2, '0')} <span className="text-black/20 dark:text-white/20">/ {String(stepOrder.length).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar (Mobile) */}
            <div className="md:hidden fixed top-[88px] left-0 w-full h-1 bg-black/5 dark:bg-white/5 z-40">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-500"
                />
            </div>


            {/* Main Interactive Area */}
            <main className="flex-1 relative flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-12 pb-20">
                {!submitted ? (
                    <div className="flex-1 flex flex-col justify-center min-h-[500px]">
                        <AnimatePresence custom={direction} mode="wait">
                            {/* Step 1: Identity */}
                            {currentStep === 'identity' && (
                                <motion.div
                                    key="identity"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-3xl space-y-12"
                                >
                                    <div>
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">01. Identity</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">Who are we collaborating with?</h2>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="group">
                                            <input
                                                ref={nameInputRef}
                                                type="text"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-2xl md:text-4xl font-light placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-primary-500 transition-colors"
                                            />
                                        </div>
                                        <div className="group">
                                            <input
                                                ref={emailInputRef}
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 py-4 text-2xl md:text-4xl font-light placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-primary-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Intent */}
                            {currentStep === 'intent' && (
                                <motion.div
                                    key="intent"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-4xl"
                                >
                                    <div>
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">02. Intent</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">What can we build for you?</h2>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                        {services.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => handleServiceToggle(s)}
                                                className={`p-6 md:p-8 rounded-2xl border text-left transition-all duration-300 group hover:shadow-lg ${formData.service.includes(s)
                                                        ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/20 scale-105'
                                                        : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-primary-500/50 hover:text-black dark:hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full border mb-4 flex items-center justify-center transition-colors ${formData.service.includes(s)
                                                        ? 'border-white bg-white/20'
                                                        : 'border-black/20 dark:border-white/20 group-hover:border-primary-500'
                                                    }`}>
                                                    {formData.service.includes(s) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="text-sm md:text-lg font-bold block">{s}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Scope */}
                            {currentStep === 'scope' && (
                                <motion.div
                                    key="scope"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-4xl"
                                >
                                    <div>
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">03. Scope</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">What is the investment range?</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {budgets.map(b => (
                                            <button
                                                key={b}
                                                onClick={() => setFormData({ ...formData, budget: b })}
                                                className={`p-8 rounded-2xl border text-left transition-all duration-300 group hover:shadow-lg flex items-center justify-between ${formData.budget === b
                                                        ? 'bg-black dark:bg-white text-white dark:text-black border-transparent scale-105'
                                                        : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                                                    }`}
                                            >
                                                <span className="text-lg md:text-2xl font-bold">{b}</span>
                                                {formData.budget === b && <Check className="w-6 h-6" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Vision */}
                            {currentStep === 'vision' && (
                                <motion.div
                                    key="vision"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-3xl"
                                >
                                    <div>
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">04. The Vision</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">Tell us about the impact you wish to create.</h2>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            ref={messageInputRef}
                                            rows={6}
                                            placeholder="Start typing your vision here..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-3xl p-8 text-xl md:text-2xl font-light focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-black/20 dark:placeholder:text-white/20 resize-none"
                                        />
                                        <div className="absolute bottom-4 right-4 text-xs text-black/30 dark:text-white/30 font-mono">
                                            {formData.message.length} chars
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 5: Review */}
                            {currentStep === 'review' && (
                                <motion.div
                                    key="review"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full max-w-3xl"
                                >
                                    <div>
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">05. Summary</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">Ready to transmit?</h2>
                                    </div>

                                    <div className="bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-12 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Identity</p>
                                                <p className="text-lg font-bold">{formData.name}</p>
                                                <p className="text-black/60 dark:text-white/60">{formData.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Investment</p>
                                                <p className="text-lg font-bold text-primary-500">{formData.budget || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Selected Services</p>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.service.length > 0 ? formData.service.map(s => (
                                                    <span key={s} className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-sm">{s}</span>
                                                )) : <span className="text-black/40 dark:text-white/40 italic">None selected</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">The Vision</p>
                                            <p className="text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-line">{formData.message}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-2 text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest font-bold">
                                        <Check className="w-3 h-3 text-primary-500" />
                                        Verified & Ready to Send
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex items-center justify-between pt-8 border-t border-black/5 dark:border-white/5">
                            {currentStepIndex > 0 ? (
                                <button
                                    onClick={prevStep}
                                    className="group flex items-center gap-2 px-6 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-widest text-black/60 dark:text-white/60"
                                >
                                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </button>
                            ) : <div></div>}

                            {currentStep !== 'review' ? (
                                <button
                                    onClick={nextStep}
                                    disabled={
                                        (currentStep === 'identity' && (!formData.name || !formData.email)) ||
                                        (currentStep === 'scope' && !formData.budget) ||
                                        (currentStep === 'intent' && formData.service.length === 0)
                                    }
                                    className="group flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="group relative bg-primary-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:shadow-xl hover:shadow-primary-600/20 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isSubmitting ? 'Transmitting...' : 'Transmit Brief'}
                                        {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Success State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-center"
                    >
                        <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/40 mb-12 animate-pulse-slow">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold font-display mb-6 tracking-tight">Signal Received.</h2>
                        <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-lg mx-auto mb-12">
                            Your brief has been successfully generated. Our team will analyze your briefing and initiate contact within 24 hours.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setCurrentStep('identity');
                                setFormData({
                                    name: '',
                                    email: '',
                                    service: [],
                                    budget: '',
                                    message: ''
                                });
                            }}
                            className="bg-black/5 dark:bg-white/5 hover:bg-primary-500 hover:text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
                        >
                            Start New Brief
                        </button>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
