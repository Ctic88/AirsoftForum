'use client';

import Navbar from '@/components/Navbar';
import Converter from '@/components/Converter';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ConverterPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-5xl mx-auto">
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
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Unit <span className="text-accent-light">Conversion</span></h1>
                            <p className="text-foreground/40 text-sm">Calibrate metrics between global standards.</p>
                        </div>
                    </div>
                </header>

                <Converter />
            </div>
        </main>
    );
}
