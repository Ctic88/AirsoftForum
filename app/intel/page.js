'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Map, Calendar, Shield, Crosshair, ChevronRight } from 'lucide-react';

export default function IntelPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                        <Shield size={14} /> Intelligence Sector
                    </div>
                    <h1 className="text-6xl font-bold tracking-tight text-white mb-6 uppercase">Tactical <span className="text-accent-light">Intel</span></h1>
                    <p className="text-foreground/40 max-w-2xl mx-auto text-lg">
                        Access strategic data on deployment zones and upcoming missions. Intelligence is the key to field dominance.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <Link href="/intel/fields" className="group">
                        <div className="glass h-full p-12 rounded-[48px] border border-white/5 hover:border-accent-light/30 transition-all flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-accent/10 transition-colors" />
                            <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center text-accent-light mb-8 group-hover:scale-110 transition-transform">
                                <Map size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Field Directory</h2>
                            <p className="text-foreground/60 mb-8 leading-relaxed">
                                Detailed reconnaissance on tactical venues, CQB arenas, and forest deployment zones.
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-accent-light font-bold uppercase tracking-widest text-[10px]">
                                Access Sector <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>

                    <Link href="/intel/events" className="group">
                        <div className="glass h-full p-12 rounded-[48px] border border-white/5 hover:border-accent-light/30 transition-all flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-accent/10 transition-colors" />
                            <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center text-accent-light mb-8 group-hover:scale-110 transition-transform">
                                <Calendar size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Mission Calendar</h2>
                            <p className="text-foreground/60 mb-8 leading-relaxed">
                                Deploy for upcoming skirmishes and Milsim operations. Coordinate with your squad.
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-accent-light font-bold uppercase tracking-widest text-[10px]">
                                View Operations <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
