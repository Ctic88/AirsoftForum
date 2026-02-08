'use client';

import { useEffect, useState } from 'react';

export default function TacticalCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Disable tactical cursor on touch devices to prevent interaction issues
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            setIsVisible(false);
            return;
        }

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);

            const target = e.target;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('button') ||
                target.closest('a')
            );
        };

        const onMouseLeave = () => setIsVisible(false);
        const onMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) ${isPointer ? 'scale(1.2)' : 'scale(1)'}`
            }}
        >
            {/* Central Dot */}
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_12px_#ef4444,0_0_20px_#ef4444]' : 'bg-accent-light shadow-[0_0_12px_#8b9a5a,0_0_20px_#8b9a5a]'}`} />

            {/* Crosshair Lines */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isPointer ? 'w-9 h-9 opacity-100' : 'w-8 h-8 opacity-70'}`}>
                {/* Horizontal */}
                <div className={`absolute top-1/2 left-0 w-full h-[1.5px] transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent-light shadow-[0_0_8px_#8b9a5a]'}`} />
                {/* Vertical */}
                <div className={`absolute left-1/2 top-0 w-[1.5px] h-full transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent-light shadow-[0_0_8px_#8b9a5a]'}`} />

                {/* Outer Corners (Tactical Brackets) */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[-2px_-2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[-2px_-2px_8px_rgba(139,154,90,0.5)]'}`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[2px_-2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[2px_-2px_8px_rgba(139,154,90,0.5)]'}`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[-2px_2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[-2px_2px_8px_rgba(139,154,90,0.5)]'}`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[2px_2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[2px_2px_8px_rgba(139,154,90,0.5)]'}`} />
            </div>

            {/* Pulsing Ring when over interactive elements */}
            {isPointer && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-red-500/30 rounded-full animate-ping" />
            )}
        </div>
    );
}
