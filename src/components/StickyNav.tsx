"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { label: "Drykkjaseðill", target: "/menu", type: "link" as const },
    { label: "Kokteilar", target: "cocktails", type: "scroll" as const },
    { label: "Skot", target: "shots", type: "scroll" as const },
    { label: "Bóka borð", target: "reservation-form", type: "scroll" as const },
    { label: "Karókí", target: "karaoke", type: "scroll" as const },
];

export default function StickyNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState("hero");
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);

        // Only track sections on the main page
        if (pathname !== "/") return;

        for (const item of [...NAV_ITEMS].filter(i => i.type === "scroll").reverse()) {
            const el = document.getElementById(item.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150) {
                    setActiveSection(item.target);
                    break;
                }
            }
        }
    }, [pathname]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleClick = (item: typeof NAV_ITEMS[0]) => {
        if (item.type === "link") {
            router.push(item.target);
            return;
        }
        if (pathname !== "/") {
            router.push("/");
            return;
        }
        if (item.target === "hero") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const el = document.getElementById(item.target);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const isActive = (item: typeof NAV_ITEMS[0]) => {
        if (item.type === "link") return pathname === item.target;
        return pathname === "/" && activeSection === item.target;
    };

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: pathname === "/" ? 4.2 : 0, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${scrolled || pathname !== "/"
                ? "backdrop-blur-md bg-[#1A0A08]/80 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-1 md:gap-2">
                {/* Logo — scrolls to top */}
                <button
                    onClick={() => {
                        if (pathname !== "/") { window.location.href = "/"; return; }
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-label="Fara efst á síðu"
                    className="flex-shrink-0"
                >
                    <Image
                        src="/macondo-logo.png"
                        alt="Macondo"
                        width={180}
                        height={108}
                        className="h-16 md:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
                        style={{ filter: "drop-shadow(0 0 8px #C13A1A80)" }}
                    />
                </button>

                <div className="flex items-center gap-1 md:gap-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.target}
                        onClick={() => handleClick(item)}
                        className={`px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${isActive(item)
                            ? "bg-[#C13A1A]/15 text-[#C13A1A] shadow-[0_0_10px_rgba(193,58,26,0.1)]"
                            : "text-[#F5E8D0]/40 hover:text-[#F5E8D0]/80"
                            }`}
                        style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                        {item.label}
                    </button>
                ))}
                {/* Cross-Link to Pablo */}
                <a href="https://pablodiscobar.is"
                    className="ml-2 md:ml-4 px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase font-bold tracking-[0.15em] rounded-full transition-all duration-300 border border-[#F806CC]/30 text-[#F806CC]/80 hover:bg-[#F806CC]/10 hover:text-[#F806CC] hover:border-[#F806CC] hover:shadow-[0_0_15px_rgba(248,6,204,0.3)]"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    Fara á Pablo
                </a>
                
                {/* Language toggle */}
                <Link href="/en"
                    className="ml-2 md:ml-4 px-3 py-1.5 text-xs uppercase tracking-[0.15em] rounded-full border border-[#F5A800]/20 text-[#F5A800]/50 hover:text-[#F5A800] hover:border-[#F5A800]/50 transition-all"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    EN
                </Link>
                </div>
            </div>
        </motion.nav>
    );
}
