"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="relative w-full z-10 mt-8">
            {/* Top divider line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1A8FB4]/40 to-transparent" />

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

                    {/* Column 1: Brand + Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <h3
                            className="text-2xl mb-3 tracking-wider"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#1E9E6E" }}
                        >
                            MACONDO
                        </h3>
                        <p className="text-sm opacity-50 mb-1 text-[#F5E6CC]">Tequila Bar</p>
                        <div className="w-12 h-px bg-[#1A8FB4]/40 my-4 mx-auto md:mx-0" />
                        <p className="text-sm opacity-70 text-[#F5E6CC]">
                            Veltusund 1
                        </p>
                        <p className="text-sm opacity-70 text-[#F5E6CC]">
                            101 Reykjavík
                        </p>

                        {/* Map link */}
                        <a
                            href="https://maps.google.com/?q=Veltusund+1+Reykjavik"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#1A8FB4] hover:text-[#2E86C1]"
                        >
                            Opna kort →
                        </a>
                    </motion.div>

                    {/* Column 2: Opening Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                    >
                        <h4
                            className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70"
                            style={{ fontFamily: "var(--font-cinzel), serif", color: "#F4D03F" }}
                        >
                            Opnunartímar
                        </h4>

                        <div className="space-y-3 text-sm text-[#F5E6CC]">
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Sun — Fim</span>
                                <span className="opacity-80 font-mono">16 — 01</span>
                            </div>
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#F4D03F]/20 to-transparent mx-auto" />
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Fös — Lau</span>
                                <span className="opacity-80 font-mono">16 — 03</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Column 3: Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-center md:text-right"
                    >
                        <h4
                            className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70"
                            style={{ fontFamily: "var(--font-cinzel), serif", color: "#F4D03F" }}
                        >
                            Fylgdu okkur
                        </h4>

                        <div className="flex justify-center md:justify-end gap-6">
                            {/* Instagram */}
                            <a
                                href="https://instagram.com/macondo.rvk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-[#F48FB1] opacity-60 hover:opacity-100 transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="5" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                                </svg>
                                <span className="text-sm tracking-wider hidden md:inline">Instagram</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://facebook.com/macondo.rvk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-[#2E86C1] opacity-60 hover:opacity-100 transition-all"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                                <span className="text-sm tracking-wider hidden md:inline">Facebook</span>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs opacity-20 text-[#F5E6CC]">
                        © {new Date().getFullYear()} Macondo Tequila Bar
                    </p>
                    <p
                        className="text-xs opacity-15 italic"
                        style={{ fontFamily: "var(--font-cinzel), serif", color: "#F48FB1" }}
                    >
                        &ldquo;Macondo was already a fearful whirlwind of dust and rubble.&rdquo;
                    </p>
                </div>
            </div>
        </footer>
    );
}
