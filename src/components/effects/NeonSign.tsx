"use client";


import { motion } from "framer-motion";

export default function NeonSign() {
    return (
        <div className="relative text-center select-none flex flex-col items-center">
            {/* Main logo — crisp, subtle luminosity only */}
            <motion.div
                className="relative z-10 w-80 md:w-[480px] lg:w-[640px] aspect-[5/3] mx-auto"
                
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
                
                animate={{ opacity: 0.82, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-8 uppercase text-[15px] tracking-[0.22em] font-normal text-[#c6a46c]/[0.55]"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
                Tequila. Cocktails. Late nights in Reykjavík.
            </motion.p>
        </div>
    );
}
