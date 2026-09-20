"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Reservation {
    id: string;
    date: string;
    name: string;
    email: string;
    phone: string;
    guests: number;
    notes?: string;
    status: "confirmed" | "cancelled";
}

interface DayData {
    date: string;
    reservations: Reservation[];
    booked: number;
    available: number;
    total: number;
}

const TOTAL = 60;
const LARGE_GROUP = 8;

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T12:00:00");
    const dayNames = ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"];
    const monthNames = ["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"];
    return `${dayNames[d.getDay()]} ${d.getDate()}. ${monthNames[d.getMonth()]}`;
}

function getToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getNext14Days(): string[] {
    return Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });
}

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [authed, setAuthed] = useState(false);
    const [authError, setAuthError] = useState("");
    const [selectedDate, setSelectedDate] = useState(getToday());
    const [dayData, setDayData] = useState<DayData | null>(null);
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [view, setView] = useState<"day" | "all">("day");

    const authHeader = `Bearer ${password}`;

    const fetchDay = useCallback(async () => {
        if (!authed) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/admin?date=${selectedDate}`, {
                headers: { authorization: authHeader },
            });
            if (res.status === 401) { setAuthed(false); return; }
            const data = await res.json();
            setDayData({ ...data, reservations: data.reservations ?? [] });
        } catch { /* ignore */ }
        setLoading(false);
    }, [authed, selectedDate, authHeader]);

    const fetchAll = useCallback(async () => {
        if (!authed) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/admin?date=all`, {
                headers: { authorization: authHeader },
            });
            if (res.status === 401) { setAuthed(false); return; }
            const data = await res.json();
            setAllReservations(data.reservations || []);
        } catch { /* ignore */ }
        setLoading(false);
    }, [authed, authHeader]);

    useEffect(() => {
        if (authed && view === "day") fetchDay();
    }, [authed, view, fetchDay]);

    useEffect(() => {
        if (authed && view === "all") fetchAll();
    }, [authed, view, fetchAll]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim()) { setAuthed(true); setAuthError(""); }
        else setAuthError("Sláðu inn lykilorð");
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Aflýsa þessari bókun?")) return;
        setCancellingId(id);
        try {
            await fetch("/api/bookings/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json", authorization: authHeader },
                body: JSON.stringify({ action: "cancel", reservationId: id }),
            });
            if (view === "day") fetchDay();
            else fetchAll();
        } catch { /* ignore */ }
        setCancellingId(null);
    };

    /* ─── LOGIN ─── */
    if (!authed) {
        return (
            <div className="min-h-screen bg-[#0e0605] flex items-center justify-center px-4">
                <motion.div  animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold tracking-[0.2em] text-[#F5A800] text-center mb-2 uppercase"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}>Macondo</h1>
                    <p className="text-[#F5E8D0]/30 text-xs text-center tracking-widest uppercase mb-10">Admin yfirlit</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Lykilorð"
                            className="w-full bg-transparent border border-[#F5E8D0]/15 rounded-lg px-4 py-3 text-[#F5E8D0] placeholder-[#F5E8D0]/20 focus:outline-none focus:border-[#F5A800]/50 transition-colors text-sm" />
                        {authError && <p className="text-red-400 text-xs">{authError}</p>}
                        <button type="submit"
                            className="w-full py-3 rounded-lg bg-[#F5A800]/10 border border-[#F5A800]/40 text-[#F5A800] text-sm font-bold tracking-widest uppercase hover:bg-[#F5A800]/20 transition-all"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            Innskrá
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const days = getNext14Days();

    /* ─── MAIN ─── */
    return (
        <div className="min-h-screen bg-[#0e0605] text-[#F5E8D0] px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold tracking-[0.2em] text-[#F5A800] uppercase"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>Macondo Admin</h1>
                        <p className="text-[#F5E8D0]/30 text-xs mt-1">Borðabókanir · kl. 17–20</p>
                    </div>
                    <button onClick={() => setAuthed(false)}
                        className="text-[#F5E8D0]/30 text-xs hover:text-[#F5E8D0]/70 transition-colors uppercase tracking-wider">
                        Útskrá
                    </button>
                </div>

                {/* View toggle */}
                <div className="flex gap-2 mb-6">
                    {(["day", "all"] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all border ${view === v
                                ? "border-[#F5A800]/60 bg-[#F5A800]/10 text-[#F5A800]"
                                : "border-[#F5E8D0]/10 text-[#F5E8D0]/40 hover:text-[#F5E8D0]/70"}`}
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            {v === "day" ? "Dagleg yfirlit" : "Allar bókanir"}
                        </button>
                    ))}
                </div>

                {/* ─── DAY VIEW ─── */}
                {view === "day" && (
                    <>
                        {/* Date picker */}
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                            {days.map(d => (
                                <button key={d} onClick={() => { setSelectedDate(d); }}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg border text-center transition-all text-xs ${selectedDate === d
                                        ? "border-[#F5A800] bg-[#F5A800]/10 text-[#F5A800]"
                                        : "border-[#F5E8D0]/10 text-[#F5E8D0]/50 hover:border-[#F5E8D0]/30"}`}>
                                    {formatDate(d)}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-16">
                                <div className="inline-block w-6 h-6 border-2 border-[#F5A800]/20 border-t-[#F5A800] rounded-full animate-spin" />
                            </div>
                        ) : dayData ? (
                            <>
                                {/* Capacity bar */}
                                <div className="bg-[#F5E8D0]/5 border border-[#F5E8D0]/10 rounded-xl p-5 mb-6">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-[#F5E8D0]/40 mb-1">Sæti</p>
                                            <p className="text-3xl font-bold text-[#F5A800]">{dayData.booked}
                                                <span className="text-[#F5E8D0]/30 text-base font-normal"> / {TOTAL}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${dayData.available === 0 ? "text-red-400" : dayData.available <= 10 ? "text-orange-400" : "text-green-400"}`}>
                                                {dayData.available === 0 ? "Fullbókað" : `${dayData.available} laus`}
                                            </p>
                                            <p className="text-[#F5E8D0]/30 text-xs">{dayData.reservations.length} bókanir</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#F5E8D0]/10 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(100, (dayData.booked / TOTAL) * 100)}%`,
                                                background: dayData.booked >= TOTAL ? "#e74c3c" : dayData.booked > TOTAL * 0.8 ? "#f39c12" : "#F5A800",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Reservations list */}
                                <AnimatePresence>
                                    {dayData.reservations.length === 0 ? (
                                        <p className="text-center text-[#F5E8D0]/20 py-12 text-sm">Engar bókanir þennan dag</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {dayData.reservations.map((r, i) => (
                                                <motion.div key={r.id}
                                                     animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={`bg-[#F5E8D0]/3 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${r.guests >= LARGE_GROUP ? "border-orange-400/30 bg-orange-400/5" : "border-[#F5E8D0]/10"}`}>
                                                    {/* Guest count badge */}
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${r.guests >= LARGE_GROUP ? "bg-orange-400/20 text-orange-400" : "bg-[#F5A800]/10 text-[#F5A800]"}`}>
                                                        {r.guests}
                                                    </div>
                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-[#F5E8D0]">{r.name}</p>
                                                            {r.guests >= LARGE_GROUP && (
                                                                <span className="text-[9px] bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Stór hópur</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#F5E8D0]/50">
                                                            <a href={`tel:${r.phone}`} className="hover:text-[#F5A800] transition-colors">📞 {r.phone}</a>
                                                            <a href={`mailto:${r.email}`} className="hover:text-[#F5A800] transition-colors truncate">✉ {r.email}</a>
                                                        </div>
                                                        {r.notes && (
                                                            <p className="text-xs text-[#F5E8D0]/30 mt-1 italic">{r.notes}</p>
                                                        )}
                                                    </div>
                                                    {/* Cancel */}
                                                    <button onClick={() => handleCancel(r.id)}
                                                        disabled={cancellingId === r.id}
                                                        className="flex-shrink-0 text-xs text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-wider disabled:opacity-30">
                                                        {cancellingId === r.id ? "..." : "Aflýsa"}
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : null}
                    </>
                )}

                {/* ─── ALL VIEW ─── */}
                {view === "all" && (
                    loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block w-6 h-6 border-2 border-[#F5A800]/20 border-t-[#F5A800] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {allReservations.length === 0 ? (
                                <p className="text-center text-[#F5E8D0]/20 py-12 text-sm">Engar bókanir</p>
                            ) : (
                                <>
                                    <p className="text-[#F5E8D0]/30 text-xs mb-4">{allReservations.length} bókanir — {allReservations.reduce((s, r) => s + r.guests, 0)} gestir samtals</p>
                                    {allReservations.map((r, i) => (
                                        <motion.div key={r.id}
                                             animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${r.guests >= LARGE_GROUP ? "border-orange-400/30 bg-orange-400/5" : "border-[#F5E8D0]/8 bg-[#F5E8D0]/3"}`}>
                                            <div className="flex-shrink-0 text-center min-w-[80px]">
                                                <p className="text-xs text-[#F5E8D0]/40">{formatDate(r.date)}</p>
                                                <p className="text-[10px] text-[#F5A800]/50 mt-0.5">kl. 17–20</p>
                                            </div>
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${r.guests >= LARGE_GROUP ? "bg-orange-400/20 text-orange-400" : "bg-[#F5A800]/10 text-[#F5A800]"}`}>
                                                {r.guests}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#F5E8D0] text-sm">{r.name}</p>
                                                <div className="flex flex-wrap gap-x-4 text-xs text-[#F5E8D0]/40 mt-0.5">
                                                    <a href={`tel:${r.phone}`} className="hover:text-[#F5A800] transition-colors">📞 {r.phone}</a>
                                                    <span className="truncate">✉ {r.email}</span>
                                                </div>
                                                {r.notes && <p className="text-xs text-[#F5E8D0]/25 italic mt-0.5">{r.notes}</p>}
                                            </div>
                                            <button onClick={() => handleCancel(r.id)}
                                                disabled={cancellingId === r.id}
                                                className="flex-shrink-0 text-xs text-red-400/40 hover:text-red-400 transition-colors uppercase tracking-wider disabled:opacity-30">
                                                {cancellingId === r.id ? "..." : "Aflýsa"}
                                            </button>
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </div>
                    )
                )}

            </div>
        </div>
    );
}
