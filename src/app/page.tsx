"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import CocktailMenu from "@/components/CocktailMenu";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import StickyNav from "@/components/StickyNav";
import Butterflies from "@/components/effects/Butterflies";
import FireflyCursor from "@/components/effects/FireflyCursor";
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

      {/* Effects */}
      {introComplete && <Butterflies />}
      <FireflyCursor />
      <StickyNav />


      {/* MAIN CONTENT */}
      <main>

      {/* HERO SECTION */}
      <section id="hero" aria-label="Forsíða" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Visually hidden h1 for SEO/accessibility */}
        <h1 className="sr-only">Macondo — Tequila Bar Reykjavík</h1>

        {/* Ambient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3D181015_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F5A80006_0%,_transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#C8891A05_0%,_transparent_50%)]" />
        </div>

        {/* Logo — absolutely centered to match intro position */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={introComplete ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <NeonSign />
        </motion.div>

        {/* Quote + CTA — positioned at bottom of hero */}
        <div className="absolute bottom-24 left-0 right-0 z-10 text-center px-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p
              className="text-sm md:text-base font-light italic leading-relaxed opacity-50"
              style={{ fontFamily: 'var(--font-cinzel), serif', color: '#C8891A' }}
            >
              &ldquo;Heimurinn var svo nýr að margt vantaði enn nöfn.&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToReservation}
              className="px-12 py-4 rounded-full text-lg font-bold tracking-[0.2em] transition-all duration-300 bg-transparent text-[#F5A800] border border-[#E8C87A] shadow-[0_0_20px_rgba(245,168,0,0.15)] hover:bg-[#F5A800]/10 hover:shadow-[0_0_30px_rgba(245,168,0,0.25)] hover:border-[#F5A800]"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              BÓKA BORÐ
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={introComplete ? { opacity: 0.3, y: [0, 8, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#C8891A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* JUNGLE DIVIDER */}
      <div className="relative w-full h-32 overflow-hidden z-10" aria-hidden="true">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z"
            fill="#1A0A08"
            fillOpacity="0.3"
          />
          <path
            d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z"
            fill="#1A0A08"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* COCKTAILS SECTION */}
      <section id="cocktails" aria-label="Kokteilar" className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          className="text-center py-16 px-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-lg md:text-xl font-light leading-relaxed opacity-60"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F5E8D0' }}
          >
            Sérhver dropi í Macondo segir sögu —<br />
            um gull og einsemd, regn og fiðrildi.
          </p>
        </motion.div>

        <div className="w-full">
          <CocktailMenu />
        </div>
      </section>

      {/* DIVIDER */}
      <div className="relative w-full h-24 overflow-hidden my-8" aria-hidden="true">
        <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z"
            fill="#1A0A08"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* MOCK GALLERY SECTION */}
      <section id="gallery" aria-label="Myndasafn" className="relative z-10 w-full flex flex-col items-center pb-24">
        <div className="text-center py-10 px-6 max-w-2xl mx-auto">
          <h2
                className="text-3xl md:text-4xl font-bold tracking-[0.15em] mb-3 uppercase"
                style={{ fontFamily: "var(--font-cinzel), serif", color: "#C13A1A" }}
            >
                Macondo Stemning
            </h2>
            <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#C13A1A]/40 to-transparent mb-6" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#F5E8D0]/10 shadow-[0_0_30px_rgba(193,58,26,0.15)] group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Image src="/images/vibe1.png" alt="Lounge Vibe" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
                
                <motion.div 
                    className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#F5E8D0]/10 shadow-[0_0_30px_rgba(193,58,26,0.15)] group md:mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Image src="/images/cocktail1.png" alt="Cocktail" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>

                <motion.div 
                    className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#F5E8D0]/10 shadow-[0_0_30px_rgba(193,58,26,0.15)] group md:-mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Image src="/images/neon1.png" alt="Neon Details" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
            </div>
        </div>
      </section>

      <BookingForm />

      <Footer />

      </main>
    </>
  );
}
