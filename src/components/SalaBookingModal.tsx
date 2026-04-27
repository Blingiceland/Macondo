"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLOSED_DAYS = [0, 1];
const OPEN_DAYS = [2, 3, 4, 5, 6];

interface DayInfo { date: string; label: string; dayName: string; }

function getWeeklyCalendar(weeksAhead = 6, weekOffset = 0): DayInfo[][] {
    const dayNames = ["", "", "Þri", "Mið", "Fim", "Fös", "Lau"];
    const monthNames = ["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    const dow = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dow >= 2 ? dow - 2 : dow + 5) + weekOffset * 7);
    const weeks: DayInfo[][] = [];
    for (let w = 0; w < weeksAhead; w++) {
        const week: DayInfo[] = [];
        for (const od of OPEN_DAYS) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + w * 7 + (od - 2));
            if (d < today) { week.push({ date: "", label: "", dayName: dayNames[od] }); }
            else {
                week.push({
                    date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
                    label: `${d.getDate()}. ${monthNames[d.getMonth()]}`,
                    dayName: dayNames[od],
                });
            }
        }
        if (week.every(d => d.date === "")) continue;
        weeks.push(week);
    }
    return weeks;
}

interface Props { open: boolean; onClose: () => void; lang?: "is" | "en"; }

