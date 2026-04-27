"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroIntroProps {
    onComplete: () => void;
}

export default function HeroIntro({ onComplete }: HeroIntroProps) {
    const [phase, setPhase] = useState<'logo' | 'glow' | 'done'>('logo');

    useEffect(() => {
        const glowTimer = setTimeout(() => setPhase('glow'), 1400);
        const doneTimer = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 3600);

        return () => {
            clearTimeout(glowTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A0A08]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    {/* Ambient radial glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3D181018_0%,_transparent_60%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C13A1A08_0%,_transparent_40%)]" />
                    </motion.div>

                    <div className="text-center px-8">
                        {/* Logo fades + scales in */}
                        <motion.div
                            
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                filter: phase === 'glow'
                                    ? "drop-shadow(0 0 18px #C13A1A) drop-shadow(0 0 40px #C13A1A70)"
                                    : "none",
                                transition: "filter 0.8s ease"
                            }}
                        >
                            <Image
                                src="/macondo-logo.png"
                                alt="Macondo Tequila Lounge"
                                width={520}
                                height={312}
                                priority
                                className="w-72 md:w-[440px] lg:w-[580px] h-auto mx-auto"
                            />
                        </motion.div>

                        {/* Sweep line */}
                        <motion.div
                            className="mx-auto mt-8 h-[1px]"
                            initial={{ width: 0, opacity: 0 }}
                            animate={phase === 'glow' ? { width: 200, opacity: 0.4 } : {}}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            style={{
                                background: "linear-gradient(to right, transparent, #C13A1A, #C13A1A, #C13A1A, transparent)",
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
