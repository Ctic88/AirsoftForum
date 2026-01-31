'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Calendar, MapPin, Users, Plus, Loader2, Search, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
    const { data: session } = useSession();
    const [events, setEvents] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [evRes, fRes] = await Promise.all([
            fetch('/api/events'),
            fetch('/api/fields')
        ]);

        if (evRes.ok) setEvents(await evRes.json());
        if (fRes.ok) setFields(await fRes.json());
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newEvent.title,
                description: newEvent.description,
                event_date: newEvent.date,
                location_id: newEvent.location_id
            }),
        });

        if (res.ok) {
            setNewEvent({ title: '', description: '', date: '', location_id: '' });
            setShowModal(false);
            fetchData();
        }
        setCreating(false);
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <Link href="/intel" className="text-accent-light text-xs font-bold uppercase tracking-widest hover:underline mb-4 inline-block">← Return to Intel Hub</Link>
                        <h1 className="text-5xl font-bold text-white uppercase tracking-tight">Mission <span className="text-accent-light">Calendar</span></h1>
                        <p className="text-foreground/40 mt-2 text-lg">Coordinate deployments and join upcoming operations.</p>
                    </div>

                    {session && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl transition-all hover:scale-105"
                        >
                            <Plus size={20} /> Schedule Operation
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-light w-12 h-12" /></div>
                ) : (
                    <div className="space-y-6">
                        {events.length > 0 ? events.map((event) => (
                            <div key={event.id} className="glass p-8 rounded-[32px] border border-white/5 hover:border-accent-light/30 transition-all group flex flex-col md:flex-row gap-8 items-start">
                                <div className="bg-white/5 p-6 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border border-white/5">
                                    <span className="text-accent-light text-xs font-bold uppercase tracking-widest mb-1">
                                        {new Date(event.event_date).toLocaleDateString('ro-RO', { month: 'short' })}
                                    </span>
                                    <span className="text-3xl font-bold text-white">
                                        {new Date(event.event_date).getDate()}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20 flex items-center gap-2">
                                            <Shield size={10} /> Active Ops
                                        </span>
                                        <span className="text-xs text-foreground/40 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(event.event_date).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-light transition-colors">{event.title}</h3>
                                    <p className="text-foreground/60 mb-6 leading-relaxed italic">"{event.description}"</p>

                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-foreground/40">
                                            <MapPin size={16} className="text-accent-light" />
                                            {event.location?.name || 'Unknown Location'}
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground/40">
                                            <Users size={16} className="text-accent-light" />
                                            {event.attendees?.length || 0} Operators Confirmed
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                    <button className="flex-1 px-8 py-3 bg-accent hover:bg-accent-light text-white rounded-2xl text-sm font-bold transition-all shadow-lg">
                                        Confirm Join
                                    </button>
                                    <button className="flex-1 px-8 py-3 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all border border-white/5">
                                        Intel Brief
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-40 glass rounded-[40px] border border-dashed border-white/10 text-center">
                                <Search className="mx-auto mb-4 opacity-10 w-12 h-12" />
                                <p className="text-foreground/20 font-medium">No missions currently scheduled in this sector.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative glass w-full max-w-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl animate-fade-in">
                        <h3 className="text-3xl font-bold mb-8">Schedule New Mission</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Mission Designation</label>
                                <input
                                    required
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    placeholder="e.g. Operation Nightfall"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Deployment Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Select Zone</label>
                                    <select
                                        required
                                        value={newEvent.location_id}
                                        onChange={(e) => setNewEvent({ ...newEvent, location_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    >
                                        <option value="" className="bg-background text-foreground/40">Choose Field...</option>
                                        {fields.map(f => (
                                            <option key={f.id} value={f.id} className="bg-background">{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Briefing (Mission Details)</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none resize-none"
                                    placeholder="Objectives, entry requirements, etc..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all">Abnormal Operation</button>
                                <button type="submit" disabled={creating} className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-light shadow-xl transition-all flex items-center justify-center gap-2">
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : 'Deploy Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
