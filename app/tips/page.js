'use client';

import Navbar from '@/components/Navbar';
import { Shield, Target, Trophy, ChevronRight, Zap, Users, Info } from 'lucide-react';
import Link from 'next/link';

export default function TipsPage() {
    const levels = [
        {
            title: 'Recruit',
            subtitle: 'Beginner',
            icon: <Shield className="w-8 h-8" />,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            tips: [
                { title: 'The Golden Rule: Eye Protection', content: 'Never lift your goggles in the play area, no matter what happens. Eye safety is priority #1.' },
                { title: 'Fair-play (Call your hits)', content: 'Airsoft is based on honor. If you are hit, call "HIT!" clearly and raise your hand or an orange dead rag.' },
                { title: 'Minimum Gear', content: 'You don\'t need thousands of dollars. Start with good goggles, a mesh mask, and a rented replica or a G&G Combat Machine.' },
                { title: 'Trigger Discipline', content: 'Keep your finger alongside the trigger until you are ready to shoot. Avoid accidental discharges in the safe zone.' }
            ]
        },
        {
            title: 'Operator',
            subtitle: 'Intermediate',
            icon: <Target className="w-8 h-8" />,
            color: 'text-accent-light',
            bg: 'bg-accent/10',
            tips: [
                { title: 'Tactical Movement', content: 'Don\'t run in the middle of an open field. Use cover, "slice the pie" at corners, and communicate with your team.' },
                { title: 'Basic Maintenance', content: 'Learn to clean your precision barrel after every game and correctly adjust the Hop-Up for your BB weight.' },
                { title: 'Trigger Management', content: 'Use Semi-Auto mode inside buildings and avoid "overkill". 1-2 BBs are enough to mark a hit.' },
                { title: 'Radio Communication', content: 'Learn your team\'s frequencies and use short and clear messages: "Contact, 12 o\'clock, 50 meters".' }
            ]
        },
        {
            title: 'Veteran',
            subtitle: 'Advanced',
            icon: <Trophy className="w-8 h-8" />,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            tips: [
                { title: 'Milsim Protocols', content: 'Study MilSim-style regulations: hierarchy, ammo limits, medic systems, and long-term missions (24h+).' },
                { title: 'Advanced Teching', content: 'Optimize your replica through Shimming, AOE correction, and installing a programmable MOSFET (ex: Gate Titan/Aster).' },
                { title: 'Leadership & Strategy', content: 'Learn to coordinate a squad. Distribute tasks, establish extraction points, and manage team resources.' },
                { title: 'Land Navigation', content: 'Don\'t rely only on GPS. Learn to use a compass and a topographic map for missions in large forests.' }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-background pb-32 md:pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                        <Zap size={14} /> Tactical Knowledge
                    </div>
                    <h1 className="text-6xl font-bold tracking-tight text-white mb-6 uppercase">Tactical <span className="text-accent-light">Tips</span></h1>
                    <p className="text-foreground/40 max-w-2xl mx-auto text-lg">
                        From recruit to veteran. Your guide to progressing in the airsoft arena.
                    </p>
                </header>

                <div className="space-y-24">
                    {levels.map((level, idx) => (
                        <section key={idx} className="relative">
                            <div className="flex items-center gap-6 mb-12">
                                <div className={`w-16 h-16 rounded-[24px] ${level.bg} ${level.color} flex items-center justify-center shadow-lg`}>
                                    {level.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">{level.title}</h2>
                                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{level.subtitle}</p>
                                </div>
                                <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-8" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {level.tips.map((tip, tIdx) => (
                                    <div key={tIdx} className="glass p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 rounded-full bg-white/5 text-accent-light group-hover:bg-accent group-hover:text-white transition-all">
                                                <Info size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-accent-light transition-colors">{tip.title}</h4>
                                                <p className="text-foreground/60 leading-relaxed text-sm">
                                                    {tip.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
