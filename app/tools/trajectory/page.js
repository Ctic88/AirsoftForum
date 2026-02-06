'use client';

import Navbar from '@/components/Navbar';
import TrajectoryVisualizer from '@/components/TrajectoryVisualizer';
import { ChevronLeft, Target } from 'lucide-react';
import Link from 'next/link';

export default function TrajectoryPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 text-accent-light hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Tactical Hub</span>
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent-light">
                            <Target size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Ballistic <span className="text-accent-light">Simulation</span></h1>
                            <p className="text-foreground/40 text-sm">Advanced trajectory analysis for precision deployment.</p>
                        </div>
                    </div>
                </header>

                <TrajectoryVisualizer />
            </div>
        </main>
    );
}
