'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const validatePassword = (pass) => {
        const hasUpper = /[A-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[@$!%*?&]/.test(pass);
        const isLongEnough = pass.length >= 8;
        return { hasUpper, hasNumber, hasSpecial, isLongEnough };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validatePassword(password);
        if (!validation.isLongEnough || !validation.hasUpper || !validation.hasNumber || !validation.hasSpecial) {
            setError('Password does not meet tactical requirements.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Verification failed.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Link href="/" className="mb-10 flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Shield className="w-10 h-10 text-army-green-light" />
                <span className="font-bold text-2xl tracking-tighter">AIRSOFT<span className="text-army-green-light">FORUM</span></span>
            </Link>

            <div className="w-full max-w-md glass p-10 rounded-apple-lg border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center">New Recruit</h2>
                <p className="text-foreground/60 text-center mb-8">Join the elite airsoft community today.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-army-green-light underline-none transition-all"
                                placeholder="Ghost"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-army-green-light underline-none transition-all"
                                placeholder="recruit@military.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-army-green-light underline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Password Requirements Checklist */}
                        <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Tactical Requirements:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <ReqItem label="8+ Chars" met={password.length >= 8} />
                                <ReqItem label="Uppercase" met={/[A-Z]/.test(password)} />
                                <ReqItem label="Number" met={/[0-9]/.test(password)} />
                                <ReqItem label="Special (@#$)" met={/[@$!%*?&]/.test(password)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Confirm Identity</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-army-green-light underline-none transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}
                                placeholder="Repeat Secure Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-army-green text-white rounded-2xl font-bold text-lg hover:bg-army-green-light transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-foreground/60 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-army-green-light font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}

function ReqItem({ label, met }) {
    return (
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${met ? 'text-army-green-light' : 'text-foreground/20'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-army-green-light shadow-[0_0_8px_rgba(139,154,90,0.6)]' : 'bg-white/10'}`} />
            {label}
        </div>
    );
}
