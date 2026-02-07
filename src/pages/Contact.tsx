import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Step = 'identity' | 'intent' | 'vision' | 'review';

export default function Contact() {
    const [currentStep, setCurrentStep] = useState<Step>('identity');
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: [] as string[],
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

    const stepOrder: Step[] = ['identity', 'intent', 'vision', 'review'];
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
            // Save to database
            const { error: dbError } = await supabase.from('project_inquiries').insert([{
                name: formData.name,
                email: formData.email,
                services: formData.service,
                message: formData.message,
                status: 'new'
            }]);

            if (dbError) {
                console.error('Database save error:', dbError);
                alert('Failed to submit. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // Success - show messaging options
            setIsSubmitting(false);
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
        }
    };

    const handleMessagingChoice = async (platform: 'whatsapp' | 'messenger' | 'email') => {
        try {
            // Fetch contact details
            const { data: emailData } = await supabase.from('footer_content').select('value').eq('key_name', 'contact_email').single();
            const { data: whatsappData } = await supabase.from('footer_content').select('value').eq('key_name', 'whatsapp_number').single();
            const { data: messengerData } = await supabase.from('footer_content').select('value').eq('key_name', 'messenger_id').single();

            const message = `Hi! I just submitted a project inquiry.\n\nName: ${formData.name}\nEmail: ${formData.email}\nServices: ${formData.service.join(', ')}\n\nMessage: ${formData.message}`;

            if (platform === 'whatsapp') {
                const phone = whatsappData?.value || '1234567890';

                // Try multiple WhatsApp URL formats for better compatibility
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

                // Open in new tab with error handling
                const newWindow = window.open(whatsappUrl, '_blank');

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Popup blocked or failed - show instructions
                    alert(`Please allow popups for this site, or manually open WhatsApp and message: ${phone}\n\nYour message:\n${message}`);
                }
            } else if (platform === 'messenger') {
                const messengerId = messengerData?.value || 'your.page.id';

                // Use Facebook Messenger web URL
                const messengerUrl = `https://m.me/${messengerId}?text=${encodeURIComponent(message)}`;

                const newWindow = window.open(messengerUrl, '_blank');

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    alert(`Please allow popups for this site, or visit: https://m.me/${messengerId}\n\nYour message:\n${message}`);
                }
            } else {
                const targetEmail = emailData?.value || 'hello@lovelli.com';
                const subject = `Project Initiation: ${formData.name}`;
                const body = `
Project Initiation Report
-------------------------
Client Identity: ${formData.name}
Contact: ${formData.email}

Intent / Services:
${formData.service.map(s => `- ${s}`).join('\n')}

The Vision:
${formData.message}
            `.trim();
                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoUrl;
            }
        } catch (error) {
            console.error('Messaging error:', error);
            alert('Unable to open messaging app. Please contact us directly via email or phone.');
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

    const services = ['Social Media Management', 'Web Development', 'Virtual Assistant', 'Talent Acquisition', 'Other'];

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
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">03. The Vision</p>
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
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4">04. Summary</p>
                                        <h2 className="text-3xl md:text-5xl font-light mb-12">Ready to transmit?</h2>
                                    </div>

                                    <div className="bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-12 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Identity</p>
                                                <p className="text-lg font-bold">{formData.name}</p>
                                                <p className="text-black/60 dark:text-white/60">{formData.email}</p>
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
                        className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-center px-6"
                    >
                        <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/40 mb-8 animate-pulse-slow">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 tracking-tight">Brief Received!</h2>
                        <p className="text-lg text-black/60 dark:text-white/60 font-light max-w-lg mx-auto mb-12">
                            Your inquiry has been saved. For a faster response, reach out directly:
                        </p>

                        {/* Messaging Platform Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
                            {/* WhatsApp */}
                            <button
                                onClick={() => handleMessagingChoice('whatsapp')}
                                className="group relative p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                                    <p className="text-sm text-white/80">Instant messaging</p>
                                </div>
                            </button>

                            {/* Messenger */}
                            <button
                                onClick={() => handleMessagingChoice('messenger')}
                                className="group relative p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                                    </svg>
                                    <h3 className="font-bold text-lg mb-1">Messenger</h3>
                                    <p className="text-sm text-white/80">Facebook chat</p>
                                </div>
                            </button>

                            {/* Email */}
                            <button
                                onClick={() => handleMessagingChoice('email')}
                                className="group relative p-8 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-2xl hover:shadow-2xl hover:shadow-gray-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <Send className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="font-bold text-lg mb-1">Email</h3>
                                    <p className="text-sm text-white/80">Traditional method</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setCurrentStep('identity');
                                setFormData({
                                    name: '',
                                    email: '',
                                    service: [],
                                    message: ''
                                });
                            }}
                            className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors"
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
