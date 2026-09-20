"use client";


import { motion } from "framer-motion";

interface Props {
    /** Slagorð undir lógóinu. */
    tagline?: string;
    /** Texti á aðgerðarhnappi; enginn hnappur ef sleppt. */
    ctaLabel?: string;
    onCta?: () => void;
}

export default function NeonSign({
    tagline = "Tequila. Cocktails. Late nights in Reykjavík.",
    ctaLabel,
    onCta,
}: Props) {
    return (
        <div className="relative text-center select-none flex flex-col items-center">
            {/* Main logo — crisp, subtle luminosity only */}
            <motion.div
                className="relative z-10 w-64 md:w-[400px] lg:w-[500px] aspect-[5/3] mx-auto"
                
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ 
                    WebkitMaskImage: 'url(/macondo-logo.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    background: 'linear-gradient(180deg, #d7b97a, #a8894f)',
                    filter: 'drop-shadow(0 0 4px rgba(198, 164, 108, 0.2)) drop-shadow(0 0 12px rgba(198, 164, 108, 0.06))'
                }}
            />
            
            {/* Tagline — smaller, tighter tracking, muted gold */}
            <motion.p
                
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-4 uppercase text-[13px] md:text-[15px] tracking-[0.22em] font-normal text-[#c6a46c]/[0.85] px-6 [text-shadow:0_1px_14px_rgba(20,12,9,0.9)]"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
                {tagline}
            </motion.p>

            {ctaLabel && (
                <motion.button
                    type="button"
                    onClick={onCta}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="mt-9 px-10 py-3.5 uppercase text-[13px] tracking-[0.2em] font-semibold text-[#c6a46c] border border-[#c6a46c]/60 hover:bg-[#c6a46c] hover:text-[#140c09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a46c] transition-all duration-300"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    {ctaLabel}
                </motion.button>
            )}
        </div>
    );
}
