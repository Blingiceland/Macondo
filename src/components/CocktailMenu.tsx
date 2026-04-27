"use client";

import { motion } from "framer-motion";
import NeonMenuHeader from "./effects/NeonMenuHeader";
import Image from "next/image";

interface Drink {
    name: string;
    description: string;
    price: string;
    image?: string;
}

const COCKTAILS: Drink[] = [
    {
        name: "YELLOW BUTTERFLY",
        description: "Padrecito tequila, Silvio Carta Limoncello, Adriatico Bianco Amaretto, Lemon, Egg white",
        price: "3490 ISK",
    },
    {
        name: "BANANA CO.",
        description: "Padrecito, X by Xiaman Mezcal, Guajillo Chili, Ancho Chili, Banana Skyr, Lemon",
        price: "3490 ISK",
    },
    {
        name: "RAIN FOR FOUR YEARS",
        description: "1800 Blanco, Plantaray Coconut Rum, Aloe Vera, Agave, Lime, Icelandic Glacial Sparkling Water",
        price: "3490 ISK",
    },
    {
        name: "THE FIFTH LEAF",
        description: "Los Siete Misterios Mezcal, Lime leaf, Green Chili, Celery, Lime",
        price: "3490 ISK",
    },
    {
        name: "THE PINK ECHO",
        description: "1800 Blanco, Strawberry, Agave, Lime, 3cent Lemonade",
        price: "3490 ISK",
    },
    {
        name: "EL JARDÍN DE MACONDO",
        description: "Aguardiente, Cucumber, Lime, Agave, Icelandic Glacial Sparkling Water",
        price: "3490 ISK",
    },
    {
        name: "MARGARITA",
        description: "1800 Blanco tequila, Cointreau, lime",
        price: "3390 ISK",
    },
    {
        name: "PALOMA",
        description: "1800 Reposado Tequila, 3 cent Grapefruit, Lime, Salt",
        price: "3390 ISK",
    },
    {
        name: "TOMMY'S MARGARITA",
        description: "Padrecito tequila, Lime, Agave, Salt",
        price: "3390 ISK",
    },
    {
        name: "TEQUILA SUNRISE",
        description: "1800 Reposado tequila, Orange juice, grenadine",
        price: "3390 ISK",
    },
    {
        name: "SPICY MARGARITA",
        description: "1800 Reposaso tequila, Chili, Lime, Agave, Tajin, Salt",
        price: "3490 ISK",
    },
];

const SHOTS: Drink[] = [
    {
        name: "1800 ANEJO",
        description: "Smoked Cinnamon & Orange",
        price: "2200 ISK",
    },
    {
        name: "CLASE AZUL REPOSADO",
        description: "Paired with Dark chocolate",
        price: "6500 ISK",
    },
    {
        name: "PADRE AZUL BLANCO",
        description: "Dried peach",
        price: "2950 ISK",
    },
];

export default function CocktailMenu() {
    return (
        <div className="py-20 px-6 w-full max-w-6xl mx-auto">

            {/* COCKTAILS SECTION */}
            <section id="cocktails" aria-label="Kokteilar">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-24">
                <div className="text-center mb-12">
                    <NeonMenuHeader text="REMEDIOS" color="yellow" />
                    <p className="text-xs md:text-sm uppercase tracking-[0.3em] mt-3 text-[#F5E8D0]/50" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Kokteilar
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
                    {COCKTAILS.map((drink, index) => (
                        <motion.li
                            key={`cocktail-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                        <article className="group relative overflow-hidden rounded-lg bg-[#7A3020]/80 border border-[#F5A800]/15 hover:border-[#F5A800]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(245,168,0,0.1)] h-full">
                            {drink.image && (
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <Image
                                        src={drink.image}
                                        alt={drink.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                            )}

                            <div className="p-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-lg font-bold tracking-wider text-[#F5A800]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-sm opacity-80 whitespace-nowrap ml-2 text-[#E8C87A] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#F5A800]/60 to-transparent" aria-hidden="true" />
                                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E8D0]">
                                    {drink.description}
                                </p>
                            </div>
                        </article>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
            </section>

            {/* SHOTS SECTION */}
            <section id="shots" aria-label="Skot">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <div className="text-center mb-12">
                    <NeonMenuHeader text="RITUALS" color="pink" />
                    <p className="text-xs md:text-sm uppercase tracking-[0.3em] mt-3 text-[#F5E8D0]/50" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Skot
                    </p>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 list-none p-0">
                    {SHOTS.map((drink, index) => (
                        <motion.li
                            key={`shot-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                        <article className="group relative overflow-hidden rounded-lg bg-[#7A3020]/80 border border-[#C8891A]/15 hover:border-[#C8891A]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(200,137,26,0.1)] h-full">
                            {drink.image && (
                                <div className="relative w-full aspect-square overflow-hidden">
                                    <Image
                                        src={drink.image}
                                        alt={drink.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                            )}

                            <div className="p-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-base font-bold tracking-wider text-[#C8891A]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-xs opacity-80 whitespace-nowrap ml-2 text-[#C8891A] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#C8891A]/60 to-transparent" aria-hidden="true" />
                                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E8D0]">
                                    {drink.description}
                                </p>
                            </div>
                        </article>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
            </section>

        </div>
    );
}
