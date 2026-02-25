"use client";

import { motion } from "framer-motion";

export default function NeonSign() {
    const titleText = "MACONDO";

    // Caribbean blue → jungle green gradient per letter
    const letterColors = [
        { text: "#1A8FB4", glow: "0 0 10px #1A8FB4, 0 0 25px #1A527690, 0 0 50px #1A527650" },
        { text: "#1E9E6E", glow: "0 0 10px #1E9E6E, 0 0 25px #1E844990, 0 0 50px #1E844950" },
        { text: "#2ECC71", glow: "0 0 10px #2ECC71, 0 0 25px #1E844990, 0 0 50px #1E844950" },
        { text: "#27AE60", glow: "0 0 10px #27AE60, 0 0 25px #1E844990, 0 0 50px #1E844950" },
        { text: "#2ECC71", glow: "0 0 10px #2ECC71, 0 0 25px #1E844990, 0 0 50px #1E844950" },
        { text: "#1E9E6E", glow: "0 0 10px #1E9E6E, 0 0 25px #1A527690, 0 0 50px #1A527650" },
        { text: "#1A8FB4", glow: "0 0 10px #1A8FB4, 0 0 25px #1A527690, 0 0 50px #1A527650" },
    ];

    return (
        <div className="relative text-center">
            {/* Ghost Layer — subtle blue shimmer behind */}
            <motion.div
                className="absolute inset-0 z-0 select-none pointer-events-none opacity-30 blur-[2px]"
                animate={{
                    x: [0, -1, 1, 0],
                    y: [0, 1, -1, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            >
                <div
                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.15em] mb-6"
                    style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#2E86C1", textShadow: "0 0 15px #2E86C1" }}
                >
                    {titleText.split("").map((char, i) => (
                        <span key={`ghost-${i}`} className="inline-block">{char}</span>
                    ))}
                </div>
            </motion.div>

            {/* Main Layer — blue to green gradient letters */}
            <div
                className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.15em] mb-6"
                style={{ fontFamily: "var(--font-macondo-gf), cursive" }}
            >
                {titleText.split("").map((char, i) => (
                    <span
                        key={i}
                        className="inline-block"
                        style={{
                            color: letterColors[i].text,
                            textShadow: letterColors[i].glow,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>

            {/* Subtitle — Tequila Bar */}
            <div
                className="relative z-10 text-sm md:text-base font-light tracking-[0.5em] uppercase opacity-70"
                style={{ fontFamily: "var(--font-cinzel), serif", color: "#F48FB1" }}
            >
                Tequila Bar
            </div>
        </div>
    );
}
