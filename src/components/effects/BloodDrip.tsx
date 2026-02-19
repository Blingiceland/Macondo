"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BloodStreak {
    id: number;
    left: number; // Percentage 0-100
    width: number; // Pixels
    duration: number; // Seconds
    delay: number;
}

export default function BloodDrip() {
    const { theme } = useTheme();
    const [streaks, setStreaks] = useState<BloodStreak[]>([]);

    useEffect(() => {
        if (theme !== "noche") {
            setStreaks([]);
            return;
        }

        // Initial set of streaks
        const initialStreaks = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: Math.random() * 95, // avoid extreme edges
            width: Math.random() * 2 + 1, // 1px to 3px thin streaks
            duration: Math.random() * 10 + 15, // 15-25s slow drip
            delay: Math.random() * 5
        }));
        setStreaks(initialStreaks);

        // Periodically add new streaks or refresh them to keep it alive but subtle
        const interval = setInterval(() => {
            setStreaks(prev => {
                if (prev.length > 12) return prev; // Limit max streaks
                return [
                    ...prev,
                    {
                        id: Date.now(),
                        left: Math.random() * 95,
                        width: Math.random() * 2 + 1,
                        duration: Math.random() * 10 + 15,
                        delay: 0
                    }
                ];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [theme]);

    if (theme !== "noche") return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <AnimatePresence>
                {streaks.map((streak) => (
                    <motion.div
                        key={streak.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "60vh",
                            opacity: [0, 0.4, 0.2, 0] // Fade in, stay visible, fade out
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: streak.duration,
                            delay: streak.delay,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: Math.random() * 10
                        }}
                        className="absolute top-0 bg-gradient-to-b from-[#450a0a] to-transparent rounded-b-full shadow-[0_0_8px_rgba(220,38,38,0.3)]"
                        style={{
                            left: `${streak.left}%`,
                            width: `${streak.width}px`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
