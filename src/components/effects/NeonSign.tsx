"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function NeonSign() {
    return (
        <div className="relative text-center select-none flex flex-col items-center">
            {/* Main logo — crisp, subtle luminosity only */}
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 8px rgba(245, 242, 238, 0.10))" }}
            >
                <Image
                    src="/macondo-logo.png"
                    alt="Macondo Tequila Lounge"
                    width={600}
                    height={360}
                    priority
                    className="w-80 md:w-[480px] lg:w-[640px] h-auto mx-auto"
                />
            </motion.div>
            
            {/* Tagline — smaller, tighter tracking, muted gold */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
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
