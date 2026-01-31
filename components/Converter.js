'use client';

import { useState, useEffect } from 'react';
import { Target, Info } from 'lucide-react';

export default function Converter() {
    const [fps, setFps] = useState(400);
    const [weight, setWeight] = useState(0.20);
    const [joules, setJoules] = useState(0);

    useEffect(() => {
        // formula: J = 0.5 * m * v^2
        // v (m/s) = fps * 0.3048
        // m (kg) = weight / 1000
        const velocityMs = fps * 0.3048;
        const massKg = weight / 1000;
        const result = 0.5 * massKg * Math.pow(velocityMs, 2);
        setJoules(result);
    }, [fps, weight]);

    return (
        <div className="glass p-8 rounded-[32px] border border-white/10 w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32" />
            </div>

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-accent-light" />
                Ballistics Calculator
            </h3>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-foreground/40">
                        <label>Muzzle Velocity (FPS)</label>
                        <span>{fps} FPS</span>
                    </div>
                    <input
                        type="range"
                        min="200"
                        max="600"
                        value={fps}
                        onChange={(e) => setFps(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-foreground/40">
                        <label>BB Weight (Grams)</label>
                        <span>{weight}g</span>
                    </div>
                    <select
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent-light outline-none"
                    >
                        {[0.20, 0.23, 0.25, 0.28, 0.30, 0.32, 0.36, 0.40, 0.43, 0.45, 0.48].map(w => (
                            <option key={w} value={w} className="bg-background text-foreground">{w}g</option>
                        ))}
                    </select>
                </div>

                <div className="mt-4 p-6 bg-accent/20 rounded-2xl border border-accent/20 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light mb-1">Impact Energy</div>
                    <div className="text-5xl font-bold text-white tracking-tighter">
                        {joules.toFixed(2)} <span className="text-2xl text-accent-light">J</span>
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
