"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import CocktailMenu from "@/components/CocktailMenu";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import StickyNav from "@/components/StickyNav";
import NeonSign from "@/components/effects/NeonSign";
import ParallaxBackground from "@/components/effects/ParallaxBackground";


export default function Home() {
  const [introComplete, setIntroComplete] = useState(true);

  const scrollToReservation = () => {
    const section = document.getElementById('reservation-form');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Cinematic Intro removed per request to load immediately */}

      {/* Parallax Background */}
      <ParallaxBackground />


      <StickyNav />


      {/* MAIN CONTENT */}
      <main>

      {/* HERO SECTION */}
      <section id="hero" aria-label="Forsíða" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Visually hidden h1 for SEO/accessibility */}
        <h1 className="sr-only">Macondo — Tequila Bar Reykjavík</h1>

        {/* Hero ambient — subtle warm center glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(198,164,108,0.055), transparent 38%)' }} />

        {/* Logo — absolutely centered to match intro position */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          
          animate={introComplete ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <NeonSign />
        </motion.div>

        {/* Removed Hero Quote and CTA for cleaner layout */}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          
          animate={introComplete ? { opacity: 0.3, y: [0, 8, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#c6a46c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* JUNGLE DIVIDER */}
      <div className="relative w-full h-32 overflow-hidden z-10" aria-hidden="true">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z"
            fill="#140c09"
            fillOpacity="0.4"
          />
          <path
            d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z"
            fill="#140c09"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* COCKTAILS SECTION */}
      <section id="cocktails" aria-label="Kokteilar" className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          className="text-center pt-24 pb-20 px-6 max-w-2xl mx-auto"
          
          
          
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-lg md:text-xl font-light leading-relaxed opacity-60"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#f5f2ee' }}
          >
            Sérhver dropi í Macondo segir sögu —<br />
            um gull og einsemd, regn og fiðrildi.
          </p>
        </motion.div>

        <div className="w-full">
          <CocktailMenu />
        </div>
      </section>



      <BookingForm />

      {/* KARAOKE SECTION */}
      <section id="karaoke" aria-label="Karókí" className="relative z-10 w-full flex flex-col items-center py-32">
        <motion.div
          className="container mx-auto px-6 max-w-5xl"
          
          
          
          transition={{ duration: 0.8 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#c6a46c]/10 bg-gradient-to-br from-[#140c09] via-[#1a1412] to-[#140c09] p-10 md:p-16 shadow-lg flex flex-col md:flex-row items-center gap-10">
            {/* Soft ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c6a46c]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 text-center md:text-left relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c6a46c]/80 mb-3"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Uppi á hæðinni
              </p>
              <h2 className="text-[36px] md:text-[42px] font-bold tracking-[0.08em] mb-4 uppercase text-[#f5f2ee]"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Karókí
              </h2>
              <div className="w-16 h-[1px] mx-auto md:mx-0 bg-gradient-to-r from-[#c6a46c]/40 to-transparent mb-6" />
              <p className="text-[#f5f2ee]/75 text-[16px] leading-relaxed max-w-md">
                Við erum með 2 herbergi.
              </p>
            </div>

            <div className="flex-shrink-0 relative z-10">
              <a
                href="https://pablodiscobar.is/karaoke"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-[34px] py-[16px] rounded-full font-light text-[14px] tracking-[0.14em] transition-all duration-300 border border-[#c6a46c]/[0.65] text-[#c6a46c] hover:border-[#c6a46c] hover:text-[#f5f2ee] hover:-translate-y-[1px]"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                <span>Bóka karókí</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <p className="text-[#f5f2ee]/20 text-[10px] text-center mt-3 uppercase tracking-widest">pablodiscobar.is</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />

      </main>
    </>
  );
}
