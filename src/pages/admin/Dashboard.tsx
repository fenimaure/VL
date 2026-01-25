
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, LayoutGrid, FileText, BookOpen, Briefcase,
    BarChart3, Plus, Star, Search, Bell, Info, Settings
} from 'lucide-react';

import ProjectsManager from '../../components/admin/ProjectsManager';
import ServicesManager from '../../components/admin/ServicesManager';
import TestimonialsManager from '../../components/admin/TestimonialsManager';
import BlogsManager from '../../components/admin/BlogsManager';
import CareersManager from '../../components/admin/CareersManager';
import AboutManager from '../../components/admin/AboutManager';
import FooterManager from '../../components/admin/FooterManager';

type ModuleType = 'Overview' | 'Services' | 'Projects' | 'Testimonials' | 'Blogs' | 'Careers' | 'About' | 'Footer';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [activeModule, setActiveModule] = useState<ModuleType>('Overview');
    const [stats, setStats] = useState({ projects: 0, blogs: 0, careers: 0, services: 0 });

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

        setStats({
            projects: p.count || 0,
            blogs: b.count || 0,
            careers: c.count || 0,
            services: s.count || 0
        });
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const modules = [
        { id: 'Overview', label: 'Overview', icon: BarChart3 },
        { id: 'Services', label: 'Services', icon: LayoutGrid },
        { id: 'Projects', label: 'Projects', icon: FileText },
        { id: 'Testimonials', label: 'Testimonials', icon: Star },
        { id: 'Blogs', label: 'Blog Posts', icon: BookOpen },
        { id: 'Careers', label: 'Careers', icon: Briefcase },
        { id: 'About', label: 'About Page', icon: Info },
        { id: 'Footer', label: 'Footer Links', icon: Settings },
    ];

    if (!user) return null;

    return (
        <div className="flex h-screen bg-dark-950 text-white overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-900/50 border-r border-white/5 flex flex-col backdrop-blur-xl z-20">
                <div className="p-6 flex items-center gap-2 border-b border-white/5 h-20">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">L</div>
                    <span className="font-display font-bold text-xl tracking-tight">Admin<span className="text-gray-500">Panel</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
                    {modules.map((m) => {
                        const Icon = m.icon;
                        const isActive = activeModule === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveModule(m.id as ModuleType)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 font-medium'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-white'}`} />
                                {m.label}
                                {m.id === 'Overview' && <span className="ml-auto w-2 h-2 rounded-full bg-primary-500"></span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin Account</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-dark-950 to-dark-900">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-dark-950/50 backdrop-blur-sm z-10 sticky top-0">
                    <h2 className="text-xl font-bold text-white font-display">
                        {activeModule === 'Overview' ? 'Dashboard Overview' : `Manage ${activeModule}`}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-dark-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-950"></span>
                        </button>
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
                                    { label: 'Published Posts', value: stats.blogs, icon: BookOpen, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                                    { label: 'Active Jobs', value: stats.careers, icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-400/10' },
                                    { label: 'Services', value: stats.services, icon: LayoutGrid, color: 'text-orange-400', bg: 'bg-orange-400/10' },
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
                            {activeModule === 'Testimonials' && <TestimonialsManager />}
                            {activeModule === 'Blogs' && <BlogsManager />}
                            {activeModule === 'Careers' && <CareersManager />}
                            {activeModule === 'About' && <AboutManager />}
                            {activeModule === 'Footer' && <FooterManager />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
