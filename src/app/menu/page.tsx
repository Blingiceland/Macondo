"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ================================================================
   MENU DATA — sourced from Pablo Discobar, rebranded for Macondo
   ================================================================ */

const HAPPY_HOUR = {
    hours: "17:00 – 20:00",
    items: [
        { name: "Allir kokteilar", price: "1.990 kr" },
        { name: "Bjór á krana", price: "1.100 kr" },
        { name: "Húsvín", price: "1.200 kr" },
        { name: "Hússhots", price: "1.000 kr" },
    ],
};

const SPRITZ_HOUR = {
    hours: "20:00 – 22:00",
    items: [
        { name: "Lagoon Bay Spritz", price: "2.000 kr" },
        { name: "Sarti Spritz", price: "2.000 kr" },
        { name: "Aperol Spritz", price: "2.000 kr" },
        { name: "Limoncello Spritz", price: "2.000 kr" },
    ],
};

interface CocktailItem {
    name: string;
    desc: string;
}

const COCKTAILS: CocktailItem[] = [
    { name: "Beware of the Pear", desc: "Xanté, lemon, sugar, egg whites" },
    { name: "Basil Boogey", desc: "Askur Gin, peach liqueur, passion fruit syrup, grapefruit soda" },
    { name: "Negroni", desc: "Askur Gin, Campari, dry vermouth, sweet vermouth, chocolate bitters" },
    { name: "Tropic Sunset", desc: "Askur Gin, peach liqueur, passionfruit syrup, grapefruit soda" },
    { name: "Peachy Paradise", desc: "Askur Gin, Peachtree, rhubarb pineapple, tiki bitters" },
    { name: "Kinky Pornstar", desc: "Helix Vodka, vanilla liqueur, passionfruit purée, dark chocolate bitters, lime" },
    { name: "Old Fashioned", desc: "Bourbon, brown sugar syrup, bitters" },
    { name: "Spicy Señorita", desc: "1800 Tequila, passionfruit purée, chili pepper syrup, lime" },
    { name: "Pablo's Sangría", desc: "Barcelo rum, red wine, pineapple, lime, cinnamon, angostura, splash of coke" },
    { name: "Madras", desc: "Helix Vodka, cranberry, triple sec, orange, lime, simple syrup" },
];

interface MuleItem {
    spirit: string;
}

const MULES: MuleItem[] = [
    { spirit: "Tullamore Dew" },
    { spirit: "Helix Vodka" },
    { spirit: "1800 Tequila" },
    { spirit: "Sailor Jerry" },
];

interface BeerItem {
    name: string;
    price: string;
    type: "draft" | "bottle";
}

const BEERS: BeerItem[] = [
    { name: "Viking / Lite", price: "1.790 kr", type: "draft" },
    { name: "Einstök White", price: "1.950 kr", type: "draft" },
    { name: "Eldgos Apple", price: "2.150 kr", type: "draft" },
    { name: "Viking Gylltur/Lite", price: "1.700 kr", type: "bottle" },
    { name: "Einstök White/Pale", price: "1.800 kr", type: "bottle" },
    { name: "Eldgos / Breezer", price: "1.700+ kr", type: "bottle" },
];

interface ShotItem {
    name: string;
    price: string;
}

const SHOTS: ShotItem[] = [
    { name: "Gajol", price: "1.500 kr" },
    { name: "Blue Lagoon", price: "1.500 kr" },
    { name: "Jägermeister", price: "1.500 kr" },
    { name: "Shanky's Whip", price: "1.500 kr" },
    { name: "Sour Watermelon", price: "1.500 kr" },
];

interface WineItem {
    name: string;
    glass: string;
    bottle: string;
}

const WINES: WineItem[] = [
    { name: "Las Moras Pinot Grigio", glass: "1.890 kr", bottle: "8.500 kr" },
    { name: "Las Moras Malbec", glass: "1.890 kr", bottle: "8.500 kr" },
    { name: "Tosti Prosecco", glass: "1.890 kr", bottle: "8.500 kr" },
];

