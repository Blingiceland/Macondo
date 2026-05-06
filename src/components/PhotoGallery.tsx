"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

// Only showing venue/bar atmosphere shots
const GALLERY_IMAGES = [
    // Bar atmosphere & venue shots
    "/assets/myndir/L1830762.jpg",
    "/assets/myndir/L1830721.jpg",
    "/assets/myndir/L1830724.jpg",
    "/assets/myndir/L1830767.jpg",
    
    // Venue & atmosphere
    "/assets/myndir/L1830722.jpg",
    "/assets/myndir/L1830723.jpg",
    "/assets/myndir/L1830735.jpg",
    
    // Bar scenes
    "/assets/myndir/L1830734.jpg",
    "/assets/myndir/L1830736.jpg",
    "/assets/myndir/L1830741.jpg",
    "/assets/myndir/L1830743.jpg",
    "/assets/myndir/L1830746.jpg",
];

// Each image gets a size variant for the masonry feel: 'sm' | 'md' | 'tall'
type TileSize = "sm" | "md" | "tall";
const SIZE_PATTERN: TileSize[] = [
    "tall", "sm", "sm", "md", "tall", "sm",
    "md", "sm", "tall", "sm", "md", "sm",
    "tall", "md", "sm", "sm", "tall", "sm",
];

function getTileSize(i: number): TileSize {
    return SIZE_PATTERN[i % SIZE_PATTERN.length];
}

function tileClasses(size: TileSize): string {
    switch (size) {
        case "tall": return "row-span-2 aspect-[3/4]";
        case "md":   return "aspect-[4/3]";
        case "sm":   return "aspect-square";
    }
}

export default function PhotoGallery() {
    const [lightbox, setLightbox] = useState<string | null>(null);

    return (
        <section
            id="gallery"
            aria-label="Myndasafn"
            className="relative z-10 w-full py-24 px-4 md:px-8"
        >
            {/* Section header */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <p
                    className="text-xs uppercase tracking-[0.35em] text-[#c6a46c]/70 mb-4"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    Líf á Macondo
                </p>
                <h2
                    className="text-3xl md:text-4xl font-bold tracking-[0.08em] uppercase text-[#f5f2ee]"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    Andinn í barnum
                </h2>
                <div className="w-16 h-px mx-auto mt-6 bg-gradient-to-r from-transparent via-[#c6a46c]/50 to-transparent" />
            </motion.div>

            {/* Masonry grid */}
            <div className="max-w-7xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                {GALLERY_IMAGES.map((src, i) => (
                    <motion.div
                        key={`${src}-${i}`}
                        className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer relative group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                            delay: (i % 8) * 0.07,
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        onClick={() => setLightbox(src)}
                    >
                        <div className="relative w-full overflow-hidden">
                            <Image
                                src={src}
                                alt={`Macondo bar mynd ${i + 1}`}
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#140c09]/0 group-hover:bg-[#140c09]/30 transition-colors duration-300 pointer-events-none" />
                            {/* Subtle gold border on hover */}
                            <div className="absolute inset-0 ring-0 group-hover:ring-1 ring-[#c6a46c]/40 rounded-lg transition-all duration-300 pointer-events-none" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setLightbox(null)}
                >
                    <motion.div
                        className="relative max-w-5xl max-h-[90vh] w-full mx-4"
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={lightbox}
                            alt="Macondo mynd stækkuð"
                            width={1400}
                            height={1000}
                            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#140c09]/80 border border-[#c6a46c]/30 text-[#c6a46c] flex items-center justify-center hover:bg-[#c6a46c]/20 transition-colors"
                            aria-label="Loka mynd"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
