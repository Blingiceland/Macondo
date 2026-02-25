"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function BookingForm() {
    const [step, setStep] = useState<'DETAILS' | 'RIDDLE' | 'CONFIRMADO'>('DETAILS');
    const [formData, setFormData] = useState({ name: '', guests: '2', time: '22:00', email: '' });
    const [riddleAnswer, setRiddleAnswer] = useState('');
    const [errorShake, setErrorShake] = useState(false);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('RIDDLE');
    };

    const handleRiddleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const answer = riddleAnswer.toLowerCase().trim();
        if (['ice', 'hielo', 'ís', 'tequila', 'macondo', 'butterfly', 'fiðrildi', 'mariposa'].some(a => answer.includes(a))) {
            setStep('CONFIRMADO');
        } else {
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
        }
    };

    return (
        <div className="py-20 px-6 w-full max-w-2xl mx-auto mb-20 text-center">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-lg border-2 transition-all duration-700 relative overflow-hidden border-[#D4A017]/30 bg-[#0B0E1A]/80 shadow-[0_0_50px_rgba(244,208,63,0.05)]"
            >
                {/* Top Glow — radiant yellow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent opacity-40" />

                <h2 className="text-3xl mb-8 font-bold font-sans uppercase tracking-[0.2em] text-[#F5E6CC]">
                    {step === 'CONFIRMADO' ? "VELKOMIN Í MACONDO" : "BÓKA BORÐ"}
                </h2>

                {/* STEP 1: DETAILS */}
                {step === 'DETAILS' && (
                    <motion.form
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleDetailsSubmit} className="space-y-6 text-left"
                    >
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Nafn</label>
                            <input
                                type="text" required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white"
                                placeholder="Nafnið þitt, ferðalangur"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Gestir</label>
                                <input
                                    type="number" min="1" required
                                    value={formData.guests}
                                    onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                    className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Tími</label>
                                <input
                                    type="time" required
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 opacity-70 text-[#F4D03F]">Netfang</label>
                            <input
                                type="email" required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 bg-transparent border-b-2 focus:outline-none transition-colors border-zinc-800 focus:border-[#F4D03F] text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 mt-8 font-bold tracking-widest transition-all duration-300 transform hover:scale-[1.02] bg-[#E91E63] text-white hover:bg-[#F06292] shadow-[0_0_20px_rgba(233,30,99,0.2)]"
                        >
                            ÁFRAM
                        </button>
                    </motion.form>
                )}

                {/* STEP 2: RIDDLE */}
                {step === 'RIDDLE' && (
                    <motion.form
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleRiddleSubmit}
                        className={`space-y-8 text-center ${errorShake ? 'animate-shake' : ''}`}
                    >
                        <div className="text-[#F5E6CC] text-lg italic opacity-80 font-serif">
                            &ldquo;José Arcadio Buendía snerti ísinn<br />
                            og kallaði hann mestu uppfinningu á jörðinni.<br />
                            Hvað snerti hann?&rdquo;
                        </div>
                        <input
                            type="text" autoFocus
                            value={riddleAnswer}
                            onChange={e => setRiddleAnswer(e.target.value)}
                            placeholder="Svar..."
                            className="w-full text-center text-2xl p-4 bg-transparent border-b-2 border-[#F4D03F] text-[#F4D03F] focus:outline-none uppercase tracking-widest"
                        />
                        <button
                            type="submit"
                            className="w-full py-4 font-bold tracking-[0.3em] bg-transparent border-2 border-[#F4D03F] text-[#F4D03F] hover:bg-[#F4D03F] hover:text-[#0B0E1A] transition-all"
                        >
                            SVARA
                        </button>
                    </motion.form>
                )}

                {/* STEP 3: CONFIRMADO */}
                {step === 'CONFIRMADO' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                        <div className="relative border p-8 border-[#D4A017]/40 bg-[#0B0E1A]/90 text-left font-serif text-sm text-[#F4D03F] shadow-[inset_0_0_50px_rgba(244,208,63,0.03)]">
                            <div className="absolute top-2 right-2 border border-[#E91E63] px-3 py-1 transform rotate-6 opacity-60">
                                <span className="text-sm font-bold text-[#F48FB1] tracking-widest">STAÐFEST</span>
                            </div>

                            <p className="mb-4 text-center text-white/40 tracking-widest text-xs uppercase">— Sáttmáli Macondo —</p>
                            <p className="mb-4 text-[#F5E6CC]">
                                <span className="font-bold text-[#F4D03F] text-lg border-b border-[#D4A017]">{formData.name}</span>, þér hefur verið veittur aðgangur að Macondo.
                            </p>
                            <p className="mb-4 text-[#F5E6CC]/80">
                                DAGSETNING: <span className="text-white">Í kvöld</span> <br />
                                TÍMI: <span className="text-white">{formData.time}</span> <br />
                                GESTIR: <span className="text-white">{formData.guests}</span>
                            </p>
                            <p className="mb-8 italic opacity-50 text-sm text-[#F48FB1]">
                                &ldquo;Heimurinn var svo nýr að margt vantaði enn nöfn, og til þess að benda á hlutina var nauðsynlegt að benda.&rdquo;
                            </p>
                            <div className="w-full h-16 border-b border-dashed border-[#D4A017]/30 flex items-end justify-center pb-2 relative">
                                <span className="font-serif text-3xl text-[#F4D03F] opacity-80 rotate-[-3deg] absolute bottom-2">{formData.name}</span>
                            </div>
                        </div>
                        <button onClick={() => setStep('DETAILS')} className="mt-8 text-xs underline opacity-50 hover:opacity-100 text-[#F48FB1]">Bóka aftur</button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