/* ================================================================
   COMPONENTS
   ================================================================ */

function SectionHeader({ title, subtitle, color = "green" }: { title: string; subtitle?: string; color?: "green" | "yellow" | "pink" | "blue" }) {
    const colors = {
        green: { text: "text-[#C13A1A]", glow: "drop-shadow-[0_0_12px_rgba(193,58,26,0.6)]", line: "from-transparent via-[#C13A1A]/40 to-transparent" },
        yellow: { text: "text-[#F5A800]", glow: "drop-shadow-[0_0_12px_rgba(245,168,0,0.6)]", line: "from-transparent via-[#F5A800]/40 to-transparent" },
        pink: { text: "text-[#C8891A]", glow: "drop-shadow-[0_0_12px_rgba(200,137,26,0.6)]", line: "from-transparent via-[#C8891A]/40 to-transparent" },
        blue: { text: "text-[#C13A1A]", glow: "drop-shadow-[0_0_12px_rgba(193,58,26,0.6)]", line: "from-transparent via-[#C13A1A]/40 to-transparent" },
    }[color];

    return (
        <div className="text-center mb-10">
            <div className={`w-32 h-px mx-auto mb-6 bg-gradient-to-r ${colors.line}`} />
            <h2
                className={`text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase ${colors.text} ${colors.glow}`}
                style={{ fontFamily: "var(--font-macondo-gf), cursive" }}
            >
                {title}
            </h2>
            {subtitle && (
                <p className="mt-2 text-sm tracking-widest uppercase opacity-40 text-[#F5E8D0]" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    {subtitle}
                </p>
            )}
            <div className={`w-32 h-px mx-auto mt-6 bg-gradient-to-r ${colors.line}`} />
        </div>
    );
}

