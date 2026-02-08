'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User, Shield, Target, Users, Save, Loader2, ChevronLeft, Palette } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        callsign: '',
        team: '',
        role: 'Assault'
    });
    const [currentTheme, setCurrentTheme] = useState('army');

    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme') || 'army';
        setCurrentTheme(theme);
    }, []);

    const fetchProfile = useCallback(async () => {
        const res = await fetch('/api/profile');
        if (res.ok) {
            const data = await res.json();
            setProfile({
                name: data.name || '',
                callsign: data.callsign || '',
                team: data.team || '',
                role: data.role || 'Assault'
            });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, fetchProfile, router]);

    const handleSave = async (e) => {
        e.preventDefault();
        console.log("Attempting profile update...", profile);
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                console.log("Profile updated successfully");
                // Update the local session instantly
                await update({
                    name: profile.name,
                    role: profile.role,
                    callsign: profile.callsign
                });
                alert('Profile Updated Successfully');
            } else {
                const errorData = await res.json();
                console.error("Profile update failed:", errorData);
                alert(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Network or Client Error:", error);
            alert("Connection error. Check console for details.");
        }
        setSaving(false);
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-accent-light" /></div>;

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-3xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tight">Operator <span className="text-accent-light">Profile</span></h1>
                    <p className="text-foreground/40">Customize your tactical identity in the field.</p>
                </header>

                <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
                    <div className="glass p-6 md:p-10 rounded-apple-lg md:rounded-[40px] border border-white/10 space-y-6 md:space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <User size={12} /> Full Name
                                </label>
                                <input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <Shield size={12} /> Callsign
                                </label>
                                <input
                                    value={profile.callsign}
                                    onChange={(e) => setProfile({ ...profile, callsign: e.target.value })}
                                    placeholder="e.g. Ghost, Viper"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <Users size={12} /> Squad / Team
                                </label>
                                <input
                                    value={profile.team}
                                    onChange={(e) => setProfile({ ...profile, team: e.target.value })}
                                    placeholder="e.g. Alpha Unit"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <Target size={12} /> Battlefield Role
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {['Assault', 'Sniper', 'Medic', 'Support', 'Recon', 'Heavy'].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setProfile({ ...profile, role: r })}
                                            className={`py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${profile.role === r
                                                ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(107,122,58,0.3)]'
                                                : 'bg-white/5 border-white/10 text-foreground/40 hover:border-white/20'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                <Palette size={12} /> Tactical Interface Theme
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'army', name: 'Army Green', color: '#4b5320' },
                                    { id: 'tan', name: 'Desert Tan', color: '#d2b48c' },
                                    { id: 'urban', name: 'Urban Grey', color: '#3b3b3b' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                            document.documentElement.setAttribute('data-theme', t.id);
                                            setCurrentTheme(t.id);
                                        }}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${currentTheme === t.id
                                            ? 'bg-accent/20 border-accent/40 shadow-lg scale-[1.02]'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                                            style={{ backgroundColor: t.color }}
                                        />
                                        <span className={`font-bold text-sm ${currentTheme === t.id ? 'text-accent-light' : 'text-foreground/60'}`}>
                                            {t.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pb-24 md:pb-0">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update Identity
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
