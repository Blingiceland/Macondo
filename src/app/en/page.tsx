"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import NeonSign from "@/components/effects/NeonSign";
import ParallaxBackground from "@/components/effects/ParallaxBackground";
import Image from "next/image";
import Link from "next/link";
import SalaBookingModal from "@/components/SalaBookingModal";

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
    { name: "YELLOW BUTTERFLY", description: "Padrecito tequila, Silvio Carta Limoncello, Adriatico Bianco Amaretto, Lemon, Egg white", price: "3490 ISK" },
    { name: "BANANA CO.", description: "Padrecito, X by Xiaman Mezcal, Guajillo Chili, Ancho Chili, Banana Skyr, Lemon", price: "3490 ISK" },
    { name: "RAIN FOR FOUR YEARS", description: "1800 Blanco, Plantaray Coconut Rum, Aloe Vera, Agave, Lime, Icelandic Glacial Sparkling Water", price: "3490 ISK" },
    { name: "THE FIFTH LEAF", description: "Los Siete Misterios Mezcal, Lime leaf, Green Chili, Celery, Lime", price: "3490 ISK" },
    { name: "THE PINK ECHO", description: "1800 Blanco, Strawberry, Agave, Lime, 3cent Lemonade", price: "3490 ISK" },
    { name: "EL JARDÍN DE MACONDO", description: "Aguardiente, Cucumber, Lime, Agave, Icelandic Glacial Sparkling Water", price: "3490 ISK" },
    { name: "MARGARITA", description: "1800 Blanco tequila, Cointreau, lime", price: "3390 ISK" },
    { name: "PALOMA", description: "1800 Reposado Tequila, 3 cent Grapefruit, Lime, Salt", price: "3390 ISK" },
    { name: "TOMMY'S MARGARITA", description: "Padrecito tequila, Lime, Agave, Salt", price: "3390 ISK" },
    { name: "TEQUILA SUNRISE", description: "1800 Reposado tequila, Orange juice, grenadine", price: "3390 ISK" },
    { name: "SPICY MARGARITA", description: "1800 Reposaso tequila, Chili, Lime, Agave, Tajin, Salt", price: "3490 ISK" },
];

