'use client';

import Navbar from '@/components/Navbar';
import { Book, FileText, Settings, Shield, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function WikiPage() {
    const articles = [
        { id: 1, title: 'AEG Maintenance Guide', category: 'Technical', author: 'EliteSupport' },
        { id: 2, title: 'GBB Lubrication Protocol', category: 'Technical', author: 'Ghost' },
        { id: 3, title: 'Radio Comms Etiquette', category: 'Protocol', author: 'Command' },
        { id: 4, title: 'Hop-Up Adjustment 101', category: 'Tutorial', author: 'Viper' },
    ];

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-accent/20">
                            <Book size={12} /> Tactical Knowledge Base
                        </div>
                        <h1 className="text-5xl font-bold text-white uppercase tracking-tight">Technical <span className="text-accent-light">Wiki</span></h1>
                        <p className="text-foreground/40 mt-2 text-lg">Central intelligence repository for gear and tactics.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 group-hover:text-accent-light transition-colors" size={18} />
                        <input
                            placeholder="Search Intel Database..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-14 focus:ring-2 focus:ring-accent-light outline-none transition-all"
                        />
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="glass p-8 rounded-[40px] border border-white/5 hover:border-accent-light/30 transition-all text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-light mx-auto mb-6">
                            <Settings size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Technical</h3>
                        <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">42 Articles Registered</p>
                    </div>
                    <div className="glass p-8 rounded-[40px] border border-white/5 hover:border-accent-light/30 transition-all text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-light mx-auto mb-6">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Protocols</h3>
                        <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">18 Protocols Active</p>
                    </div>
                    <div className="glass p-8 rounded-[40px] border border-white/5 hover:border-accent-light/30 transition-all text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-light mx-auto mb-6">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Field Guides</h3>
                        <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">24 Guides Available</p>
                    </div>
                </div>

                <div className="glass rounded-[48px] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">Recent Intel Uploads</h4>
                    </div>
                    <div className="divide-y divide-white/5">
                        {articles.map((art) => (
                            <div key={art.id} className="p-8 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="bg-white/5 p-4 rounded-2xl text-foreground/20 group-hover:text-accent-light transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light opacity-60">{art.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">{art.title}</h3>
                                        <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest">Author: {art.author}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-full bg-white/5 text-foreground/20 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-45">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
