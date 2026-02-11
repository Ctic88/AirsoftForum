'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { MapPin, Globe, Star, Info, Loader2, Search, Trophy, Shield, Trash2, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function FieldsPage() {
    const { data: session } = useSession();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedField, setSelectedField] = useState(null);
    const [showManageModal, setShowManageModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        location: '',
        type: 'Outdoor',
        rating: 4.5,
        contact_url: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFields();
    }, []);

    const handleDeleteField = async (e, fieldId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Elimini această zonă de desfășurare? Datele vor fi șterse definitiv.')) return;

        const res = await fetch(`/api/fields?id=${fieldId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchFields();
        } else {
            const error = await res.json();
            window.dispatchEvent(new CustomEvent('hud-alert', {
                detail: { content: `Eroare: ${error.message}`, type: 'alert' }
            }));
        }
    };

    const fetchFields = async () => {
        const res = await fetch('/api/fields');
        if (res.ok) {
            const data = await res.json();
            setFields(data);
        }
        setLoading(false);
    };

    const handleSaveField = async (e) => {
        e.preventDefault();
        setSaving(true);
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/fields?id=${formData.id}` : '/api/fields';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setShowManageModal(false);
            fetchFields();
        } else {
            const error = await res.json();
            window.dispatchEvent(new CustomEvent('hud-alert', {
                detail: { content: `Eroare: ${error.message}`, type: 'alert' }
            }));
        }
        setSaving(false);
    };

    const openManageModal = (field = null) => {
        if (field) {
            setIsEditing(true);
            setFormData({
                id: field.id,
                name: field.name,
                location: field.location,
                type: field.type,
                rating: field.rating || 4.5,
                contact_url: field.contact_url || ''
            });
        } else {
            setIsEditing(false);
            setFormData({ id: null, name: '', location: '', type: 'Outdoor', rating: 4.5, contact_url: '' });
        }
        setShowManageModal(true);
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <Link href="/intel" className="text-accent-light text-xs font-bold uppercase tracking-widest hover:underline mb-4 inline-block">← Return to Intel Hub</Link>
                            <h1 className="text-5xl font-bold text-white uppercase tracking-tight">Deployment <span className="text-accent-light">Zones</span></h1>
                            <p className="text-foreground/40 mt-2 text-lg">Reconnaissance on active airsoft venues and arenas.</p>
                        </div>
                        {session?.user?.role === 'admin' && (
                            <button
                                onClick={() => openManageModal()}
                                className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 shadow-xl transition-all hover:scale-105"
                            >
                                <Plus size={20} /> Add Deployment Zone
                            </button>
                        )}
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-light w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.length > 0 ? fields.map((field) => (
                            <div key={field.id} className="glass p-8 rounded-apple-xl border border-white/5 hover:border-accent-light/30 transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-accent/20 p-4 rounded-3xl text-accent-light group-hover:scale-110 transition-transform">
                                        <Trophy size={24} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-bold text-white">{field.rating || 'N/A'}</span>
                                        </div>
                                        {session?.user?.role === 'admin' && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); openManageModal(field); }}
                                                    className="p-2 text-foreground/20 hover:text-accent-light hover:bg-accent/10 rounded-lg transition-all"
                                                    title="Modifică"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteField(e, field.id)}
                                                    className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Elimină Locație"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{field.name}</h3>
                                <div className="flex items-center gap-2 text-foreground/40 text-sm mb-6">
                                    <MapPin size={14} />
                                    {field.location}
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <span className="bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">
                                        {field.type}
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    {field.contact_url && (
                                        <a href={field.contact_url} target="_blank" className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 border border-white/10 text-foreground/60">
                                            <Globe size={14} /> Website
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelectedField(field)}
                                        className="flex-1 py-3 bg-accent hover:bg-accent-light text-white rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all shadow-lg"
                                    >
                                        View Intel
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 glass rounded-apple-xl border border-dashed border-white/10 text-center">
                                <Search className="mx-auto mb-4 opacity-10 w-12 h-12" />
                                <p className="text-foreground/20 font-medium">No active zones identified in this sector.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Field Intel Modal */}
            {selectedField && (
                <div className="fixed top-24 right-8 z-100 flex flex-col gap-4 pointer-events-none">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedField(null)}></div>
                    <div className="glass w-full max-w-2xl rounded-[48px] border border-white/10 overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="h-32 bg-accent/20 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <button
                                onClick={() => setSelectedField(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
                            >
                                <Search size={20} className="rotate-45" />
                            </button>
                            <div className="absolute bottom-6 left-8 flex items-end gap-4">
                                <div className="bg-background p-4 rounded-3xl shadow-xl border border-white/5">
                                    <Trophy size={32} className="text-accent-light" />
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">{selectedField.name}</h2>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">Field Intel Dossier</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Location Coordinates</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="font-medium">{selectedField.location}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Engagement Type</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-light">
                                                <Shield size={18} />
                                            </div>
                                            <span className="font-medium">{selectedField.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Strategic Rating</label>
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-500">
                                                <Star size={18} className="fill-yellow-500" />
                                            </div>
                                            <span className="font-bold text-xl">{selectedField.rating || 'N/A'}<span className="text-xs text-foreground/40 font-normal ml-1">/ 5.0</span></span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 block mb-2">Operational Status</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Active Zone</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-10">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white mb-4">
                                    <Info size={14} className="text-accent-light" /> Rules of Engagement (RoE)
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "EYE PROTECTION MANDATORY AT ALL TIMES IN HOT ZONES",
                                        "FPS LIMITS STRICTLY ENFORCED PER FIELD POLICY",
                                        "FAIR PLAY AND HONOR SYSTEM (CALL YOUR HITS)",
                                        "BIO-DEGRADABLE BBS ONLY IN FOREST SECTORS"
                                    ].map((rule, i) => (
                                        <li key={i} className="text-xs text-foreground/60 flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full bg-accent-light"></div>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                {selectedField.contact_url ? (
                                    <a
                                        href={selectedField.contact_url}
                                        target="_blank"
                                        className="flex-1 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Globe size={16} /> Contact Field Command
                                    </a>
                                ) : (
                                    <div className="flex-1 py-4 bg-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-center text-foreground/20 border border-white/5 cursor-not-allowed">
                                        No Contact Data Available
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedField(null)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Admin Management Modal */}
            {showManageModal && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !saving && setShowManageModal(false)}></div>
                    <div className="glass w-full max-w-lg rounded-apple-xl border border-white/10 overflow-hidden relative shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                        <div className="p-8 md:p-10">
                            <h2 className="text-3xl font-bold text-white mb-2">{isEditing ? 'Actualizează Locație' : 'Zonă de Desfășurare Nouă'}</h2>
                            <p className="text-foreground/40 text-sm mb-8">Stabilește recunoașterea strategică pentru operatorii din teren.</p>

                            <form onSubmit={handleSaveField} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Nume Locație</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                        placeholder="ex. Wolf Arena"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Localitate</label>
                                        <input
                                            required
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                            placeholder="Oraș / Județ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Rating</label>
                                        <input
                                            type="number" step="0.1" min="0" max="5"
                                            value={formData.rating}
                                            onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">Tip Teren</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Outdoor">Outdoor / Pădurice</option>
                                        <option value="CQB">CQB / Urban</option>
                                        <option value="Milsim">Milsim Hub</option>
                                        <option value="Indoor">Indoor Arena</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-2">URL Website (Opțional)</label>
                                    <input
                                        value={formData.contact_url}
                                        onChange={e => setFormData({ ...formData, contact_url: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowManageModal(false)}
                                        className="flex-1 py-4 glass border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        disabled={saving}
                                    >
                                        Anulează
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-accent hover:bg-accent-light text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all disabled:opacity-50"
                                        disabled={saving}
                                    >
                                        {saving ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : isEditing ? 'Salvează Intelligence' : 'Înregistrează Zonă'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