const SHOTS: Drink[] = [
    { name: "1800 ANEJO", description: "Smoked Cinnamon & Orange", price: "2200 ISK" },
    { name: "CLASE AZUL REPOSADO", description: "Paired with Dark chocolate", price: "6500 ISK" },
    { name: "PADRE AZUL BLANCO", description: "Dried peach", price: "2950 ISK" },
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

    const dayNames = ["", "", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getWeeklyCalendar = useCallback((weeksAhead = 5, weekOffset = 0) => {
        const OPEN_DAYS = [2, 3, 4, 5, 6];
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        const dow = startDate.getDay();
        startDate.setDate(startDate.getDate() - (dow >= 2 ? dow - 2 : dow + 5) + weekOffset * 7);
        const weeks = [];
        for (let w = 0; w < weeksAhead; w++) {
            const week = [];
            for (const od of OPEN_DAYS) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + w * 7 + (od - 2));
                if (d < today) { week.push({ date: "", label: "", dayName: dayNames[od] }); }
                else {
                    week.push({
                        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
                        label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
                        dayName: dayNames[od],
                    });
                }
            }
            if (week.every((d: any) => d.date === "")) continue;
            weeks.push(week);
        }
        return weeks;
    }, []);

    const [weekOffset, setWeekOffset] = useState(0);
    const weeks = getWeeklyCalendar(6, weekOffset);
    const dates = weeks.flat().filter(d => d.date !== "");

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
                    <h2 className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>
                        BOOK A TABLE
                    </h2>
                    <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#c6a46c]/40 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                    {step === "DATE" && (
                        <motion.div key="date" {...fadeSlide}>
                            <p className="text-center text-[#f5f2ee]/60 text-sm mb-6 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Choose a date</p>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="text-[#c6a46c]/70 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel), serif" }}>Guests</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-[#c6a46c]/20 text-[#c6a46c]/60 hover:border-[#c6a46c]/50 hover:text-[#c6a46c] transition-all text-sm">−</button>
                                    <span className="w-8 text-center text-[#c6a46c] font-bold text-lg">{guests}</span>
                                    <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-8 h-8 rounded-full border border-[#c6a46c]/20 text-[#c6a46c]/60 hover:border-[#c6a46c]/50 hover:text-[#c6a46c] transition-all text-sm">+</button>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="grid grid-cols-5 gap-2 mb-1 relative">
                                    <button 
                                        onClick={() => setWeekOffset(Math.max(0, weekOffset - 4))}
                                        disabled={weekOffset === 0}
                                        className="absolute -left-16 top-0 bottom-0 flex items-center justify-center text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 disabled:opacity-0 transition-all"
                                        aria-label="Previous weeks"
                                    >
                                        &larr;
                                    </button>
                                    <button 
                                        onClick={() => setWeekOffset(weekOffset + 4)}
                                        className="absolute -right-16 top-0 bottom-0 flex items-center justify-center text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 transition-all"
                                        aria-label="Next weeks"
                                    >
                                        &rarr;
                                    </button>
                                    {["Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                        <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#f5f2ee]/25 py-1">{d}</div>
                                    ))}
                                </div>
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="grid grid-cols-5 gap-2">
                                        {week.map((d, di) => d.date === "" ? (
                                            <div key={di} className="py-3 rounded-lg border border-[#f5f2ee]/5 opacity-20" />
                                        ) : (
                                            <button key={d.date} onClick={() => { setSelectedDate(d.date); setStep("TIME"); }}
                                                className={`py-3 px-1 rounded-lg border text-center transition-all duration-200 hover:scale-105 ${selectedDate === d.date ? "border-[#c6a46c] bg-[#c6a46c]/10 text-[#c6a46c]" : "border-[#f5f2ee]/10 text-[#f5f2ee]/60 hover:border-[#c6a46c]/30 hover:text-[#f5f2ee]/90"
                                                    }`}>
                                                <div className="text-xs font-semibold">{d.label.split(" ")[0]}</div>
                                                <div className="text-[10px] opacity-60 mt-1">{d.label.split(" ")[1]}</div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === "TIME" && (
                        <motion.div key="time" {...fadeSlide}>
                            <button onClick={() => setStep("DATE")} className="text-[#c6a46c]/50 text-xs uppercase tracking-wider hover:text-[#c6a46c] transition-colors mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>← Back</button>
                            <p className="text-center text-[#f5f2ee]/60 text-sm mb-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Choose a time</p>
                            <p className="text-center text-[#f5f2ee]/30 text-xs mb-6">{dates.find(d => d.date === selectedDate)?.label} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-6 h-6 border-2 border-[#c6a46c]/20 border-t-[#c6a46c] rounded-full animate-spin" />
                                    <p className="text-[#f5f2ee]/40 text-xs mt-3">Checking availability...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {slots.map(s => (
                                        <button key={s.slot} disabled={!s.available} onClick={() => { setSelectedTime(s.slot); setStep("DETAILS"); }}
                                            className={`py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${!s.available ? "border-[#f5f2ee]/5 text-[#f5f2ee]/15 cursor-not-allowed line-through"
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
                            <button onClick={() => setStep("TIME")} className="text-[#c6a46c]/50 text-xs uppercase tracking-wider hover:text-[#c6a46c] transition-colors mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>← Back</button>
                            <p className="text-center text-[#f5f2ee]/60 text-sm mb-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>Your details</p>
                            <p className="text-center text-[#f5f2ee]/30 text-xs mb-8">{dates.find(d => d.date === selectedDate)?.label} · {selectedTime} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#c6a46c]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                                        className="w-full bg-transparent border-b border-[#f5f2ee]/15 py-3 text-[#f5f2ee] placeholder-[#f5f2ee]/20 focus:outline-none focus:border-[#c6a46c]/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#c6a46c]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                                        className="w-full bg-transparent border-b border-[#f5f2ee]/15 py-3 text-[#f5f2ee] placeholder-[#f5f2ee]/20 focus:outline-none focus:border-[#c6a46c]/50 transition-colors" />
                                </div>
                                {error && <p className="text-[#E74C3C] text-sm text-center">{error}</p>}
                                <button type="submit" disabled={loading}
                                    className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent text-[#c6a46c] border border-[#c6a46c] shadow-[0_0_15px_rgba(245,168,0,0.1)] hover:bg-[#c6a46c]/10 hover:shadow-[0_0_25px_rgba(245,168,0,0.2)] disabled:opacity-30"
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
                            <div className="bg-[#f5f2ee]/5 rounded-xl p-6 mb-8 space-y-3 text-left border border-[#f5f2ee]/10">
                                <div className="flex justify-between"><span className="text-[#f5f2ee]/40 text-xs uppercase tracking-wider">Name</span><span className="text-[#f5f2ee] text-sm">{name}</span></div>
                                <div className="flex justify-between"><span className="text-[#f5f2ee]/40 text-xs uppercase tracking-wider">Date</span><span className="text-[#f5f2ee] text-sm">{dates.find(d => d.date === selectedDate)?.label}</span></div>
                                <div className="flex justify-between"><span className="text-[#f5f2ee]/40 text-xs uppercase tracking-wider">Time</span><span className="text-[#f5f2ee] text-sm">{selectedTime}</span></div>
                                <div className="flex justify-between"><span className="text-[#f5f2ee]/40 text-xs uppercase tracking-wider">Guests</span><span className="text-[#f5f2ee] text-sm">{guests}</span></div>
                                {confirmationId && <div className="pt-3 border-t border-[#f5f2ee]/10"><span className="text-[#f5f2ee]/30 text-[10px] uppercase tracking-wider">Ref: {confirmationId.slice(0, 8)}</span></div>}
                            </div>
                            <p className="text-[#f5f2ee]/40 text-xs mb-6">Confirmation sent to <span className="text-[#c6a46c]/70">{email}</span></p>
                            <button onClick={resetForm} className="text-[#c6a46c]/50 text-xs uppercase tracking-wider hover:text-[#c6a46c] transition-colors" style={{ fontFamily: "var(--font-cinzel), serif" }}>Book another table</button>
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
                        <p className="text-sm opacity-50 mb-1 text-[#f5f2ee]">Tequila Bar</p>
                        <div className="w-12 h-px bg-[#C13A1A]/40 my-4 mx-auto md:mx-0" />
                        <p className="text-sm opacity-70 text-[#f5f2ee]">Veltusund 1</p>
                        <p className="text-sm opacity-70 text-[#f5f2ee]">101 Reykjavík</p>
                        <a href="https://maps.google.com/?q=Veltusund+1+Reykjavik" target="_blank" rel="noopener noreferrer"
                            className="inline-block mt-3 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#C13A1A] hover:text-[#C13A1A]">
                            Open map →
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>Opening Hours</h4>
                        <div className="space-y-3 text-sm text-[#f5f2ee]">
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Sun — Thu</span>
                                <span className="opacity-80 font-mono">16 — 01</span>
                            </div>
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c6a46c]/20 to-transparent mx-auto" />
                            <div className="flex justify-between max-w-[200px] mx-auto">
                                <span className="opacity-50">Fri — Sat</span>
                                <span className="opacity-80 font-mono">16 — 03</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>Follow Us</h4>
                        <div className="flex justify-center md:justify-end gap-6">
                            <a href="https://instagram.com/macondo.rvk" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#c6a46c] opacity-60 hover:opacity-100 transition-all">
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
                    <p className="text-xs opacity-20 text-[#f5f2ee]">© {new Date().getFullYear()} Macondo Tequila Bar</p>
                    <p className="text-xs opacity-15 italic" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>
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
    const [salaOpen, setSalaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinkClass = "text-[15px] uppercase tracking-[0.16em] font-medium text-[#c6a46c]/[0.65] hover:text-[#c6a46c] transition-colors relative group";
    const navLinkStyle = { fontFamily: "var(--font-cinzel), serif" };

    return (
        <>
            <SalaBookingModal open={salaOpen} onClose={() => setSalaOpen(false)} lang="en" />

            <header
                className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md bg-[#0f0a08]/90 border-b border-white/[0.04] shadow-sm"
                style={{ height: "96px" }}
            >
                {/* Desktop: 3-zone grid */}
                <div
                    className="hidden md:grid h-full max-w-[1400px] mx-auto items-center"
                    style={{ gridTemplateColumns: "220px 1fr auto", padding: "0 72px" }}
                >
                    {/* LEFT: Logo */}
                    <a href="/en" className="flex-shrink-0 group">
                        <Image src="/macondo-logo.png" alt="Macondo" width={180} height={108}
                            className="h-[46px] w-auto opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </a>

                    {/* CENTER: Nav links */}
                    <nav className="flex items-center justify-center gap-[42px]">
                        <button
                            onClick={() => document.getElementById("cocktails")?.scrollIntoView({ behavior: "smooth" })}
                            className={navLinkClass} style={navLinkStyle}
                        >
                            Drinks Menu
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c]/60 transition-all duration-300 group-hover:w-full" />
                        </button>
                        <button
                            onClick={() => setSalaOpen(true)}
                            className={navLinkClass} style={navLinkStyle}
                        >
                            Venue Booking
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c]/60 transition-all duration-300 group-hover:w-full" />
                        </button>
                        <Link href="/karaoke" className={navLinkClass} style={navLinkStyle}>
                            Karaoke
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c6a46c]/60 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </nav>

                    {/* RIGHT: CTA + Language + Pablo badge */}
                    <div className="flex items-center gap-7">
                        <button
                            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                            className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#c6a46c]/80 border border-[#c6a46c]/[0.25] hover:bg-[#c6a46c]/90 hover:text-[#0f0a08] transition-all duration-300 px-5 py-2"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Book Table
                        </button>

                        <Link href="/"
                            className="text-[13px] uppercase tracking-widest text-[#f5f2ee]/50 hover:text-[#c6a46c] transition-colors flex items-center gap-1"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            IS <span className="text-[10px] leading-none opacity-80">🇮🇸</span>
                        </Link>

                        {/* Pablo Discobar Badge — far right */}
                        <a
                            href="https://pablodiscobar.is"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.14em] font-medium text-[#d84acb]/70 rounded-full px-3.5 py-[7px] transition-all duration-300 hover:text-[#d84acb] hover:border-[#d84acb]/[0.3] hover:bg-[#d84acb]/[0.07]"
                            style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                background: "rgba(216, 74, 203, 0.03)",
                                border: "1px solid rgba(216, 74, 203, 0.14)",
                            }}
                        >
                            Pablo Discobar <span className="text-[10px] ml-0.5 opacity-70">✦</span>
                        </a>
                    </div>
                </div>

                {/* Mobile: logo + CTA + hamburger */}
                <div className="flex md:hidden h-full items-center justify-between px-5">
                    <a href="/en" className="flex-shrink-0">
                        <Image src="/macondo-logo.png" alt="Macondo" width={140} height={84}
                            className="h-10 w-auto opacity-90" />
                    </a>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                            className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#f5f2ee] border border-[#c6a46c]/[0.55] px-5 py-2 hover:bg-[#c6a46c] hover:text-[#0f0a08] transition-all duration-300"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Book Table
                        </button>
                        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
                            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px]">
                            <span className={`block w-5 h-px bg-[#f5f2ee]/70 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                            <span className={`block w-5 h-px bg-[#f5f2ee]/70 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu-en"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[85] bg-[#0f0a08]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
                        style={{ paddingTop: "96px" }}
                    >
                        {[
                            { label: "Drinks Menu", action: () => { setMobileOpen(false); document.getElementById("cocktails")?.scrollIntoView({ behavior: "smooth" }); } },
                            { label: "Table Booking", action: () => { setMobileOpen(false); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); } },
                            { label: "Venue Booking", action: () => { setMobileOpen(false); setSalaOpen(true); } },
                            { label: "Karaoke", action: () => { setMobileOpen(false); window.location.href = "/karaoke"; } },
                        ].map(item => (
                            <button key={item.label} onClick={item.action}
                                className="text-[18px] uppercase tracking-[0.18em] font-medium text-[#f5f2ee]/80 hover:text-[#c6a46c] transition-colors"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                {item.label}
                            </button>
                        ))}
                        <div className="w-12 h-px bg-[#c6a46c]/20 my-2" />
                        <a href="https://pablodiscobar.is" target="_blank" rel="noopener noreferrer"
                            className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#d84acb] rounded-full px-4 py-2 transition-all"
                            style={{ fontFamily: "var(--font-inter), sans-serif", background: "rgba(216,74,203,0.06)", border: "1px solid rgba(216,74,203,0.22)" }}>
                            Pablo Discobar <span className="text-[10px] opacity-70">✦</span>
                        </a>
                        <Link href="/" onClick={() => setMobileOpen(false)}
                            className="text-[13px] uppercase tracking-widest text-[#f5f2ee]/40 hover:text-[#c6a46c] transition-colors flex items-center gap-1 mt-2"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                            IS <span className="text-[10px] leading-none opacity-80">🇮🇸</span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ================================================================
   DRINK CARD
   ================================================================ */

function DrinkCard({ drink, color }: { drink: Drink; color: "yellow" | "pink" }) {
    const styles = { border: "border-[#c6a46c]/20 hover:border-[#c6a46c]/50", title: "text-[#c6a46c]", price: "text-[#c6a46c]", line: "from-[#c6a46c]/40" };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className={`group relative overflow-hidden rounded-lg bg-[#0f0a08]/50 border ${styles.border} transition-all duration-300 h-full`}>
            {drink.image && (
                <div className="relative w-full aspect-square overflow-hidden">
                    <Image src={drink.image} alt={drink.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                </div>
            )}
            <div className="p-4">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className={`text-sm font-bold tracking-wider ${styles.title}`}>{drink.name}</h3>
                    <span className={`text-xs opacity-80 whitespace-nowrap ml-2 ${styles.price} font-mono`}>{drink.price}</span>
                </div>
                <div className={`h-px w-full my-2 bg-gradient-to-r ${styles.line} to-transparent`} />
                <p className="text-xs opacity-70 font-light tracking-wide text-[#f5f2ee]">{drink.description}</p>
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
            <NavEN />

            {/* HERO */}
            <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(198,164,108,0.055), transparent 38%)' }} />

                <div className="z-10 text-center max-w-4xl px-6">
                    <motion.div className="min-h-32 mb-16 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <NeonSign />
                    </motion.div>
                </div>
            </main>

            {/* DIVIDER */}
            <div className="relative w-full h-32 overflow-hidden z-10">
                <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z" fill="#0f0a08" fillOpacity="0.4" />
                    <path d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z" fill="#0f0a08" fillOpacity="0.6" />
                </svg>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div className="text-center py-16 px-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="text-lg md:text-xl font-light leading-relaxed opacity-60" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#f5f2ee' }}>
                        Every drink in Macondo tells a story —<br />
                        of gold and solitude, rain and butterflies.
                    </p>
                </motion.div>

                {/* COCKTAILS */}
                <div id="cocktails" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-[#c6a46c]"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>REMEDIOS</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest mt-2 text-[#f5f2ee]">Cocktails</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COCKTAILS.map((drink, i) => <DrinkCard key={i} drink={drink} color="yellow" />)}
                    </div>
                </div>

                {/* SHOTS */}
                <div id="shots" className="py-10 px-6 w-full max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-[#c6a46c]"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>RITUALS</h2>
                        <p className="text-xs opacity-50 uppercase tracking-widest mt-2 text-[#f5f2ee]">Shots</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {SHOTS.map((drink, i) => <DrinkCard key={i} drink={drink} color="pink" />)}
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="relative w-full h-24 overflow-hidden my-8">
                    <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
                        <path d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z" fill="#0f0a08" fillOpacity="0.4" />
                    </svg>
                </div>

                <BookingFormEN />
                <FooterEN />
            </div>
        </>
    );
}
