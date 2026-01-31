import Navbar from '@/components/Navbar';
import Converter from '@/components/Converter';
import { Settings } from 'lucide-react';

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                        <Settings size={14} className="animate-spin-slow" />
                        Tactical Maintenance
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-white mb-4">TACTICAL <span className="text-accent-light">TOOLS</span></h1>
                    <p className="text-foreground/40 max-w-xl mx-auto text-lg italic">
                        Precision engineering for the modern operator. Calibrate your gear with intelligence.
                    </p>
                </header>

                <div className="grid gap-12">
                    <Converter />

                    {/* Optional: Placeholder for future tools */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass p-8 rounded-[32px] border border-white/5 opacity-50 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 mb-4 flex items-center justify-center text-foreground/20 italic font-bold">?</div>
                            <h4 className="font-bold text-white/40 mb-2">Comms Encryption</h4>
                            <p className="text-xs text-foreground/20 uppercase tracking-widest">Locked: Under Development</p>
                        </div>
                        <div className="glass p-8 rounded-[32px] border border-white/5 opacity-50 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 mb-4 flex items-center justify-center text-foreground/20 italic font-bold">?</div>
                            <h4 className="font-bold text-white/40 mb-2">Squad Map Sync</h4>
                            <p className="text-xs text-foreground/20 uppercase tracking-widest">Locked: Under Development</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
