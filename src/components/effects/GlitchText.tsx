"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function GlitchText({ children, className }: { children: string, className?: string }) {
    const { theme } = useTheme();
    const [displayText, setDisplayText] = useState(children);
    const isVampire = theme === "noche";

    useEffect(() => {
        if (!isVampire) {
            setDisplayText(children);
            return;
        }

        let intervalId: NodeJS.Timeout;

        const glitch = () => {
            // Randomly decide to glitch
            if (Math.random() < 0.1) {
                const chars = children.split("");
                const randomCharIndex = Math.floor(Math.random() * chars.length);
                const randomGlitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                chars[randomCharIndex] = randomGlitchChar;
                setDisplayText(chars.join(""));

                // Reset quickly
                setTimeout(() => {
                    setDisplayText(children);
                }, 50 + Math.random() * 100);
            }
        };

        intervalId = setInterval(glitch, 200);
        return () => clearInterval(intervalId);
    }, [children, isVampire, theme]);

    if (!isVampire) {
        return <span className={className}>{children}</span>
    }

    return (
        <span className={`${className} relative inline-block`} style={{ fontFamily: 'var(--font-nosifer)' }}>
            {/* Main Text */}
            <span className="relative z-10">{displayText}</span>

            {/* Glitch Shadows (Visual Only) */}
            <span className="absolute top-0 left-0 -ml-[2px] text-red-600 opacity-70 animate-pulse z-0 pointer-events-none mix-blend-screen">
                {displayText}
            </span>
            <span className="absolute top-0 left-0 ml-[2px] text-blue-600 opacity-70 animate-pulse z-0 pointer-events-none mix-blend-screen delay-75">
                {displayText}
            </span>
        </span>
    );
}
