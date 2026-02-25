"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================================
   TYPES
   ================================================================ */

type Step = "DATE" | "TIME" | "DETAILS" | "CONFIRMED";

interface SlotInfo {
    slot: string;
    available: boolean;
    tablesLeft: number;
}

/* ================================================================
   HELPERS
   ================================================================ */

function getNext30Days(): { date: string; label: string; dayName: string }[] {
    const days: { date: string; label: string; dayName: string }[] = [];
    const dayNames = ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"];
    const monthNames = ["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"];

    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
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

/* ================================================================
   COMPONENT
   ================================================================ */

export default function BookingForm() {
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

    const dates = getNext30Days();

    // Fetch availability when date or guest count changes
    const fetchSlots = useCallback(async () => {
        if (!selectedDate) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/bookings/available?date=${selectedDate}&guests=${guests}`);
            const data = await res.json();
            if (data.slots) {
                setSlots(data.slots);
            }
        } catch {
            setError("Gat ekki sótt lausar tímasetningar");
        }
        setLoading(false);
    }, [selectedDate, guests]);

    useEffect(() => {
        if (step === "TIME" && selectedDate) {
            fetchSlots();
        }
    }, [step, selectedDate, guests, fetchSlots]);

    // Handle booking submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: selectedDate,
                    timeSlot: selectedTime,
                    guests,
                    name,
                    email,
                }),
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

    // Reset form
    const resetForm = () => {
        setStep("DATE");
        setSelectedDate("");
        setSelectedTime("");
        setGuests(2);
        setName("");
        setEmail("");
        setError("");
        setConfirmationId("");
    };

    /* ---- Animation variants ---- */
    const fadeSlide = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4 },
    };

    return (
        <section id="reservation-form" className="relative py-32 px-6">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3"
                        style={{ fontFamily: "var(--font-cinzel), serif", color: "#F4D03F" }}
                    >
                        BÓKA BORÐ
                    </h2>
                    <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#F4D03F]/40 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                    {/* =============== STEP 1: DATE =============== */}
                    {step === "DATE" && (
                        <motion.div key="date" {...fadeSlide}>
                            <p className="text-center text-[#F5E6CC]/60 text-sm mb-6 tracking-wider uppercase"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Veldu dag
                            </p>

                            {/* Guest count */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="text-[#F4D03F]/70 text-xs uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                    Gestir
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="w-8 h-8 rounded-full border border-[#F4D03F]/20 text-[#F4D03F]/60 hover:border-[#F4D03F]/50 hover:text-[#F4D03F] transition-all text-sm"
                                    >−</button>
                                    <span className="w-8 text-center text-[#F4D03F] font-bold text-lg">{guests}</span>
                                    <button
                                        onClick={() => setGuests(Math.min(20, guests + 1))}
                                        className="w-8 h-8 rounded-full border border-[#F4D03F]/20 text-[#F4D03F]/60 hover:border-[#F4D03F]/50 hover:text-[#F4D03F] transition-all text-sm"
                                    >+</button>
                                </div>
                            </div>

                            {/* Date grid */}
                            <div className="grid grid-cols-7 gap-2 mb-6">
                                {dates.map((d) => (
                                    <button
                                        key={d.date}
                                        onClick={() => {
                                            setSelectedDate(d.date);
                                            setStep("TIME");
                                        }}
                                        className={`py-3 px-1 rounded-lg border text-center transition-all duration-200 hover:scale-105 ${selectedDate === d.date
                                            ? "border-[#F4D03F] bg-[#F4D03F]/10 text-[#F4D03F]"
                                            : "border-[#F5E6CC]/10 text-[#F5E6CC]/60 hover:border-[#F4D03F]/30 hover:text-[#F5E6CC]/90"
                                            }`}
                                    >
                                        <div className="text-[10px] uppercase tracking-wider opacity-60">{d.dayName}</div>
                                        <div className="text-xs font-semibold mt-1">{d.label}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* =============== STEP 2: TIME =============== */}
                    {step === "TIME" && (
                        <motion.div key="time" {...fadeSlide}>
                            <button
                                onClick={() => setStep("DATE")}
                                className="text-[#F4D03F]/50 text-xs uppercase tracking-wider hover:text-[#F4D03F] transition-colors mb-4"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                ← Til baka
                            </button>

                            <p className="text-center text-[#F5E6CC]/60 text-sm mb-2 tracking-wider uppercase"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Veldu tíma
                            </p>
                            <p className="text-center text-[#F5E6CC]/30 text-xs mb-6">
                                {dates.find(d => d.date === selectedDate)?.label} · {guests} {guests === 1 ? "gestur" : "gestir"}
                            </p>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-6 h-6 border-2 border-[#F4D03F]/20 border-t-[#F4D03F] rounded-full animate-spin" />
                                    <p className="text-[#F5E6CC]/40 text-xs mt-3">Sæki lausar tímasetningar...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {slots.map((s) => (
                                        <button
                                            key={s.slot}
                                            disabled={!s.available}
                                            onClick={() => {
                                                setSelectedTime(s.slot);
                                                setStep("DETAILS");
                                            }}
                                            className={`py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${!s.available
                                                ? "border-[#F5E6CC]/5 text-[#F5E6CC]/15 cursor-not-allowed line-through"
                                                : s.tablesLeft <= 2
                                                    ? "border-[#E74C3C]/30 text-[#E74C3C]/80 hover:border-[#E74C3C]/60 hover:bg-[#E74C3C]/5"
                                                    : "border-[#2ECC71]/20 text-[#2ECC71]/80 hover:border-[#2ECC71]/50 hover:bg-[#2ECC71]/5"
                                                }`}
                                        >
                                            {s.slot}
                                            {s.available && s.tablesLeft <= 2 && (
                                                <div className="text-[9px] opacity-60 mt-0.5">Fá borð</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {error && (
                                <p className="text-[#E74C3C] text-sm text-center">{error}</p>
                            )}
                        </motion.div>
                    )}

                    {/* =============== STEP 3: DETAILS =============== */}
                    {step === "DETAILS" && (
                        <motion.div key="details" {...fadeSlide}>
                            <button
                                onClick={() => setStep("TIME")}
                                className="text-[#F4D03F]/50 text-xs uppercase tracking-wider hover:text-[#F4D03F] transition-colors mb-4"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                ← Til baka
                            </button>

                            <p className="text-center text-[#F5E6CC]/60 text-sm mb-2 tracking-wider uppercase"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Upplýsingar
                            </p>
                            <p className="text-center text-[#F5E6CC]/30 text-xs mb-8">
                                {dates.find(d => d.date === selectedDate)?.label} · kl. {selectedTime} · {guests} {guests === 1 ? "gestur" : "gestir"}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]"
                                        style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                        Nafn
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Nafnið þitt"
                                        className="w-full bg-transparent border-b border-[#F5E6CC]/15 py-3 text-[#F5E6CC] placeholder-[#F5E6CC]/20 focus:outline-none focus:border-[#F4D03F]/50 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]"
                                        style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                        Netfang
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="netfangid@thitt.is"
                                        className="w-full bg-transparent border-b border-[#F5E6CC]/15 py-3 text-[#F5E6CC] placeholder-[#F5E6CC]/20 focus:outline-none focus:border-[#F4D03F]/50 transition-colors"
                                    />
                                </div>

                                {error && (
                                    <p className="text-[#E74C3C] text-sm text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent text-[#F4D03F] border border-[#D4A017] shadow-[0_0_15px_rgba(244,208,63,0.1)] hover:bg-[#F4D03F]/10 hover:shadow-[0_0_25px_rgba(244,208,63,0.2)] disabled:opacity-30"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                                >
                                    {loading ? "Bóka..." : "STAÐFESTA BÓKUN"}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* =============== STEP 4: CONFIRMED =============== */}
                    {step === "CONFIRMED" && (
                        <motion.div key="confirmed" {...fadeSlide} className="text-center">
                            {/* Checkmark */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#2ECC71] flex items-center justify-center"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2ECC71" strokeWidth="2.5">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.div>

                            <h3 className="text-xl font-bold tracking-[0.15em] mb-2 text-[#2ECC71]"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                BÓKUN STAÐFEST
                            </h3>

                            <div className="bg-[#F5E6CC]/5 rounded-xl p-6 mb-8 space-y-3 text-left border border-[#F5E6CC]/10">
                                <div className="flex justify-between">
                                    <span className="text-[#F5E6CC]/40 text-xs uppercase tracking-wider">Nafn</span>
                                    <span className="text-[#F5E6CC] text-sm">{name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E6CC]/40 text-xs uppercase tracking-wider">Dagsetning</span>
                                    <span className="text-[#F5E6CC] text-sm">{dates.find(d => d.date === selectedDate)?.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E6CC]/40 text-xs uppercase tracking-wider">Tími</span>
                                    <span className="text-[#F5E6CC] text-sm">kl. {selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#F5E6CC]/40 text-xs uppercase tracking-wider">Gestir</span>
                                    <span className="text-[#F5E6CC] text-sm">{guests}</span>
                                </div>
                                {confirmationId && (
                                    <div className="pt-3 border-t border-[#F5E6CC]/10">
                                        <span className="text-[#F5E6CC]/30 text-[10px] uppercase tracking-wider">Bókunarnúmer: {confirmationId.slice(0, 8)}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[#F5E6CC]/40 text-xs mb-6">
                                Staðfesting hefur verið send á <span className="text-[#F4D03F]/70">{email}</span>
                            </p>

                            <button
                                onClick={resetForm}
                                className="text-[#F4D03F]/50 text-xs uppercase tracking-wider hover:text-[#F4D03F] transition-colors"
                                style={{ fontFamily: "var(--font-cinzel), serif" }}
                            >
                                Bóka annað borð
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
