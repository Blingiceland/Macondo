"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";
import { SoundProfile } from "./AudioControl";

interface SpookyAudioProps {
    isMuted: boolean;
    profile: SoundProfile;
}

export default function SpookyAudio({ isMuted, profile }: SpookyAudioProps) {
    const { theme } = useTheme();
    const audioCtxRef = useRef<AudioContext | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Shutdown if not vampire or muted
        if (theme !== "noche" || isMuted) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => { });
                audioCtxRef.current = null;
            }
            return;
        }

        // Init Context
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const playSound = () => {
            if (!audioCtxRef.current || theme !== "noche" || isMuted) return;

            const ctx = audioCtxRef.current;
            if (ctx.state === "suspended") ctx.resume();

            const t = ctx.currentTime;
            // Determine sound type based on profile
            let forcedType = null;
            if (profile === "drone") forcedType = 2; // Low Drone preference
            if (profile === "whispers") forcedType = 1; // Noise preference
            if (profile === "heartbeat") forcedType = 3; // Pulse preference

            const type = forcedType || Math.floor(Math.random() * 3) + 1; // 1 to 3

            // 1. Whispers / Wind (Refined Noise)
            if (type === 1) {
                const bufferSize = ctx.sampleRate * 2.5; // 2.5s duration
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.5; // Lower amplitude noise
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                // Filter to make it "windy" not static-y
                const filter = ctx.createBiquadFilter();
                filter.type = "bandpass";
                filter.frequency.setValueAtTime(400, t);
                filter.Q.value = 1;
                filter.frequency.linearRampToValueAtTime(800, t + 2); // Moving wind

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.05, t + 0.5); // Slow attack
                gain.gain.linearRampToValueAtTime(0, t + 2.5);   // Slow release

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start();
            }

            // 2. Deep Drone (Refined Oscillators)
            else if (type === 2) {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();

                osc1.type = "sine";
                osc2.type = "triangle";

                const baseFreq = 50 + Math.random() * 20; // Low frequency
                osc1.frequency.setValueAtTime(baseFreq, t);
                osc2.frequency.setValueAtTime(baseFreq + 2, t); // Detuned slightly for texture

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.1, t + 1); // Slow attack
                gain.gain.exponentialRampToValueAtTime(0.001, t + 4); // Long release

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                osc1.start();
                osc2.start();
                osc1.stop(t + 4);
                osc2.stop(t + 4);
            }

            // 3. Heartbeat / Thump (Refined Pulse)
            else if (type === 3) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.frequency.setValueAtTime(40, t);
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.3, t + 0.05); // Thump
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(t + 0.5);

                // Second thump (da-DUM)
                setTimeout(() => {
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    const t2 = ctx.currentTime;
                    osc2.frequency.setValueAtTime(40, t2);
                    gain2.gain.setValueAtTime(0, t2);
                    gain2.gain.linearRampToValueAtTime(0.3, t2 + 0.05);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.4);

                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.start();
                    osc2.stop(t2 + 0.5);
                }, 300);
            }

            // Schedule next sound
            const nextDelay = Math.random() * 5000 + 3000; // 3-8 seconds
            timeoutRef.current = setTimeout(playSound, nextDelay);
        };

        // User gesture unlock wrapper
        const resumeAndPlay = () => {
            if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
        }
        window.addEventListener('click', resumeAndPlay);

        // Start loop
        timeoutRef.current = setTimeout(playSound, 1000);

        return () => {
            window.removeEventListener('click', resumeAndPlay);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [theme, isMuted, profile]);

    return null;
}
