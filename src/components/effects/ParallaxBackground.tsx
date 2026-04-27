"use client";

import { useEffect, useState, useRef } from "react";

export default function ParallaxBackground() {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(1);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);

        const handleScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setScrollY(window.scrollY);
            });
        };

        const handleResize = () => setWindowHeight(window.innerHeight);

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const progress = Math.min(scrollY / (windowHeight * 2.5), 1);
    const starOpacity = Math.max(1 - progress * 2.5, 0) * 0.28;
    const jungleOpacity = Math.min(progress * 1.5, 0.35) * Math.max(1 - (progress - 0.5) * 2, 0.3);
    const goldenOpacity = Math.max((progress - 0.4) * 1.2, 0) * 0.5;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

            {/* Layer 1: Sparse starfield — reduced count & opacity */}
            <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{ opacity: starOpacity }}
            >
                <div className="absolute inset-0">
                    {/* ~5 small stars (halved from 10) */}
                    <div className="absolute w-[1px] h-[1px] bg-white/60 rounded-full" style={{ top: '8%', left: '15%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white/60 rounded-full" style={{ top: '5%', left: '68%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white/60 rounded-full" style={{ top: '25%', left: '25%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white/60 rounded-full" style={{ top: '30%', left: '55%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white/60 rounded-full" style={{ top: '15%', left: '92%' }} />

                    {/* ~2 faint accent stars (halved from 4, muted gold only) */}
                    <div className="absolute w-[1.5px] h-[1.5px] bg-[#c6a46c]/40 rounded-full" style={{ top: '10%', left: '30%' }} />
                    <div className="absolute w-[1.5px] h-[1.5px] bg-[#c6a46c]/40 rounded-full" style={{ top: '28%', left: '75%' }} />
                </div>

                {/* Very subtle warm haze instead of milky way */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 15% at 50% 15%, rgba(198,164,108,0.02), transparent)",
                    }}
                />
            </div>

            {/* Layer 2: Muted canopy */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: jungleOpacity,
                    transform: `translateY(${scrollY * -0.06}px)`,
                }}
            >
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0f0a08]/60 via-[#c6a46c]/[0.03] to-transparent" />
                <div className="absolute top-0 left-0 w-1/6 h-full bg-gradient-to-r from-[#0f0a08]/30 to-transparent" />
                <div className="absolute top-0 right-0 w-1/6 h-full bg-gradient-to-l from-[#0f0a08]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f0a08]/40 to-transparent" />
            </div>

            {/* Layer 3: Warm ambient — very subtle */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: goldenOpacity,
                    transform: `translateY(${scrollY * -0.03}px)`,
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_80%,_rgba(198,164,108,0.04)_0%,_transparent_70%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0f0a08]/15 to-transparent" />
            </div>
        </div>
    );
}
