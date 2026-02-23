"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmbientAudio() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    // Show the music prompt after the intro finishes
    useEffect(() => {
        const timer = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.volume = 0.15;
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
            setHasInteracted(true);
        }
    };

    return (
        <>
            {/* Audio element — place your MP3 in /public/audio/ambient.mp3 */}
            <audio
                ref={audioRef}
                src="/audio/ambient.mp3"
                loop
                preload="none"
            />

            {/* Initial prompt — appears once, inviting user to enable music */}
            <AnimatePresence>
                {showPrompt && !hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95]"
                    >
                        <button
                            onClick={toggleAudio}
                            className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-[#0B0E1A]/70 border border-[#1A8FB4]/30 text-[#F5E6CC]/70 hover:text-[#F5E6CC] hover:border-[#2ECC71]/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ECC71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                            <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                Spila tónlist
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Persistent toggle — bottom-right corner */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: hasInteracted ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={toggleAudio}
                className={`fixed bottom-6 right-6 z-[95] w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isPlaying
                        ? "bg-[#2ECC71]/10 border border-[#2ECC71]/30 shadow-[0_0_15px_rgba(46,204,113,0.15)]"
                        : "bg-[#0B0E1A]/50 border border-white/10"
                    }`}
                aria-label={isPlaying ? "Þagga tónlist" : "Spila tónlist"}
            >
                {isPlaying ? (
                    // Sound on icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ECC71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#2ECC71" fillOpacity="0.2" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                ) : (
                    // Sound off icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5E6CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                )}
            </motion.button>
        </>
    );
}
