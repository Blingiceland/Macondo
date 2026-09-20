"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import NeonSign from "@/components/effects/NeonSign";
import ParallaxBackground from "@/components/effects/ParallaxBackground";
import Link from "next/link";
import SalaBookingModal from "@/components/SalaBookingModal";
import CocktailMenu from "@/components/CocktailMenu";
import Image from "next/image";
import { BUSINESS, OPEN_DAYS, DAY_ABBR, hoursRows } from "@/lib/business";


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

    const getWeeklyCalendar = useCallback((weeksAhead = 5, weekOffset = 0) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        const dow = startDate.getDay();
        startDate.setDate(startDate.getDate() - (dow >= 2 ? dow - 2 : dow + 5) + weekOffset * 7);
        const weeks = [];
        for (let w = 0; w < weeksAhead; w++) {
            const week = [];
            for (const od of OPEN_DAYS) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + w * 7 + ((od - 2 + 7) % 7));
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
                                <div className="grid gap-2 mb-1 relative" style={{ gridTemplateColumns: `repeat(${OPEN_DAYS.length}, minmax(0, 1fr))` }}>
                                    <button 
                                        onClick={() => setWeekOffset(Math.max(0, weekOffset - 4))}
                                        disabled={weekOffset === 0}
                                        className="absolute -left-6 md:-left-16 w-6 md:w-16 top-0 bottom-0 flex items-center justify-center text-2xl md:text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 disabled:opacity-0 transition-all"
                                        aria-label="Previous weeks"
                                    >
                                        &larr;
                                    </button>
                                    <button 
                                        onClick={() => setWeekOffset(weekOffset + 4)}
                                        className="absolute -right-6 md:-right-16 w-6 md:w-16 top-0 bottom-0 flex items-center justify-center text-2xl md:text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 transition-all"
                                        aria-label="Next weeks"
                                    >
                                        &rarr;
                                    </button>
                                    {OPEN_DAYS.map(d => (
                                        <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#f5f2ee]/25 py-1">{DAY_ABBR.en[d]}</div>
                                    ))}
                                </div>
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${OPEN_DAYS.length}, minmax(0, 1fr))` }}>
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
                                                    : "border-[#c6a46c]/20 text-[#c6a46c]/80 hover:border-[#c6a46c]/50 hover:bg-[#c6a46c]/5"
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
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#c6a46c] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c6a46c" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </motion.div>
                            <h3 className="text-xl font-bold tracking-[0.15em] mb-2 text-[#c6a46c]" style={{ fontFamily: "var(--font-cinzel), serif" }}>BOOKING CONFIRMED</h3>
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
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c6a46c]/40 to-transparent" />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl mb-3 tracking-wider" style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#c6a46c" }}>MACONDO</h3>
                        <p className="text-sm opacity-50 mb-1 text-[#f5f2ee]">Tequila Bar</p>
                        <div className="w-12 h-px bg-[#c6a46c]/40 my-4 mx-auto md:mx-0" />
                        <address className="not-italic">
                            <p className="text-sm opacity-70 text-[#f5f2ee]">{BUSINESS.address.street}</p>
                            <p className="text-sm opacity-70 text-[#f5f2ee]">{BUSINESS.address.postalCode} {BUSINESS.address.city}</p>
                            <a href={`mailto:${BUSINESS.publicEmail}`} className="text-sm opacity-50 hover:opacity-80 transition-opacity text-[#f5f2ee] block mt-1">
                                {BUSINESS.publicEmail}
                            </a>
                        </address>
                        <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-block mt-3 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#c6a46c] hover:text-[#c6a46c]">
                            Open map →
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>Opening Hours</h4>
                        <div className="space-y-3 text-sm text-[#f5f2ee]">
                            {hoursRows("en").map((row, i) => (
                                <div key={row.days}>
                                    {i > 0 && <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c6a46c]/20 to-transparent mx-auto mb-3" />}
                                    <div className="flex justify-between max-w-[200px] mx-auto">
                                        <span className="opacity-50">{row.days}</span>
                                        {row.hours
                                            ? <span className="opacity-80 font-mono">{row.hours}</span>
                                            : <span className="opacity-40 font-mono text-xs">Closed</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-sm uppercase tracking-[0.3em] mb-6 opacity-70" style={{ fontFamily: "var(--font-cinzel), serif", color: "#c6a46c" }}>Follow Us</h4>
                        <div className="flex justify-center md:justify-end gap-6">
                            <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#c6a46c] opacity-60 hover:opacity-100 transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                                <span className="text-sm tracking-wider hidden md:inline">Instagram</span>
                            </a>
                            <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-[#c6a46c] opacity-60 hover:opacity-100 transition-all">
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

    const navLinkClass = "text-[15px] uppercase tracking-[0.16em] font-medium text-[#c6a46c]/70 hover:text-[#f5f2ee] transition-colors relative group";
    const navLinkStyle = { fontFamily: "var(--font-cinzel), serif" };

    return (
        <>
            <SalaBookingModal open={salaOpen} onClose={() => setSalaOpen(false)} lang="en" />

            <header
                className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md bg-[#140c09]/90 border-b border-white/[0.04] shadow-sm"
                style={{ height: "var(--nav-h)" }}
            >
                {/* Desktop: 3-zone grid */}
                <div
                    className="hidden md:grid h-full max-w-[1400px] mx-auto items-center"
                    style={{ gridTemplateColumns: "160px 1fr auto", padding: "0 48px" }}
                >
                    {/* LEFT: Logo */}
                    <a href="/en" className="flex-shrink-0 group">
                        <div
                            className="h-[68px] aspect-[5/3] opacity-90 group-hover:opacity-100 transition-opacity"
                            style={{ 
                                WebkitMaskImage: 'url(/macondo-logo.png)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'left center',
                                background: 'linear-gradient(180deg, #d7b97a, #a8894f)',
                                filter: 'drop-shadow(0 0 4px rgba(198, 164, 108, 0.2)) drop-shadow(0 0 12px rgba(198, 164, 108, 0.06))'
                            }}
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
                            className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#c6a46c] border border-[#c6a46c]/50 hover:bg-[#c6a46c]/90 hover:text-[#140c09] transition-all duration-300 px-5 py-2"
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
                            className="hidden lg:inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.14em] font-medium text-[#f5f2ee]/45 rounded-full px-3.5 py-[7px] transition-all duration-300 hover:text-[#f5f2ee]/85 hover:border-[#f5f2ee]/25"
                            style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                background: "transparent",
                                border: "1px solid rgba(245, 242, 238, 0.12)",
                            }}
                        >
                            Pablo Discobar <span className="text-[10px] ml-0.5 text-[#d84acb]/70">✦</span>
                        </a>
                    </div>
                </div>

                {/* Mobile: logo + CTA + hamburger */}
                <div className="flex md:hidden h-full items-center justify-between px-5">
                    <a href="/en" className="flex-shrink-0">
                        <div
                            className="h-11 aspect-[5/3] opacity-90"
                            style={{ 
                                WebkitMaskImage: 'url(/macondo-logo.png)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'left center',
                                background: 'linear-gradient(180deg, #d7b97a, #a8894f)',
                                filter: 'drop-shadow(0 0 4px rgba(198, 164, 108, 0.2)) drop-shadow(0 0 12px rgba(198, 164, 108, 0.06))'
                            }}
                        />
                    </a>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                            className="text-[13px] uppercase tracking-[0.16em] font-semibold text-[#c6a46c] border border-[#c6a46c]/50 px-5 py-2 hover:bg-[#c6a46c] hover:text-[#140c09] transition-all duration-300"
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
                         animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[85] bg-[#140c09]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
                        style={{ paddingTop: "var(--nav-h)" }}
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
                            className="text-[13px] uppercase tracking-[0.14em] font-semibold text-[#f5f2ee]/60 rounded-full px-4 py-2 transition-all"
                            style={{ fontFamily: "var(--font-inter), sans-serif", background: "rgba(245,242,238,0.04)", border: "1px solid rgba(245,242,238,0.14)" }}>
                            Pablo Discobar <span className="text-[10px] text-[#d84acb]/70">✦</span>
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
            <main className="min-h-[68svh] md:min-h-[72vh] flex flex-col items-center justify-center relative overflow-hidden pt-[var(--nav-h)] pb-16">
                {/* Staðarmynd með dökku yfirlagi sem rennur saman við bakgrunninn */}
                <div className="absolute inset-0 z-0" aria-hidden="true">
                  <Image
                    src="/images/hero-venue.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center hero-photo"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(20,12,9,0.80) 0%, rgba(20,12,9,0.64) 45%, rgba(20,12,9,0.88) 82%, #140c09 100%)" }}
                  />
                  {/* Dekkra svæði á bak við lógóið svo það lesist gegn barnum */}
                  <div className="absolute inset-0 hero-vignette" />
                </div>

        
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(198,164,108,0.055), transparent 38%)' }} />

                <div className="z-10 text-center max-w-4xl px-6">
                    {/* Visually hidden h1 for SEO/accessibility */}
                    <h1 className="sr-only">Macondo — Tequila &amp; Cocktail Bar in Reykjavík</h1>
                    <motion.div className="flex items-center justify-center" animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <NeonSign
                            ctaLabel="Book a table"
                            onCta={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                        />
                    </motion.div>
                </div>
            </main>

            {/* DIVIDER */}
            <div className="relative w-full h-12 overflow-hidden z-10">
                <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z" fill="#140c09" fillOpacity="0.4" />
                    <path d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z" fill="#140c09" fillOpacity="0.6" />
                </svg>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div className="text-center pt-6 pb-10 px-6 max-w-2xl mx-auto">
                    <p className="text-lg md:text-xl font-light leading-relaxed opacity-60" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#f5f2ee' }}>
                        Every drink in Macondo tells a story — <br className="hidden md:inline" />
                        of gold and solitude, rain and butterflies.
                    </p>
                </motion.div>

                <CocktailMenu lang="en" />

                {/* DIVIDER */}
                <div className="relative w-full h-24 overflow-hidden my-8">
                    <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
                        <path d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z" fill="#140c09" fillOpacity="0.4" />
                    </svg>
                </div>

                <BookingFormEN />
                <FooterEN />
            </div>
        </>
    );
}
