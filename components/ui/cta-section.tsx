"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Silk } from './silk-background';
import { useAuth } from '@/context/AuthContext';

export const CTASection = () => {
    const { user } = useAuth();

    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Silk Background - Using accented yellow colors to match brand */}
            <Silk
                color="#FECD00"
                speed={1.5}
                scale={0.4}
                noiseIntensity={0.5}
            />

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="relative z-20 container mx-auto px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-pirata uppercase tracking-tight text-white mb-6">
                        Ready to Transform <br /> Your Content?
                    </h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-10 font-sans leading-relaxed">
                        Join thousands of creators using mu8ic to generate perfect,
                        royalty-free soundtracks in seconds. Stop searching, start creating.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href={user ? "/workspace" : "/auth"}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-black px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl hover:shadow-white/20"
                        >
                            Get Started Now
                        </motion.a>
                        <motion.a
                            href="#"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-transparent text-white border border-white/30 px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-white/10"
                        >
                            View Examples
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative bottom fade to blend with potential footer */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-15" />
        </section>
    );
};
