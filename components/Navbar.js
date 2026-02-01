'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Shield, User, LogOut, Menu, X, Settings, LayoutGrid, Calendar, Info, MessageSquare } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <div className="glass w-full max-w-6xl h-16 rounded-full flex items-center justify-between px-8 border border-white/10 shadow-2xl">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                    <Shield className="w-8 h-8 text-accent-light" />
                    <span className="font-bold text-xl tracking-tight text-foreground">AIRSOFT<span className="text-accent-light">FORUM</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                        {['army', 'tan', 'urban'].map((t) => (
                            <button
                                key={t}
                                onClick={() => document.documentElement.setAttribute('data-theme', t)}
                                className={`w-8 h-8 rounded-full border border-white/10 transition-all hover:scale-110 active:scale-95 flex items-center justify-center`}
                                style={{
                                    backgroundColor: t === 'army' ? '#4b5320' : t === 'tan' ? '#d2b48c' : '#3b3b3b'
                                }}
                                title={t.charAt(0).toUpperCase() + t.slice(1)}
                            />
                        ))}
                    </div>

                    <Link href="/" className="text-sm font-medium hover:text-accent-light transition-colors">Home</Link>
                    <Link href="/tools" className="text-sm font-medium hover:text-accent-light transition-colors">Tools</Link>
                    <Link href="/tips" className="text-sm font-medium hover:text-accent-light transition-colors">Tips</Link>
                    {session && (
                        <>
                            <Link href="/forum" className="text-sm font-medium hover:text-accent-light transition-colors">Forum</Link>
                            <Link href="/loadouts" className="text-sm font-medium hover:text-accent-light transition-colors">Loadouts</Link>
                            <Link href="/intel" className="text-sm font-medium hover:text-accent-light transition-colors">Intel</Link>
                        </>
                    )}
                    <Link href="/wiki" className="text-sm font-medium hover:text-accent-light transition-colors">Wiki</Link>
                    {session ? (
                        <div className="flex items-center gap-4">
                            <Link href="/settings" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-accent-light transition-colors">
                                <User className="w-4 h-4" />
                                <div className="flex flex-col items-start leading-tight">
                                    <span>{session.user.name || session.user.email}</span>
                                    {session.user.role === 'admin' && (
                                        <span className="text-[9px] font-bold text-accent-light uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded-md border border-accent/20 mt-0.5">
                                            Master Admin
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 text-sm font-semibold py-2 px-6 rounded-full bg-accent text-white hover:bg-accent-light transition-all shadow-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-semibold py-2 px-6 rounded-full bg-transparent border border-white/20 hover:bg-white/10 transition-all">Login</Link>
                            <Link href="/register" className="text-sm font-semibold py-2 px-6 rounded-full bg-accent text-white hover:bg-accent-light transition-all shadow-lg">Sign Up</Link>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-foreground/60 hover:text-accent-light transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop for extra isolation */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute top-24 left-4 right-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-[#0b0c0b]/95 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                                {/* Navigation */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Link onClick={() => setIsOpen(false)} href="/" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-sm">
                                        <LayoutGrid size={18} className="text-accent-light" /> Home
                                    </Link>
                                    <Link onClick={() => setIsOpen(false)} href="/tools" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-sm">
                                        <Settings size={18} className="text-accent-light" /> Tools
                                    </Link>
                                    <Link onClick={() => setIsOpen(false)} href="/wiki" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-sm text-center">
                                        <Info size={18} className="text-accent-light" /> Wiki
                                    </Link>
                                    <Link onClick={() => setIsOpen(false)} href="/tips" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-bold text-sm">
                                        <Shield size={18} className="text-accent-light" /> Tips
                                    </Link>
                                </div>

                                {session && (
                                    <div className="grid grid-cols-3 gap-3">
                                        <Link onClick={() => setIsOpen(false)} href="/forum" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-bold font-bold">
                                            <MessageSquare size={20} className="text-accent-light" /> Forum
                                        </Link>
                                        <Link onClick={() => setIsOpen(false)} href="/loadouts" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-bold">
                                            <Shield size={20} className="text-accent-light" /> Gear
                                        </Link>
                                        <Link onClick={() => setIsOpen(false)} href="/intel" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-bold">
                                            <Calendar size={20} className="text-accent-light" /> Intel
                                        </Link>
                                    </div>
                                )}

                                {/* Theme Toggles */}
                                <div className="bg-black/20 p-4 rounded-3xl flex items-center justify-between mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-2">Theme Selector</span>
                                    <div className="flex items-center gap-2">
                                        {['army', 'tan', 'urban'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => {
                                                    document.documentElement.setAttribute('data-theme', t);
                                                    setIsOpen(false);
                                                }}
                                                className="w-10 h-10 rounded-xl border border-white/10 transition-all active:scale-90"
                                                style={{ backgroundColor: t === 'army' ? '#4b5320' : t === 'tan' ? '#d2b48c' : '#3b3b3b' }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Auth Actions */}
                                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                                    {session ? (
                                        <>
                                            <div className="flex items-center gap-4 px-4 py-2">
                                                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-light">
                                                    <User size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white tracking-tight">{session.user.name}</span>
                                                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{session.user.role || 'Operator'}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                <Link
                                                    onClick={() => setIsOpen(false)}
                                                    href="/settings"
                                                    className="flex items-center justify-center gap-2 py-4 glass border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                                                >
                                                    <User size={14} className="text-accent-light" /> Profile
                                                </Link>
                                                <button
                                                    onClick={() => { signOut(); setIsOpen(false); }}
                                                    className="flex items-center justify-center gap-2 py-4 bg-accent/20 border border-accent/20 text-accent-light rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent/30 transition-all shadow-lg"
                                                >
                                                    <LogOut size={14} /> Logout
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link onClick={() => setIsOpen(false)} href="/login" className="py-4 glass border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-center text-xs">Login</Link>
                                            <Link onClick={() => setIsOpen(false)} href="/register" className="py-4 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-center text-xs shadow-xl">Join Hub</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
