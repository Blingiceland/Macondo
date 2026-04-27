"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "DATE" | "DETAILS" | "CONFIRMED";

const CLOSED_DAYS = [1, 2]; // 1 = Mánudagur, 2 = Þriðjudagur

function getNext30Days(): { date: string; label: string; dayName: string }[] {
    const days: { date: string; label: string; dayName: string }[] = [];
    const dayNames = ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"];
    const monthNames = ["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"];
    for (let i = 0; i < 60; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        if (CLOSED_DAYS.includes(d.getDay())) continue; // sleppa lokuðum dögum
        if (days.length >= 30) break;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        days.push({
            date: `${yyyy}-${mm}-${dd}`,
            label: `${d.getDate()}. ${monthNames[d.getMonth()]}`,
            dayName: dayNames[d.getDay()],
        });
    }
    return days;
}

export default function BookingForm() {
    const [step, setStep] = useState<Step>("DATE");
    const [selectedDate, setSelectedDate] = useState("");
    const [guests, setGuests] = useState(2);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationId, setConfirmationId] = useState("");
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);
    const [checkingAvail, setCheckingAvail] = useState(false);

    const dates = getNext30Days();

    const fetchAvailability = useCallback(async (date: string) => {
        setCheckingAvail(true);
        try {
            const res = await fetch(`/api/bookings/available?date=${date}`);
            const data = await res.json();
            setAvailableSeats(data.available ?? null);
        } catch {
            setAvailableSeats(null);
        }
        setCheckingAvail(false);
    }, []);

    useEffect(() => {
        if (selectedDate) fetchAvailability(selectedDate);
    }, [selectedDate, fetchAvailability]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setError("");
        setStep("DETAILS");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) return;

        if (availableSeats !== null && guests > availableSeats) {
            setError(`Aðeins ${availableSeats} sæti laus á þessum degi`);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: selectedDate, guests, name, email, phone, notes }),
            });
            const data = await res.json();
            if (data.success) {
                setConfirmationId(data.id);
                setStep("CONFIRMED");
            } else {
                setError(data.error || "Villa kom upp");
            }
        } catch {
            setError("Villa kom upp við bókun");
        }
        setLoading(false);
    };

    const resetForm = () => {
        setStep("DATE");
        setSelectedDate("");
        setGuests(2);
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
        setError("");
        setConfirmationId("");
        setAvailableSeats(null);
    };

    const fadeSlide = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4 },
    };

    const selectedDateLabel = dates.find(d => d.date === selectedDate)?.label ?? "";

    return (
        <section id="reservation-form" className="relative py-32 px-6">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3"
                        style={{ fontFamily: "var(--font-cinzel), serif", color: "#F5A800" }}
                    >
                        BÓKA BORÐ
                    </h2>
                    <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#F5A800]/40 to-transparent mb-4" />
                    <p className="text-[#F5E8D0]/50 text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                        kl. 17:00 – 20:00 · Eitt sitting
                    </p>
                </div>

                <AnimatePresence mode="wait">

                    {/* ═══════════ STEP 1: DATE ═══════════ */}
                    {step === "DATE" && (
                        <motion.div key="date" {...fadeSlide}>
                            <p className="text-center text-[#F5E8D0]/60 text-sm mb-8 tracking-wider uppercase"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Veldu dag
                            </p>

                            {/* Guest counter */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="text-[#F5A800]/70 text-xs uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                    Gestir
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="w-8 h-8 rounded-full border border-[#F5A800]/30 text-[#F5A800]/70 hover:border-[#F5A800] hover:text-[#F5A800] transition-all text-lg leading-none"
                                    >−</button>
                                    <span className="w-10 text-center text-[#F5A800] font-bold text-xl">{guests}</span>
                                    <button
                                        onClick={() => setGuests(Math.min(60, guests + 1))}
                                        className="w-8 h-8 rounded-full border border-[#F5A800]/30 text-[#F5A800]/70 hover:border-[#F5A800] hover:text-[#F5A800] transition-all text-lg leading-none"
                                    >+</button>
                                </div>
                            </div>

                            {/* Date grid */}
                            <div className="grid grid-cols-7 gap-1.5 mb-6">
                                {dates.map((d) => (
                                    <button
                                        key={d.date}
                                        onClick={() => handleDateSelect(d.date)}
                                        className={`py-3 px-1 rounded-lg border text-center transition-all duration-200 hover:scale-105 ${selectedDate === d.date
                                            ? "border-[#F5A800] bg-[#F5A800]/10 text-[#F5A800]"
                                            : "border-[#F5E8D0]/10 text-[#F5E8D0]/60 hover:border-[#F5A800]/30 hover:text-[#F5E8D0]/90"
                                            }`}
                                    >
                                        <div className="text-[9px] uppercase tracking-wider opacity-60">{d.dayName}</div>
                                        <div className="text-xs font-semibold mt-1">{d.label}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════ STEP 2: DETAILS ═══════════ */}
                    {step === "DETAILS" && (
                        <motion.div key="details" {...fadeSlide}>
                            <button
                                onClick={() => { setStep("DATE"); setError(""); }}
                                className="text-[#F5A800]/50 text-xs uppercase tracking-wider hover:text-[#F5A800] transition-colors mb-6"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                ← Til baka
                            </button>

                            {/* Date + availability summary */}
                            <div className="text-center mb-8">
                                <p className="text-[#F5E8D0]/80 text-sm mb-1">{selectedDateLabel} · kl. 17:00–20:00</p>
                                {checkingAvail ? (
                                    <p className="text-[#F5E8D0]/30 text-xs">Sæki upplýsingar...</p>
                                ) : availableSeats !== null ? (
                                    <p className={`text-xs font-mono ${availableSeats === 0 ? "text-red-400" : availableSeats <= 10 ? "text-orange-400" : "text-[#F5A800]/70"}`}>
                                        {availableSeats === 0
                                            ? "Fullbókað þennan dag"
                                            : `${availableSeats} af 60 sætum laus`}
                                    </p>
                                ) : null}
                            </div>

                            {availableSeats === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-red-400 mb-4">Þessi dagur er fullbókaður.</p>
                                    <button onClick={() => setStep("DATE")}
                                        className="text-[#F5A800]/70 text-sm underline hover:text-[#F5A800] transition-colors">
                                        Velja annan dag
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Guest counter (repeated for convenience) */}
                                    <div className="flex items-center justify-between py-3 border-b border-[#F5E8D0]/10">
                                        <label className="text-xs uppercase tracking-widest text-[#F5A800]/70"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Gestir</label>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}
                                                className="w-7 h-7 rounded-full border border-[#F5A800]/30 text-[#F5A800]/70 hover:border-[#F5A800] hover:text-[#F5A800] transition-all text-base leading-none">−</button>
                                            <span className="w-8 text-center text-[#F5A800] font-bold text-lg">{guests}</span>
                                            <button type="button" onClick={() => setGuests(Math.min(60, guests + 1))}
                                                className="w-7 h-7 rounded-full border border-[#F5A800]/30 text-[#F5A800]/70 hover:border-[#F5A800] hover:text-[#F5A800] transition-all text-base leading-none">+</button>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#F5A800]/70"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Nafn</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                            placeholder="Nafnið þitt"
                                            className="w-full bg-transparent border-b border-[#F5E8D0]/15 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#F5A800]/70"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Símanúmer</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                                            placeholder="000-0000"
                                            className="w-full bg-transparent border-b border-[#F5E8D0]/15 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#F5A800]/70"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Netfang</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                            placeholder="netfang@þitt.is"
                                            className="w-full bg-transparent border-b border-[#F5E8D0]/15 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors" />
                                    </div>

                                    {/* Notes (optional) */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#F5A800]/40"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Athugasemd <span className="normal-case tracking-normal opacity-60">(valfrjálst)</span></label>
                                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                                            placeholder="Séróskir, afmæli o.s.frv."
                                            className="w-full bg-transparent border-b border-[#F5E8D0]/10 py-3 text-[#F5E8D0]/80 placeholder-[#F5E8D0]/15 focus:outline-none focus:border-[#F5A800]/30 transition-colors text-sm" />
                                    </div>

                                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent text-[#F5A800] border border-[#E8C87A] shadow-[0_0_15px_rgba(245,168,0,0.1)] hover:bg-[#F5A800]/10 hover:shadow-[0_0_25px_rgba(245,168,0,0.2)] disabled:opacity-30"
                                        style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                        {loading ? "Bóka..." : "STAÐFESTA BÓKUN"}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* ═══════════ STEP 3: CONFIRMED ═══════════ */}
                    {step === "CONFIRMED" && (
                        <motion.div key="confirmed" {...fadeSlide} className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#C13A1A] flex items-center justify-center"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C13A1A" strokeWidth="2.5">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.div>

                            <h3 className="text-xl font-bold tracking-[0.15em] mb-2 text-[#C13A1A]"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                BÓKUN STAÐFEST
                            </h3>

                            <div className="bg-[#F5E8D0]/5 rounded-xl p-6 mb-8 space-y-3 text-left border border-[#F5E8D0]/10">
                                <div className="flex justify-between">
                                    <span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Nafn</span>
                                    <span className="text-[#F5E8D0] text-sm">{name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Dagsetning</span>
                                    <span className="text-[#F5E8D0] text-sm">{selectedDateLabel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Tími</span>
                                    <span className="text-[#F5A800] text-sm">kl. 17:00 – 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E8D0]/40 text-xs uppercase tracking-wider">Gestir</span>
                                    <span className="text-[#F5E8D0] text-sm">{guests}</span>
                                </div>
                                {confirmationId && (
                                    <div className="pt-3 border-t border-[#F5E8D0]/10">
                                        <span className="text-[#F5E8D0]/30 text-[10px] uppercase tracking-wider">
                                            Bókunarnúmer: {confirmationId.slice(0, 8)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[#F5E8D0]/40 text-xs mb-6">
                                Staðfesting send á <span className="text-[#F5A800]/70">{email}</span>
                            </p>

                            <button onClick={resetForm}
                                className="text-[#F5A800]/50 text-xs uppercase tracking-wider hover:text-[#F5A800] transition-colors"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Bóka annað borð
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </section>
    );
}
