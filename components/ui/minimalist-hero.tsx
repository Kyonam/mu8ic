"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
    logoText: string;
    navLinks: { label: string; href: string }[];
    mainText: string;
    getStartedLink: string;
    imageSrc: string;
    imageAlt: string;
    overlayText: {
        part1: string;
        part2: string;
    };
    socialLinks?: { icon: LucideIcon; href: string }[];
    locationText?: string;
    className?: string;
    userProfile?: React.ReactNode;
}

// Helper component for navigation links
const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
    <a
        href={href}
        onClick={onClick}
        className="text-xs font-semibold tracking-widest text-foreground/60 transition-colors hover:text-foreground md:text-[10px] lg:text-xs"
    >
        {children}
    </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
        <Icon className="h-5 w-5" />
    </a>
);

// The main reusable Hero Section component
export const MinimalistHero = ({
    logoText,
    navLinks,
    mainText,
    getStartedLink,
    imageSrc,
    imageAlt,
    overlayText,
    socialLinks = [],
    locationText = "",
    className,
    userProfile,
}: MinimalistHeroProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            className={cn(
                'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-6 font-sans md:h-screen md:p-12',
                className
            )}
        >
            {/* Header */}
            <header className="z-50 flex w-full max-w-7xl items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-normal tracking-wider font-schoolbell md:text-3xl"
                >
                    {logoText}
                </motion.div>

                {/* Desktop Nav */}
                <div className="hidden items-center space-x-6 md:flex lg:space-x-8">
                    {navLinks.map((link) => (
                        <NavLink key={link.label} href={link.href}>
                            {link.label}
                        </NavLink>
                    ))}
                    {userProfile ? (
                        userProfile
                    ) : (
                        <motion.a
                            href={getStartedLink}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="rounded-full bg-foreground px-5 py-2 text-[10px] font-bold tracking-widest text-background transition-transform hover:scale-105 active:scale-95 lg:text-xs"
                        >
                            GET STARTED
                        </motion.a>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 md:hidden z-50 transition-colors active:bg-foreground/10"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 p-8 backdrop-blur-xl md:hidden"
                    >
                        <nav className="flex flex-col items-center space-y-8 text-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold tracking-widest text-foreground uppercase"
                                >
                                    {link.label}
                                </a>
                            ))}
                            {userProfile ? (
                                <div className="pt-4">{userProfile}</div>
                            ) : (
                                <a
                                    href={getStartedLink}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-full bg-foreground px-10 py-4 text-sm font-bold tracking-widest text-background uppercase shadow-xl"
                                >
                                    GET STARTED
                                </a>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="relative flex w-full max-w-7xl flex-grow flex-col items-center justify-center gap-y-12 md:gap-y-0 md:grid md:grid-cols-3 md:items-center">

                {/* Image Section (Now below headline on mobile) */}
                <div className="relative order-2 flex h-[35vh] w-full items-center justify-center overflow-visible md:order-2 md:h-full">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="absolute z-0 h-[220px] w-[220px] rounded-full bg-[#FECD00] md:h-[300px] md:w-[300px] lg:h-[450px] lg:w-[450px]"
                    ></motion.div>
                    <motion.img
                        src={imageSrc}
                        alt={imageAlt}
                        className="relative z-10 h-auto w-40 object-cover scale-125 md:w-56 md:scale-150 lg:w-72"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://placehold.co/400x600/eab308/ffffff?text=Creator`;
                        }}
                    />
                </div>

                {/* Left Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="z-20 order-3 mt-12 flex flex-col items-center text-center md:order-1 md:mt-0 md:items-start md:text-left"
                >
                    <p className="max-w-xs text-xs leading-relaxed text-foreground/70 md:text-sm lg:text-base font-sans">
                        {mainText}
                    </p>
                    <motion.a
                        href={getStartedLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-sm bg-foreground px-6 text-xs font-bold tracking-widest text-background transition-all hover:shadow-lg md:h-12 md:px-8 md:text-sm"
                    >
                        GET STARTED
                    </motion.a>
                </motion.div>

                {/* Right Headline Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="z-20 order-1 mt-6 flex items-center justify-center text-center md:order-3 md:mt-0 md:justify-end md:text-right"
                >
                    <h1 className="text-5xl text-foreground sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-pirata uppercase leading-[0.85] tracking-tight">
                        {overlayText.part1}
                        <br />
                        {overlayText.part2}
                    </h1>
                </motion.div>
            </div>

            {/* Footer Elements */}
            <footer className="z-30 mt-8 flex w-full max-w-7xl items-center justify-between border-t border-foreground/5 pt-6 md:mt-0 md:border-none md:pt-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="flex items-center space-x-5"
                >
                    {socialLinks.length > 0 ? (
                        socialLinks.map((link, index) => (
                            <SocialIcon key={index} href={link.href} icon={link.icon} />
                        ))
                    ) : (
                        <div className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">mu8ic labs</div>
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase md:text-xs"
                >
                    {locationText || "Based in Earth"}
                </motion.div>
            </footer>
        </div>
    );
};
