"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Volume2, VolumeX, Ghost } from "lucide-react";

export type SoundProfile = "drone" | "whispers" | "heartbeat" | "random";

interface AudioControlProps {
    onProfileChange: (profile: SoundProfile) => void;
    onMuteToggle: (muted: boolean) => void;
    isMuted: boolean;
    currentProfile: SoundProfile;
}

export default function AudioControl({ onProfileChange, onMuteToggle, isMuted, currentProfile }: AudioControlProps) {
    const { theme } = useTheme();

    if (theme !== "noche") return null; // Only show in Noche mode

    return (
        <div className="fixed top-24 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-10 duration-500">

            {/* Mute Toggle */}
            <button
                onClick={() => onMuteToggle(!isMuted)}
                className="p-3 rounded-full bg-black/80 border border-[var(--color-vampire-secondary)] text-[var(--color-vampire-secondary)] hover:bg-[var(--color-vampire-secondary)] hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Profile Selector (Only visible if not muted, or always visible) */}
            {!isMuted && (
                <div className="bg-black/90 border border-[var(--color-vampire-accent)] rounded-sm p-1 ml-4 relative group">
                    <div className="absolute -left-8 top-1 opacity-50"><Ghost size={16} className="text-[var(--color-vampire-accent)]" /></div>
                    <select
                        value={currentProfile}
                        onChange={(e) => onProfileChange(e.target.value as SoundProfile)}
                        className="bg-transparent text-xs uppercase font-bold text-[var(--color-vampire-accent)] outline-none cursor-pointer w-24 text-right appearance-none"
                    >
                        <option value="random">Mixed</option>
                        <option value="drone">Drone</option>
                        <option value="whispers">Eerie</option>
                        <option value="heartbeat">Pulse</option>
                    </select>
                </div>
            )}
        </div>
    );
}
