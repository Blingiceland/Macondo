"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import NeonSign from "@/components/effects/NeonSign";
import Butterflies from "@/components/effects/Butterflies";
import FireflyCursor from "@/components/effects/FireflyCursor";
import ParallaxBackground from "@/components/effects/ParallaxBackground";
import Image from "next/image";
import Link from "next/link";

/* ================================================================
   English versions of cocktails & shots
   ================================================================ */

interface Drink {
    name: string;
    description: string;
    price: string;
    image?: string;
}

const COCKTAILS: Drink[] = [
    { name: "Mariposa Amarilla", description: "Tequila, passion fruit, sour lime, gold-dust rim.", price: "2400 ISK", image: "/images/The_Sanguine_Saint.png" },
    { name: "Macondo Sunrise", description: "Tequila, grapefruit soda, grenadine, orange zest.", price: "2200 ISK", image: "/images/Eternal_Sunset.png" },
    { name: "La Lluvia", description: "Mezcal, grapefruit, rosemary smoke, salt.", price: "2300 ISK", image: "/images/Graveyard_Dust.png" },
    { name: "Aureliano", description: "Añejo tequila, agave, bitters, orange peel.", price: "2800 ISK", image: "/images/A_Stake_Through_The_Heart.png" },
    { name: "Melquíades", description: "Smoky, bitter, dark. One for the alchemist.", price: "2600 ISK", image: "/images/Crimson_Peak.png" },
    { name: "Remedios la Bella", description: "Elderflower, lime, tequila blanco. Ascends.", price: "2400 ISK", image: "/images/La_Llorona.png" },
    { name: "Pilar Ternera", description: "Tequila, ginger, tamarind, chili-salt rim.", price: "2500 ISK", image: "/images/Lucifers_Reach.png" },
    { name: "Úrsula", description: "Tequila, blackberry, basil, dark honey.", price: "2700 ISK", image: "/images/Midnight_Garden.png" },
];

const SHOTS: Drink[] = [
    { name: "El Hielo", description: "Frozen tequila blanco. The very first wonder.", price: "1500 ISK", image: "/images/Holy_Water.png" },
    { name: "Tierra", description: "Oak-aged, deep, and earthy.", price: "1700 ISK", image: "/images/The_Antidote.png" },
    { name: "Las Cenizas", description: "Thick, dark, 1-3 years aged. Everything turns to ash.", price: "2000 ISK", image: "/images/Venom.png" },
    { name: "El Pergamino", description: "Coffee-agave fusion. Written on parchment.", price: "1600 ISK", image: "/images/Coffin_Nail.png" },
    { name: "Fuego", description: "Mezcal and blazing chili heat. Everything burns.", price: "1600 ISK", image: "/images/Hellfire.png" },
    { name: "El Circo", description: "Smoke and mirrors. The circus comes to town.", price: "1800 ISK", image: "/images/Smoke_And_Mirrors.png" },
    { name: "Soledad", description: "Coconut, light, sweet, alone.", price: "1600 ISK", image: "/images/Pale_Ghost.png" },
    { name: "Insomnia", description: "Herbal blend. No one sleeps in Macondo.", price: "1900 ISK", image: "/images/Viper_Bite.png" },
];

/* ================================================================
   Booking Form (English)
   ================================================================ */

