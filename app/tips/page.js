'use client';

import Navbar from '@/components/Navbar';
import { Shield, Target, Trophy, ChevronRight, Zap, Users, Info } from 'lucide-react';
import Link from 'next/link';

export default function TipsPage() {
    const levels = [
        {
            title: 'Recruit',
            subtitle: 'Beginner / Începători',
            icon: <Shield className="w-8 h-8" />,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            tips: [
                { title: 'Regula de Aur: Ochelarii', content: 'Nu ridica niciodată ochelarii în zona de joc, indiferent de ce se întâmplă. Siguranța ochilor este prioritatea #1.' },
                { title: 'Fair-play (Call your hits)', content: 'Airsoft-ul se bazează pe onoare. Dacă ești lovit, strigă "MORT!" clar și ridică mâna sau un vestuț portocaliu.' },
                { title: 'Echipament minim', content: 'Nu ai nevoie de mii de euro. Începe cu ochelari buni, o mască mesh și o replică închiriată sau un G&G Combat Machine.' },
                { title: 'Trigger Discipline', content: 'Ține degetul pe lângă trăgaci până când ești gata să tragi. Evită descărcările accidentale în safe zone.' }
            ]
        },
        {
            title: 'Operator',
            subtitle: 'Intermediate / Mediu',
            icon: <Target className="w-8 h-8" />,
            color: 'text-accent-light',
            bg: 'bg-accent/10',
            tips: [
                { title: 'Tactical Movement', content: 'Nu alerga în mijlocul câmpului. Folosește cover-ul, "taie felia" la colțuri (slicing the pie) și comunică cu echipa.' },
                { title: 'Mentenanță de bază', content: 'Învață să cureți teava de precizie după fiecare joc și să reglezi corect Hop-Up-ul pentru greutatea bilelor tale.' },
                { title: 'Trigger Management', content: 'Folosește modul Semi-Auto în clădiri și evită "overkill-ul". 1-2 bile sunt suficiente pentru a marca un hit.' },
                { title: 'Comunicarea prin Radio', content: 'Învață frecvențele echipei tale și folosește mesaje scurte și clare: "Contact, ora 12, 50 metri".' }
            ]
        },
        {
            title: 'Veteran',
            subtitle: 'Advanced / Avansați',
            icon: <Trophy className="w-8 h-8" />,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            tips: [
                { title: 'Milsim Protocols', content: 'Studiază regulamentele de tip MilSim: ierarhie, limite de muniție, sisteme de medic și misiuni pe termen lung (24h+).' },
                { title: 'Advanced Teching', content: 'Optimizează-ți replica prin Shimming, AOE correction și instalarea unui MOSFET programabil (ex: Gate Titan/Aster).' },
                { title: 'Leadership & Strategie', content: 'Învață să coordonezi o grupă. Distribuie sarcini, stabilește puncte de extracție și gestionează resursele echipei.' },
                { title: 'Land Navigation', content: 'Nu te baza doar pe GPS. Învață să folosești o busolă și o hartă topografică pentru misiunile în păduri mari.' }
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
                    <h1 className="text-6xl font-bold tracking-tight text-white mb-6 uppercase">Sfaturi <span className="text-accent-light">Tactice</span></h1>
                    <p className="text-foreground/40 max-w-2xl mx-auto text-lg">
                        De la recrut la veteran. Ghidul tău pentru progres în arena de airsoft.
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

                <div className="mt-32 glass p-12 rounded-[48px] border border-accent/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <h3 className="text-3xl font-bold text-white mb-4">Ești gata pentru prima misiune?</h3>
                    <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
                        Alătură-te discuțiilor de pe forum pentru a pune întrebări specifice sau pentru a-ți împărtăși propriile experiențe.
                    </p>
                    <Link href="/forum" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
                        Intră pe Forum <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </main>
    );
}
