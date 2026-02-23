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

    // Calculate progress (0→1) as user scrolls through different zones
    const progress = Math.min(scrollY / (windowHeight * 2.5), 1);

    // Stars fade out, jungle fades in, then golden glow appears
    const starOpacity = Math.max(1 - progress * 2.5, 0);
    const jungleOpacity = Math.min(progress * 2, 0.6) * Math.max(1 - (progress - 0.5) * 2, 0.3);
    const goldenOpacity = Math.max((progress - 0.4) * 1.5, 0);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

            {/* Layer 1: Starfield / Night Sky */}
            <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{ opacity: starOpacity }}
            >
                {/* Stars as CSS dots */}
                <div className="absolute inset-0">
                    {/* Small stars */}
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '8%', left: '15%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '12%', left: '42%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '5%', left: '68%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '18%', left: '85%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '25%', left: '25%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '30%', left: '55%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '22%', left: '78%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '15%', left: '92%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '35%', left: '10%' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_2px_white]" style={{ top: '40%', left: '38%' }} />

                    {/* Brighter accent stars */}
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_#F4D03F,0_0_8px_#F4D03F]" style={{ top: '10%', left: '30%' }} />
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_#2E86C1,0_0_8px_#2E86C1]" style={{ top: '20%', left: '60%' }} />
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_#F48FB1,0_0_8px_#F48FB1]" style={{ top: '28%', left: '75%' }} />
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_#2ECC71,0_0_8px_#2ECC71]" style={{ top: '8%', left: '50%' }} />
                </div>

                {/* Subtle milky way */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 15% at 50% 15%, rgba(46,134,193,0.04), transparent)",
                    }}
                />
            </div>

            {/* Layer 2: Jungle Canopy — deep greens and blues */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: jungleOpacity,
                    transform: `translateY(${scrollY * -0.08}px)`,
                }}
            >
                {/* Top canopy gradient */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#0D2818]/90 via-[#1E8449]/20 to-transparent" />

                {/* Side vines */}
                <div className="absolute top-0 left-0 w-1/6 h-full bg-gradient-to-r from-[#1E8449]/15 to-transparent" />
                <div className="absolute top-0 right-0 w-1/6 h-full bg-gradient-to-l from-[#1E8449]/15 to-transparent" />

                {/* Atmospheric haze */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0B0E1A]/50 to-transparent" />
            </div>

            {/* Layer 3: Golden Glow — warmth of the bar */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: goldenOpacity,
                    transform: `translateY(${scrollY * -0.04}px)`,
                }}
            >
                {/* Warm golden radial from center-bottom */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_80%,_#D4A01712_0%,_transparent_70%)]" />

                {/* Subtle pink accent */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_70%_60%,_#E91E6306_0%,_transparent_70%)]" />

                {/* Bottom warm gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A120B]/20 to-transparent" />
            </div>
        </div>
    );
}
