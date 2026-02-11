'use client';

import { useEffect, useRef } from 'react';

export default function TacticalCursor() {
    const cursorRef = useRef(null);
    const lastInteractive = useRef(null);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        // Force hide standard cursor
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';

        const onMouseMove = (e) => {
            // Direct immediate movement - bypassing rAF for lower latency in high-CPU scenarios
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

            if (!cursor.classList.contains('visible')) {
                cursor.classList.add('visible');
            }

            // Throttled interactivity detection
            const target = e.target;
            if (target) {
                const isInteractive =
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.classList.contains('cursor-pointer') ||
                    target.closest('button') ||
                    target.closest('a') ||
                    target.closest('.cursor-pointer') ||
                    target.getAttribute('role') === 'button';

                // Update attribute ONLY if state changed to prevent style recalc thrashing
                if (isInteractive !== lastInteractive.current) {
                    cursor.setAttribute('data-interactive', isInteractive ? 'true' : 'false');
                    lastInteractive.current = isInteractive;
                }
            }
        };

        const onMouseLeave = () => cursor.classList.remove('visible');
        const onMouseEnter = () => cursor.classList.add('visible');

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    return (
        <div id="tactical-cursor" ref={cursorRef}>
            <div className="cursor-container">
                <div className="cursor-dot" />
                <div className="cursor-crosshair">
                    <div className="cursor-line-h" />
                    <div className="cursor-line-v" />
                    <div className="cursor-corner corner-tl" />
                    <div className="cursor-corner corner-tr" />
                    <div className="cursor-corner corner-bl" />
                    <div className="cursor-corner corner-br" />
                </div>
                <div className="cursor-pulse" />
            </div>
        </div>
    );
}
