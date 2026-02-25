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
        name: "Mariposa Amarilla",
        description: "Tequila, ástraldin, súr límón, gullstofsbarmur.",
        price: "2400 ISK",
        image: "/images/The_Sanguine_Saint.png",
    },
    {
        name: "Macondo Sunrise",
        description: "Tequila, greipaldinsgoði, grenadín, appelsínubörkur.",
        price: "2200 ISK",
        image: "/images/Eternal_Sunset.png",
    },
    {
        name: "La Lluvia",
        description: "Mezcal, greipaldín, rósmarín-reykur, salt.",
        price: "2300 ISK",
        image: "/images/Graveyard_Dust.png",
    },
    {
        name: "Aureliano",
        description: "Añejo tequila, agave, bitter, appelsínubörkur.",
        price: "2800 ISK",
        image: "/images/A_Stake_Through_The_Heart.png",
    },
    {
        name: "Melquíades",
        description: "Reykurkenndur, beiskur, dökkur. Einn fyrir gullgerðarmanninn.",
        price: "2600 ISK",
        image: "/images/Crimson_Peak.png",
    },
    {
        name: "Remedios la Bella",
        description: "Ylliblóm, límón, tequila blanco. Svífur upp.",
        price: "2400 ISK",
        image: "/images/La_Llorona.png",
    },
    {
        name: "Pilar Ternera",
        description: "Tequila, engifer, tamarind, chili-saltbarmur.",
        price: "2500 ISK",
        image: "/images/Lucifers_Reach.png",
    },
    {
        name: "Úrsula",
        description: "Tequila, bláber, basil, dökkur hunang.",
        price: "2700 ISK",
        image: "/images/Midnight_Garden.png",
    },
];

const SHOTS: Drink[] = [
    {
        name: "El Hielo",
        description: "Frosið tequila blanco. Fyrsta undurverkið.",
        price: "1500 ISK",
        image: "/images/Holy_Water.png",
    },
    {
        name: "Tierra",
        description: "Eikartunnuþroskað, djúpt og jarðneskt.",
        price: "1700 ISK",
        image: "/images/The_Antidote.png",
    },
    {
        name: "Las Cenizas",
        description: "Þykkt, dökkt, 1-3 ára þroskað. Allt verður að ösku.",
        price: "2000 ISK",
        image: "/images/Venom.png",
    },
    {
        name: "El Pergamino",
        description: "Kaffi-agave blanda. Skrifað á pergament.",
        price: "1600 ISK",
        image: "/images/Coffin_Nail.png",
    },
    {
        name: "Fuego",
        description: "Mezcal og brennandi chili-hiti. Allt brennur.",
        price: "1600 ISK",
        image: "/images/Hellfire.png",
    },
    {
        name: "El Circo",
        description: "Reykur og blekking. Sirkúsinn kemur í bæ.",
        price: "1800 ISK",
        image: "/images/Smoke_And_Mirrors.png",
    },
    {
        name: "Soledad",
        description: "Kókos, létt, sætt, einsamt.",
        price: "1600 ISK",
        image: "/images/Pale_Ghost.png",
    },
    {
        name: "Insomnia",
        description: "Jurtablanda. Enginn sefur í Macondo.",
        price: "1900 ISK",
        image: "/images/Viper_Bite.png",
    },
];

export default function CocktailMenu() {
    return (
        <div className="py-20 px-6 w-full max-w-6xl mx-auto">

            {/* COCKTAILS SECTION */}
            <motion.div id="cocktails" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-24">
                <div className="text-center mb-12">
                    <NeonMenuHeader text="REMEDIOS" color="yellow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {COCKTAILS.map((drink, index) => (
                        <motion.div
                            key={`cocktail-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-lg bg-[#0B0E1A]/80 border border-[#F4D03F]/15 hover:border-[#F4D03F]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(244,208,63,0.1)]"
                        >
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
                                    <h3 className="text-lg font-bold tracking-wider text-[#F4D03F]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-sm opacity-80 whitespace-nowrap ml-2 text-[#D4A017] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#F4D03F]/60 to-transparent" />
                                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E6CC]">
                                    {drink.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* SHOTS SECTION */}
            <motion.div id="shots" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <div className="text-center mb-12">
                    <NeonMenuHeader text="LA ALQUIMIA" color="pink" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    {SHOTS.map((drink, index) => (
                        <motion.div
                            key={`shot-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-lg bg-[#0B0E1A]/80 border border-[#E91E63]/15 hover:border-[#E91E63]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(233,30,99,0.1)]"
                        >
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
                                    <h3 className="text-base font-bold tracking-wider text-[#F48FB1]">
                                        {drink.name}
                                    </h3>
                                    <span className="text-xs opacity-80 whitespace-nowrap ml-2 text-[#E91E63] font-mono">
                                        {drink.price}
                                    </span>
                                </div>
                                <div className="h-px w-full my-2 bg-gradient-to-r from-[#E91E63]/60 to-transparent" />
                                <p className="text-xs opacity-90 font-light tracking-wide text-[#F5E6CC]">
                                    {drink.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
