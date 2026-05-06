"use client";

import { motion, Variants } from "framer-motion";

interface Drink {
    name: string;
    description: string;
    price: string;
}

const COCKTAILS: Drink[] = [
    { name: "YELLOW BUTTERFLY", description: "Padrecito tequila, Silvio Carta Limoncello, Adriatico Bianco Amaretto, Lemon, Egg white", price: "3490 ISK" },
    { name: "BANANA CO.", description: "Padrecito, X by Xiaman Mezcal, Guajillo Chili, Ancho Chili, Banana Skyr, Lemon", price: "3490 ISK" },
    { name: "RAIN FOR FOUR YEARS", description: "1800 Blanco, Plantaray Coconut Rum, Aloe Vera, Agave, Lime, Icelandic Glacial Sparkling Water", price: "3490 ISK" },
    { name: "THE FIFTH LEAF", description: "Los Siete Misterios Mezcal, Lime leaf, Green Chili, Celery, Lime", price: "3490 ISK" },
    { name: "THE PINK ECHO", description: "1800 Blanco, Strawberry, Agave, Lime, 3cent Lemonade", price: "3490 ISK" },
    { name: "EL JARDÍN DE MACONDO", description: "Aguardiente, Cucumber, Lime, Agave, Icelandic Glacial Sparkling Water", price: "3490 ISK" },
    { name: "MARGARITA", description: "1800 Blanco tequila, Cointreau, lime", price: "3390 ISK" },
    { name: "PALOMA", description: "1800 Reposado Tequila, 3 cent Grapefruit, Lime, Salt", price: "3390 ISK" },
    { name: "TOMMY'S MARGARITA", description: "Padrecito tequila, Lime, Agave, Salt", price: "3390 ISK" },
    { name: "TEQUILA SUNRISE", description: "1800 Reposado tequila, Orange juice, grenadine", price: "3390 ISK" },
    { name: "SPICY MARGARITA", description: "1800 Reposado tequila, Chili, Lime, Agave, Tajin, Salt", price: "3490 ISK" },
];

const SHOTS: Drink[] = [
    { name: "1800 ANEJO", description: "Smoked Cinnamon & Orange", price: "2200 ISK" },
    { name: "CLASE AZUL REPOSADO", description: "Paired with Dark chocolate", price: "6500 ISK" },
    { name: "PADRE AZUL BLANCO", description: "Dried peach", price: "2950 ISK" },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.06,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

function DrinkCard({ drink, index }: { drink: Drink; index: number }) {
    return (
        <motion.li
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="list-none"
        >
            <article className="group relative overflow-hidden rounded-lg bg-[#140c09]/60 border border-[#c6a46c]/20 hover:border-[#c6a46c]/50 transition-all duration-300 h-full flex flex-col p-5 shadow-md hover:shadow-[0_0_20px_rgba(198,164,108,0.10)]">
                {/* Gold accent top bar */}
                <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#c6a46c] to-[#e8c98a] group-hover:w-full transition-all duration-500 ease-out" />

                <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-sm font-bold tracking-wider text-[#c6a46c] leading-snug">
                        {drink.name}
                    </h3>
                    <span className="text-xs opacity-80 whitespace-nowrap ml-3 text-[#c6a46c] font-mono">
                        {drink.price}
                    </span>
                </div>
                <div
                    className="h-px w-full mb-3 bg-gradient-to-r from-[#c6a46c]/30 to-transparent"
                    aria-hidden="true"
                />
                <p className="text-xs opacity-55 font-light tracking-wide text-[#f5f2ee] leading-relaxed flex-1">
                    {drink.description}
                </p>
            </article>
        </motion.li>
    );
}

export default function CocktailMenu() {
    return (
        <div className="pt-8 pb-20 px-6 w-full max-w-6xl mx-auto">

            {/* COCKTAILS SECTION */}
            <section id="cocktails" aria-label="Kokteilar">
                <motion.div
                    className="mb-28"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                >
                    <div className="text-center mb-14">
                        <h2
                            className="text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-[#c6a46c]"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Remedios
                        </h2>
                        <p
                            className="text-xs md:text-sm tracking-[0.2em] mt-3 text-[#f5f2ee]/40"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Kokteilar
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-0">
                        {COCKTAILS.map((drink, index) => (
                            <DrinkCard key={drink.name} drink={drink} index={index} />
                        ))}
                    </ul>
                </motion.div>
            </section>

            {/* SHOTS SECTION */}
            <section id="shots" aria-label="Skot">
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                >
                    <div className="text-center mb-14">
                        <h2
                            className="text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-[#c6a46c]"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Rituals
                        </h2>
                        <p
                            className="text-xs md:text-sm tracking-[0.2em] mt-3 text-[#f5f2ee]/40"
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                        >
                            Skot
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 p-0">
                        {SHOTS.map((drink, index) => (
                            <DrinkCard key={drink.name} drink={drink} index={index} />
                        ))}
                    </ul>
                </motion.div>
            </section>

        </div>
    );
}
