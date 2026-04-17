"use client";

import { useState, useEffect } from "react";

interface NeonBorderSegmentProps {
    side: "top" | "right" | "bottom" | "left";
    color: string;
}

const NeonBorderSegment = ({ side, color }: NeonBorderSegmentProps) => {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.85) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 80 + Math.random() * 120);
            }
        }, 2000 + Math.random() * 3000);

        return () => clearInterval(glitchInterval);
    }, []);

    const baseClass = "absolute transition-opacity duration-75";

    const glowStyles: Record<string, string> = {
        yellow: "shadow-[0_0_10px_rgba(245,168,0,0.8),0_0_20px_rgba(245,168,0,0.4)]",
        pink: "shadow-[0_0_10px_rgba(200,137,26,0.8),0_0_20px_rgba(200,137,26,0.4)]",
        blue: "shadow-[0_0_10px_rgba(61,24,16,0.8),0_0_20px_rgba(61,24,16,0.4)]",
        green: "shadow-[0_0_10px_rgba(193,58,26,0.8),0_0_20px_rgba(193,58,26,0.4)]",
    };

    const borderStyles: Record<string, string> = {
        yellow: "bg-[#F5A800]",
        pink: "bg-[#C8891A]",
        blue: "bg-[#3D1810]",
        green: "bg-[#C13A1A]",
    };

    const positions = {
        top: "top-0 left-0 right-0 h-[3px]",
        right: "top-0 right-0 bottom-0 w-[3px]",
        bottom: "bottom-0 left-0 right-0 h-[3px]",
        left: "top-0 left-0 bottom-0 w-[3px]",
    };

    return (
        <div
            className={`${baseClass} ${positions[side]} ${borderStyles[color] || borderStyles.yellow} ${glowStyles[color] || glowStyles.yellow} ${isGlitching ? "opacity-0" : "opacity-100"
                }`}
        />
    );
};

interface NeonMenuHeaderProps {
    text: string;
    color: "yellow" | "pink" | "blue" | "green";
}

export default function NeonMenuHeader({ text, color }: NeonMenuHeaderProps) {
    const textColors: Record<string, string> = {
        yellow: "text-[#F5A800]",
        pink: "text-[#C8891A]",
        blue: "text-[#3D1810]",
        green: "text-[#C13A1A]",
    };

    const glowEffects: Record<string, string> = {
        yellow: "drop-shadow-[0_0_15px_rgba(245,168,0,0.9)] drop-shadow-[0_0_30px_rgba(245,168,0,0.5)]",
        pink: "drop-shadow-[0_0_15px_rgba(200,137,26,0.9)] drop-shadow-[0_0_30px_rgba(200,137,26,0.5)]",
        blue: "drop-shadow-[0_0_15px_rgba(61,24,16,0.9)] drop-shadow-[0_0_30px_rgba(61,24,16,0.5)]",
        green: "drop-shadow-[0_0_15px_rgba(193,58,26,0.9)] drop-shadow-[0_0_30px_rgba(193,58,26,0.5)]",
    };

    return (
        <div className="relative inline-block px-8 py-6 bg-[#7A3020]/50">
            {/* Neon Border Segments */}
            <NeonBorderSegment side="top" color={color} />
            <NeonBorderSegment side="right" color={color} />
            <NeonBorderSegment side="bottom" color={color} />
            <NeonBorderSegment side="left" color={color} />

            {/* Text */}
            <h2
                className={`text-3xl md:text-4xl font-bold ${textColors[color]} ${glowEffects[color]} tracking-widest uppercase`}
                style={{ fontFamily: 'var(--font-macondo-gf), cursive' }}
            >
                {text}
            </h2>
        </div>
    );
}
