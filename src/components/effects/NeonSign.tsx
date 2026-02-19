"use client";

import { motion } from "framer-motion";

// --- Main Component ---
export default function NeonSign() {
    const titleText = "MACONDO";

    // Caribbean blue → jungle green gradient per letter
    const letterColors = [
        { text: "#1A8FB4", glow: "0 0 10px #1A8FB4, 0 0 25px #1A527690, 0 0 50px #1A527650" },  // M — deep caribbean
        { text: "#1E9E6E", glow: "0 0 10px #1E9E6E, 0 0 25px #1E844990, 0 0 50px #1E844950" },  // A — sea-green transition
        { text: "#2ECC71", glow: "0 0 10px #2ECC71, 0 0 25px #1E844990, 0 0 50px #1E844950" },  // C — lush green
        { text: "#27AE60", glow: "0 0 10px #27AE60, 0 0 25px #1E844990, 0 0 50px #1E844950" },  // O — jungle green
        { text: "#2ECC71", glow: "0 0 10px #2ECC71, 0 0 25px #1E844990, 0 0 50px #1E844950" },  // N — lush green
        { text: "#1E9E6E", glow: "0 0 10px #1E9E6E, 0 0 25px #1A527690, 0 0 50px #1A527650" },  // D — back to sea-green
        { text: "#1A8FB4", glow: "0 0 10px #1A8FB4, 0 0 25px #1A527690, 0 0 50px #1A527650" },  // O — back to caribbean
    ];

    return (
        <div className="relative inline-block p-8 md:p-12">
            {/* Steady border — blue-green gradient */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1A8FB4] via-[#2ECC71] to-[#1A8FB4] opacity-70 shadow-[0_0_10px_#1E844980,0_0_20px_#1A527650]" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1A8FB4] via-[#2ECC71] to-[#1A8FB4] opacity-70 shadow-[0_0_10px_#1E844980,0_0_20px_#1A527650]" />
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1A8FB4] via-[#2ECC71] to-[#1A8FB4] opacity-70 shadow-[0_0_10px_#1E844980,0_0_20px_#1A527650]" />
            <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1A8FB4] via-[#2ECC71] to-[#1A8FB4] opacity-70 shadow-[0_0_10px_#1E844980,0_0_20px_#1A527650]" />

            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-[#1E844908] rounded-xl pointer-events-none m-1" />

            <div className="relative z-10 text-center">
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
                        className="text-5xl md:text-7xl font-black tracking-widest mb-4"
                        style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#2E86C1", textShadow: "0 0 15px #2E86C1" }}
                    >
                        {titleText.split("").map((char, i) => (
                            <span key={`ghost-${i}`} className="inline-block">{char}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Main Layer — blue to green gradient letters */}
                <div
                    className="relative z-10 text-5xl md:text-7xl font-black tracking-widest mb-4"
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

                {/* Subtitle — warm pink */}
                <div
                    className="text-sm md:text-base font-light tracking-[0.4em] uppercase opacity-70"
                    style={{ fontFamily: "var(--font-cinzel), serif", color: "#F48FB1" }}
                >
                    Tequila Bar
                </div>
            </div>
        </div>
    );
}
