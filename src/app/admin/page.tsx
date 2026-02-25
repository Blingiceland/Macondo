"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ================================================================
   TYPES
   ================================================================ */

interface Reservation {
    id: string;
    tableNumber: number;
    date: string;
    timeSlot: string;
    duration: number;
    name: string;
    email: string;
    guests: number;
    status: string;
    notes?: string;
}

interface BlockedSlot {
    id: string;
    date: string;
    timeSlot: string;
    tableNumber: number;
    reason?: string;
}

interface TableConfig {
    id: string;
    number: number;
    seats: number;
    active: boolean;
    label?: string;
}

/* ================================================================
   COMPONENT
   ================================================================ */

export default function AdminDashboard() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [selectedDate, setSelectedDate] = useState("all");

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
    const [tables, setTables] = useState<TableConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"bookings" | "block" | "tables">("bookings");

    // Block form state
    const [blockDate, setBlockDate] = useState("");
    const [blockTime, setBlockTime] = useState("all");
    const [blockTable, setBlockTable] = useState(0);
    const [blockReason, setBlockReason] = useState("");

    // Auth helper
    const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers as Record<string, string>,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    }, [token]);

    // Check auth on mount
    useEffect(() => {
        const stored = sessionStorage.getItem("adminToken");
        if (!stored) {
            router.push("/admin/login");
            return;
        }
        setToken(stored);
    }, [router]);

    // Fetch data when date changes
    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [resData, tableData] = await Promise.all([
                authFetch(`/api/bookings/admin?date=${selectedDate}`).then(r => r.json()),
                authFetch(`/api/bookings/admin?action=tables`).then(r => r.json()),
            ]);
            setReservations(resData.reservations || []);
            setBlockedSlots(resData.blockedSlots || []);
            setTables(tableData.tables || []);
        } catch (err) {
            console.error("Failed to fetch:", err);
        }
        setLoading(false);
    }, [token, selectedDate, authFetch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Cancel reservation
    const handleCancel = async (id: string) => {
        if (!confirm("Ertu viss um að þú viljir aflýsa þessari bókun?")) return;
        await authFetch("/api/bookings/admin", {
            method: "POST",
            body: JSON.stringify({ action: "cancel", reservationId: id }),
        });
        fetchData();
    };

    // Block slot
    const handleBlock = async (e: React.FormEvent) => {
        e.preventDefault();

        // If "all" is selected on the main dashboard, default to today for blocking
        let targetBlockDate = blockDate || selectedDate;
        if (targetBlockDate === "all") {
            const d = new Date();
            targetBlockDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

        await authFetch("/api/bookings/admin", {
            method: "POST",
            body: JSON.stringify({
                action: "block",
                date: targetBlockDate,
                timeSlot: blockTime,
                tableNumber: blockTable,
                reason: blockReason,
            }),
        });
        setBlockReason("");
        fetchData();
    };

    // Unblock
    const handleUnblock = async (id: string) => {
        await authFetch("/api/bookings/admin", {
            method: "POST",
            body: JSON.stringify({ action: "unblock", blockId: id }),
        });
        fetchData();
    };

    // Initialize tables
    const handleInitTables = async () => {
        await authFetch("/api/bookings/admin?action=init");
        fetchData();
    };

    // Logout
    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    // Time slots for the block dropdown
    const timeOptions = [
        "all",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
        "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
        "22:00", "22:30", "23:00", "23:30", "00:00", "00:30",
        "01:00", "01:30", "02:00", "02:30",
    ];

    return (
        <div className="min-h-screen bg-[#0B0E1A] text-[#F5E6CC]">
            {/* Header */}
            <header className="border-b border-[#F5E6CC]/10 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-[0.15em] text-[#F4D03F]"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            MACONDO — STJÓRNBORÐ
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-xs text-[#F5E6CC]/30 hover:text-[#F5E6CC]/60 transition-colors">
                            ← Vefsíða
                        </a>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-[#E74C3C]/50 hover:text-[#E74C3C] transition-colors"
                        >
                            Útskrá
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Date picker + Tabs */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <label className="text-xs uppercase tracking-wider text-[#F4D03F]/60">Dagsetning</label>
                        <select
                            value={selectedDate === "all" ? "all" : "custom"}
                            onChange={(e) => {
                                if (e.target.value === "all") {
                                    setSelectedDate("all");
                                } else {
                                    const d = new Date();
                                    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
                                }
                            }}
                            className="bg-[#0B0E1A] border border-[#F5E6CC]/15 rounded-lg px-4 py-2 text-sm text-[#F5E6CC] focus:outline-none focus:border-[#F4D03F]/40"
                        >
                            <option value="all">Allar framtíðarbókanir</option>
                            <option value="custom">Velja dag...</option>
                        </select>

                        {selectedDate !== "all" && (
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-[#0B0E1A] border border-[#F5E6CC]/15 rounded-lg px-4 py-2 text-sm text-[#F5E6CC] focus:outline-none focus:border-[#F4D03F]/40"
                            />
                        )}
                    </div>

                    <div className="flex gap-2">
                        {(["bookings", "block", "tables"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all ${activeTab === tab
                                    ? "bg-[#F4D03F]/10 text-[#F4D03F] border border-[#F4D03F]/30"
                                    : "text-[#F5E6CC]/30 border border-transparent hover:text-[#F5E6CC]/60"
                                    }`}
                            >
                                {tab === "bookings" ? "Bókanir" : tab === "block" ? "Loka" : "Borð"}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-6 h-6 border-2 border-[#F4D03F]/20 border-t-[#F4D03F] rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ============ BOOKINGS TAB ============ */}
                        {activeTab === "bookings" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm uppercase tracking-wider text-[#F4D03F]/70">
                                        {selectedDate === "all" ? "Afgreiðslulausar bókanir" : `Bókanir — ${selectedDate}`}
                                    </h2>
                                    <span className="text-xs text-[#F5E6CC]/30">{reservations.length} bókanir</span>
                                </div>

                                {reservations.length === 0 ? (
                                    <div className="text-center py-16 text-[#F5E6CC]/20">
                                        <p className="text-lg mb-1">Engar bókanir</p>
                                        <p className="text-xs">Engar borðabókanir á þessari dagsetningu</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {reservations.map((r) => (
                                            <div key={r.id} className="border border-[#F5E6CC]/10 rounded-xl p-4 flex items-center justify-between hover:border-[#F5E6CC]/20 transition-colors">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center min-w-[80px]">
                                                        {selectedDate === "all" && (
                                                            <div className="text-[10px] uppercase font-bold text-[#F4D03F]/70 mb-1">{r.date.substring(5)}</div>
                                                        )}
                                                        <div className="text-lg font-bold text-[#2ECC71]">{r.timeSlot}</div>
                                                        <div className="text-[10px] text-[#F5E6CC]/30">{r.duration} mín</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{r.name}</div>
                                                        <div className="text-xs text-[#F5E6CC]/40">{r.email}</div>
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <span className="text-xs px-2 py-1 rounded bg-[#F5E6CC]/5 text-[#F5E6CC]/50">
                                                            {r.guests} gestir · Borð {r.tableNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCancel(r.id)}
                                                    className="text-xs text-[#E74C3C]/40 hover:text-[#E74C3C] transition-colors px-3 py-1 rounded border border-transparent hover:border-[#E74C3C]/20"
                                                >
                                                    Aflýsa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Blocked slots for today */}
                                {blockedSlots.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xs uppercase tracking-wider text-[#E74C3C]/60 mb-3">Lokaðir tímar</h3>
                                        <div className="space-y-2">
                                            {blockedSlots.map(b => (
                                                <div key={b.id} className="flex items-center justify-between border border-[#E74C3C]/10 rounded-lg px-4 py-3">
                                                    <div className="text-sm">
                                                        <span className="text-[#E74C3C]/70">
                                                            {b.timeSlot === "all" ? "Allan daginn" : `kl. ${b.timeSlot}`}
                                                        </span>
                                                        <span className="text-[#F5E6CC]/30 mx-2">·</span>
                                                        <span className="text-[#F5E6CC]/40">
                                                            {b.tableNumber === 0 ? "Öll borð" : `Borð ${b.tableNumber}`}
                                                        </span>
                                                        {b.reason && (
                                                            <span className="text-[#F5E6CC]/20 ml-2 text-xs">({b.reason})</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnblock(b.id)}
                                                        className="text-xs text-[#2ECC71]/40 hover:text-[#2ECC71] transition-colors"
                                                    >
                                                        Opna
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ============ BLOCK TAB ============ */}
                        {activeTab === "block" && (
                            <div className="max-w-md">
                                <h2 className="text-sm uppercase tracking-wider text-[#F4D03F]/70 mb-6">
                                    Loka tímabili
                                </h2>

                                <form onSubmit={handleBlock} className="space-y-5">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#F5E6CC]/40 mb-2">Dagsetning</label>
                                        <input
                                            type="date"
                                            value={blockDate || selectedDate}
                                            onChange={(e) => setBlockDate(e.target.value)}
                                            className="w-full bg-[#0B0E1A] border border-[#F5E6CC]/15 rounded-lg px-4 py-2 text-sm text-[#F5E6CC] focus:outline-none focus:border-[#F4D03F]/40"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#F5E6CC]/40 mb-2">Tími</label>
                                        <select
                                            value={blockTime}
                                            onChange={(e) => setBlockTime(e.target.value)}
                                            className="w-full bg-[#0B0E1A] border border-[#F5E6CC]/15 rounded-lg px-4 py-2 text-sm text-[#F5E6CC] focus:outline-none focus:border-[#F4D03F]/40"
                                        >
                                            {timeOptions.map(t => (
                                                <option key={t} value={t}>{t === "all" ? "Allan daginn" : `kl. ${t}`}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#F5E6CC]/40 mb-2">Borð</label>
                                        <select
                                            value={blockTable}
                                            onChange={(e) => setBlockTable(parseInt(e.target.value))}
                                            className="w-full bg-[#0B0E1A] border border-[#F5E6CC]/15 rounded-lg px-4 py-2 text-sm text-[#F5E6CC] focus:outline-none focus:border-[#F4D03F]/40"
                                        >
                                            <option value={0}>Öll borð</option>
                                            {tables.map(t => (
                                                <option key={t.id} value={t.number}>Borð {t.number}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#F5E6CC]/40 mb-2">Ástæða (valfrjálst)</label>
                                        <input
                                            type="text"
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            placeholder="t.d. Lokaður hópur"
                                            className="w-full bg-transparent border-b border-[#F5E6CC]/15 py-3 text-[#F5E6CC] placeholder-[#F5E6CC]/20 focus:outline-none focus:border-[#F4D03F]/50 transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-transparent text-[#E74C3C] border border-[#E74C3C]/30 hover:bg-[#E74C3C]/10 transition-all"
                                    >
                                        LOKA TÍMABILI
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ============ TABLES TAB ============ */}
                        {activeTab === "tables" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm uppercase tracking-wider text-[#F4D03F]/70">
                                        Borðastillingar
                                    </h2>
                                    {tables.length === 0 && (
                                        <button
                                            onClick={handleInitTables}
                                            className="text-xs px-4 py-2 rounded-lg border border-[#2ECC71]/30 text-[#2ECC71] hover:bg-[#2ECC71]/10 transition-all"
                                        >
                                            Búa til 10 borð
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {tables.map(t => (
                                        <div
                                            key={t.id}
                                            className={`border rounded-xl p-4 text-center transition-all ${t.active
                                                ? "border-[#2ECC71]/20 hover:border-[#2ECC71]/40"
                                                : "border-[#E74C3C]/20 opacity-40"
                                                }`}
                                        >
                                            <div className="text-2xl font-bold text-[#F4D03F] mb-1">{t.number}</div>
                                            <div className="text-xs text-[#F5E6CC]/30">{t.label || `Borð ${t.number}`}</div>
                                            <div className="text-xs text-[#F5E6CC]/20 mt-1">{t.seats} sæti</div>
                                            <div className={`text-[10px] mt-2 ${t.active ? "text-[#2ECC71]/60" : "text-[#E74C3C]/60"}`}>
                                                {t.active ? "Virkt" : "Óvirkt"}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {tables.length > 0 && (
                                    <p className="text-xs text-[#F5E6CC]/20 mt-6 text-center">
                                        Til að breyta fjölda sæta eða gera borð óvirkt, hafðu samband við kerfisstjóra.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
