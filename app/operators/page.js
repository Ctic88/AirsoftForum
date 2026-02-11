'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { User, Users, Shield, Search, Terminal, Loader2, Signal, Target, Activity, Swords, Zap, Radar, X, ChevronRight, Info, MapPin, Clock } from 'lucide-react';

const roleIcons = {
    'Assault': <Swords className="w-5 h-5" />,
    'Sniper': <Target className="w-5 h-5" />,
    'Medic': <Activity className="w-5 h-5" />,
    'Support': <Zap className="w-5 h-5" />,
    'Recon': <Radar className="w-5 h-5" />,
    'Heavy': <Shield className="w-5 h-5" />
};

export default function OperatorsPage() {
    const { data: session } = useSession();
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedOperator, setSelectedOperator] = useState(null);

    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setOperators(data);
                }
            } catch (error) {
                console.error("IFF Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchOperators();
        }
    }, [session]);

    const filteredOperators = operators.filter(op => {
        const matchesSearch = (op.callsign?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (op.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (op.team?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        const matchesRole = selectedRole === 'All' || op.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    const roles = ['All', 'Assault', 'Sniper', 'Medic', 'Support', 'Recon', 'Heavy'];

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />

            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Tactical HUD Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Signal className="w-5 h-5 text-accent-light animate-pulse" />
                                <span className="text-xs font-bold text-accent-light uppercase tracking-[0.3em]">Neural Link: Stable</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                                IFF <span className="text-accent-light">DATABASE</span>
                            </h1>
                            <p className="text-foreground/40 font-mono text-xs md:text-sm mt-2 max-w-md">
                                Identification Friend or Foe: Encrypted personnel directory and tactical network status.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                                <input
                                    type="text"
                                    placeholder="SCAN CALLSIGN / SQUAD..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-accent-light transition-all font-mono text-sm uppercase tracking-widest placeholder:text-white/10"
                                />
                            </div>

                            {/* Role Filter Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {roles.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedRole === role
                                            ? 'bg-accent border-accent text-white shadow-lg scale-105'
                                            : 'bg-white/5 border-white/5 text-foreground/40 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 grayscale">
                            <Loader2 className="w-12 h-12 text-accent-light animate-spin mb-4" />
                            <p className="font-mono text-[10px] animate-pulse">DECRYPTING PERSONNEL RECORDS...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOperators.map((op) => {
                                const isActive = op.event_attendees?.some(a => new Date(a.events?.event_date) > new Date());
                                return (
                                    <div
                                        key={op.id}
                                        onClick={() => setSelectedOperator(op)}
                                        className="group relative glass p-6 rounded-apple-lg border border-white/10 hover:border-accent-light/50 transition-all duration-500 overflow-hidden cursor-pointer"
                                    >
                                        {/* Scanline Effect */}
                                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent-light/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-2000 pointer-events-none" />

                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-accent-light border border-white/5 group-hover:bg-accent/10 transition-colors duration-500">
                                                    {roleIcons[op.role] || <User size={32} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-2xl tracking-tight uppercase group-hover:text-accent-light transition-colors">
                                                        {op.callsign || op.name || 'UNKNOWN OPERATOR'}
                                                    </h3>
                                                    <span className="text-xs font-bold text-accent-light bg-accent/10 px-2 py-1 rounded border border-accent/20 uppercase tracking-widest flex items-center gap-1.5 shrink-0 w-fit">
                                                        {roleIcons[op.role] && <span className="opacity-50 scale-75">{roleIcons[op.role]}</span>}
                                                        {op.role || 'GHOST'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Info size={16} />
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-white/5 space-y-4 relative z-10 font-mono">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-foreground/40 uppercase tracking-tighter">Operational Status</span>
                                                {isActive ? (
                                                    <span className="text-accent-light font-bold flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
                                                        ACTIVE_OPS
                                                    </span>
                                                ) : (
                                                    <span className="text-foreground/20 font-bold uppercase tracking-widest">
                                                        INACTIVE_OPS
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-foreground/40 uppercase tracking-tighter">Assigned Squad</span>
                                                <span className="text-foreground/80 font-bold uppercase">{op.team || 'SOLO_DIR'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-center text-[10px] font-bold uppercase text-accent-light/40 group-hover:text-accent-light transition-colors">
                                            View Personnel Brief <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredOperators.length === 0 && (
                                <div className="col-span-full py-32 bg-white/5 rounded-apple-xl border border-dashed border-white/10 flex flex-col items-center">
                                    <Terminal className="w-12 h-12 text-foreground/20 mb-4" />
                                    <h3 className="text-foreground/40 font-mono text-sm tracking-widest uppercase">No Signals Detected</h3>
                                    <p className="text-foreground/20 font-mono text-[10px] mt-2">Check search parameters or recruitment status.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Personnel Brief Modal */}
            {selectedOperator && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        onClick={() => setSelectedOperator(null)}
                    />

                    <div className="relative glass w-full max-w-2xl flex flex-col max-h-[90vh] rounded-apple-lg border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        {/* Modal Header HUD */}
                        <div className="h-48 bg-linear-to-br from-accent/20 to-transparent p-10 relative shrink-0">
                            <button
                                onClick={() => setSelectedOperator(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-end gap-6 h-full">
                                <div className="w-24 h-24 rounded-3xl bg-background/80 flex items-center justify-center text-accent-light border border-accent/20 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-accent-light animate-pulse opacity-5" />
                                    {roleIcons[selectedOperator.role] || <User size={48} />}
                                </div>
                                <div className="pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                                        <span className="text-[10px] font-bold text-accent-light uppercase tracking-[0.3em]">Identity Verified</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">
                                        {selectedOperator.callsign || selectedOperator.name}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs font-bold text-accent-light bg-accent/10 px-3 py-1 rounded border border-accent/20 uppercase tracking-widest">
                                            {selectedOperator.role || 'GHOST OPERATOR'}
                                        </span>
                                        <span className="text-[10px] font-mono text-white/20">OPERATOR_ID: {selectedOperator.id.substring(0, 8)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-8 font-mono">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Official Designation</label>
                                        <p className="text-white font-bold">{selectedOperator.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Unit / Squad</label>
                                        <p className="text-accent-light font-bold text-lg uppercase tracking-tight">{selectedOperator.team || 'SOLO_OPERATOR'}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2 text-right">
                                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Deployment Status</label>
                                        {selectedOperator.event_attendees?.some(a => new Date(a.events?.event_date) > new Date()) ? (
                                            <span className="inline-flex items-center gap-2 text-accent-light font-bold text-sm">
                                                <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                                                ON_STANDBY
                                            </span>
                                        ) : (
                                            <span className="text-white/20 font-bold text-sm tracking-widest">OFF_DUTY</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 overflow-visible">
                                <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 sticky top-0 bg-background/50 backdrop-blur-sm py-1">
                                    Operational History & Objectives
                                </h4>
                                <div className="space-y-4">
                                    {selectedOperator.event_attendees?.length > 0 ? (
                                        <>
                                            {/* Upcoming Missions */}
                                            {selectedOperator.event_attendees
                                                .filter(a => new Date(a.events?.event_date) > new Date())
                                                .sort((a, b) => new Date(a.events?.event_date) - new Date(b.events?.event_date))
                                                .map((att, idx) => (
                                                    <div key={`up-${idx}`} className="flex flex-col gap-1 py-1 border-b border-white/5 last:border-0 pb-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-accent-light uppercase tracking-tight">{att.events?.title}</span>
                                                            <span className="text-[10px] font-mono text-accent-light bg-accent/10 px-2 py-0.5 rounded border border-accent/20">UPCOMING</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] text-white/40">
                                                            <span className="flex items-center gap-1 uppercase tracking-tighter"><MapPin size={10} /> {att.events?.location?.name || 'TBD'}</span>
                                                            <span className="flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {new Date(att.events?.event_date).toLocaleDateString('ro-RO')}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                            {/* Past Missions */}
                                            {selectedOperator.event_attendees
                                                .filter(a => new Date(a.events?.event_date) <= new Date())
                                                .sort((a, b) => new Date(b.events?.event_date) - new Date(a.events?.event_date))
                                                .map((att, idx) => (
                                                    <div key={`past-${idx}`} className="flex flex-col gap-1 py-1 border-b border-white/5 last:border-0 pb-3 opacity-60">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-white uppercase tracking-tight">{att.events?.title}</span>
                                                            <span className="text-[10px] font-mono text-white/20 px-2 py-0.5 rounded border border-white/5">ARCHIVED</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] text-white/20">
                                                            <span className="flex items-center gap-1 uppercase tracking-tighter"><MapPin size={10} /> {att.events?.location?.name || 'FIELD'}</span>
                                                            <span className="flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {new Date(att.events?.event_date).toLocaleDateString('ro-RO')}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <p className="text-xs text-white/20 italic text-center py-4">No mission participation records found in current sectors.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setSelectedOperator(null)}
                                    className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all border border-white/10 w-full md:w-auto"
                                >
                                    Terminate Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
