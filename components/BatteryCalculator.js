'use client';

import { useState, useEffect } from 'react';
import { Battery, Zap, Info } from 'lucide-react';

export default function BatteryCalculator() {
    const [capacity, setCapacity] = useState(1200);
    const [voltage, setVoltage] = useState(11.1);
    const [type, setType] = useState('LiPo');
    const [shots, setShots] = useState(0);

    useEffect(() => {
        // Rough estimate: 1 shot per 1mAh for standard setups
        // High voltage (11.1) is slightly more efficient in motor startup but consumes more per cycle in some setups
        // For simplicity, we use 0.8 - 1.2 shots per mAh
        let multiplier = 1.0;
        if (voltage === 7.4) multiplier = 0.9;
        if (voltage === 11.1) multiplier = 1.1;

        setShots(Math.floor(capacity * multiplier));
    }, [capacity, voltage]);

    return (
        <div className="glass p-8 rounded-apple-lg border border-white/10 w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Battery className="w-32 h-32" />
            </div>

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-accent-light" />
                Battery Performance
            </h3>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-foreground/40">
                        <label>Capacity (mAh)</label>
                        <span>{capacity} mAh</span>
                    </div>
                    <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Voltage (V)</label>
                        <select
                            value={voltage}
                            onChange={(e) => setVoltage(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent-light outline-none"
                        >
                            <option value={7.4} className="bg-background text-foreground">7.4V (2S)</option>
                            <option value={11.1} className="bg-background text-foreground">11.1V (3S)</option>
                            <option value={9.6} className="bg-background text-foreground">9.6V (NiMH)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Chemistry</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent-light outline-none"
                        >
                            <option value="LiPo" className="bg-background text-foreground">Li-Po</option>
                            <option value="LiIon" className="bg-background text-foreground">Li-Ion</option>
                            <option value="NiMH" className="bg-background text-foreground">Ni-MH</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 p-6 bg-accent/20 rounded-2xl border border-accent/20 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-light mb-1">Estimated Shots</div>
                    <div className="text-5xl font-bold text-white tracking-tighter">
                        ~{shots.toLocaleString()} <span className="text-2xl text-accent-light">BBs</span>
                    </div>
                </div>

                <div className="flex gap-2 items-start text-[10px] text-foreground/40 italic">
                    <Info className="w-3 h-3 mt-0.5" />
                    <p>Based on average AEG efficiency. High-torque motors and heavy springs will reduce these values.</p>
                </div>
            </div>
        </div>
    );
}
