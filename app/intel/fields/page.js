'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Globe, Star, Info, Loader2, Search, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function FieldsPage() {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        const res = await fetch('/api/fields');
        if (res.ok) {
            const data = await res.json();
            setFields(data);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="mb-16">
                    <Link href="/intel" className="text-accent-light text-xs font-bold uppercase tracking-widest hover:underline mb-4 inline-block">← Return to Intel Hub</Link>
                    <h1 className="text-5xl font-bold text-white uppercase tracking-tight">Deployment <span className="text-accent-light">Zones</span></h1>
                    <p className="text-foreground/40 mt-2 text-lg">Reconnaissance on active airsoft venues and arenas.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-light w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.length > 0 ? fields.map((field) => (
                            <div key={field.id} className="glass p-8 rounded-[40px] border border-white/5 hover:border-accent-light/30 transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-accent/20 p-4 rounded-3xl text-accent-light group-hover:scale-110 transition-transform">
                                        <Trophy size={24} />
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-bold text-white">{field.rating || 'N/A'}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{field.name}</h3>
                                <div className="flex items-center gap-2 text-foreground/40 text-sm mb-6">
                                    <MapPin size={14} />
                                    {field.location}
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <span className="bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">
                                        {field.type}
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    {field.contact_url && (
                                        <a href={field.contact_url} target="_blank" className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 border border-white/10">
                                            <Globe size={14} /> Website
                                        </a>
                                    )}
                                    <button className="flex-1 py-3 bg-accent hover:bg-accent-light text-white rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all shadow-lg">
                                        View Intel
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 glass rounded-[40px] border border-dashed border-white/10 text-center">
                                <Search className="mx-auto mb-4 opacity-10 w-12 h-12" />
                                <p className="text-foreground/20 font-medium">No active zones identified in this sector.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