function BookingFormEN() {
    const [step, setStep] = useState<'DETAILS' | 'RIDDLE' | 'CONFIRMED'>('DETAILS');
    const [formData, setFormData] = useState({ name: '', guests: '2', time: '22:00', email: '' });
    const [riddleAnswer, setRiddleAnswer] = useState('');
    const [errorShake, setErrorShake] = useState(false);

    const handleDetailsSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep('RIDDLE'); };

    const handleRiddleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const answer = riddleAnswer.toLowerCase().trim();
        if (['ice', 'hielo', 'ís', 'tequila', 'macondo', 'butterfly', 'fiðrildi', 'mariposa'].some(a => answer.includes(a))) {
            setStep('CONFIRMED');
        } else {
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
        }
    };

    return (
        <div id="booking" className="py-20 px-6 w-full max-w-2xl mx-auto mb-20 text-center">
            <motion.div layout initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-lg border-2 transition-all duration-700 relative overflow-hidden border-[#D4A017]/30 bg-[#0B0E1A]/80 shadow-[0_0_50px_rgba(244,208,63,0.05)]"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent opacity-40" />
                <h2 className="text-3xl mb-8 font-bold font-sans uppercase tracking-[0.2em] text-[#F5E6CC]">
                    {step === 'CONFIRMED' ? "WELCOME TO MACONDO" : "BOOK A TABLE"}
                </h2>

                {step === 'DETAILS' && (
                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleDetailsSubmit} className="space-y-6 text-left">
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white" placeholder="Your name, traveler" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Guests</label>
                                <input type="number" min="1" required value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                    className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Time</label>
                                <input type="time" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Email</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white" />
                        </div>
                        <button type="submit" className="w-full py-4 mt-8 font-bold tracking-widest transition-all duration-300 transform hover:scale-[1.02] bg-[#E91E63] text-white hover:bg-[#F06292] shadow-[0_0_20px_rgba(233,30,99,0.2)]">
                            PROCEED
                        </button>
                    </motion.form>
                )}

                {step === 'RIDDLE' && (
                    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleRiddleSubmit}
                        className={`space-y-8 text-center ${errorShake ? 'animate-shake' : ''}`}>
                        <div className="text-[#F5E6CC] text-lg italic opacity-80 font-serif">
                            &ldquo;José Arcadio Buendía touched the ice<br />
                            and called it the greatest invention on earth.<br />
                            What did he touch?&rdquo;
                        </div>
                        <input type="text" autoFocus value={riddleAnswer} onChange={e => setRiddleAnswer(e.target.value)} placeholder="Answer..."
                            className="w-full text-center text-2xl p-4 bg-transparent border-b-2 border-[#F4D03F] text-[#F4D03F] focus:outline-none uppercase tracking-widest" />
                        <button type="submit" className="w-full py-4 font-bold tracking-[0.3em] bg-transparent border-2 border-[#F4D03F] text-[#F4D03F] hover:bg-[#F4D03F] hover:text-[#0B0E1A] transition-all">
                            SUBMIT
                        </button>
                    </motion.form>
                )}

                {step === 'CONFIRMED' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                        <div className="relative border p-8 border-[#D4A017]/40 bg-[#0B0E1A]/90 text-left font-serif text-sm text-[#F4D03F] shadow-[inset_0_0_50px_rgba(244,208,63,0.03)]">
                            <div className="absolute top-2 right-2 border border-[#E91E63] px-3 py-1 transform rotate-6 opacity-60">
                                <span className="text-sm font-bold text-[#F48FB1] tracking-widest">CONFIRMED</span>
                            </div>
                            <p className="mb-4 text-center text-white/40 tracking-widest text-xs uppercase">— The Pact of Macondo —</p>
                            <p className="mb-4 text-[#F5E6CC]">
                                <span className="font-bold text-[#F4D03F] text-lg border-b border-[#D4A017]">{formData.name}</span>, you have been granted passage into Macondo.
                            </p>
                            <p className="mb-4 text-[#F5E6CC]/80">
                                DATE: <span className="text-white">Tonight</span> <br />
                                TIME: <span className="text-white">{formData.time}</span> <br />
                                TRAVELERS: <span className="text-white">{formData.guests}</span>
                            </p>
                            <p className="mb-8 italic opacity-50 text-sm text-[#F48FB1]">
                                &ldquo;The world was so recent that many things lacked names, and in order to indicate them it was necessary to point.&rdquo;
                            </p>
                            <div className="w-full h-16 border-b border-dashed border-[#D4A017]/30 flex items-end justify-center pb-2 relative">
                                <span className="font-serif text-3xl text-[#F4D03F] opacity-80 rotate-[-3deg] absolute bottom-2">{formData.name}</span>
                            </div>
                        </div>
                        <button onClick={() => setStep('DETAILS')} className="mt-8 text-xs underline opacity-50 hover:opacity-100 text-[#F48FB1]">Make another reservation</button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

/* ================================================================
   Footer (English)
   ================================================================ */

function FooterEN() {
    return (
        <footer className="relative w-full z-10 mt-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1A8FB4]/40 to-transparent" />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl mb-3 tracking-wider" style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#1E9E6E" }}>MACONDO</h3>
                        <p className="text-sm opacity-50 mb-1 text-[#F5E6CC]">Tequila Bar</p>
                        <div className="w-12 h-px bg-[#1A8FB4]/40 my-4 mx-auto md:mx-0" />
                        <p className="text-sm opacity-70 text-[#F5E6CC]">Veltusund 1</p>
                        <p className="text-sm opacity-70 text-[#F5E6CC]">101 Reykjavík</p>
                        <a href="https://maps.google.com/?q=Veltusund+1+Reykjavik" target="_blank" rel="noopener noreferrer"
                            className="inline-block mt-3 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#1A8FB4] hover:text-[#2E86C1]">
                            Open map →
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F4D03F" }}>Opening Hours</h4>
                        <div className="space-y-3 text-sm text-[#F5E6CC]">
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Sun — Thu</span>
                                <span className="opacity-80 font-mono">16 — 01</span>
                            </div>
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#F4D03F]/20 to-transparent mx-auto" />
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Fri — Sat</span>
                                <span className="opacity-80 font-mono">16 — 03</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F4D03F" }}>Follow Us</h4>
                        <div className="flex justify-center md:justify-end gap-6">
                            <a href="https://instagram.com/macondo.rvk" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#F48FB1] opacity-60 hover:opacity-100 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                                <span className="text-sm tracking-wider hidden md:inline">Instagram</span>
                            </a>
                            <a href="https://facebook.com/macondo.rvk" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#2E86C1] opacity-60 hover:opacity-100 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                <span className="text-sm tracking-wider hidden md:inline">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs opacity-20 text-[#F5E6CC]">© {new Date().getFullYear()} Macondo Tequila Bar</p>
                    <p className="text-xs opacity-15 italic" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F48FB1" }}>
                        &ldquo;Macondo was already a fearful whirlwind of dust and rubble.&rdquo;
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ================================================================
   Nav (English)
   ================================================================ */

function NavEN() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md bg-[#0B0E1A]/80 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-1 md:gap-2">
                {[
                    { label: "Macondo", href: "#top" },
                    { label: "Drinks Menu", href: "/menu" },
                    { label: "Cocktails", href: "#cocktails" },
                    { label: "Shots", href: "#shots" },
                    { label: "Book a Table", href: "#booking" },
                ].map((item) => {
                    const isLink = item.href.startsWith("/");
                    if (isLink) {
                        return (
                            <Link key={item.label} href={item.href}
                                className="px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full text-[#F5E6CC]/40 hover:text-[#F5E6CC]/80 transition-all duration-300"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                {item.label}
                            </Link>
                        );
                    }
                    return (
                        <button key={item.label}
                            onClick={() => {
                                if (item.href === "#top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
                                document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full text-[#F5E6CC]/40 hover:text-[#F5E6CC]/80 transition-all duration-300"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            {item.label}
                        </button>
                    );
                })}
                {/* Language toggle */}
                <Link href="/"
                    className="ml-4 px-3 py-1.5 text-xs uppercase tracking-[0.15em] rounded-full border border-[#F4D03F]/20 text-[#F4D03F]/50 hover:text-[#F4D03F] hover:border-[#F4D03F]/50 transition-all"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    IS
                </Link>
            </div>
        </div>
    );
}

/* ================================================================
   DRINK CARD
   ================================================================ */

function DrinkCard({ drink, color }: { drink: Drink; color: "yellow" | "pink" }) {
    const styles = color === "yellow"
        ? { border: "border-[#F4D03F]/15 hover:border-[#F4D03F]/50", title: "text-[#F4D03F]", price: "text-[#D4A017]", line: "from-[#F4D03F]/60", hover: "hover:shadow-[0_0_25px_rgba(244,208,63,0.1)]" }
        : { border: "border-[#E91E63]/15 hover:border-[#E91E63]/50", title: "text-[#F48FB1]", price: "text-[#E91E63]", line: "from-[#E91E63]/60", hover: "hover:shadow-[0_0_25px_rgba(233,30,99,0.1)]" };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className={`group relative overflow-hidden rounded-lg bg-[#0B0E1A]/80 border ${styles.border} transition-all duration-300 hover:scale-105 ${styles.hover}`}>
            {drink.image && (
                <div className="relative w-full aspect-square overflow-hidden">
                    <Image src={drink.image} alt={drink.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                </div>
            )}
            <div className="p-4">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className={`text-lg font-bold tracking-wider ${styles.title}`}>{drink.name}</h3>
                    <span className={`text-sm opacity-80 whitespace-nowrap ml-2 ${styles.price} font-mono`}>{drink.price}</span>
                </div>
                <div className={`h-px w-full my-2 bg-gradient-to-r ${styles.line} to-transparent`} />
                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E6CC]">{drink.description}</p>
            </div>
        </motion.div>
    );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function EnglishPage() {
    const [introDone, setIntroDone] = useState(false);

    useCallback(() => setIntroDone(true), []);

    // Skip intro on English page, just show content
    useState(() => { setIntroDone(true); });

    return (
        <>
            <ParallaxBackground />
            {introDone && <Butterflies />}
            <FireflyCursor />
            <NavEN />

            {/* HERO */}
            <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A527615_0%,_transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F4D03F06_0%,_transparent_40%)]" />
                </div>
                <div className="z-10 text-center max-w-4xl px-6">
                    <motion.div className="min-h-32 mb-16 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <NeonSign />
                    </motion.div>
                    <motion.div className="h-24 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-sm md:text-base font-light italic leading-relaxed opacity-50" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F48FB1' }}>
                            &ldquo;The world was so recent that many things lacked names.&rdquo;
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-12 py-4 rounded-full text-lg font-bold tracking-[0.2em] transition-all duration-300 bg-transparent text-[#F4D03F] border border-[#D4A017] shadow-[0_0_20px_rgba(244,208,63,0.15)] hover:bg-[#F4D03F]/10 hover:shadow-[0_0_30px_rgba(244,208,63,0.25)] hover:border-[#F4D03F]"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            ENTER MACONDO
                        </motion.button>
                    </motion.div>
                </div>
            </main>

            {/* DIVIDER */}
            <div className="relative w-full h-32 overflow-hidden z-10">
                <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z" fill="#0D2818" fillOpacity="0.3" />
                    <path d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z" fill="#0B0E1A" fillOpacity="0.5" />
                </svg>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div className="text-center py-16 px-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="text-lg md:text-xl font-light leading-relaxed opacity-60" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F5E6CC' }}>
                        Every drink in Macondo tells a story —<br />
                        of gold and solitude, rain and butterflies.
                    </p>
                </motion.div>

                {/* COCKTAILS */}
                <div id="cocktails" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-[#F4D03F] drop-shadow-[0_0_12px_rgba(244,208,63,0.6)]"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive" }}>REMEDIOS</h2>
                        <p className="text-xs opacity-40 uppercase tracking-widest mt-2 text-[#F5E6CC]">Cocktails</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COCKTAILS.map((drink, i) => <DrinkCard key={i} drink={drink} color="yellow" />)}
                    </div>
                </div>

                {/* SHOTS */}
                <div id="shots" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-[#F48FB1] drop-shadow-[0_0_12px_rgba(233,30,99,0.6)]"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive" }}>LA ALQUIMIA</h2>
                        <p className="text-xs opacity-40 uppercase tracking-widest mt-2 text-[#F5E6CC]">Shots</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {SHOTS.map((drink, i) => <DrinkCard key={i} drink={drink} color="pink" />)}
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="relative w-full h-24 overflow-hidden my-8">
                    <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
                        <path d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z" fill="#0D2818" fillOpacity="0.2" />
                    </svg>
                </div>

                <BookingFormEN />
                <FooterEN />
            </div>
        </>
    );
}
