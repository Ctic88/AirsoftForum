'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Plus, MessageSquare, User, Calendar, Loader2, Search, Trash2 } from 'lucide-react';

export default function ForumPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [creating, setCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [reportCategory, setReportCategory] = useState('Tactics');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchTopics();
        }
    }, [status]);

    const filteredTopics = topics.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.content && t.content.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const fetchTopics = async () => {
        try {
            const res = await fetch('/api/topics');
            if (res.ok) {
                const data = await res.json();
                setTopics(data);
            }
        } catch (error) {
            console.error("Fetch topics error:", error);
        }
        setLoading(false);
    };

    const handleDeleteTopic = async (e, topicId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this report?')) return;

        const res = await fetch(`/api/topics?id=${topicId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchTopics();
        } else {
            const error = await res.json();
            alert(`Error: ${error.message}`);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        const res = await fetch('/api/topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                content: newContent,
                category: reportCategory
            }),
        });

        if (res.ok) {
            setNewTitle('');
            setNewContent('');
            setShowModal(false);
            fetchTopics();
        }
        setCreating(false);
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar themeSwitcher />

            <div className="pt-32 px-4 max-w-5xl mx-auto">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-2">Intel <span className="text-accent-light">Exchange</span></h1>
                            <p className="text-foreground/40 text-base md:text-lg">Communication channel for active field operators.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl transition-all hover:scale-105"
                        >
                            <Plus size={20} /> Create Report
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 group-hover:text-accent-light transition-colors" size={18} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tactical reports..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-14 focus:ring-2 focus:ring-accent-light outline-none"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {['All', 'Tactics', 'Gear', 'Milsim', 'Tech'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-accent border-accent text-white' : 'glass border-white/10 text-foreground/40 hover:border-white/20'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="grid gap-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-light w-12 h-12" /></div>
                    ) : (
                        <>
                            {filteredTopics.length > 0 ? filteredTopics.map((topic) => (
                                <div key={topic.id} className="glass p-6 md:p-8 rounded-[28px] border border-white/5 hover:border-accent-light/30 transition-all cursor-pointer group relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 mr-4">
                                            <Link href={`/forum/${topic.id}`}>
                                                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-accent-light transition-colors">{topic.title}</h2>
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-accent/20 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">
                                                {topic.category || 'General'}
                                            </div>
                                            {(session?.user?.id === topic.authorId || session?.user?.role === 'admin') && (
                                                <button
                                                    onClick={(e) => handleDeleteTopic(e, topic.id)}
                                                    className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Link href={`/forum/${topic.id}`}>
                                        <p className="text-foreground/70 mb-8 line-clamp-2 italic">"{topic.content}"</p>
                                        <div className="flex items-center gap-6 text-[10px] text-foreground/40 border-t border-white/5 pt-6 uppercase tracking-widest font-bold">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-accent-light" />
                                                <span>{topic.author?.name || 'Unknown Operator'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-accent-light" />
                                                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto text-accent-light">
                                                <MessageSquare size={14} />
                                                <span>View Briefing</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )) : (
                                <div className="text-center py-32 glass rounded-[40px] border border-dashed border-white/10">
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">No intelligence reports matching criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative glass w-full max-w-2xl p-6 md:p-10 rounded-[40px] border border-white/10 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Deploy New Intel</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Report Title</label>
                                <input
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    placeholder="Summarize the briefing..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Intel Classification</label>
                                <select
                                    value={reportCategory}
                                    onChange={(e) => setReportCategory(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none appearance-none cursor-pointer"
                                >
                                    {['Tactics', 'Gear', 'Milsim', 'Tech'].map(cat => (
                                        <option key={cat} value={cat} className="bg-background text-white">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Intel Details</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none resize-none"
                                    placeholder="Provide full documentation..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all"
                                >
                                    Abnormal Mission
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-light shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Deployment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
