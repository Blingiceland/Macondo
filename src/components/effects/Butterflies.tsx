"use client";

import { useEffect, useState } from "react";

interface Butterfly {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
    rotation: number;
    flapSpeed: number;
}

export default function Butterflies() {
    const [butterflies, setButterflies] = useState<Butterfly[]>([]);

    useEffect(() => {
        const count = 6;
        const newButterflies: Butterfly[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 85 + 5,
            y: Math.random() * 75 + 10,
            size: 28 + Math.random() * 18,
            delay: Math.random() * 8,
            duration: 10 + Math.random() * 12,
            opacity: 0.25 + Math.random() * 0.35,
            rotation: Math.random() * 40 - 20,
            flapSpeed: 0.4 + Math.random() * 0.3,
        }));
        setButterflies(newButterflies);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {butterflies.map((b) => (
                <div
                    key={b.id}
                    className="absolute"
                    style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        opacity: b.opacity,
                        animation: `butterfly-float ${b.duration}s ease-in-out ${b.delay}s infinite`,
                    }}
                >
                    <div
                        style={{
                            transform: `rotate(${b.rotation}deg)`,
                            filter: "drop-shadow(0 0 6px rgba(245, 168, 0, 0.5))",
                        }}
                    >
                        <svg
                            width={b.size}
                            height={b.size * 0.8}
                            viewBox="0 0 120 96"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Left wing group — flaps */}
                            <g style={{ transformOrigin: "60px 48px", animation: `wing-flap-left ${b.flapSpeed}s ease-in-out infinite` }}>
                                {/* Upper left wing */}
                                <path
                                    d="M60 48 C50 30, 25 10, 8 18 C-5 24, 2 42, 15 48 C22 52, 40 50, 60 48Z"
                                    fill="url(#wingGoldLeft)"
                                    stroke="#E8C87A"
                                    strokeWidth="0.5"
                                    opacity="0.9"
                                />
                                {/* Lower left wing */}
                                <path
                                    d="M60 48 C48 52, 28 60, 16 72 C8 82, 18 88, 30 82 C38 76, 50 62, 60 48Z"
                                    fill="url(#wingAmberLeft)"
                                    stroke="#E8C87A"
                                    strokeWidth="0.5"
                                    opacity="0.85"
                                />
                                {/* Wing vein details — left */}
                                <path d="M60 48 C48 38, 30 22, 14 26" stroke="#E8C87A" strokeWidth="0.4" opacity="0.3" fill="none" />
                                <path d="M60 48 C52 42, 35 30, 20 35" stroke="#E8C87A" strokeWidth="0.3" opacity="0.2" fill="none" />
                                {/* Wing spots — left */}
                                <circle cx="30" cy="32" r="3" fill="#FFF8DC" opacity="0.3" />
                                <circle cx="22" cy="42" r="2" fill="#FFF8DC" opacity="0.25" />
                                <circle cx="28" cy="68" r="2.5" fill="#FFF8DC" opacity="0.2" />
                            </g>

                            {/* Right wing group — flaps */}
                            <g style={{ transformOrigin: "60px 48px", animation: `wing-flap-right ${b.flapSpeed}s ease-in-out infinite` }}>
                                {/* Upper right wing */}
                                <path
                                    d="M60 48 C70 30, 95 10, 112 18 C125 24, 118 42, 105 48 C98 52, 80 50, 60 48Z"
                                    fill="url(#wingGoldRight)"
                                    stroke="#E8C87A"
                                    strokeWidth="0.5"
                                    opacity="0.9"
                                />
                                {/* Lower right wing */}
                                <path
                                    d="M60 48 C72 52, 92 60, 104 72 C112 82, 102 88, 90 82 C82 76, 70 62, 60 48Z"
                                    fill="url(#wingAmberRight)"
                                    stroke="#E8C87A"
                                    strokeWidth="0.5"
                                    opacity="0.85"
                                />
                                {/* Wing vein details — right */}
                                <path d="M60 48 C72 38, 90 22, 106 26" stroke="#E8C87A" strokeWidth="0.4" opacity="0.3" fill="none" />
                                <path d="M60 48 C68 42, 85 30, 100 35" stroke="#E8C87A" strokeWidth="0.3" opacity="0.2" fill="none" />
                                {/* Wing spots — right */}
                                <circle cx="90" cy="32" r="3" fill="#FFF8DC" opacity="0.3" />
                                <circle cx="98" cy="42" r="2" fill="#FFF8DC" opacity="0.25" />
                                <circle cx="92" cy="68" r="2.5" fill="#FFF8DC" opacity="0.2" />
                            </g>

                            {/* Body */}
                            <ellipse cx="60" cy="48" rx="2.5" ry="14" fill="#8B6914" />
                            <ellipse cx="60" cy="48" rx="1.5" ry="12" fill="#A07D1A" opacity="0.6" />

                            {/* Head */}
                            <circle cx="60" cy="33" r="3" fill="#8B6914" />

                            {/* Antennae — elegant curves */}
                            <path d="M58 33 C54 22, 46 16, 42 12" stroke="#8B6914" strokeWidth="1" strokeLinecap="round" fill="none" />
                            <path d="M62 33 C66 22, 74 16, 78 12" stroke="#8B6914" strokeWidth="1" strokeLinecap="round" fill="none" />
                            <circle cx="42" cy="12" r="1.5" fill="#F5A800" />
                            <circle cx="78" cy="12" r="1.5" fill="#F5A800" />

                            {/* Gradient definitions */}
                            <defs>
                                <radialGradient id="wingGoldLeft" cx="30%" cy="40%">
                                    <stop offset="0%" stopColor="#FFD166" />
                                    <stop offset="50%" stopColor="#F5A800" />
                                    <stop offset="100%" stopColor="#E8C87A" />
                                </radialGradient>
                                <radialGradient id="wingGoldRight" cx="70%" cy="40%">
                                    <stop offset="0%" stopColor="#FFD166" />
                                    <stop offset="50%" stopColor="#F5A800" />
                                    <stop offset="100%" stopColor="#E8C87A" />
                                </radialGradient>
                                <radialGradient id="wingAmberLeft" cx="35%" cy="60%">
                                    <stop offset="0%" stopColor="#F5A800" />
                                    <stop offset="100%" stopColor="#E8A000" />
                                </radialGradient>
                                <radialGradient id="wingAmberRight" cx="65%" cy="60%">
                                    <stop offset="0%" stopColor="#F5A800" />
                                    <stop offset="100%" stopColor="#E8A000" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    );
}
