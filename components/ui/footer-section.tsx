"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Twitter, AtSign } from 'lucide-react';

export const FooterSection = () => {
    return (
        <footer className="w-full bg-[#0a0a0a] pt-24 pb-12 px-8 md:px-12 font-sans overflow-hidden border-t border-white/5">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between items-start mb-24">
                    {/* Left Side: Vertical Social Icons & Copyright */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center space-y-6"
                    >
                        <div className="flex flex-col space-y-6">
                            <a href="#" className="text-white/40 hover:text-[#FECD00] transition-colors" aria-label="X">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-[#FECD00] transition-colors" aria-label="Threads">
                                <AtSign className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-[#FECD00] transition-colors" aria-label="Youtube">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                        <div className="pt-12 text-[10px] font-bold tracking-widest text-white/20 uppercase whitespace-nowrap rotate-180 [writing-mode:vertical-lr]">
                            ⓒ 2026
                        </div>
                    </motion.div>

                    {/* Right Side: Vertical Links */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-end space-y-4"
                    >
                        {['features', 'pricing', 'privacy', 'terms'].map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all hover:translate-x-[-4px]"
                            >
                                {item}
                            </a>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom: Oversized Title */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex justify-center"
                >
                    <h1 className="text-[12vw] md:text-[15vw] lg:text-[20vw] font-pirata leading-none text-white/[0.03] select-none tracking-tighter uppercase whitespace-nowrap">
                        mu8ic
                    </h1>
                    {/* Reflected text effect for premium feel */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
                </motion.div>

                <div className="mt-8 text-center text-[9px] font-bold tracking-[0.5em] text-white/10 uppercase">
                    AI Music for the Next Generation of Creators
                </div>
            </div>
        </footer>
    );
};
