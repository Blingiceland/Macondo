"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Drink {
    name: string;
    description: string;
    price: string;
    image?: string;
}

const COCKTAILS: Drink[] = [
    { name: "YELLOW BUTTERFLY", description: "Padrecito tequila, Silvio Carta Limoncello, Adriatico Bianco Amaretto, Lemon, Egg white", price: "3490 ISK", image: "/images/cocktail-yellow-butterfly.png" },
    { name: "BANANA CO.", description: "Padrecito, X by Xiaman Mezcal, Guajillo Chili, Ancho Chili, Banana Skyr, Lemon", price: "3490 ISK", image: "/images/cocktail-banana-co.png" },
    { name: "RAIN FOR FOUR YEARS", description: "1800 Blanco, Plantaray Coconut Rum, Aloe Vera, Agave, Lime, Icelandic Glacial Sparkling Water", price: "3490 ISK", image: "/images/cocktail-rain.png" },
    { name: "THE FIFTH LEAF", description: "Los Siete Misterios Mezcal, Lime leaf, Green Chili, Celery, Lime", price: "3490 ISK", image: "/images/cocktail-fifth-leaf.png" },
    { name: "THE PINK ECHO", description: "1800 Blanco, Strawberry, Agave, Lime, 3cent Lemonade", price: "3490 ISK", image: "/images/cocktail-pink-echo.png" },
    { name: "EL JARDÍN DE MACONDO", description: "Aguardiente, Cucumber, Lime, Agave, Icelandic Glacial Sparkling Water", price: "3490 ISK", image: "/images/cocktail-garden.png" },
    { name: "MARGARITA", description: "1800 Blanco tequila, Cointreau, lime", price: "3390 ISK", image: "/images/cocktail-margarita.png" },
    { name: "PALOMA", description: "1800 Reposado Tequila, 3 cent Grapefruit, Lime, Salt", price: "3390 ISK", image: "/images/cocktail-paloma.png" },
    { name: "TOMMY'S MARGARITA", description: "Padrecito tequila, Lime, Agave, Salt", price: "3390 ISK", image: "/images/cocktail-tommy.png" },
    { name: "TEQUILA SUNRISE", description: "1800 Reposado tequila, Orange juice, grenadine", price: "3390 ISK", image: "/images/cocktail-sunrise.png" },
    { name: "SPICY MARGARITA", description: "1800 Reposaso tequila, Chili, Lime, Agave, Tajin, Salt", price: "3490 ISK", image: "/images/cocktail-spicy.png" },
];

const SHOTS: Drink[] = [
    { name: "1800 ANEJO", description: "Smoked Cinnamon & Orange", price: "2200 ISK", image: "/images/shot-anejo.png" },
    { name: "CLASE AZUL REPOSADO", description: "Paired with Dark chocolate", price: "6500 ISK", image: "/images/shot-clase-azul.png" },
    { name: "PADRE AZUL BLANCO", description: "Dried peach", price: "2950 ISK", image: "/images/shot-padre-azul.png" },
];

export default function CocktailMenu() {
    return (
        <div className="pt-8 pb-28 px-6 w-full max-w-6xl mx-auto">

            {/* COCKTAILS SECTION */}
            <section id="cocktails" aria-label="Kokteilar">
            <motion.div   className="mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-[#c6a46c]"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}>
                        Remedios
                    </h2>
                    <p className="text-xs md:text-sm tracking-[0.2em] mt-3 text-[#f5f2ee]/40" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Kokteilar
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
                    {COCKTAILS.map((drink, index) => (
                        <motion.li
                            key={`cocktail-${index}`}
                            
                            
                            transition={{ delay: index * 0.1 }}
                        >
                        <article className="group relative overflow-hidden rounded-lg bg-[#0f0a08]/50 border border-[#c6a46c]/20 hover:border-[#c6a46c]/50 transition-all duration-300 h-full">
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
                                    <h3 className="text-sm font-bold tracking-wider text-[#c6a46c]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-xs opacity-80 whitespace-nowrap ml-2 text-[#c6a46c] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#c6a46c]/40 to-transparent" aria-hidden="true" />
                                <p className="text-xs opacity-70 font-light tracking-wide text-[#f5f2ee]">
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
            <motion.div  >
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-[#c6a46c]"
                        style={{ fontFamily: "var(--font-cinzel), serif" }}>
                        Rituals
                    </h2>
                    <p className="text-xs md:text-sm tracking-[0.2em] mt-3 text-[#f5f2ee]/40" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Skot
                    </p>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 list-none p-0">
                    {SHOTS.map((drink, index) => (
                        <motion.li
                            key={`shot-${index}`}
                            
                            
                            transition={{ delay: index * 0.1 }}
                        >
                        <article className="group relative overflow-hidden rounded-lg bg-[#0f0a08]/50 border border-[#c6a46c]/20 hover:border-[#c6a46c]/50 transition-all duration-300 h-full">
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
                                    <h3 className="text-sm font-bold tracking-wider text-[#c6a46c]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-xs opacity-80 whitespace-nowrap ml-2 text-[#c6a46c] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#c6a46c]/40 to-transparent" aria-hidden="true" />
                                <p className="text-xs opacity-70 font-light tracking-wide text-[#f5f2ee]">
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
