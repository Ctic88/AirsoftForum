'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Shield, User, LogOut, Menu } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <div className="glass w-full max-w-5xl h-16 rounded-full flex items-center justify-between px-8 border border-white/10 shadow-2xl">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Shield className="w-8 h-8 text-accent-light" />
                    <span className="font-bold text-xl tracking-tight text-foreground">AIRSOFT<span className="text-accent-light">FORUM</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
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
                                <span>{session.user.name || session.user.email}</span>
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

                <button className="md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