export default function SalaBookingModal({ open, onClose, lang = "is" }: Props) {
    const [step, setStep] = useState<"DATE" | "DETAILS" | "CONFIRMED">("DATE");
    const [selectedDate, setSelectedDate] = useState("");
    const [guests, setGuests] = useState(20);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationId, setConfirmationId] = useState("");
    const [weekOffset, setWeekOffset] = useState(0);

    const weeks = getWeeklyCalendar(6, weekOffset);
    const dates = weeks.flat().filter(d => d.date !== "");

    const selectedDateLabel = dates.find(d => d.date === selectedDate)?.label ?? "";

    const T = lang === "en" ? {
        title: "Venue Booking",
        sub: "Macondo · 17:00 – 20:00",
        veldu: "Select Date",
        gestir: "Guests",
        next: "Continue",
        back: "← Back",
        confirm: "Confirm Booking",
        nameLabel: "Name",
        phoneLabel: "Phone",
        emailLabel: "Email",
        notesLabel: "Notes (optional)",
        notesPh: "Special requests, occasions, etc.",
        confirmedTitle: "Booking Confirmed!",
        confirmedText: "We will be in touch. Confirmation sent to your email.",
        ref: "Reference",
        close: "Close",
    } : {
        title: "Salabókun",
        sub: "Macondo · kl. 17:00 – 20:00",
        veldu: "Veldu dag",
        gestir: "Gestir",
        next: "Áfram",
        back: "← Til baka",
        confirm: "Staðfesta bókun",
        nameLabel: "Nafn",
        phoneLabel: "Símanúmer",
        emailLabel: "Netfang",
        notesLabel: "Athugasemdir (valfrjálst)",
        notesPh: "Séróskir, tilefni, o.s.frv.",
        confirmedTitle: "Bókun staðfest!",
        confirmedText: "Við höfum samband. Staðfesting send á netfangið þitt.",
        ref: "Tilvísun",
        close: "Loka",
    };

    // Lock body scroll when open
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const reset = useCallback(() => {
        setStep("DATE"); setSelectedDate(""); setGuests(20);
        setName(""); setEmail(""); setPhone(""); setNotes("");
        setError(""); setConfirmationId("");
    }, []);

    const handleClose = () => { reset(); onClose(); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: selectedDate, guests, name, email, phone,
                    notes: `[SALABÓKUN] ${notes}`.trim(),
                    bookingType: "sala",
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Villa kom upp"); }
            else { setConfirmationId(data.reservationId || "—"); setStep("CONFIRMED"); }
        } catch { setError("Tengifall mistókst"); }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="sala-overlay"
                    
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    style={{ background: "rgba(10,4,2,0.85)", backdropFilter: "blur(8px)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <motion.div
                        
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, #0f0a08 0%, #0e0605 100%)",
                            border: "1px solid rgba(198,164,108,0.15)",
                        }}
                    >
                        {/* Close button */}
                        <button onClick={handleClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-[#f5f2ee]/20 text-[#f5f2ee]/40 hover:text-[#f5f2ee] hover:border-[#f5f2ee]/40 transition-all text-lg leading-none">
                            ×
                        </button>

                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold tracking-[0.2em] text-[#c6a46c] uppercase mb-2"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.title}</h2>
                                <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#c6a46c]/40 to-transparent mb-3" />
                                <p className="text-[#f5f2ee]/40 text-xs tracking-widest uppercase"
                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.sub}</p>
                            </div>

                            <AnimatePresence mode="wait">

                                {/* STEP 1: DATE */}
                                {step === "DATE" && (
                                    <motion.div key="date"  animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p className="text-center text-[#f5f2ee]/50 text-xs tracking-widest uppercase mb-6"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.veldu}</p>

                                        {/* Guest counter */}
                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <span className="text-[#c6a46c]/70 text-xs uppercase tracking-widest"
                                                style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.gestir}</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setGuests(Math.max(1, guests - 1))}
                                                    className="w-8 h-8 rounded-full border border-[#c6a46c]/30 text-[#c6a46c]/70 hover:border-[#c6a46c] hover:text-[#c6a46c] transition-all text-lg">−</button>
                                                <span className="w-10 text-center text-[#c6a46c] font-bold text-xl">{guests}</span>
                                                <button onClick={() => setGuests(Math.min(60, guests + 1))}
                                                    className="w-8 h-8 rounded-full border border-[#c6a46c]/30 text-[#c6a46c]/70 hover:border-[#c6a46c] hover:text-[#c6a46c] transition-all text-lg">+</button>
                                            </div>
                                        </div>

                                        {/* Weekly calendar */}
                                        <div className="space-y-2 mb-6">
                                            <div className="grid grid-cols-5 gap-2 mb-1 relative">
                                                <button 
                                                    onClick={() => setWeekOffset(Math.max(0, weekOffset - 4))}
                                                    disabled={weekOffset === 0}
                                                    className="absolute -left-14 top-0 bottom-0 flex items-center justify-center text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 disabled:opacity-0 transition-all"
                                                >
                                                    &larr;
                                                </button>
                                                <button 
                                                    onClick={() => setWeekOffset(weekOffset + 4)}
                                                    className="absolute -right-14 top-0 bottom-0 flex items-center justify-center text-7xl text-[#c6a46c]/50 hover:text-[#c6a46c] hover:scale-110 transition-all"
                                                >
                                                    &rarr;
                                                </button>
                                                {["Þri", "Mið", "Fim", "Fös", "Lau"].map(d => (
                                                    <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#f5f2ee]/25 py-1">{d}</div>
                                                ))}
                                            </div>
                                            {weeks.map((week, wi) => (
                                                <div key={wi} className="grid grid-cols-5 gap-2">
                                                    {week.map((d, di) => d.date === "" ? (
                                                        <div key={di} className="py-3 rounded-xl border border-[#f5f2ee]/5 opacity-20" />
                                                    ) : (
                                                        <button key={d.date} onClick={() => setSelectedDate(d.date)}
                                                            className={`py-3 px-2 rounded-xl border text-center transition-all duration-200 hover:scale-[1.03] ${selectedDate === d.date
                                                                ? "border-[#c6a46c] bg-[#c6a46c]/15 text-[#c6a46c] shadow-[0_0_20px_rgba(245,168,0,0.15)]"
                                                                : "border-[#f5f2ee]/15 text-[#f5f2ee]/70 hover:border-[#c6a46c]/40 hover:bg-[#f5f2ee]/5"}`}>
                                                            <div className="text-sm font-semibold">{d.label.split(".")[0]}.</div>
                                                            <div className="text-xs opacity-60 mt-0.5">{d.label.split(". ")[1]}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        <button disabled={!selectedDate}
                                            onClick={() => setStep("DETAILS")}
                                            className="w-full py-3 rounded-xl border border-[#c6a46c]/40 bg-[#c6a46c]/10 text-[#c6a46c] text-sm font-bold tracking-widest uppercase hover:bg-[#c6a46c]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                            {T.next}
                                        </button>
                                    </motion.div>
                                )}

                                {/* STEP 2: DETAILS */}
                                {step === "DETAILS" && (
                                    <motion.div key="details"  animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <button onClick={() => setStep("DATE")}
                                            className="text-[#c6a46c]/50 text-xs uppercase tracking-wider hover:text-[#c6a46c] transition-colors mb-6"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                            {T.back}
                                        </button>
                                        <p className="text-center text-[#f5f2ee]/60 text-sm mb-6">
                                            {selectedDateLabel} · {guests} gestir · kl. 17:00–20:00
                                        </p>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {[
                                                { label: T.nameLabel, value: name, set: setName, type: "text", required: true },
                                                { label: T.phoneLabel, value: phone, set: setPhone, type: "tel", required: true },
                                                { label: T.emailLabel, value: email, set: setEmail, type: "email", required: true },
                                            ].map(f => (
                                                <div key={f.label}>
                                                    <label className="block text-[#c6a46c]/60 text-[10px] uppercase tracking-widest mb-1"
                                                        style={{ fontFamily: "var(--font-cinzel), serif" }}>{f.label}</label>
                                                    <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} required={f.required}
                                                        className="w-full bg-transparent border-b border-[#f5f2ee]/20 pb-2 text-[#f5f2ee] text-sm focus:outline-none focus:border-[#c6a46c]/60 transition-colors" />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-[#c6a46c]/60 text-[10px] uppercase tracking-widest mb-1"
                                                    style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.notesLabel}</label>
                                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                                    placeholder={T.notesPh}
                                                    className="w-full bg-transparent border-b border-[#f5f2ee]/20 pb-2 text-[#f5f2ee] text-sm focus:outline-none focus:border-[#c6a46c]/60 transition-colors resize-none placeholder-[#f5f2ee]/20" />
                                            </div>
                                            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                                            <button type="submit" disabled={loading}
                                                className="w-full py-3 rounded-xl border border-[#c6a46c]/40 bg-[#c6a46c]/10 text-[#c6a46c] text-sm font-bold tracking-widest uppercase hover:bg-[#c6a46c]/20 transition-all disabled:opacity-50"
                                                style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                                {loading ? "..." : T.confirm}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {/* STEP 3: CONFIRMED */}
                                {step === "CONFIRMED" && (
                                    <motion.div key="confirmed"  animate={{ opacity: 1 }}
                                        className="text-center py-8">
                                        <div className="text-5xl mb-6">🌿</div>
                                        <h3 className="text-xl font-bold text-[#c6a46c] tracking-wider uppercase mb-3"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.confirmedTitle}</h3>
                                        <p className="text-[#f5f2ee]/50 text-sm mb-6">{T.confirmedText}</p>
                                        {confirmationId && (
                                            <p className="text-[#f5f2ee]/30 text-xs font-mono">{T.ref}: {confirmationId}</p>
                                        )}
                                        <button onClick={handleClose}
                                            className="mt-8 px-8 py-2 rounded-full border border-[#c6a46c]/40 text-[#c6a46c] text-xs uppercase tracking-widest hover:bg-[#c6a46c]/10 transition-all"
                                            style={{ fontFamily: "var(--font-cinzel), serif" }}>{T.close}</button>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
