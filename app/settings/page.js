'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User, Shield, Target, Users, Save, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        callsign: '',
        team: '',
        role: 'Assault'
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
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
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });

        if (res.ok) {
            // HUD notification logic would go here
            alert('Profile Updated Successfully');
        } else {
            alert('Failed to update profile');
        }
        setSaving(false);
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-accent-light" /></div>;

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-3xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-tight">Operator <span className="text-accent-light">Profile</span></h1>
                    <p className="text-foreground/40">Customize your tactical identity in the field.</p>
                </header>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="glass p-10 rounded-[40px] border border-white/10 space-y-8">
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                    <Target size={12} /> Battlefield Role
                                </label>
                                <select
                                    value={profile.role}
                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none"
                                >
                                    {['Assault', 'Sniper', 'Medic', 'Support', 'Recon', 'Heavy'].map(r => (
                                        <option key={r} value={r} className="bg-background">{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
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
