"use client";

import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
}

export default function FireflyCursor() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        let counter = 0;
        const handleMouseMove = (e: MouseEvent) => {
            if (counter++ % 4 !== 0) return;

            const newParticle = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
            };

            setParticles((prev) => [...prev.slice(-12), newParticle]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles((prev) => prev.filter((p) => Date.now() - p.id < 600));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full animate-firefly"
                    style={{
                        left: p.x - 4,
                        top: p.y - 4,
                        backgroundColor: "#F4D03F",
                        boxShadow: "0 0 8px #F4D03F, 0 0 16px #D4A017, 0 0 24px #D4A01780",
                    }}
                />
            ))}
        </div>
    );
}
