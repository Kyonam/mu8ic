"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
    tier: string;
    price: string;
    description: string;
    credits: string;
    features: string[];
    index: number;
    isPopular?: boolean;
}

const PricingCard = ({ tier, price, description, credits, features, index, isPopular }: PricingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300",
                isPopular
                    ? "bg-white/[0.05] border-[#FECD00]/50 shadow-[0_0_40px_-15px_rgba(254,205,0,0.3)] scale-105 z-10"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
            )}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FECD00] text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-sm font-bold tracking-[0.2em] text-[#FECD00] uppercase mb-4">{tier}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    {price !== "Free" && <span className="text-white/40 text-sm font-sans">/one-time</span>}
                </div>
                <p className="mt-4 text-sm text-white/60 font-sans leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-[#FECD00]" />
                    <span className="text-lg font-bold text-white">{credits}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Generation Credits</p>
            </div>

            <ul className="mb-8 space-y-4 flex-grow">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-white/50 font-sans">
                        <Check className="h-4 w-4 text-[#FECD00] shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button className={cn(
                "w-full py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all active:scale-95",
                isPopular
                    ? "bg-[#FECD00] text-background hover:shadow-[0_0_20px_rgba(254,205,0,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            )}>
                Get Started
            </button>
        </motion.div>
    );
};

export const PricingSection = () => {
    const tiers = [
        {
            tier: "Starter",
            price: "Free",
            description: "Perfect for exploring AI music generation for your first project.",
            credits: "5 Credits",
            features: [
                "Standard quality generation",
                "Non-commercial usage",
                "Community support",
                "Basic generation length"
            ]
        },
        {
            tier: "Pro",
            price: "$29",
            description: "The best value for individual creators and YouTubers.",
            credits: "50 Credits",
            isPopular: true,
            features: [
                "High-fidelity generation",
                "Commercial license included",
                "Priority generation",
                "Extended track length",
                "Advanced style controls"
            ]
        },
        {
            tier: "Ultra",
            price: "$99",
            description: "Unlimited potential for power users and content studios.",
            credits: "200 Credits",
            features: [
                "Studio-grade lossless audio",
                "Full commercial rights",
                "Dedicated cloud access",
                "Fastest generation speed",
                "Multi-track stems export",
                "Personal support"
            ]
        }
    ];

    return (
        <section className="relative w-full bg-[#0a0a0a] py-24 px-8 md:px-12 font-sans overflow-hidden border-t border-white/5">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-20 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-pirata uppercase tracking-tight text-white mb-6"
                    >
                        Simple Credit-Based Pricing
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <p className="text-white/40 max-w-xl leading-relaxed font-sans mb-8">
                            No monthly subscriptions. No hidden fees. <br className="hidden md:block" />
                            Only pay for what you create. Purchase credits once and use them forever.
                        </p>

                        <div className="flex items-center gap-4 py-2 px-6 rounded-full bg-[#FECD00]/10 border border-[#FECD00]/20">
                            <Star className="h-4 w-4 text-[#FECD00] animate-pulse" />
                            <span className="text-[10px] font-bold tracking-widest text-[#FECD00] uppercase">
                                No Expiration on Credits
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {tiers.map((tier, index) => (
                        <PricingCard key={index} {...tier} index={index} />
                    ))}
                </div>

                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
                    <span className="text-[200px] md:text-[300px] font-pirata text-white/[0.02] select-none leading-none tracking-tighter">
                        PRICING
                    </span>
                </div>
            </div>
        </section>
    );
};
