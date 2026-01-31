'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, SkipBack, Music } from 'lucide-react';
import { tacticalPlaylist } from '@/lib/playlist';

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
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

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Navigation play blocked"));
        }
    }, [currentTrack]);

    return (
        <div className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3">
            <audio
                ref={audioRef}
                loop
                src={tacticalPlaylist[currentTrack].url}
            />

            <div className={`glass px-4 py-3 rounded-full border border-white/10 flex items-center gap-4 transition-all duration-500 overflow-hidden ${isPlaying ? 'max-w-xs opacity-100 translate-x-0' : 'max-w-0 opacity-0 translate-x-12 pointer-events-none'}`}>
                <div className="flex flex-col min-w-[100px]">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-accent-light">Now Listening</span>
                    <span className="text-xs font-bold text-white truncate">{tacticalPlaylist[currentTrack].title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevTrack} className="hover:text-accent-light transition-colors"><SkipBack size={14} /></button>
                    <button onClick={nextTrack} className="hover:text-accent-light transition-colors"><SkipForward size={14} /></button>
                </div>
            </div>

            <button
                onClick={toggleAudio}
                className="glass p-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all bg-accent/10"
            >
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-light animate-pulse' : 'bg-red-500'}`}></div>
                <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors">
                    {isPlaying ? 'Tactical Audio Active' : 'Comms Silent'}
                </span>
                {isPlaying ? <Music className="w-5 h-5 text-white/60" /> : <VolumeX className="w-5 h-5 text-white/20" />}
            </button>
        </div>
    );
}
