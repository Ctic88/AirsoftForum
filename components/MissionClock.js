'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function MissionClock() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();

            // Military format (HH:mm:ss)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);

            // Tactical date format (DD MON YYYY)
            const day = String(now.getDate()).padStart(2, '0');
            const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const year = now.getFullYear();
            setDate(`${day} ${month} ${year}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-16 flex justify-center pointer-events-none animate-fade-in-delayed">
            <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center group relative min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-accent-light uppercase tracking-[0.2em]">Mission Time</span>
                </div>

                <div className="text-2xl font-mono font-bold text-white tracking-widest bg-clip-text">
                    {time}
                </div>

                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-mono font-bold text-foreground/30 uppercase tracking-widest">{date}</span>
                    <span className="text-[9px] font-mono font-bold text-foreground/30 uppercase tracking-widest italic">Signal: Stable</span>
                </div>

                {/* Tactical HUD Brackets */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-light/30 transition-all group-hover:w-3 group-hover:h-3" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-light/30 transition-all group-hover:w-3 group-hover:h-3" />
            </div>
        </div>
    );
}
