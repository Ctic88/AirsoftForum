import Navbar from '@/components/Navbar';
import { Settings, Target, Zap, RefreshCw, Radio, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
    {
        title: "Trajectory Sim",
        description: "Physics-based BB ballistic flight path simulator.",
        icon: Target,
        href: "/tools/trajectory",
        color: "text-accent-light",
        tag: "Ballistics"
    },
    {
        title: "Battery Calc",
        description: "Calculate expected shots and runtime for AC/DC power.",
        icon: Zap,
        href: "/tools/battery",
        color: "text-yellow-500",
        tag: "Electronics"
    },
    {
        title: "Unit Converter",
        description: "Essential tactical unit conversions for FPS and energy.",
        icon: RefreshCw,
        href: "/tools/converter",
        color: "text-blue-400",
        tag: "Metrics"
    },
    {
        title: "Comms Guide",
        description: "NATO alphabet and radio frequency reference.",
        icon: Radio,
        href: "/tools/comms",
        color: "text-red-400",
        tag: "Radio"
    }
];

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                        <Settings size={14} className="animate-spin-slow" />
                        Command Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase">TACTICAL <span className="text-accent-light">HUB</span></h1>
                    <p className="text-foreground/40 max-w-2xl mx-auto text-lg italic leading-relaxed">
                        Deploy specialized intelligence tools for field optimization and gear calibration.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {TOOLS.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group relative glass p-8 md:p-10 rounded-[48px] border border-white/5 hover:border-accent-light/30 transition-all overflow-hidden flex flex-col"
                        >
                            {/* Decorative Background Icon */}
                            <div className={`absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${tool.color}`}>
                                <tool.icon size={280} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-accent/20 ${tool.color}`}>
                                        <tool.icon size={28} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-full border border-white/5 text-foreground/40">
                                        {tool.tag}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-light transition-colors">{tool.title}</h3>
                                <p className="text-foreground/40 text-sm mb-12 max-w-[250px]">
                                    {tool.description}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-light group-hover:translate-x-2 transition-transform">
                                    Launch Module <ChevronRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className="mt-32 pt-12 border-t border-white/5 text-center">
                    <p className="text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-bold">
                        All modules verified for Field Deployment // v2.4.0
                    </p>
                </footer>
            </div>
        </main>
    );
}
