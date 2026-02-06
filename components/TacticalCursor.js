'use client';

import { useEffect, useState } from 'react';

export default function TacticalCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
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
                transform: `translate(-50%, -50%) ${isPointer ? 'scale(1.5)' : 'scale(1)'}`
            }}
        >
            {/* Central Dot */}
            <div className="w-1 h-1 bg-accent-light rounded-full shadow-[0_0_10px_#8b9a5a]" />

            {/* Crosshair Lines */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isPointer ? 'w-8 h-8 opacity-100' : 'w-6 h-6 opacity-40'}`}>
                {/* Horizontal */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent-light/50" />
                {/* Vertical */}
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-accent-light/50" />

                {/* Outer Corners (Tactical Brackets) */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-light" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-light" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-light" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-light" />
            </div>

            {/* Pulsing Ring when over interactive elements */}
            {isPointer && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-accent-light/30 rounded-full animate-ping" />
            )}
        </div>
    );
}
