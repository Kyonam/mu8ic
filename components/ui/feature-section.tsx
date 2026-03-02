"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Copyright, Download, Music, Zap, Share2, ShieldCheck } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    imageSrc: string;
    icon: React.ReactNode;
    index: number;
}

const FeatureCard = ({ title, description, imageSrc, icon, index }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 transition-all hover:bg-white/[0.06] hover:border-white/20"
        >
            <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                    src={imageSrc}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                />
            </div>
            <div className="p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FECD00] text-background">
                    {icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-sans">{description}</p>
            </div>
        </motion.div>
    );
};

export const FeatureSection = () => {
    const features = [
        {
            title: "Zero Copyright Issues",
            description: "No more worrying about copyright strikes. Every track generated is 100% royalty-free and safe for all platforms.",
            imageSrc: "/images/1.jpg",
            icon: <ShieldCheck className="h-5 w-5" />
        },
        {
            title: "Instant Generation",
            description: "Stop wasting hours searching for the right track. Generate high-quality music in seconds with just a few keywords.",
            imageSrc: "/images/2.jpg",
            icon: <Zap className="h-5 w-5" />
        },
        {
            title: "Custom Tailored Style",
            description: "Get music that actually fits your vibe. Our AI understands your content and creates music that matches your specific style.",
            imageSrc: "/images/3.jpg",
            icon: <Music className="h-5 w-5" />
        },
        {
            title: "No More Manual Downloads",
            description: "Say goodbye to endless mp3 downloads. Access your entire history and manage your tracks directly in the workspace.",
            imageSrc: "/images/4.jpg",
            icon: <Download className="h-5 w-5" />
        },
        {
            title: "Mood-Based Algorithms",
            description: "From cinematic swells to lo-fi beats, our algorithms are trained to capture the exact emotion your video needs.",
            imageSrc: "/images/5.jpg",
            icon: <Share2 className="h-5 w-5" />
        },
        {
            title: "Global Compatibility",
            description: "Use your generated music across YouTube, TikTok, Instagram, and more without any limitation on reach.",
            imageSrc: "/images/6.jpg",
            icon: <Copyright className="h-5 w-5" />
        }
    ];

    return (
        <section className="relative w-full bg-[#0a0a0a] py-24 px-8 md:px-12 font-sans overflow-hidden border-t border-white/5">
            <div className="mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-5xl md:text-6xl font-pirata uppercase tracking-tight text-white leading-none mb-6">
                            Every Feature <br /> You Ever Needed
                        </h2>
                        <p className="text-white/40 max-w-md leading-relaxed">
                            Stop compromising on your creative vision. mu8ic provides a complete toolkit to bring your soundtracks to life instantly.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden md:block"
                    >
                        <div className="text-[120px] font-pirata text-white/5 select-none leading-none tracking-tighter">
                            FEATURE
                        </div>
                    </motion.div>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            imageSrc={feature.imageSrc}
                            icon={feature.icon}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#FECD00]/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#FECD00]/5 blur-[120px]" />
        </section>
    );
};
