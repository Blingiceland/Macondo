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
import HeroIntro from "@/components/effects/HeroIntro";
import ParallaxBackground from "@/components/effects/ParallaxBackground";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const scrollToReservation = () => {
    const section = document.getElementById('reservation-form');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Cinematic Intro */}
      <HeroIntro onComplete={handleIntroComplete} />

      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Effects */}
      {introComplete && <Butterflies />}
      <FireflyCursor />
      <StickyNav />

      {/* HERO SECTION */}
      <main id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A527615_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F4D03F06_0%,_transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#E91E6305_0%,_transparent_50%)]" />
        </div>

        {/* Main Content */}
        <div className="z-10 text-center max-w-4xl px-6">

          {/* Logo */}
          <motion.div
            className="min-h-32 mb-16 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={introComplete ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <NeonSign />
          </motion.div>

          {/* Quote */}
          <motion.div
            className="h-24 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p
              className="text-sm md:text-base font-light italic leading-relaxed opacity-50"
              style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F48FB1' }}
            >
              &ldquo;The world was so recent that many things lacked names.&rdquo;
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToReservation}
              className="px-12 py-4 rounded-full text-lg font-bold tracking-[0.2em] transition-all duration-300 bg-transparent text-[#F4D03F] border border-[#D4A017] shadow-[0_0_20px_rgba(244,208,63,0.15)] hover:bg-[#F4D03F]/10 hover:shadow-[0_0_30px_rgba(244,208,63,0.25)] hover:border-[#F4D03F]"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              ENTER MACONDO
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#F48FB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </main>

      {/* JUNGLE DIVIDER — organic vine shape */}
      <div className="relative w-full h-32 overflow-hidden z-10">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,60 C120,100 240,20 360,60 C480,100 600,30 720,55 C840,80 960,20 1080,50 C1200,80 1320,30 1440,60 L1440,120 L0,120 Z"
            fill="#0D2818"
            fillOpacity="0.3"
          />
          <path
            d="M0,80 C160,50 320,90 480,70 C640,50 800,95 960,75 C1120,55 1280,85 1440,65 L1440,120 L0,120 Z"
            fill="#0B0E1A"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* COCKTAILS & BOOKING */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Section intro text */}
        <motion.div
          className="text-center py-16 px-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-lg md:text-xl font-light leading-relaxed opacity-60"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F5E6CC' }}
          >
            Every drink in Macondo tells a story —<br />
            of gold and solitude, rain and butterflies.
          </p>
        </motion.div>

        <div className="w-full">
          <CocktailMenu />
        </div>

        {/* Another divider before booking */}
        <div className="relative w-full h-24 overflow-hidden my-8">
          <svg viewBox="0 0 1440 80" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,40 C240,10 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z"
              fill="#0D2818"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <div id="reservation-form" className="w-full">
          <BookingForm />
        </div>

        <Footer />
      </div>
    </>
  );
}
