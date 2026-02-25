"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Test the password against the admin API
            const res = await fetch("/api/bookings/admin?action=tables", {
                headers: { Authorization: `Bearer ${password}` },
            });

            if (res.ok) {
                // Store password in sessionStorage for subsequent requests
                sessionStorage.setItem("adminToken", password);
                router.push("/admin");
            } else {
                setError("Rangt lykilorð");
            }
        } catch {
            setError("Villa kom upp");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center px-6">
            <div className="max-w-sm w-full">
                <h1
                    className="text-2xl font-bold text-center tracking-[0.15em] mb-2 text-[#F4D03F]"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    MACONDO
                </h1>
                <p className="text-center text-[#F5E6CC]/30 text-xs uppercase tracking-wider mb-8">
                    Stjórnborð
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest mb-2 text-[#F4D03F]/70">
                            Lykilorð
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-[#F5E6CC]/15 py-3 text-[#F5E6CC] placeholder-[#F5E6CC]/20 focus:outline-none focus:border-[#F4D03F]/50 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-[#E74C3C] text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-transparent text-[#F4D03F] border border-[#D4A017] hover:bg-[#F4D03F]/10 transition-all disabled:opacity-30"
                    >
                        {loading ? "..." : "INNSKRÁ"}
                    </button>
                </form>
            </div>
        </div>
    );
}