function PriceRow({ name, price, desc }: { name: string; price?: string; desc?: string }) {
    return (
        <div className="py-3 border-b border-white/5 last:border-b-0">
            <div className="flex justify-between items-baseline gap-4">
                <span className="text-[#F5E8D0] font-medium tracking-wide text-sm md:text-base">{name}</span>
                {price && <span className="text-[#E8C87A] font-mono text-xs whitespace-nowrap">{price}</span>}
            </div>
            {desc && <p className="mt-1 text-xs text-[#F5E8D0]/40 italic">{desc}</p>}
        </div>
    );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function DrinksMenu() {
    return (
        <div className="min-h-screen bg-[#1A0A08] text-[#F5E8D0]">
            {/* Back link */}
            <div className="fixed top-4 left-4 z-50">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity text-[#C13A1A]"
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Til baka
                </Link>
            </div>

            {/* Hero */}
            <div className="pt-20 pb-8 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold tracking-[0.15em] mb-3"
                    style={{ fontFamily: "var(--font-macondo-gf), cursive", color: "#C13A1A", textShadow: "0 0 20px rgba(193,58,26,0.3)" }}
                >
                    DRINKS MENU
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm italic tracking-wider"
                    style={{ fontFamily: "var(--font-cinzel), serif", color: "#C8891A" }}
                >
                    &ldquo;It was the time of the butterflies. Everything tasted of gold.&rdquo;
                </motion.p>
            </div>

            <div className="max-w-2xl mx-auto px-6 pb-24 space-y-16">

                {/* HAPPY HOUR */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Happy Hour" subtitle={HAPPY_HOUR.hours} color="yellow" />
                    <div className="bg-[#F5A800]/5 border border-[#F5A800]/15 rounded-lg p-6">
                        {HAPPY_HOUR.items.map((item, i) => (
                            <PriceRow key={i} name={item.name} price={item.price} />
                        ))}
                    </div>
                </motion.section>

                {/* SPRITZ HOUR */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Spritz Hour" subtitle={SPRITZ_HOUR.hours} color="pink" />
                    <div className="bg-[#C8891A]/5 border border-[#C8891A]/15 rounded-lg p-6">
                        {SPRITZ_HOUR.items.map((item, i) => (
                            <PriceRow key={i} name={item.name} price={item.price} />
                        ))}
                    </div>
                </motion.section>

                {/* COCKTAILS */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Cocktails" color="green" />
                    <div className="bg-[#C13A1A]/5 border border-[#C13A1A]/15 rounded-lg p-6">
                        {COCKTAILS.map((item, i) => (
                            <PriceRow key={i} name={item.name} desc={item.desc} />
                        ))}
                    </div>
                </motion.section>

                {/* MULES */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Mules" subtitle="+ 3 Cents Ginger Beer, lime" color="blue" />
                    <div className="bg-[#3D1810]/5 border border-[#3D1810]/15 rounded-lg p-6">
                        {MULES.map((item, i) => (
                            <PriceRow key={i} name={item.spirit} />
                        ))}
                    </div>
                </motion.section>

                {/* COCKTAIL JUGS */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="text-center py-8 bg-[#F5A800]/5 border border-[#F5A800]/10 rounded-lg">
                        <h3 className="text-lg tracking-[0.2em] uppercase text-[#F5A800] mb-1" style={{ fontFamily: "var(--font-macondo-gf), cursive" }}>
                            Cocktail Jugs
                        </h3>
                        <p className="text-xs opacity-40">2L Pitchers — Perfect for groups!</p>
                        <p className="mt-3 text-xl font-bold text-[#E8C87A] font-mono">14.990 kr</p>
                    </div>
                </motion.section>

                {/* BEER */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Bjór" color="yellow" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#F5A800]/5 border border-[#F5A800]/10 rounded-lg p-6">
                            <h4 className="text-xs uppercase tracking-[0.3em] text-[#F5A800]/60 mb-4">Á krana · 0.4L</h4>
                            {BEERS.filter(b => b.type === "draft").map((item, i) => (
                                <PriceRow key={i} name={item.name} price={item.price} />
                            ))}
                        </div>
                        <div className="bg-[#F5A800]/5 border border-[#F5A800]/10 rounded-lg p-6">
                            <h4 className="text-xs uppercase tracking-[0.3em] text-[#F5A800]/60 mb-4">Flöskur / Dósir</h4>
                            {BEERS.filter(b => b.type === "bottle").map((item, i) => (
                                <PriceRow key={i} name={item.name} price={item.price} />
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* SHOTS */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Shots" color="pink" />
                    <div className="bg-[#C8891A]/5 border border-[#C8891A]/15 rounded-lg p-6">
                        {SHOTS.map((item, i) => (
                            <PriceRow key={i} name={item.name} price={item.price} />
                        ))}
                    </div>
                </motion.section>

                {/* WINE */}
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SectionHeader title="Vín" color="green" />
                    <div className="bg-[#C13A1A]/5 border border-[#C13A1A]/15 rounded-lg p-6 space-y-4">
                        {WINES.map((wine, i) => (
                            <div key={i} className="py-3 border-b border-white/5 last:border-b-0">
                                <div className="text-[#F5E8D0] font-medium tracking-wide text-sm md:text-base">{wine.name}</div>
                                <div className="flex gap-6 mt-1.5 text-xs text-[#E8C87A] font-mono">
                                    <span>Glas: {wine.glass}</span>
                                    <span>Flaska: {wine.bottle}</span>
                                </div>
                            </div>
                        ))}
                        {/* Bollinger special */}
                        <div className="pt-4 border-t border-[#F5A800]/10 text-center">
                            <span className="text-[#F5A800] font-medium tracking-wider">Bollinger 750ml</span>
                            <span className="block text-xl font-bold text-[#E8C87A] font-mono mt-1">40.000 kr</span>
                        </div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
