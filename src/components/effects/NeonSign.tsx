"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function NeonSign() {
    return (
        <div className="relative text-center select-none">
            {/* Pulsing glow layer behind logo */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/macondo-logo.png"
                    alt=""
                    width={600}
                    height={360}
                    className="w-80 md:w-[480px] lg:w-[640px] h-auto blur-[18px]"
                    style={{ filter: "drop-shadow(0 0 40px #C13A1A) drop-shadow(0 0 80px #C13A1A)" }}
                    aria-hidden
                    priority
                />
            </motion.div>

            {/* Main logo */}
            <motion.div
                className="relative z-10"
                animate={{ filter: [
                    "drop-shadow(0 0 12px #C13A1A) drop-shadow(0 0 25px #C13A1A80)",
                    "drop-shadow(0 0 20px #C13A1A) drop-shadow(0 0 40px #C13A1A80)",
                    "drop-shadow(0 0 12px #C13A1A) drop-shadow(0 0 25px #C13A1A80)",
                ]}}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
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
        </div>
    );
}
