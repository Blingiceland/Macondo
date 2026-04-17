"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
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
    type Step = "DATE" | "TIME" | "DETAILS" | "CONFIRMED";
    interface SlotInfo { slot: string; available: boolean; tablesLeft: number; }

    const [step, setStep] = useState<Step>("DATE");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [slots, setSlots] = useState<SlotInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationId, setConfirmationId] = useState("");

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() + i);
        return {
            date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
            label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
            dayName: dayNames[d.getDay()],
        };
    });

    const fetchSlots = useCallback(async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/available?date=${selectedDate}&guests=${guests}`);
            const data = await res.json();
            if (data.slots) setSlots(data.slots);
        } catch { setError("Could not fetch availability"); }
        setLoading(false);
    }, [selectedDate, guests]);

    useEffect(() => { if (step === "TIME" && selectedDate) fetchSlots(); }, [step, selectedDate, guests, fetchSlots]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: selectedDate, timeSlot: selectedTime, guests, name, email }),
            });
            const data = await res.json();
            if (data.success) { setConfirmationId(data.id); setStep("CONFIRMED"); }
            else setError(data.error || "Something went wrong");
        } catch { setError("Booking failed"); }
        setLoading(false);
    };

    const resetForm = () => { setStep("DATE"); setSelectedDate(""); setSelectedTime(""); setGuests(2); setName(""); setEmail(""); setError(""); setConfirmationId(""); };

    const fadeSlide = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.4 } };

    return (
        <section id="booking" className="relative py-32 px-6">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F5A800" }}>
                        BOOK A TABLE
                    </h2>
                    <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#F5A800]/40 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                    {step === "DATE" && (
                        <motion.div key="date" {...fadeSlide}>
                            <p className="text-center text-[#F5E8D0]/60 text-sm mb-6 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Choose a date</p>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="text-[#F5A800]/70 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel), serif" }}>Guests</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-[#F5A800]/20 text-[#F5A800]/60 hover:border-[#F5A800]/50 hover:text-[#F5A800] transition-all text-sm">−</button>
                                    <span className="w-8 text-center text-[#F5A800] font-bold text-lg">{guests}</span>
                                    <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-8 h-8 rounded-full border border-[#F5A800]/20 text-[#F5A800]/60 hover:border-[#F5A800]/50 hover:text-[#F5A800] transition-all text-sm">+</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 mb-6">
                                {dates.map(d => (
                                    <button key={d.date} onClick={() => { setSelectedDate(d.date); setStep("TIME"); }}
                                        className={`py-3 px-1 rounded-lg border text-center transition-all duration-200 hover:scale-105 ${selectedDate === d.date ? "border-[#F5A800] bg-[#F5A800]/10 text-[#F5A800]" : "border-[#F5E8D0]/10 text-[#F5E8D0]/60 hover:border-[#F5A800]/30 hover:text-[#F5E8D0]/90"
                                            }`}>
                                        <div className="text-[10px] uppercase tracking-wider opacity-60">{d.dayName}</div>
                                        <div className="text-xs font-semibold mt-1">{d.label}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === "TIME" && (
                        <motion.div key="time" {...fadeSlide}>
                            <button onClick={() => setStep("DATE")} className="text-[#F5A800]/50 text-xs uppercase tracking-wider hover:text-[#F5A800] transition-colors mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>← Back</button>
                            <p className="text-center text-[#F5E8D0]/60 text-sm mb-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Choose a time</p>
                            <p className="text-center text-[#F5E8D0]/30 text-xs mb-6">{dates.find(d => d.date === selectedDate)?.label} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-6 h-6 border-2 border-[#F5A800]/20 border-t-[#F5A800] rounded-full animate-spin" />
                                    <p className="text-[#F5E8D0]/40 text-xs mt-3">Checking availability...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {slots.map(s => (
                                        <button key={s.slot} disabled={!s.available} onClick={() => { setSelectedTime(s.slot); setStep("DETAILS"); }}
                                            className={`py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${!s.available ? "border-[#F5E8D0]/5 text-[#F5E8D0]/15 cursor-not-allowed line-through"
                                                : s.tablesLeft <= 2 ? "border-[#E74C3C]/30 text-[#E74C3C]/80 hover:border-[#E74C3C]/60 hover:bg-[#E74C3C]/5"
                                                    : "border-[#C13A1A]/20 text-[#C13A1A]/80 hover:border-[#C13A1A]/50 hover:bg-[#C13A1A]/5"
                                                }`}>
                                            {s.slot}
                                            {s.available && s.tablesLeft <= 2 && <div className="text-[9px] opacity-60 mt-0.5">Few left</div>}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {error && <p className="text-[#E74C3C] text-sm text-center">{error}</p>}
                        </motion.div>
                    )}

                    {step === "DETAILS" && (
                        <motion.div key="details" {...fadeSlide}>
                            <button onClick={() => setStep("TIME")} className="text-[#F5A800]/50 text-xs uppercase tracking-wider hover:text-[#F5A800] transition-colors mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>← Back</button>
                            <p className="text-center text-[#F5E8D0]/60 text-sm mb-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Your details</p>
                            <p className="text-center text-[#F5E8D0]/30 text-xs mb-8">{dates.find(d => d.date === selectedDate)?.label} · {selectedTime} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F5A800]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                                        className="w-full bg-transparent border-b border-[#F5E8D0]/15 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F5A800]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                                        className="w-full bg-transparent border-b border-[#F5E8D0]/15 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors" />
                                </div>
                                {error && <p className="text-[#E74C3C] text-sm text-center">{error}</p>}
                                <button type="submit" disabled={loading}
                                    className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent text-[#F5A800] border border-[#E8C87A] shadow-[0_0_15px_rgba(245,168,0,0.1)] hover:bg-[#F5A800]/10 hover:shadow-[0_0_25px_rgba(245,168,0,0.2)] disabled:opacity-30"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                    {loading ? "Booking..." : "CONFIRM BOOKING"}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === "CONFIRMED" && (
                        <motion.div key="confirmed" {...fadeSlide} className="text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#C13A1A] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C13A1A" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </motion.div>
                            <h3 className="text-xl font-bold tracking-[0.15em] mb-2 text-[#C13A1A]" style={{ fontFamily: "var(--font-cinzel), serif" }}>BOOKING CONFIRMED</h3>
                            <div className="bg-[#F5E8D0]/5 rounded-xl p-6 mb-8 space-y-3 text-left border border-[#F5E8D0]/10">
                                <div className="flex justify-between"><span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Name</span><span className="text-[#F5E8D0] text-sm">{name}</span></div>
                                <div className="flex justify-between"><span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Date</span><span className="text-[#F5E8D0] text-sm">{dates.find(d => d.date === selectedDate)?.label}</span></div>
                                <div className="flex justify-between"><span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Time</span><span className="text-[#F5E8D0] text-sm">{selectedTime}</span></div>
                                <div className="flex justify-between"><span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Guests</span><span className="text-[#F5E8D0] text-sm">{guests}</span></div>
                                {confirmationId && <div className="pt-3 border-t border-[#F5E8D0]/10"><span className="text-[#F5E8D0]/30 text-[10px] uppercase tracking-wider">Ref: {confirmationId.slice(0, 8)}</span></div>}
                            </div>
                            <p className="text-[#F5E8D0]/40 text-xs mb-6">Confirmation sent to <span className="text-[#F5A800]/70">{email}</span></p>
                            <button onClick={resetForm} className="text-[#F5A800]/50 text-xs uppercase tracking-wider hover:text-[#F5A800] transition-colors" style={{ fontFamily: "var(--font-cinzel), serif" }}>Book another table</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

/* ================================================================
   Footer (English)
   ================================================================ */

function FooterEN() {
    return (
        <footer className="relative w-full z-10 mt-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C13A1A]/40 to-transparent" />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl mb-3 tracking-wider" style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#C13A1A" }}>MACONDO</h3>
                        <p className="text-sm opacity-50 mb-1 text-[#F5E8D0]">Tequila Bar</p>
                        <div className="w-12 h-px bg-[#C13A1A]/40 my-4 mx-auto md:mx-0" />
                        <p className="text-sm opacity-70 text-[#F5E8D0]">Veltusund 1</p>
                        <p className="text-sm opacity-70 text-[#F5E8D0]">101 Reykjavík</p>
                        <a href="https://maps.google.com/?q=Veltusund+1+Reykjavik" target="_blank" rel="noopener noreferrer"
                            className="inline-block mt-3 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#C13A1A] hover:text-[#C13A1A]">
                            Open map →
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F5A800" }}>Opening Hours</h4>
                        <div className="space-y-3 text-sm text-[#F5E8D0]">
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Sun — Thu</span>
                                <span className="opacity-80 font-mono">16 — 01</span>
                            </div>
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#F5A800]/20 to-transparent mx-auto" />
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Fri — Sat</span>
                                <span className="opacity-80 font-mono">16 — 03</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#F5A800" }}>Follow Us</h4>
                        <div className="flex justify-center md:justify-end gap-6">
                            <a href="https://instagram.com/macondo.rvk" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#C8891A] opacity-60 hover:opacity-100 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                                <span className="text-sm tracking-wider hidden md:inline">Instagram</span>
                            </a>
                            <a href="https://facebook.com/macondo.rvk" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#C13A1A] opacity-60 hover:opacity-100 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                <span className="text-sm tracking-wider hidden md:inline">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs opacity-20 text-[#F5E8D0]">© {new Date().getFullYear()} Macondo Tequila Bar</p>
                    <p className="text-xs opacity-15 italic" style={{ fontFamily: "var(--font-cinzel), serif", color: "#C8891A" }}>
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
        <div className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md bg-[#1A0A08]/80 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
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
                                className="px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full text-[#F5E8D0]/40 hover:text-[#F5E8D0]/80 transition-all duration-300"
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
                            className="px-3 md:px-5 py-1.5 text-xs md:text-sm uppercase tracking-[0.15em] rounded-full text-[#F5E8D0]/40 hover:text-[#F5E8D0]/80 transition-all duration-300"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            {item.label}
                        </button>
                    );
                })}
                {/* Language toggle */}
                <Link href="/"
                    className="ml-4 px-3 py-1.5 text-xs uppercase tracking-[0.15em] rounded-full border border-[#F5A800]/20 text-[#F5A800]/50 hover:text-[#F5A800] hover:border-[#F5A800]/50 transition-all"
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
        ? { border: "border-[#F5A800]/15 hover:border-[#F5A800]/50", title: "text-[#F5A800]", price: "text-[#E8C87A]", line: "from-[#F5A800]/60", hover: "hover:shadow-[0_0_25px_rgba(245,168,0,0.1)]" }
        : { border: "border-[#C8891A]/15 hover:border-[#C8891A]/50", title: "text-[#C8891A]", price: "text-[#C8891A]", line: "from-[#C8891A]/60", hover: "hover:shadow-[0_0_25px_rgba(200,137,26,0.1)]" };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className={`group relative overflow-hidden rounded-lg bg-[#7A3020]/80 border ${styles.border} transition-all duration-300 hover:scale-105 ${styles.hover}`}>
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
                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E8D0]">{drink.description}</p>
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3D181015_0%,_transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F5A80006_0%,_transparent_40%)]" />
                </div>
                <div className="z-10 text-center max-w-4xl px-6">
                    <motion.div className="min-h-32 mb-16 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <NeonSign />
                    </motion.div>
                    <motion.div className="h-24 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-sm md:text-base font-light italic leading-relaxed opacity-50" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#C8891A' }}>
                            &ldquo;The world was so recent that many things lacked names.&rdquo;
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-12 py-4 rounded-full text-lg font-bold tracking-[0.2em] transition-all duration-300 bg-transparent text-[#F5A800] border border-[#E8C87A] shadow-[0_0_20px_rgba(245,168,0,0.15)] hover:bg-[#F5A800]/10 hover:shadow-[0_0_30px_rgba(245,168,0,0.25)] hover:border-[#F5A800]"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            ENTER MACONDO
                        </motion.button>
                    </motion.div>
                </div>
            </main>

            {/* DIVIDER */}
            <div className="relative w-full h-32 overflow-hidden z-10">
                <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z" fill="#1A0A08" fillOpacity="0.3" />
                    <path d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z" fill="#1A0A08" fillOpacity="0.5" />
                </svg>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div className="text-center py-16 px-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="text-lg md:text-xl font-light leading-relaxed opacity-60" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F5E8D0' }}>
                        Every drink in Macondo tells a story —<br />
                        of gold and solitude, rain and butterflies.
                    </p>
                </motion.div>

                {/* COCKTAILS */}
                <div id="cocktails" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-[#F5A800] drop-shadow-[0_0_12px_rgba(245,168,0,0.6)]"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive" }}>REMEDIOS</h2>
                        <p className="text-xs opacity-40 uppercase tracking-widest mt-2 text-[#F5E8D0]">Cocktails</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COCKTAILS.map((drink, i) => <DrinkCard key={i} drink={drink} color="yellow" />)}
                    </div>
                </div>

                {/* SHOTS */}
                <div id="shots" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-[#C8891A] drop-shadow-[0_0_12px_rgba(200,137,26,0.6)]"
                            style={{ fontFamily: "var(--font-macondo-gf), cursive" }}>LA ALQUIMIA</h2>
                        <p className="text-xs opacity-40 uppercase tracking-widest mt-2 text-[#F5E8D0]">Shots</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {SHOTS.map((drink, i) => <DrinkCard key={i} drink={drink} color="pink" />)}
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="relative w-full h-24 overflow-hidden my-8">
                    <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
                        <path d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z" fill="#1A0A08" fillOpacity="0.2" />
                    </svg>
                </div>

                <BookingFormEN />
                <FooterEN />
            </div>
        </>
    );
}
