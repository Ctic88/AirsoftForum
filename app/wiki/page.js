'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Book, FileText, Settings, Shield, Search, ChevronRight, X, Info, Clock, User } from 'lucide-react';
import Link from 'next/link';

export default function WikiPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedArticle, setSelectedArticle] = useState(null);

    const categories = [
        { name: 'Technical', icon: Settings, count: 42, color: 'text-blue-400' },
        { name: 'Protocols', icon: Shield, count: 18, color: 'text-red-400' },
        { name: 'Field Guides', icon: FileText, count: 24, color: 'text-green-400' },
    ];

    const articles = useMemo(() => [
        {
            id: 1,
            title: 'AEG Maintenance Guide',
            category: 'Technical',
            author: 'EliteSupport',
            date: '2024-01-15',
            content: "Regular maintenance ensures your AEG performs at its peak. This includes cleaning the inner barrel every 2-3 games with a lint-free patch and high-purity isopropyl alcohol. Check your motor height if you hear high-pitched screeching sounds. Gearing shimming should be tight but smooth, reducing friction and noise while increasing parts longevity.",
            tags: ['Gearbox', 'Motor', 'Maintenance']
        },
        {
            id: 2,
            title: 'GBB Lubrication Protocol',
            category: 'Technical',
            author: 'Ghost',
            date: '2024-02-10',
            content: "Gas Blowback systems require constant lubrication due to the freezing effect of expanding gas. Use 100% silicone oil for seals and O-rings, and white lithium grease for high-friction metal-on-metal areas like slide rails or bolt carriers. Never use WD-40 or petroleum-based oils as they corrode rubber components.",
            tags: ['GBB', 'Silicone', 'Seals']
        },
        {
            id: 3,
            title: 'Radio Comms Etiquette',
            category: 'Protocols',
            author: 'Command',
            date: '2023-11-20',
            content: "On the field, radio traffic should be reserved for 'Tactical' and 'Urgent' info. Follow the 'ABC' rule: Accuracy, Brevity, and Clarity. Identify your station, state the recipient, and use pro-words like 'Roger' (Message received), 'Wilco' (Will comply), and 'Out' (Transmission ended). Avoid 'Over and Out'.",
            tags: ['Radio', 'Comms', 'Tactical']
        },
        {
            id: 5,
            title: 'MOSFET & LiPo Safety',
            category: 'Technical',
            author: 'Sparky',
            date: '2024-03-12',
            content: "A MOSFET protects your trigger contacts from electrical arcing, especially when using 11.1V batteries. LiPo batteries must be handled with care: never discharge them completely, always use a balanced charger, and store them in fire-proof bags. A puffed LiPo is a major fire hazard and should be disposed of immediately.",
            tags: ['Electronics', 'Battery', 'Safety']
        },
        {
            id: 6,
            title: 'Squad Formations: The Wedge',
            category: 'Protocols',
            author: 'Sergeant',
            date: '2024-01-28',
            content: "The Wedge is the most common formation for moving through open terrain. It provides excellent 360-degree security and allows for rapid transition to a 'Line' formation for contact. The Pointman stays at the tip, while the Squad Leader remains central to coordinate fire and movement.",
            tags: ['SOP', 'Movement', 'Tactics']
        },
        {
            id: 7,
            title: 'Camouflage & Concealment',
            category: 'Field Guides',
            author: 'Hunter',
            date: '2024-02-22',
            content: "Concealment is not just about the color of your clothing. It's about breaking up your silhouette, reducing shine (from goggles/watches), and controlling movement. Shadows are your best friend. Remember: a stationary target in the wrong camo is harder to see than a moving target in the perfect camo.",
            tags: ['Stealth', 'Woods', 'RECON']
        },
        {
            id: 8,
            title: 'CQB: Room Clearing Basics',
            category: 'Protocols',
            author: 'Breacher',
            date: '2024-03-20',
            content: "Speed, Surprise, and Violence of Action. When entering a room, 'Fatal Funnels' (doorways) must be cleared immediately. The first man takes a corner, the second man takes the opposite. Communication is non-verbal where possible—use shoulder taps to signal readiness. Every corner is a potential threat.",
            tags: ['CQB', 'SOP', 'Close-Quarters']
        },
        {
            id: 9,
            title: 'Optics Zeroing Guide',
            category: 'Field Guides',
            author: 'Oracle',
            date: '2024-01-05',
            content: "Zeroing your Red Dot or Scope is essential. At airsoft ranges, zero for about 20-30 meters. Remember the 'Height Over Bore' effect: at very close ranges, your BB will hit lower than your crosshair. Use a stable rest or bipod when zeroing to eliminate human error.",
            tags: ['Optics', 'Accuracy', 'Training']
        },
        {
            id: 10,
            title: 'Loadout Weight Management',
            category: 'Field Guides',
            author: 'Mule',
            date: '2023-12-15',
            content: "Ounces equal pounds, and pounds equal pain. Balance your weight across your First Line (belt), Second Line (plate carrier), and Third Line (backpack). Keep essential items like magazines and hydration accessible. Avoid over-encumbering yourself with 'cool' looking gear that has no tactical utility.",
            tags: ['Gear', 'Loadout', 'Health']
        },
        {
            id: 11,
            title: 'Inner Barrel: Steel vs Brass',
            category: 'Technical',
            author: 'Smith',
            date: '2024-02-05',
            content: "Stainless steel barrels are more durable and resistant to scratches than brass. A tighter bore (6.01mm) increases FPS but is more prone to jams with low-purity BBs. A 6.03mm bore is generally considered the 'sweet spot' for reliability and precision on most AEG platforms.",
            tags: ['Accuracy', 'Barrel', 'Internal']
        },
        {
            id: 12,
            title: 'Medic Rules & Bleed-outs',
            category: 'Protocols',
            author: 'Doc',
            date: '2024-03-25',
            content: "Standard Milsim medic rules usually involve a 5-minute bleed-out timer. Medics must apply a bandage or tourniquet to get a player back in the fight. Dragging a casualty to cover before healing is a vital tactic to prevent the medic from becoming the next casualty. Always stay low when performing aid.",
            tags: ['Medic', 'Milsim', 'Rules']
        },
        {
            id: 13,
            title: 'Hydration & Field Nutrition',
            category: 'Field Guides',
            author: 'Wilderness',
            date: '2024-01-18',
            content: "Dehydration is the #1 reason players leave the field. Drink water before you feel thirsty. Electrolyte tablets are much better than plain water for long games. High-energy, slow-burn snacks like nuts and protein bars will keep your brain alert during long-duration recon operations.",
            tags: ['Health', 'Survival', 'Water']
        },
    ], []);

    const filteredArticles = articles.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-accent/20">
                            <Book size={12} /> Tactical Knowledge Base
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight">Technical <span className="text-accent-light">Wiki</span></h1>
                        <p className="text-foreground/40 mt-2 text-base md:text-lg">Central intelligence repository for gear and tactics.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 group-hover:text-accent-light transition-colors" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Intel Database..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-14 focus:ring-2 focus:ring-accent-light outline-none transition-all text-white"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(activeCategory === cat.name ? 'All' : cat.name)}
                            className={`glass p-6 md:p-8 rounded-[40px] border transition-all text-center relative overflow-hidden group ${activeCategory === cat.name ? 'border-accent-light bg-accent/5' : 'border-white/5 hover:border-white/20'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 ${activeCategory === cat.name ? 'bg-accent/40 text-white' : 'bg-white/5 text-accent-light'}`}>
                                <cat.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{cat.name}</h3>
                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">{cat.count} Articles Registered</p>
                            {activeCategory === cat.name && (
                                <div className="absolute top-4 right-4 text-accent-light">
                                    <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="glass rounded-[48px] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">
                            {activeCategory === 'All' ? 'Recent Intel Uploads' : `Sector: ${activeCategory}`}
                        </h4>
                        <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
                            {filteredArticles.length} Result(s)
                        </span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {filteredArticles.length > 0 ? filteredArticles.map((art) => (
                            <div
                                key={art.id}
                                onClick={() => setSelectedArticle(art)}
                                className="p-6 md:p-8 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="bg-white/5 p-4 rounded-2xl text-foreground/20 group-hover:text-accent-light transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light opacity-60">{art.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">{art.title}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                                                <User size={10} /> {art.author}
                                            </p>
                                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={10} /> {art.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-full bg-white/5 text-foreground/20 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-45">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center">
                                <Search className="mx-auto mb-4 opacity-5" size={48} />
                                <p className="text-foreground/20 font-bold uppercase tracking-widest">No Intelligence Matching Criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
                    <div className="relative glass w-full max-w-3xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
                        <div className="h-40 bg-accent/20 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-8 right-8 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-8 left-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-accent/40 text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                                        {selectedArticle.category}
                                    </span>
                                    <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">ID: #00{selectedArticle.id}</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{selectedArticle.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 md:p-14">
                            <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
                                {selectedArticle.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-accent-light bg-accent/5 px-3 md:px-4 py-2 rounded-xl border border-accent/10">
                                        # {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/5 relative">
                                    <div className="absolute top-0 right-6 md:right-10 -mt-3">
                                        <div className="bg-background px-3 md:px-4 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest italic tracking-tighter">Verified Intel</span>
                                        </div>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed text-base md:text-lg italic">
                                        "{selectedArticle.content}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <User className="text-accent-light" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Authored By</p>
                                        <p className="text-white font-bold">{selectedArticle.author}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10 flex items-center gap-2">
                                        <FileText size={16} /> Print Report
                                    </button>
                                    <button
                                        onClick={() => setSelectedArticle(null)}
                                        className="px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
                                    >
                                        Dismiss Intel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
