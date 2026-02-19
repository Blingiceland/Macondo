"use client";

import { motion } from "framer-motion";
import CocktailMenu from "@/components/CocktailMenu";
import BookingForm from "@/components/BookingForm";
import Butterflies from "@/components/effects/Butterflies";
import FireflyCursor from "@/components/effects/FireflyCursor";
import NeonSign from "@/components/effects/NeonSign";

export default function Home() {
  const scrollToReservation = () => {
    const section = document.getElementById('reservation-form');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Butterflies />
      <FireflyCursor />
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambience — deep blue radial + subtle yellow top glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A527620_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F4D03F08_0%,_transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#E91E6308_0%,_transparent_50%)]" />
        </div>

        {/* Main Content Container */}
        <div className="z-10 text-center max-w-4xl px-6">

          {/* Title */}
          <div className="min-h-32 mb-16 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            >
              <NeonSign />
            </motion.div>
          </div>

          {/* Quote */}
          <div className="h-24 mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base font-light italic leading-relaxed opacity-50"
              style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F48FB1' }}
            >
              &ldquo;The world was so recent that many things lacked names.&rdquo;
            </motion.p>
          </div>

          {/* Action Button — warm pink border with yellow hover */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToReservation}
            className="px-12 py-4 rounded-full text-lg font-bold tracking-[0.2em] transition-all duration-300 bg-transparent text-[#F4D03F] border border-[#D4A017] shadow-[0_0_20px_rgba(244,208,63,0.15)] hover:bg-[#F4D03F]/10 hover:shadow-[0_0_30px_rgba(244,208,63,0.25)] hover:border-[#F4D03F]"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            ENTER MACONDO
          </motion.button>
        </div>

      </main>

      {/* Sections below the fold */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        <div className="w-full">
          <CocktailMenu />
        </div>
        <div id="reservation-form" className="w-full">
          <BookingForm />
        </div>
      </div>
    </>
  );
}
