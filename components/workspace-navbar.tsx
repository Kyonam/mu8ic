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

                {/* Center: Title or Space (Search removed from here) */}
                <div className="hidden flex-grow justify-center px-8 md:flex">
                </div>

                {/* Right: Profile */}
                <div className="flex items-center">
                    <UserProfile />
                </div>
            </div>
        </nav>
    );
};
