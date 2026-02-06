'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Package, Plus, User, Info, Camera, Loader2, Search, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoadoutsPage() {
    const { data: session } = useSession();
    const [loadouts, setLoadouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedKit, setSelectedKit] = useState(null);
    const [newLoadout, setNewLoadout] = useState({ title: '', description: '', kit: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchLoadouts();
    }, []);

    const fetchLoadouts = async () => {
        const res = await fetch('/api/loadouts');
        if (res.ok) {
            const data = await res.json();
            setLoadouts(data);
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);

        let image_url = null;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `loadouts/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('images') // Assumes a generic 'images' bucket exists
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);
                image_url = publicUrl;
            }
        }

        const res = await fetch('/api/loadouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newLoadout.title,
                description: newLoadout.description,
                image_url: image_url,
                kit_list: newLoadout.kit.split('\n').filter(i => i.trim())
            }),
        });

        if (res.ok) {
            setNewLoadout({ title: '', description: '', kit: '' });
            setImageFile(null);
            setImagePreview(null);
            setShowModal(false);
            fetchLoadouts();
        }
        setCreating(false);
    };

    return (
        <main className="min-h-screen bg-background pb-32 md:pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-accent/20">
                            <Package size={12} /> Armoury & Loadouts
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight">Operator <span className="text-accent-light">Kits</span></h1>
                        <p className="text-foreground/40 mt-2 text-base md:text-lg">Inspect community gear and tactical configurations.</p>
                    </div>

                    {session && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl transition-all hover:scale-105"
                        >
                            <Plus size={20} /> Deploy Kit
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-light w-12 h-12" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loadouts.length > 0 ? loadouts.map((kit) => (
                            <div key={kit.id} className="glass rounded-[40px] border border-white/5 overflow-hidden group hover:border-accent-light/30 transition-all flex flex-col">
                                <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                                    {kit.image_url ? (
                                        <img src={kit.image_url} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-500">
                                            <Camera size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                            {kit.author?.role || 'Operator'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-accent-light transition-colors">{kit.title}</h3>
                                    <p className="text-sm text-foreground/40 mb-6 line-clamp-2 italic">"{kit.description}"</p>

                                    <div className="space-y-3 mb-8">
                                        {kit.kit_list?.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs text-foreground/60">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-light/40" />
                                                {item}
                                            </div>
                                        ))}
                                        {kit.kit_list?.length > 3 && (
                                            <p className="text-[10px] text-accent-light font-bold uppercase tracking-widest pl-4">+{kit.kit_list.length - 3} More Components</p>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent-light uppercase">
                                                {(kit.author?.callsign || kit.author?.name || 'O').charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-foreground/60">{kit.author?.callsign || kit.author?.name}</span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedKit(kit)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-accent-light hover:underline"
                                        >
                                            Inspect Kit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 glass rounded-[40px] border border-dashed border-white/10 text-center">
                                <Search className="mx-auto mb-4 opacity-10 w-12 h-12" />
                                <p className="text-foreground/20 font-medium">No tactical kits identified in this sector.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative glass w-full max-w-2xl p-6 md:p-10 rounded-[40px] border border-white/10 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Deploy Tactical Kit</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Visual Intel (Photo)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="h-48 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center group-hover:bg-white/10 transition-all overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Camera className="text-foreground/20 mb-2" size={32} />
                                                <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest">Click to upload tactical photo</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Loadout Designation</label>
                                <input
                                    required
                                    value={newLoadout.title}
                                    onChange={(e) => setNewLoadout({ ...newLoadout, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    placeholder="e.g. Urban Recon Ghost"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Intel Summary</label>
                                <input
                                    required
                                    value={newLoadout.description}
                                    onChange={(e) => setNewLoadout({ ...newLoadout, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                    placeholder="Brief description of the setup..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Kit List (One per line)</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newLoadout.kit}
                                    onChange={(e) => setNewLoadout({ ...newLoadout, kit: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none resize-none"
                                    placeholder="Primary: HK416&#10;Sidearm: Glock 17&#10;Vest: JPC 2.0..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all">Abort Operation</button>
                                <button type="submit" disabled={creating} className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-light shadow-xl transition-all flex items-center justify-center gap-2">
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Deployment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Inspect Modal */}
            {selectedKit && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedKit(null)} />
                    <div className="relative glass w-full max-w-4xl p-0 rounded-[48px] border border-white/10 shadow-2xl animate-fade-in overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                        <button
                            onClick={() => setSelectedKit(null)}
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-white/5">
                            {selectedKit.image_url ? (
                                <img src={selectedKit.image_url} alt={selectedKit.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-10">
                                    <Camera size={80} />
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-accent/20">
                                Tactical Intelligence
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tight">{selectedKit.title}</h2>
                            <p className="text-foreground/60 text-sm md:text-base italic mb-8 md:mb-10 leading-relaxed">"{selectedKit.description}"</p>

                            <div className="space-y-6">
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light">Kit Manifest</h4>
                                <div className="grid gap-4">
                                    {selectedKit.kit_list?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <CheckCircle2 size={16} className="text-accent-light shrink-0" />
                                            <span className="text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-bold text-xl uppercase">
                                    {(selectedKit.author?.callsign || selectedKit.author?.name || 'O').charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{selectedKit.author?.callsign || selectedKit.author?.name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{selectedKit.author?.role || 'Field Operator'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
