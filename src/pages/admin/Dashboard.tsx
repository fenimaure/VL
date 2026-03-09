
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, LayoutGrid, FileText, BookOpen, Briefcase,
    BarChart3, Plus, Star, Search, Bell, Info, Settings,
    Menu, X, ChevronLeft, ChevronRight, DollarSign, HelpCircle
} from 'lucide-react';

import ProjectsManager from '../../components/admin/ProjectsManager';
import ServicesManager from '../../components/admin/ServicesManager';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import BlogsManager from '../../components/admin/BlogsManager';
import CareersManager from '../../components/admin/CareersManager';
import AboutManager from '../../components/admin/AboutManager';
import FooterManager from '../../components/admin/FooterManager';

import PricingManager from '../../components/admin/PricingManager';
import InquiriesManager from '../../components/admin/InquiriesManager';
import FAQManager from '../../components/admin/FAQManager';

type ModuleType = 'Overview' | 'Services' | 'Projects' | 'Inquiries' | 'Testimonials' | 'Blogs' | 'Careers' | 'About' | 'Footer' | 'Pricing' | 'FAQ';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [activeModule, setActiveModule] = useState<ModuleType>('Overview');
    const [stats, setStats] = useState({ projects: 0, blogs: 0, careers: 0, services: 0, inquiries: 0 });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) navigate('/admin');
            setUser(user);
        });

        fetchStats();
    }, [navigate]);

    async function fetchStats() {
        const p = await supabase.from('projects').select('id', { count: 'exact' });
        const b = await supabase.from('blogs').select('id', { count: 'exact' });
        const c = await supabase.from('careers').select('id', { count: 'exact' }).eq('is_active', true);
        const s = await supabase.from('services').select('id', { count: 'exact' });

        const i = await supabase.from('project_inquiries').select('id', { count: 'exact' }).eq('status', 'new');

        setStats({
            projects: p.count || 0,
            blogs: b.count || 0,
            careers: c.count || 0,
            services: s.count || 0,
            inquiries: i.count || 0
        });
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const modules = [
        { id: 'Overview', label: 'Overview', icon: BarChart3 },
        { id: 'Services', label: 'Services', icon: LayoutGrid },
        { id: 'Inquiries', label: 'Inquiries', icon: Bell },
        { id: 'Projects', label: 'Projects', icon: FileText },
        { id: 'Testimonials', label: 'Testimonials', icon: Star },
        { id: 'Blogs', label: 'Blog Posts', icon: BookOpen },
        { id: 'Careers', label: 'Careers', icon: Briefcase },
        { id: 'About', label: 'About Page', icon: Info },
        { id: 'Footer', label: 'Footer Links', icon: Settings },
        { id: 'Pricing', label: 'Pricing', icon: DollarSign },
        { id: 'FAQ', label: 'FAQ', icon: HelpCircle },
    ];

    if (!user) return null;

    const SidebarContent = () => (
        <>
            <div className={`p-6 flex items-center justify-between border-b border-white/5 h-20 overflow-hidden`}>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/30 shrink-0">L</div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-display font-bold text-xl tracking-tight whitespace-nowrap"
                        >
                            Admin<span className="text-gray-500">Panel</span>
                        </motion.span>
                    )}
                </div>
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
                <p className={`px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 mt-2 ${isCollapsed ? 'text-center opacity-0 h-0 overflow-hidden' : ''}`}>Main Menu</p>
                {modules.map((m) => {
                    const Icon = m.icon;
                    const isActive = activeModule === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => {
                                setActiveModule(m.id as ModuleType);
                                if (window.innerWidth < 1024) setIsMobileOpen(false);
                            }}
                            title={isCollapsed ? m.label : ''}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                ? 'bg-primary-500/10 text-primary-400 font-bold'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'text-primary-400 scale-110' : 'text-gray-500 group-hover:text-white group-hover:scale-110'}`} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="whitespace-nowrap"
                                >
                                    {m.label}
                                </motion.span>
                            )}
                            {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary-500 rounded-full" />}
                            {m.id === 'Overview' && !isCollapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow"></span>}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-dark-900/40">
                {!isCollapsed ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-4 group hover:border-primary-500/30 transition-all cursor-pointer"
                    >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-black shadow-inner">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Admin</p>
                            <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest">{user.email}</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex justify-center mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-black shadow-inner cursor-pointer hover:border hover:border-primary-500/30">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center gap-3 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-widest ${isCollapsed ? 'px-0' : ''}`}
                >
                    <LogOut className="h-4 w-4 shrink-0" /> {!isCollapsed && "Logout"}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-dark-950 text-white overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Desktop Sidebar (Collapsible) */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 100 : 280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-col bg-dark-900/50 border-r border-white/5 backdrop-blur-2xl relative z-30"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-dark-900 z-[70] flex flex-col border-r border-white/10 lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-dark-950 to-dark-900">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-dark-950/50 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white font-display tracking-tight">
                            {activeModule === 'Overview' ? 'Dashboard Overview' : `${activeModule}`}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="relative hidden sm:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                className="bg-dark-900/50 border border-white/10 rounded-2xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 w-40 md:w-64 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl relative transition-all border border-white/5">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-950 shadow-glow"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeModule === 'Overview' && (
                        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                            {/* Welcome Banner */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 md:p-12 shadow-2xl">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <BarChart3 className="w-64 h-64 text-white transform rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome back, Ky</h1>
                                    <p className="text-white/80 text-lg max-w-xl">
                                        Your digital headquarters is running smoothly. Here's what's happening across your platform today.
                                    </p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Projects', value: stats.projects, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { label: 'Published Posts', value: stats.blogs, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                    { label: 'Active Jobs', value: stats.careers, icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-400/10' },
                                    { label: 'New Inquiries', value: stats.inquiries, icon: Bell, color: 'text-red-400', bg: 'bg-red-400/10' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+2.5%</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                        <p className="text-gray-400 text-sm">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button onClick={() => setActiveModule('Projects')} className="flex items-center gap-4 bg-dark-900 border border-white/5 p-4 rounded-xl hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all group text-left">
                                        <div className="h-10 w-10 bg-dark-950 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-primary-500/50">
                                            <Plus className="h-5 w-5 text-gray-400 group-hover:text-primary-400" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-200 group-hover:text-white">Add Project</span>
                                            <span className="text-xs text-gray-500">Showcase new work</span>
                                        </div>
                                    </button>
                                    <button onClick={() => setActiveModule('Blogs')} className="flex items-center gap-4 bg-dark-900 border border-white/5 p-4 rounded-xl hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all group text-left">
                                        <div className="h-10 w-10 bg-dark-950 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-primary-500/50">
                                            <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-primary-400" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-200 group-hover:text-white">Write Post</span>
                                            <span className="text-xs text-gray-500">Share your thoughts</span>
                                        </div>
                                    </button>
                                    <button onClick={() => setActiveModule('Careers')} className="flex items-center gap-4 bg-dark-900 border border-white/5 p-4 rounded-xl hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all group text-left">
                                        <div className="h-10 w-10 bg-dark-950 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-primary-500/50">
                                            <Briefcase className="h-5 w-5 text-gray-400 group-hover:text-primary-400" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-200 group-hover:text-white">Post Job</span>
                                            <span className="text-xs text-gray-500">Expand the team</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModule !== 'Overview' && (
                        <div className="max-w-7xl mx-auto animate-fade-in">
                            {activeModule === 'Projects' && <ProjectsManager />}
                            {activeModule === 'Services' && <ServicesManager />}
                            {activeModule === 'Inquiries' && <InquiriesManager />}
                            {activeModule === 'Testimonials' && <TestimonialsManager />}
                            {activeModule === 'Blogs' && <BlogsManager />}
                            {activeModule === 'Careers' && <CareersManager />}
                            {activeModule === 'About' && <AboutManager />}
                            {activeModule === 'Footer' && <FooterManager />}
                            {activeModule === 'Pricing' && <PricingManager />}
                            {activeModule === 'FAQ' && <FAQManager />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
