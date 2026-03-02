"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { UserProfile } from './user-profile';

interface WorkspaceNavbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

export const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({ searchValue, onSearchChange }) => {
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
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-10 w-full rounded-2xl border border-white/10 bg-white/[0.05] pl-10 pr-4 text-xs font-medium text-white placeholder-white/20 outline-none transition-all focus:bg-white/[0.08] focus:ring-4 focus:ring-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/20"
                        />
                    </div>
                </div>

                {/* Right: Profile */}
                <div className="flex items-center">
                    <UserProfile />
                </div>
            </div>
        </nav>
    );
};
