'use client';

import { useEffect, useState, useRef } from 'react';

export default function TacticalCursor() {
    const cursorRef = useRef(null);
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouch(isTouchDevice);
        if (isTouchDevice) return;

        const onMouseMove = (e) => {
            if (cursorRef.current) {
                // Direct DOM manipulation to avoid React re-renders on every move
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                if (!isVisible) setIsVisible(true);
            }

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

    if (isTouch || !isVisible) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
            style={{
                transform: 'translate3d(0, 0, 0)',
            }}
        >
            <div className={`relative w-0 h-0 flex items-center justify-center transition-transform duration-200 ease-out ${isPointer ? 'scale-125' : 'scale-100'}`}>
                {/* Central Dot */}
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_12px_#ef4444,0_0_20px_#ef4444]' : 'bg-accent-light shadow-[0_0_12px_#8b9a5a,0_0_20px_#8b9a5a]'}`} />

                {/* Crosshair Lines */}
                <div className={`absolute transition-all duration-300 ${isPointer ? 'w-9 h-9 opacity-100' : 'w-8 h-8 opacity-70'}`}>
                    {/* Horizontal */}
                    <div className={`absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent-light shadow-[0_0_8px_#8b9a5a]'}`} />
                    {/* Vertical */}
                    <div className={`absolute left-1/2 top-0 w-[1.5px] h-full -translate-x-1/2 transition-colors duration-300 ${isPointer ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-accent-light shadow-[0_0_8px_#8b9a5a]'}`} />

                    {/* Outer Corners (Tactical Brackets) */}
                    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[-2px_-2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[-2px_-2px_8px_rgba(139,154,90,0.5)]'}`} />
                    <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[2px_-2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[2px_-2px_8px_rgba(139,154,90,0.5)]'}`} />
                    <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[-2px_2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[-2px_2px_8px_rgba(139,154,90,0.5)]'}`} />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${isPointer ? 'border-red-500 shadow-[2px_2px_8px_rgba(239,68,68,0.5)]' : 'border-accent-light shadow-[2px_2px_8px_rgba(139,154,90,0.5)]'}`} />
                </div>

                {/* Pulsing Ring when over interactive elements */}
                {isPointer && (
                    <div className="absolute w-10 h-10 border border-red-500/30 rounded-full animate-ping" />
                )}
            </div>
        </div>
    );
}
