"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SalaBookingModal from "./SalaBookingModal";

export default function StickyNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [salaOpen, setSalaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const scrollTo = (id: string) => {
        setMobileOpen(false);
        if (pathname !== "/") { router.push("/"); return; }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const navLinkClass = "text-[15px] uppercase tracking-[0.16em] font-medium text-[#c6a46c]/[0.85] hover:text-[#dfc08a] transition-colors relative group";
    const navLinkStyle = { fontFamily: "var(--font-cinzel), serif" };

    return (
        <>
            <SalaBookingModal open={salaOpen} onClose={() => setSalaOpen(false)} lang="is" />

            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: pathname === "/" ? 4.2 : 0, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${scrolled || pathname !== "/"
                    ? "backdrop-blur-md bg-[#0f0a08]/90 border-b border-white/[0.04] shadow-sm"
                    : "bg-transparent"
                    }`}
                style={{ height: "96px" }}
            >
                {/* Desktop: 3-zone grid layout */}
                <div
                    className="hidden md:grid h-full max-w-[1400px] mx-auto items-center"
                    style={{
                        gridTemplateColumns: "220px 1fr auto",
                        padding: "0 72px",
                    }}
                >
                    {/* LEFT: Logo */}
                    <button
                        onClick={() => {
                            if (pathname !== "/") { window.location.href = "/"; return; }
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        aria-label="Fara efst á síðu"
                        className="flex flex-col items-start flex-shrink-0 group"
                    >
                        <Image
                            src="/macondo-logo.png" alt="Macondo" width={180} height={108}
                            className="h-[52px] w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                            style={{ filter: "drop-shadow(0 0 6px rgba(198,164,108,0.25)) drop-shadow(0 0 18px rgba(198,164,108,0.1))" }}
                        />
                    </button>

                    {/* CENTER: Nav links */}
                    <nav className="flex items-center justify-center gap-[42px]">
                        <button onClick={() => scrollTo("cocktails")} className={navLinkClass} style={navLinkStyle}>
                            Drykkjarseðill
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c] transition-all duration-300 group-hover:w-full" />
                        </button>
                        <button onClick={() => setSalaOpen(true)} className={navLinkClass} style={navLinkStyle}>
                            Salabókun
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c] transition-all duration-300 group-hover:w-full" />
                        </button>
                        <button onClick={() => router.push("/karaoke")} className={navLinkClass} style={navLinkStyle}>
                            Karókí
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c] transition-all duration-300 group-hover:w-full" />
                        </button>
                    </nav>

                    {/* RIGHT: CTA + Language + Pablo badge */}
                    <div className="flex items-center gap-7">
                        {/* CTA */}
                        <button
                            onClick={() => scrollTo("reservation-form")}
                            className="text-[15px] uppercase tracking-[0.18em] font-semibold text-[#f5f2ee] border border-[#c6a46c]/[0.55] hover:bg-[#c6a46c] hover:text-[#0f0a08] transition-all duration-300"
                            style={{
                                fontFamily: "var(--font-cinzel), serif",
                                padding: "14px 34px",
                            }}
                        >
                            Bóka Borð
                        </button>

                        {/* Language toggle */}
                        <Link
                            href="/en"
                            className="text-[13px] uppercase tracking-widest text-[#f5f2ee]/50 hover:text-[#c6a46c] transition-colors flex items-center gap-1"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                            EN <span className="text-[10px] leading-none opacity-80">🇬🇧</span>
                        </Link>

                        {/* Pablo Discobar Badge — far right */}
                        <a
                            href="https://pablodiscobar.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:inline-flex items-center gap-1 text-[13px] uppercase tracking-[0.14em] font-semibold text-[#d84acb] rounded-full px-3.5 py-[7px] transition-all duration-300 hover:text-[#f06ee3] hover:border-[#d84acb]/[0.38] hover:bg-[#d84acb]/[0.09]"
                            style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                background: "rgba(216, 74, 203, 0.06)",
                                border: "1px solid rgba(216, 74, 203, 0.22)",
                            }}
                        >
                            Pablo Discobar <span className="text-[10px] ml-0.5 opacity-70">✦</span>
                        </a>
                    </div>
                </div>

                {/* Mobile: logo + CTA + hamburger */}
                <div className="flex md:hidden h-full items-center justify-between px-5">
                    <button
                        onClick={() => {
                            if (pathname !== "/") { window.location.href = "/"; return; }
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        aria-label="Fara efst á síðu"
                        className="flex-shrink-0"
                    >
                        <Image
                            src="/macondo-logo.png" alt="Macondo" width={140} height={84}
                            className="h-10 w-auto opacity-90"
                        />
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scrollTo("reservation-form")}
                            className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#f5f2ee] border border-[#c6a46c]/[0.55] px-5 py-2 hover:bg-[#c6a46c] hover:text-[#0f0a08] transition-all duration-300"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Bóka Borð
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Valmynd"
                            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
                        >
                            <span className={`block w-5 h-px bg-[#f5f2ee]/70 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                            <span className={`block w-5 h-px bg-[#f5f2ee]/70 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[85] bg-[#0f0a08]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
                        style={{ paddingTop: "96px" }}
                    >
                        {[
                            { label: "Drykkjarseðill", action: () => scrollTo("cocktails") },
                            { label: "Borðabókun", action: () => scrollTo("reservation-form") },
                            { label: "Salabókun", action: () => { setMobileOpen(false); setSalaOpen(true); } },
                            { label: "Karókí", action: () => { setMobileOpen(false); router.push("/karaoke"); } },
                        ].map(item => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="text-[18px] uppercase tracking-[0.18em] font-medium text-[#f5f2ee]/80 hover:text-[#c6a46c] transition-colors"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                {item.label}
                            </button>
                        ))}

                        <div className="w-12 h-px bg-[#c6a46c]/20 my-2" />

                        {/* Pablo badge — mobile */}
                        <a
                            href="https://pablodiscobar.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#d84acb] rounded-full px-4 py-2 transition-all"
                            style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                background: "rgba(216, 74, 203, 0.06)",
                                border: "1px solid rgba(216, 74, 203, 0.22)",
                            }}
                        >
                            Pablo Discobar <span className="text-[10px] opacity-70">✦</span>
                        </a>

                        <Link
                            href="/en"
                            onClick={() => setMobileOpen(false)}
                            className="text-[13px] uppercase tracking-widest text-[#f5f2ee]/40 hover:text-[#c6a46c] transition-colors flex items-center gap-1 mt-2"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                            EN <span className="text-[10px] leading-none opacity-80">🇬🇧</span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
