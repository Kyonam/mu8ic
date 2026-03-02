"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicItemProps {
    src: string;
    index: number;
}

const MusicItem = ({ src, index }: MusicItemProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                    className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow md:h-20 md:w-20"
                    onClick={togglePlay}
                >
                    {isPlaying ? (
                        <Pause className="h-5 w-5 text-background fill-background md:h-8 md:w-8" />
                    ) : (
                        <Play className="h-5 w-5 text-background fill-background ml-0.5 md:h-8 md:w-8" />
                    )}
                </motion.div>

                {/* Simple Visualizer ring when playing */}
                {isPlaying && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute h-12 w-12 rounded-full border-4 border-foreground pointer-events-none md:h-20 md:w-20"
                    />
                )}
            </div>
            <span className="mt-4 text-[9px] font-bold tracking-[0.2em] text-foreground opacity-60 uppercase md:text-[10px]">
                SAMPLE {index + 1}
            </span>
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export const ExampleSection = () => {
    const musicFiles = ["/music/1.mp3", "/music/2.mp3", "/music/3.mp3"];

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6 font-sans md:h-screen md:p-12 border-t border-foreground/5 py-20 md:py-0">
            {/* Center Background Circle - Heritage from Hero */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="h-[350px] w-[350px] rounded-full bg-[#FECD00] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] lg:h-[600px] lg:w-[600px]"
                />
            </div>

            <div className="relative grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-3 z-10">

                {/* Large Section Title (Top on mobile) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-1 flex items-center justify-center text-center md:order-3 md:justify-end md:text-right"
                >
                    <h1 className="text-5xl text-foreground sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-pirata uppercase leading-[0.8] tracking-tight">
                        EXAMPLE
                    </h1>
                </motion.div>

                {/* Center - 3 Music Players */}
                <div className="order-2 flex flex-col sm:flex-row items-center justify-center gap-10 md:order-2">
                    {musicFiles.map((src, i) => (
                        <MusicItem key={i} src={src} index={i} />
                    ))}
                </div>

                {/* Left Subtext - Subtitle (Bottom on mobile) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="order-3 text-center md:order-1 md:text-left"
                >
                    <p className="mx-auto max-w-xs text-xs leading-relaxed text-foreground/70 sm:text-sm md:mx-0 font-sans md:text-foreground/80">
                        Create the perfect soundtrack for your videos
                        <br className="hidden md:block" />
                        Our AI instantly suggests the ideal sound to match your unique mood and style
                    </p>
                </motion.div>

            </div>
        </section>
    );
};
