"use client";

import { motion } from "framer-motion";

/* ================================================================
   DRYKKJASEÐILL — listaform eins og á prentuðum seðli
   ================================================================ */

interface Drink {
    name: string;
    description: string;
    /** Verð í krónum. */
    price: number;
}

const COCKTAILS: Drink[] = [
    { name: "Yellow Butterfly", description: "Padrecito tequila, Silvio Carta Limoncello, Adriatico Bianco Amaretto, Lemon, Egg white", price: 3490 },
    { name: "Banana Co.", description: "Padrecito, X by Xiaman Mezcal, Guajillo Chili, Ancho Chili, Banana Skyr, Lemon", price: 3490 },
    { name: "Rain for Four Years", description: "1800 Blanco, Plantaray Coconut Rum, Aloe Vera, Agave, Lime, Icelandic Glacial Sparkling Water", price: 3490 },
    { name: "The Fifth Leaf", description: "Los Siete Misterios Mezcal, Lime leaf, Green Chili, Celery, Lime", price: 3490 },
    { name: "The Pink Echo", description: "1800 Blanco, Strawberry, Agave, Lime, 3cent Lemonade", price: 3490 },
    { name: "El Jardín de Macondo", description: "Aguardiente, Cucumber, Lime, Agave, Icelandic Glacial Sparkling Water", price: 3490 },
    { name: "Margarita", description: "1800 Blanco tequila, Cointreau, Lime", price: 3390 },
    { name: "Paloma", description: "1800 Reposado Tequila, 3 cent Grapefruit, Lime, Salt", price: 3390 },
    { name: "Tommy's Margarita", description: "Padrecito tequila, Lime, Agave, Salt", price: 3390 },
    { name: "Tequila Sunrise", description: "1800 Reposado tequila, Orange juice, Grenadine", price: 3390 },
    { name: "Spicy Margarita", description: "1800 Reposado tequila, Chili, Lime, Agave, Tajín, Salt", price: 3490 },
];

const SHOTS: Drink[] = [
    { name: "1800 Añejo", description: "Smoked cinnamon & orange", price: 2200 },
    { name: "Clase Azul Reposado", description: "Paired with dark chocolate", price: 6500 },
    { name: "Padre Azul Blanco", description: "Dried peach", price: 2950 },
];

const LABELS = {
    is: { cocktails: "Kokteilar", shots: "Skot", note: "Öll verð í íslenskum krónum" },
    en: { cocktails: "Cocktails", shots: "Shots", note: "All prices in Icelandic krónur" },
} as const;

function formatPrice(price: number, lang: "is" | "en"): string {
    const n = price.toLocaleString(lang === "is" ? "de-DE" : "en-US");
    return lang === "is" ? `${n} kr.` : `${n} ISK`;
}

const cinzel = { fontFamily: "var(--font-cinzel), serif" };

function MenuItem({ drink, index, lang }: { drink: Drink; index: number; lang: "is" | "en" }) {
    return (
        <motion.li
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (index % 6) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="group list-none py-4 border-b border-[#c6a46c]/[0.12]"
        >
            <div className="flex items-baseline gap-3">
                <h3
                    className="text-[15px] md:text-[16px] font-semibold tracking-[0.1em] uppercase text-[#e2cc98] group-hover:text-[#f5f2ee] transition-colors duration-300"
                    style={cinzel}
                >
                    {drink.name}
                </h3>
                {/* Punktalína milli nafns og verðs, eins og á prentuðum seðli */}
                <span
                    aria-hidden="true"
                    className="flex-1 min-w-6 border-b border-dotted border-[#c6a46c]/40 -translate-y-1"
                />
                <span className="text-[13px] font-mono tracking-wide text-[#c6a46c] whitespace-nowrap">
                    {formatPrice(drink.price, lang)}
                </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed font-light text-[#f5f2ee]/50 md:pr-12">
                {drink.description}
            </p>
        </motion.li>
    );
}

function SectionHeading({ title, label }: { title: string; label: string }) {
    return (
        <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <h2
                className="text-2xl md:text-3xl font-bold tracking-[0.12em] uppercase text-[#c6a46c]"
                style={cinzel}
            >
                {title}
            </h2>
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase mt-2 text-[#f5f2ee]/40" style={cinzel}>
                {label}
            </p>
            <div className="w-12 h-px mx-auto mt-5 bg-gradient-to-r from-transparent via-[#c6a46c]/60 to-transparent" />
        </motion.div>
    );
}

export default function CocktailMenu({ lang = "is" }: { lang?: "is" | "en" }) {
    const t = LABELS[lang];

    return (
        <div className="pt-4 pb-16 px-6 w-full max-w-5xl mx-auto">

            {/* KOKTEILAR */}
            <section id="cocktails" aria-label={t.cocktails} className="mb-20">
                <SectionHeading title="Remedios" label={t.cocktails} />
                <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 p-0 m-0">
                    {COCKTAILS.map((drink, index) => (
                        <MenuItem key={drink.name} drink={drink} index={index} lang={lang} />
                    ))}
                </ul>
            </section>

            {/* SKOT */}
            <section id="shots" aria-label={t.shots}>
                <SectionHeading title="Rituals" label={t.shots} />
                <ul className="max-w-2xl mx-auto p-0 m-0">
                    {SHOTS.map((drink, index) => (
                        <MenuItem key={drink.name} drink={drink} index={index} lang={lang} />
                    ))}
                </ul>
            </section>

            <p className="text-center mt-10 text-[11px] tracking-[0.2em] uppercase text-[#f5f2ee]/25" style={cinzel}>
                {t.note}
            </p>
        </div>
    );
}
