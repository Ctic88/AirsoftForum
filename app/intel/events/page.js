'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Calendar, MapPin, Users, Plus, Loader2, Search, Clock, Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
    const { data: session } = useSession();
    const [events, setEvents] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '' });
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [evRes, fRes] = await Promise.all([
                fetch('/api/events'),
                fetch('/api/fields')
            ]);

            if (evRes.ok) {
                const data = await evRes.json();
                console.log('Fetched events:', data);
                setEvents(data);
            } else {
                const error = await evRes.json();
                console.error('Events Fetch Error:', error);
                alert(`Error fetching missions: ${error.message || 'Unknown error'}`);
            }

            if (fRes.ok) setFields(await fRes.json());
        } catch (err) {
            console.error('FetchData Crash:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        console.log('Sending event data:', newEvent);
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newEvent.title,
                    description: newEvent.description,
                    event_date: newEvent.date,
                    location_name: newEvent.location
                }),
            });

            if (res.ok) {
                console.log('Event created successfully');
                setNewEvent({ title: '', description: '', date: '', location: '' });
                setShowModal(false);
                fetchData();
            } else {
                const errorData = await res.json();
                console.error('Failed to create event:', errorData);
                alert(`Error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('A network error occurred.');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteEvent = async (e, eventId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Abort mission? This will delete all deployment intelligence.')) return;

        const res = await fetch(`/api/events?id=${eventId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchData();
        } else {
            const error = await res.json();
            alert(`Error aborting mission: ${error.message}`);
        }
    };

    const handleJoin = async (eventId) => {
        if (!session) {
            alert('Trebuie să fii logat pentru a participa la misiuni.');
            return;
        }

        const res = await fetch('/api/events/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId }),
        });

        if (res.ok) {
            fetchData();
        } else {
            const data = await res.json();
            alert(`Eroare la înscriere: ${data.message || 'Error'} ${data.details ? `(${data.details})` : ''}`);
        }
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
                        {events.length > 0 ? events.map((event) => {
                            const isJoined = event.event_attendees?.some(a => a.user_id === session?.user?.id);
                            return (
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
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20 flex items-center gap-2">
                                                    <Shield size={10} /> Active Ops
                                                </span>
                                                <span className="text-xs text-foreground/40 flex items-center gap-1">
                                                    <Clock size={12} /> {new Date(event.event_date).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {(session?.user?.id === event.author_id || session?.user?.role === 'admin') && (
                                                <button
                                                    onClick={(e) => handleDeleteEvent(e, event.id)}
                                                    className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Abort Mission"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-accent-light transition-colors">{event.title}</h3>
                                        <p className="text-xs text-foreground/40 mb-4">Commanded by: <span className="text-white font-bold">{event.author?.name || 'Unknown'}</span></p>
                                        <p className="text-foreground/60 mb-6 leading-relaxed italic text-sm">"{event.description}"</p>

                                        <div className="flex flex-wrap gap-6 text-sm mb-6">
                                            <div className="flex items-center gap-2 text-foreground/40">
                                                <MapPin size={16} className="text-accent-light" />
                                                {event.location?.name || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-foreground/40">
                                                <Users size={16} className="text-accent-light" />
                                                {event.event_attendees?.length || 0} Operators Confirmed
                                            </div>
                                        </div>

                                        {/* Attendee Names List */}
                                        {event.event_attendees?.length > 0 && (
                                            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                                {event.event_attendees.map((a, i) => (
                                                    <span key={i} className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-foreground/60 font-medium">
                                                        {a.user?.callsign || a.user?.name || 'Operator'}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => handleJoin(event.id)}
                                            disabled={isJoined}
                                            className={`flex-1 px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${isJoined
                                                ? 'bg-white/10 text-foreground/40 cursor-not-allowed'
                                                : 'bg-accent hover:bg-accent-light text-white'
                                                }`}
                                        >
                                            {isJoined ? 'Joined Mission' : 'Confirm Join'}
                                        </button>
                                        <button
                                            onClick={() => setSelectedEvent(event)}
                                            className="flex-1 px-8 py-3 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all border border-white/5"
                                        >
                                            Intel Brief
                                        </button>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="py-40 glass rounded-[40px] border border-dashed border-white/10 text-center">
                                <Search className="mx-auto mb-4 opacity-10 w-12 h-12" />
                                <p className="text-foreground/20 font-medium">No missions currently scheduled in this sector.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !creating && setShowModal(false)} />
                    <div className="relative glass w-full max-w-lg overflow-hidden rounded-[40px] border border-white/10 shadow-2xl animate-fade-in">
                        <div className="p-8 md:p-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Schedule Operation</h2>
                            <p className="text-foreground/40 text-sm mb-8">Deploy mission reconnaissance and coordinate logistics.</p>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Mission Title</label>
                                    <input
                                        required
                                        value={newEvent.title}
                                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                        placeholder="e.g. Operation Black Fox"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Deployment Site (DZ)</label>
                                    <select
                                        required
                                        value={newEvent.location}
                                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Deployment Zone...</option>
                                        {fields.map(f => (
                                            <option key={f.id} value={f.name}>{f.name} ({f.location})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Operation Date & Time</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none [color-scheme:dark]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Mission Intelligence / Brief</label>
                                    <textarea
                                        required
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none h-32 resize-none"
                                        placeholder="Outline operational objectives, gear requirements, and rules of engagement..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 glass border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        disabled={creating}
                                    >
                                        Abondon
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all disabled:opacity-50"
                                        disabled={creating}
                                    >
                                        {creating ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : 'Confirm Deployment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !creating && setShowModal(false)} />
                    <div className="relative glass w-full max-w-lg overflow-hidden rounded-[40px] border border-white/10 shadow-2xl animate-fade-in">
                        <div className="p-8 md:p-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Schedule Operation</h2>
                            <p className="text-foreground/40 text-sm mb-8">Deploy mission reconnaissance and coordinate logistics.</p>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Mission Title</label>
                                    <input
                                        required
                                        value={newEvent.title}
                                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                        placeholder="e.g. Operation Black Fox"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Deployment Site (DZ)</label>
                                    <select
                                        required
                                        value={newEvent.location}
                                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Deployment Zone...</option>
                                        {fields.map(f => (
                                            <option key={f.id} value={f.name}>{f.name} ({f.location})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Operation Date & Time</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none [color-scheme:dark]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Mission Intelligence / Brief</label>
                                    <textarea
                                        required
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none h-32 resize-none"
                                        placeholder="Outline operational objectives, gear requirements, and rules of engagement..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 glass border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        disabled={creating}
                                    >
                                        Abondon
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all disabled:opacity-50"
                                        disabled={creating}
                                    >
                                        {creating ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : 'Confirm Deployment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Mission Intel Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
                    <div className="relative glass w-full max-w-2xl overflow-hidden rounded-[40px] border border-white/10 shadow-2xl animate-fade-in">
                        <div className="h-32 bg-gradient-to-br from-accent/20 to-transparent relative">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white border border-white/10"
                            >
                                <Plus size={20} className="rotate-45" />
                            </button>
                            <div className="absolute bottom-6 left-8 flex items-end gap-4">
                                <div className="bg-background p-4 rounded-3xl shadow-xl border border-white/5">
                                    <Shield size={32} className="text-accent-light" />
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">{selectedEvent.title}</h2>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">Field Operations Intel</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Location / DZ</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="font-medium">{selectedEvent.location?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Deployment Schedule</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                                                <Clock size={18} />
                                            </div>
                                            <span className="font-medium">
                                                {new Date(selectedEvent.event_date).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })} at {new Date(selectedEvent.event_date).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Commanding Officer</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                                                <Users size={18} />
                                            </div>
                                            <span className="font-bold text-lg">{selectedEvent.author?.name || 'Unknown Command'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Force Strength</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-accent-light animate-pulse"></div>
                                            <span className="text-white font-bold uppercase tracking-widest text-xs">{selectedEvent.event_attendees?.length || 0} Ready Operators</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-10">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white mb-4">
                                    Mission Briefing
                                </h4>
                                <p className="text-sm text-foreground/60 leading-relaxed italic">
                                    "{selectedEvent.description}"
                                </p>
                            </div>

                            {selectedEvent.event_attendees?.length > 0 && (
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-4">Confirmed Strike Force</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedEvent.event_attendees.map((a, i) => (
                                            <div key={i} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-accent-light"></div>
                                                <span className="text-xs font-bold text-white">{a.user?.callsign || a.user?.name || 'Ghost Operator'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleJoin(selectedEvent.id)}
                                    disabled={selectedEvent.event_attendees?.some(a => a.user_id === session?.user?.id)}
                                    className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all shadow-lg ${selectedEvent.event_attendees?.some(a => a.user_id === session?.user?.id)
                                        ? 'bg-white/10 text-foreground/40 cursor-not-allowed'
                                        : 'bg-accent hover:bg-accent-light text-white'
                                        }`}
                                >
                                    {selectedEvent.event_attendees?.some(a => a.user_id === session?.user?.id) ? 'Already Deployed' : 'Request Deployment'}
                                </button>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
