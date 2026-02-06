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
        {
            id: 14,
            title: 'Hop-Up Bucking Selection',
            category: 'Technical',
            author: 'RangeMaster',
            date: '2024-04-01',
            content: "The bucking is the most important part for accuracy. Use a soft bucking (50-60 degrees) for low FPS/winter and a harder one (70-75 degrees) for high FPS. Maple Leaf Wonder/Super are great for flat-hop performance without complex modifications.",
            tags: ['Hop-Up', 'Accuracy', 'Internal']
        },
        {
            id: 15,
            title: 'Night Ops: Light Discipline',
            category: 'Protocols',
            author: 'Shadow',
            date: '2024-03-15',
            content: "White light should only be used in short bursts for navigation or blinding an enemy. Filter your light with red or blue lenses to preserve your natural night vision. Never shine your light directly at teammates' faces if they are using NVG devices.",
            tags: ['Night', 'Stealth', 'Protocol']
        },
        {
            id: 16,
            title: 'Cold Weather Battery Care',
            category: 'Technical',
            author: 'Frost',
            date: '2023-12-10',
            content: "In freezing temperatures, battery performance drops significantly. Keep your spare LiPos in an inner pocket close to your body heat. NiMH batteries are generally more resistant to cold than LiPo, but have less discharge current. Always wrap your motor grip in grip tape for better insulation.",
            tags: ['Battery', 'Winter', 'Maintenance']
        },
        {
            id: 17,
            title: 'Sniper Concealment: Ghillie Basics',
            category: 'Field Guides',
            author: 'Ghost-1',
            date: '2024-02-05',
            content: "A ghillie suit should match the local vegetation. Use logical colors for the season and add natural veg from the field. Focus on breaking up the head and shoulder silhouette. Most snipers are spotted when moving too fast or when their barrel reflects sunlight.",
            tags: ['Sniper', 'Stealth', 'Camouflage']
        },
        {
            id: 18,
            title: 'Grenade Deployment SOP',
            category: 'Protocols',
            author: 'Boomer',
            date: '2024-04-10',
            content: "Always announce 'Frag Out!' before throwing. Use grenades to clear corners or force an enemy into cover. Impact grenades are best for CQB, while timed grenades are safer for throwing over obstacles. Check site rules for 'bang-bang' radius and pyro usage.",
            tags: ['Ordnance', 'CQB', 'Protocol']
        },
        {
            id: 19,
            title: 'High-Pressure Air (HPA) Basics',
            category: 'Technical',
            author: 'Pressure',
            date: '2024-01-20',
            content: "HPA systems offer the most consistent FPS and adjustable rate of fire. Ensure your tank is within its hydro-test date. Use a quality regulator (Redline, PolarStar) to prevent spikes. Always disconnect the line and bleed the regulator after a game to preserve the O-rings.",
            tags: ['HPA', 'Technical', 'Performance']
        },
        {
            id: 20,
            title: 'Hand Signals for Stealth',
            category: 'Protocols',
            author: 'Silent',
            date: '2023-11-15',
            content: "Non-verbal communication is vital for recon. Common signals: Closed fist (Stop), Open palm (Freeze), Finger to ear (Listen), Two fingers to eyes (I see enemy). Ensure the whole squad knows the signals to avoid confusion during high-stress encounters.",
            tags: ['Comms', 'Stealth', 'Squad']
        },
        {
            id: 21,
            title: 'Shimming the Gearbox',
            category: 'Technical',
            author: 'Mechanic',
            date: '2024-02-28',
            content: "Proper shimming aligns your gears perfectly, reducing wear and noise. Start shimming from the bevel gear to the motor pinion. Use a 'shim-down' approach for the sector gear to ensure perfect engagement with the piston rack. A thin layer of quality grease is all you need.",
            tags: ['Gearbox', 'Technical', 'Repair']
        },
        {
            id: 22,
            title: 'Eye Protection: ANSI Z87.1+',
            category: 'Field Guides',
            author: 'SafetyFirst',
            date: '2024-03-05',
            content: "Never compromise on eye protection. Ensure your goggles are rated ANSI Z87.1+ or MIL-PRF-32432. Full-seal goggles are mandatory on most fields. Treat your lenses with anti-fog solution and replace them if they receive a direct, high-joule hit or show deep scratches.",
            tags: ['Safety', 'Gear', 'Health']
        },
        {
            id: 23,
            title: 'The Art of Flanking',
            category: 'Protocols',
            author: 'Tactician',
            date: '2024-04-05',
            content: "Flanking requires one element to pin the enemy (Fix) while another moves to the side or rear (Finish). Timing is critical. The flanking element should maintain silence until they are in a position to deliver decisive fire. Use terrain to mask your movement.",
            tags: ['Tactics', 'Squad', 'Movement']
        },
        {
            id: 24,
            title: 'Gas Magazine Maintenance',
            category: 'Technical',
            author: 'GreenGas',
            date: '2023-12-20',
            content: "Keep your gas magazines slightly pressurized during storage to keep the seals tight. If a mag leaks from the fill valve, try soaking the O-ring in silicone oil. For output valve leaks, use a valve key to tighten or replace the internal seal. Avoid 'venting' all gas at once as it freezes the O-rings.",
            tags: ['GBB', 'Maintenance', 'Magazine']
        },
        {
            id: 25,
            title: 'Radio Frequency Selection',
            category: 'Field Guides',
            author: 'Signal',
            date: '2024-01-10',
            content: "UHF (PMR446 or FRS) is the standard for airsoft. Use CTCSS or DCS 'privacy codes' to filter out other teams, but remember this doesn't actually encrypt your signal—anyone can still listen. High-ground placement for your antenna significantly increases range in forested areas.",
            tags: ['Radio', 'Comms', 'Field']
        },
        {
            id: 26,
            title: 'Standardizing Mags: STANAG vs Others',
            category: 'Field Guides',
            author: 'Logistician',
            date: '2024-02-15',
            content: "Standardizing magazine types within a squad allows for 'buddy-loading' during long fire-fights. The STANAG (M4) platform is the most common. Mid-cap magazines are preferred for their lack of 'rattle' and realistic capacity, vs high-caps which require winding and make noise while moving.",
            tags: ['Gear', 'Squad', 'Logistics']
        },
        {
            id: 27,
            title: 'Correcting AOE (Angle of Engagement)',
            category: 'Technical',
            author: 'TechPro',
            date: '2024-03-30',
            content: "AOE is the angle at which the sector gear makes contact with the first tooth of the piston. Ideally, it should be at 12 o'clock. Use Sorbothane pads or washers on the cylinder head to space the piston back. This prevents stripping the first piston tooth and extends the life of your gearbox shell.",
            tags: ['Gearbox', 'Piston', 'Technical']
        },
        {
            id: 28,
            title: 'Urban Combat: High-Low Peek',
            category: 'Protocols',
            author: 'Operator-X',
            date: '2023-11-30',
            content: "When clearing a corner with a teammate, the 'High-Low' technique allows two guns to bear on a target simultaneously. The lead operator crouches (low), while the second operator stands (high) behind them. Do not use this in hallways where fire can be easily returned at both targets.",
            tags: ['CQB', 'Tactics', 'Squad']
        },
        {
            id: 29,
            title: 'Proper Footwear for Airsoft',
            category: 'Field Guides',
            author: 'Trekker',
            date: '2024-02-25',
            content: "Ankle support is mandatory for outdoor fields with uneven terrain. Waterproof boots (Gore-Tex) are essential for morning dew or muddy conditions. Breaking in your boots weeks before a large event will prevent blisters that could take you out of the game early.",
            tags: ['Gear', 'Health', 'Field']
        },
        {
            id: 30,
            title: 'Motor Selection: Torque vs Speed',
            category: 'Technical',
            author: 'Voltage',
            date: '2024-01-08',
            content: "High-torque motors are better for heavy springs and trigger response. Neodymium magnets provide significantly more power than ferrous ones. High-speed motors are for ultra-high ROF builds but run hotter and are less efficient at semi-auto performance. Always match your gear ratio to your motor's torque.",
            tags: ['Motor', 'Electronics', 'Technical']
        },
        {
            id: 31,
            title: 'Sentry Protocol: Keeping Watch',
            category: 'Protocols',
            author: 'Watchman',
            date: '2023-12-05',
            content: "Sentry duty requires 100% focus. Divide your sector into clear zones of responsibility. Use a 'Scan and Focus' method: scan the horizon, then focus on specific cover points. In a two-man post, one operator rests while the other maintains surveillance to prevent fatigue.",
            tags: ['SOP', 'Defense', 'Field']
        },
        {
            id: 32,
            title: 'Clearing Jams in the Field',
            category: 'Technical',
            author: 'FieldTech',
            date: '2024-04-12',
            content: "If your gun stops firing, check the battery first. If you hear a 'clunk', it might be a BB jam. Disconnect the mag and use a cleaning rod carefully. Never force the trigger if the gearbox is locked, as this can burn out your motor or strip gears. Always carry a folding cleaning rod in your kit.",
            tags: ['Repair', 'Maintenance', 'Field']
        },
    ], []);

    const filteredArticles = articles.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-background pb-32 md:pb-20">
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
                                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                                            <Clock size={10} /> {art.date}
                                        </p>
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

                            <div className="mt-12 pt-10 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    className="px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg w-full md:w-auto"
                                >
                                    Dismiss Intel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
