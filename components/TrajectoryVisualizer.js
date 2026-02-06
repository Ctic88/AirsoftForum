'use client';

import { useState, useEffect, useRef } from 'react';
import { Target, Info, Wind, Zap } from 'lucide-react';

export default function TrajectoryVisualizer() {
    const [fps, setFps] = useState('');
    const [ms, setMs] = useState('');
    const [weight, setWeight] = useState(0.20);
    const [hopup, setHopup] = useState(50); // 0-100%
    const canvasRef = useRef(null);

    // Physics constants
    const G = 9.81; // Gravity
    const RHO = 1.225; // Air density (kg/m3)
    const RADIUS = 0.003; // 6mm BB = 3mm radius (m)
    const AREA = Math.PI * Math.pow(RADIUS, 2);
    const CD = 0.47; // Drag coefficient for a sphere

    const simulate = () => {
        const results = [];
        let t = 0;
        const dt = 0.01; // 10ms steps

        const velocityMs = ms ? Number(ms) : (fps ? Number(fps) * 0.3048 : 0);
        if (velocityMs === 0) return [];

        // Initial velocity (m/s)
        let vx = velocityMs;
        let vy = 0;
        let x = 0;
        let y = 1.6; // Shooting from 1.6m height

        const mass = weight / 1000; // Grams to kg

        // Magnus force scaling (simplified for UI)
        const liftScale = (hopup / 100) * (G * 1.5);

        while (y > 0 && x < 100 && t < 5) {
            const v = Math.sqrt(vx * vx + vy * vy);

            // Drag Force
            const fd = 0.5 * RHO * v * v * CD * AREA;
            const ax_drag = -(fd * (vx / v)) / mass;
            const ay_drag = -(fd * (vy / v)) / mass;

            // Magnus Force (Lift)
            const ay_lift = liftScale * (vx / velocityMs);

            // Total Acceleration
            const ax = ax_drag;
            const ay = -G + ay_lift + ay_drag;

            // Update Velocity
            vx += ax * dt;
            vy += ay * dt;

            // Update Position
            x += vx * dt;
            y += vy * dt;

            results.push({ x, y, v });
            t += dt;
        }
        return results;
    };

    const handleFpsChange = (val) => {
        setFps(val);
        if (!val) setMs('');
        else setMs((Number(val) * 0.3048).toFixed(1));
    };

    const handleMsChange = (val) => {
        setMs(val);
        if (!val) setFps('');
        else setFps(Math.round(Number(val) / 0.3048).toString());
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = simulate();

        // Clear and setup
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid colors
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;

        // Draw Grid
        const scaleX = canvas.width / 100; // 100 meters
        const scaleY = canvas.height / 5;   // 5 meters height

        for (let i = 0; i <= 100; i += 10) {
            ctx.beginPath();
            ctx.moveTo(i * scaleX, 0);
            ctx.lineTo(i * scaleX, canvas.height);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`${i}m`, i * scaleX + 5, canvas.height - 10);
        }

        // Draw Ground
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();

        // Draw Trajectory & Gradient
        if (data.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#4b5320'; // Army Green
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';

            data.forEach((p, i) => {
                const px = p.x * scaleX;
                const py = canvas.height - (p.y * scaleY);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });

            ctx.stroke();

            // Draw Gradient under curve
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, 'rgba(75, 83, 32, 0.2)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.lineTo(data[data.length - 1].x * scaleX, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = grad;
            ctx.fill();

            // Draw "Impact" point
            const last = data[data.length - 1];
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(last.x * scaleX, canvas.height - (last.y * scaleY), 4, 0, Math.PI * 2);
            ctx.fill();
        }

    }, [fps, weight, hopup]);

    return (
        <div className="glass p-8 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Controls */}
                <div className="w-full md:w-1/3 space-y-8">
                    <header>
                        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-accent/20">
                            <Target size={12} /> Ballistic Sim
                        </div>
                        <h3 className="text-2xl font-bold text-white">TRAJECTORY <span className="text-accent-light">VISUALIZER</span></h3>
                        <p className="text-foreground/40 text-xs mt-2 uppercase tracking-widest font-bold font-mono">Theoretical BB Flight Path</p>
                    </header>

                    <div className="space-y-6">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">Velocity (FPS)</label>
                                    <span className="text-accent-light font-bold font-mono text-[10px]">{fps || 0}</span>
                                </div>
                                <input
                                    type="number"
                                    value={fps}
                                    onChange={(e) => handleFpsChange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-accent-light outline-none transition-all font-mono font-bold no-spinner text-sm"
                                    placeholder="FPS"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">Velocity (m/s)</label>
                                    <span className="text-accent-light font-bold font-mono text-[10px]">{ms || '0.0'}</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={ms}
                                    onChange={(e) => handleMsChange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-accent-light outline-none transition-all font-mono font-bold no-spinner text-sm"
                                    placeholder="m/s"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white uppercase tracking-widest">BB Weight (Grade)</label>
                                <span className="text-accent-light font-bold font-mono">{weight.toFixed(2)}g</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[0.20, 0.25, 0.28, 0.30, 0.32, 0.36, 0.40, 0.45].map(w => (
                                    <button
                                        key={w}
                                        onClick={() => setWeight(w)}
                                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${weight === w ? 'bg-accent text-white border-accent' : 'bg-white/5 text-foreground/40 border-white/10'}`}
                                    >
                                        {w.toFixed(2)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white uppercase tracking-widest">Hop-Up Level (Spin)</label>
                                <span className="text-accent-light font-bold font-mono">{hopup}%</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="1"
                                value={hopup} onChange={(e) => setHopup(parseInt(e.target.value))}
                                className="w-full accent-accent-light"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 space-y-3">
                        <div className="flex items-center gap-2 text-accent-light text-[10px] font-bold uppercase tracking-widest">
                            <Info size={12} /> Live Telemetry
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-foreground/40 uppercase font-bold">Max Range</p>
                                <p className="text-lg font-bold text-white">~{simulate().pop()?.x.toFixed(1) || '0.0'}m</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-foreground/40 uppercase font-bold">Muzzle Energy</p>
                                <p className="text-lg font-bold text-white">
                                    {(0.5 * (weight / 1000) * Math.pow(ms ? Number(ms) : (fps ? Number(fps) * 0.3048 : 0), 2)).toFixed(2)} J
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="relative flex-1 min-h-[300px] bg-black/40 rounded-[32px] border border-white/5 overflow-hidden group">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={400}
                            className="w-full h-full"
                        />
                        <div className="absolute top-6 left-6 flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                <Wind size={10} className="text-accent-light" /> Static Air
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                <Zap size={10} className="text-yellow-500" /> Active Magnus
                            </div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Target size={200} />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between px-2 text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
                        <span>Deploy Point (1.6m Elev)</span>
                        <span>Sector Range (100m)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
