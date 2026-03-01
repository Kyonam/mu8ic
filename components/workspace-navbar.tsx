"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export const WorkspaceNavbar = () => {
    const { user, signOut } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-transparent">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="font-schoolbell text-2xl font-bold tracking-wider text-white">
                        mu8ic
                    </div>
                </Link>

                {/* Center: Search Input with Glass Design */}
                <div className="hidden flex-grow justify-center px-8 md:flex">
                    <div className="relative w-full max-w-md group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/20 group-focus-within:text-white/40 transition-colors z-10">
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="h-10 w-full rounded-2xl border border-white/10 bg-white/[0.05] pl-10 pr-4 text-xs font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-white/[0.08] focus:ring-4 focus:ring-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/20"
                        />
                    </div>
                </div>

                {/* Right: Profile */}
                <div className="flex items-center">
                    <div
                        className="relative"
                        onMouseEnter={() => setIsProfileOpen(true)}
                        onMouseLeave={() => setIsProfileOpen(false)}
                    >
                        <motion.button
                            className="flex items-center space-x-3 rounded-full border border-white/10 bg-white/[0.05] p-1.5 pr-3 transition-all hover:bg-white/[0.1] backdrop-blur-md"
                        >
                            <div className="h-7 w-7 overflow-hidden rounded-full border border-white/10 bg-gradient-to-tr from-yellow-400/80 to-orange-500/80">
                                {user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <UserIcon className="h-3.5 w-3.5 text-white" />
                                    </div>
                                )}
                            </div>
                            <span className="max-w-[100px] truncate text-[11px] font-semibold text-white/80">
                                {user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}
                            </span>
                            <ChevronDown className={`h-3 w-3 text-white/40 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/90 shadow-2xl backdrop-blur-3xl"
                                >
                                    <div className="p-2">
                                        <div className="mb-2 px-3 py-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Account</p>
                                            <p className="mt-1 truncate text-xs font-medium text-white/60">{user?.email}</p>
                                        </div>
                                        <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                                            <UserIcon className="h-4 w-4" />
                                            <span>Profile Settings</span>
                                        </button>
                                        <div className="my-1 h-[1px] bg-white/5" />
                                        <button
                                            onClick={() => signOut()}
                                            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};
