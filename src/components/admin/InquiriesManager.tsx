
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Archive, Trash2, CheckCircle, X, Search } from 'lucide-react';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    services: string[];
    message: string;
    status: 'new' | 'contacted' | 'archived';
    created_at: string;
}

export default function InquiriesManager() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'archived'>('all');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        try {
            const { data, error } = await supabase
                .from('project_inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: 'new' | 'contacted' | 'archived') {
        try {
            const { error } = await supabase
                .from('project_inquiries')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            fetchInquiries();
            if (selectedInquiry && selectedInquiry.id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            const { error } = await supabase.from('project_inquiries').delete().eq('id', id);
            if (error) throw error;
            setInquiries(inquiries.filter(i => i.id !== id));
            if (selectedInquiry?.id === id) setSelectedInquiry(null);
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    }

    const filteredInquiries = inquiries.filter(i => {
        if (filter === 'all') return true;
        return i.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'contacted': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading inbox...</div>;

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* List View */}
            <div className={`flex-1 flex flex-col bg-dark-900 border border-white/5 rounded-2xl overflow-hidden ${selectedInquiry ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary-500" /> Inbox
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{inquiries.length}</span>
                    </h2>
                    <div className="flex gap-2">
                        {(['all', 'new', 'contacted', 'archived'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredInquiries.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No inquiries found in this folder.</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredInquiries.map(inquiry => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedInquiry?.id === inquiry.id ? 'bg-white/5 border-l-2 border-primary-500' : 'border-l-2 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold ${inquiry.status === 'new' ? 'text-white' : 'text-gray-400'}`}>{inquiry.name}</h3>
                                        <span className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate mb-2">{inquiry.email}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(inquiry.status)} uppercase font-bold tracking-wider`}>
                                            {inquiry.status}
                                        </span>
                                        {inquiry.services.length > 0 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 truncate max-w-[150px]">
                                                {inquiry.services.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className={`flex-[1.5] bg-dark-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col ${selectedInquiry ? 'flex fixed inset-0 z-50 md:static md:z-0 m-4 md:m-0' : 'hidden md:flex items-center justify-center'}`}>
                {selectedInquiry ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-dark-950/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedInquiry.name}</h2>
                                <p className="text-primary-400 font-mono text-sm">{selectedInquiry.email}</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {new Date(selectedInquiry.created_at).toLocaleString()}
                                    </span>
                                    <div className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(selectedInquiry.status)} uppercase font-bold`}>
                                        {selectedInquiry.status}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStatus(selectedInquiry.id, 'contacted')}
                                    className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                                    title="Mark as Contacted"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedInquiry.id, 'archived')}
                                    className="p-2 rounded-lg bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/20"
                                    title="Archive"
                                >
                                    <Archive className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedInquiry.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                    title="Delete"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => setSelectedInquiry(null)} className="md:hidden p-2 text-gray-400">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Detail Content */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {selectedInquiry.services.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Interested In</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedInquiry.services.map(s => (
                                            <span key={s} className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Message / Vision</h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed text-lg">
                                        {selectedInquiry.message || <span className="italic text-gray-600">No message provided.</span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-4 border-t border-white/5 bg-dark-950/30 flex justify-end">
                            <a
                                href={`mailto:${selectedInquiry.email}`}
                                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <Mail className="h-4 w-4" /> Reply via Email
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        <Mail className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Select an inquiry to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
