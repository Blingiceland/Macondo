"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { label: "Macondo", target: "hero" },
    { label: "Kokteilar", target: "cocktails" },
    { label: "Shots", target: "shots" },
    { label: "Borðapöntun", target: "reservation-form" },
];

export default function StickyNav() {
    const [visible, setVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    const handleScroll = useCallback(() => {
        // Show navbar after scrolling past hero
        setVisible(window.scrollY > window.innerHeight * 0.7);

        // Determine active section
        for (const item of [...NAV_ITEMS].reverse()) {
            const el = document.getElementById(item.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150) {
                    setActiveSection(item.target);
                    break;
                }
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const scrollTo = (id: string) => {
        if (id === "hero") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md bg-[#0B0E1A]/70 border-b border-white/5"
                >
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-1 md:gap-2">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => scrollTo(item.target)}
                                className={`px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${activeSection === item.target
                                        ? "bg-[#1A8FB4]/15 text-[#2ECC71] shadow-[0_0_10px_rgba(46,204,113,0.1)]"
                                        : "text-[#F5E6CC]/40 hover:text-[#F5E6CC]/80"
                                    }`}
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
