'use client';

import { useState, useEffect } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}|;:,.<>?/\\';

export default function DecryptText({ text, active = true, speed = 30, className = "" }) {
    const [displayedText, setDisplayedText] = useState(text);
    const [isDecrypting, setIsDecrypting] = useState(false);

    useEffect(() => {
        if (!active || !text) {
            setDisplayedText(text);
            return;
        }

        let iteration = 0;
        let interval = null;

        setIsDecrypting(true);

        interval = setInterval(() => {
            setDisplayedText(
                text.split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        if (char === " ") return " ";
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                setIsDecrypting(false);
            }

            iteration += 1 / 3;
        }, speed);

        return () => clearInterval(interval);
    }, [text, active, speed]);

    return (
        <span className={`${className} ${isDecrypting ? 'font-mono' : ''}`}>
            {displayedText}
        </span>
    );
}
