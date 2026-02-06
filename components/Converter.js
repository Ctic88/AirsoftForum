'use client';

import { useState, useEffect } from 'react';
import { Target, Info } from 'lucide-react';

export default function Converter() {
    const [fps, setFps] = useState('');
    const [ms, setMs] = useState('');
    const [weight, setWeight] = useState(0.20);
    const [joules, setJoules] = useState(0);

    useEffect(() => {
        const velocityMs = ms ? Number(ms) : (fps ? Number(fps) * 0.3048 : 0);
        if (velocityMs === 0) {
            setJoules(0);
            return;
        }
        const massKg = Number(weight) / 1000;
        const result = 0.5 * massKg * Math.pow(velocityMs, 2);
        setJoules(result);
    }, [fps, ms, weight]);

    const handleFpsChange = (val) => {
        setFps(val);
        if (!val) {
            setMs('');
        } else {
            setMs((Number(val) * 0.3048).toFixed(1));
        }
    };

    const handleMsChange = (val) => {
        setMs(val);
        if (!val) {
            setFps('');
        } else {
            setFps(Math.round(Number(val) / 0.3048).toString());
        }
    };

    return (
        <div className="glass p-8 rounded-[40px] border border-white/10 w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
            <style jsx global>{`
                .no-spinner::-webkit-inner-spin-button,
                .no-spinner::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .no-spinner {
                    -moz-appearance: textfield;
                }
            `}</style>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32" />
            </div>

            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center text-accent-light">
                    <Target size={20} />
                </div>
                BALLISTICS <span className="text-accent-light">CALCULATOR</span>
            </h3>

            <div className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                            <label>Velocity (FPS)</label>
                            <span className="text-accent-light font-mono font-bold">{fps || 0} FPS</span>
                        </div>
                        <input
                            type="number"
                            value={fps}
                            onChange={(e) => handleFpsChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none transition-all font-mono font-bold no-spinner"
                            placeholder="Type FPS..."
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                            <label>Velocity (m/s)</label>
                            <span className="text-accent-light font-mono font-bold">{ms || '0.0'} m/s</span>
                        </div>
                        <input
                            type="number"
                            step="0.1"
                            value={ms}
                            onChange={(e) => handleMsChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-accent-light outline-none transition-all font-mono font-bold no-spinner"
                            placeholder="Type m/s..."
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                        <label>BB Weight (Grams)</label>
                        <span className="text-accent-light font-mono font-bold">{weight.toFixed(2)}g</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {[0.20, 0.23, 0.25, 0.28, 0.30, 0.32, 0.36, 0.40, 0.43, 0.45, 0.48].map(w => (
                            <button
                                key={w}
                                onClick={() => setWeight(w)}
                                className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${weight === w ? 'bg-accent text-white border-accent' : 'bg-white/5 text-foreground/40 border-white/10'}`}
                            >
                                {w.toFixed(2)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-8 bg-accent/10 rounded-[32px] border border-accent/20 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-light mb-2">Muzzle Energy</div>
                        <div className="text-6xl font-bold text-white tracking-tighter flex items-end gap-2">
                            {joules.toFixed(2)} <span className="text-3xl text-accent-light mb-1">J</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center text-[10px] text-foreground/40 italic">
                    <Info className="w-3 h-3" />
                    Values are calculated for standard environmental conditions.
                </div>
            </div>
        </div>
    );
}
