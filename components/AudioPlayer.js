'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, SkipBack, Music } from 'lucide-react';
import { tacticalPlaylist } from '@/lib/playlist';

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.1);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play blocked by browser"));
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        const next = (currentTrack + 1) % tacticalPlaylist.length;
        setCurrentTrack(next);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        const prev = (currentTrack - 1 + tacticalPlaylist.length) % tacticalPlaylist.length;
        setCurrentTrack(prev);
        setIsPlaying(true);
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Navigation play blocked"));
        }
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, []);

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-100 group flex flex-col items-end gap-3 pointer-events-none">
            <audio
                ref={audioRef}
                loop
                src={tacticalPlaylist[currentTrack].url}
            />

            <div className={`glass px-6 py-4 rounded-apple-lg border border-white/10 flex flex-col gap-4 transition-all duration-500 overflow-hidden shadow-2xl pointer-events-auto ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col min-w-[120px]">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent-light mb-1">Active Frequency</span>
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{tacticalPlaylist[currentTrack].title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={prevTrack} className="text-white/40 hover:text-accent-light transition-colors"><SkipBack size={16} /></button>
                        <button onClick={nextTrack} className="text-white/40 hover:text-accent-light transition-colors"><SkipForward size={16} /></button>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    {volume === 0 ? <VolumeX size={14} className="text-white/20" /> : <Volume2 size={14} className="text-accent-light" />}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-light"
                    />
                </div>
            </div>

            <button
                onClick={toggleAudio}
                className="glass p-5 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all bg-accent/10 hover:border-accent-light/30 pointer-events-auto"
            >
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-light animate-pulse' : 'bg-red-500/50'}`}></div>
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors">
                    {isPlaying ? 'Operational Audio' : 'Silence Confirmed'}
                </span>
                {isPlaying ? <Music className="w-5 h-5 text-white/60" /> : <Volume2 className="w-5 h-5 text-white/20" />}
            </button>
        </div>
    );
}
