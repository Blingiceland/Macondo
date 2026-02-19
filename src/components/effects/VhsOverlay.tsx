"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function VhsOverlay() {
    const { theme } = useTheme();
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        if (theme !== "noche") return;

        // Random glitch loop
        const glitchLoop = () => {
            const timeToNextGlitch = Math.random() * 5000 + 2000; // 2-7 seconds wait
            setTimeout(() => {
                setIsGlitching(true);
                setTimeout(() => {
                    setIsGlitching(false);
                    glitchLoop();
                }, Math.random() * 300 + 100); // 100-400ms glitch duration
            }, timeToNextGlitch);
        };

        const timeoutId = setTimeout(glitchLoop, 1000);
        return () => clearTimeout(timeoutId);
    }, [theme]);

    if (theme !== "noche") return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-screen opacity-50">
            {/* Base Scanlines (Always visible but subtle) */}
            <div
                className="absolute inset-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]"
                style={{ backgroundSize: '100% 4px, 3px 100%' }}
            />

            {/* Heavy Glitch Layers (Only when glitching) */}
            <div
                className={`absolute inset-0 w-full h-full transition-opacity duration-100 ${isGlitching ? 'opacity-40 animate-noise' : 'opacity-0'}`}
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", filter: 'contrast(150%) brightness(150%)' }}
            />

            {isGlitching && (
                <div className="absolute top-0 left-0 w-full h-2 bg-white/20 animate-tracking" />
            )}

            {/* Vignette (Always on) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,black_100%)] opacity-80" />
        </div>
    );
}
