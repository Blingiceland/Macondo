"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroIntroProps {
    onComplete: () => void;
}

export default function HeroIntro({ onComplete }: HeroIntroProps) {
    const [phase, setPhase] = useState<'letters' | 'subtitle' | 'done'>('letters');
    const titleText = "MACONDO";

    // Caribbean blue → jungle green gradient per letter
    const letterColors = [
        { text: "#1A8FB4", glow: "0 0 12px #1A8FB4, 0 0 30px #1A527690, 0 0 60px #1A527640" },
        { text: "#1E9E6E", glow: "0 0 12px #1E9E6E, 0 0 30px #1E844990, 0 0 60px #1E844940" },
        { text: "#2ECC71", glow: "0 0 12px #2ECC71, 0 0 30px #1E844990, 0 0 60px #1E844940" },
        { text: "#27AE60", glow: "0 0 12px #27AE60, 0 0 30px #1E844990, 0 0 60px #1E844940" },
        { text: "#2ECC71", glow: "0 0 12px #2ECC71, 0 0 30px #1E844990, 0 0 60px #1E844940" },
        { text: "#1E9E6E", glow: "0 0 12px #1E9E6E, 0 0 30px #1A527690, 0 0 60px #1A527640" },
        { text: "#1A8FB4", glow: "0 0 12px #1A8FB4, 0 0 30px #1A527690, 0 0 60px #1A527640" },
    ];

    useEffect(() => {
        // Phase transitions
        const subtitleTimer = setTimeout(() => setPhase('subtitle'), 2200);
        const doneTimer = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 3800);

        return () => {
            clearTimeout(subtitleTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E1A]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    {/* Ambient background glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A527615_0%,_transparent_60%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1E844908_0%,_transparent_40%)]" />
                    </motion.div>

                    <div className="text-center">
                        {/* Letter by letter reveal */}
                        <div
                            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.15em] mb-6"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive" }}
                        >
                            {titleText.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    initial={{ opacity: 0, y: 40, scale: 0.5, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                    transition={{
                                        delay: 0.15 + i * 0.18,
                                        duration: 0.6,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    style={{
                                        color: letterColors[i].text,
                                        textShadow: letterColors[i].glow,
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Subtitle reveals after letters */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={phase === 'subtitle' ? { opacity: 0.7, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-sm md:text-base font-light tracking-[0.5em] uppercase"
                            style={{ fontFamily: "var(--font-cinzel), serif", color: "#F48FB1" }}
                        >
                            Tequila Bar
                        </motion.div>

                        {/* Border line sweeps in */}
                        <motion.div
                            className="mx-auto mt-8 h-[1px]"
                            initial={{ width: 0, opacity: 0 }}
                            animate={phase === 'subtitle' ? { width: 200, opacity: 0.4 } : {}}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            style={{
                                background: "linear-gradient(to right, transparent, #1A8FB4, #2ECC71, #1A8FB4, transparent)",
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
