"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
    x: number;
    y: number;
    id: number;
    scale: number;
}

export default function BloodyCursor() {
    const { theme } = useTheme();
    const [trail, setTrail] = useState<Point[]>([]);

    useEffect(() => {
        if (theme !== "noche") {
            setTrail([]);
            return;
        }

        let counter = 0;
        const handleMouseMove = (e: MouseEvent) => {
            // Limit to every 3rd event for performance/spacing
            if (counter++ % 3 !== 0) return;

            const newPoint = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now(),
                scale: Math.random() * 0.5 + 0.5, // Random size
            };

            setTrail((prev) => [...prev.slice(-15), newPoint]); // Keep last 15 points
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [theme]);

    // Cleanup old points
    useEffect(() => {
        if (theme !== "noche") return;
        const interval = setInterval(() => {
            setTrail((prev) => prev.filter((p) => Date.now() - p.id < 500));
        }, 100);
        return () => clearInterval(interval);
    }, [theme]);

    if (theme !== "noche") return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
            <AnimatePresence>
                {trail.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 0.8, scale: point.scale }}
                        animate={{ opacity: 0, scale: point.scale * 0.5, y: 20 }} // Drip down and fade
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-3 h-3 rounded-full bg-[var(--color-vampire-highlight)] blur-[1px]"
                        style={{ left: point.x, top: point.y }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
