"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceNavbar } from '@/components/workspace-navbar';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkspacePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
        }
    }, [user, isLoading, router]);

    const handleSendMessage = (message: string, files?: File[]) => {
        console.log('Sending message to AI:', message, files);
        // For now, just add to a local list or log
        setMessages(prev => [...prev, message]);
    };

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#171717] text-white/50">
                <div className="h-4 w-4 animate-ping rounded-full bg-white/20" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#171717] text-white font-sans overflow-hidden relative">
            {/* Transparent Workspace Navbar with Glass Search */}
            <WorkspaceNavbar />

            {/* Main Area (currently empty as requested) */}
            <main className="flex-grow flex flex-col items-center justify-center p-8 relative">
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-4xl font-schoolbell opacity-20 select-none">mu8ic ai</h2>
                            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/10 select-none">Ready to generate your next soundtrack</p>
                        </motion.div>
                    ) : (
                        <div className="w-full max-w-2xl overflow-y-auto max-h-[60vh] space-y-4 px-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-white/60"
                                >
                                    {msg}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Fixed Bottom Prompt Box */}
            <div className="sticky bottom-0 left-0 right-0 flex justify-center p-8 pb-12 z-40 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-3xl"
                >
                    <PromptInputBox
                        onSend={handleSendMessage}
                        placeholder="Describe the mood for your next YouTube background music..."
                    />
                    <p className="mt-4 text-center text-[9px] uppercase tracking-widest text-white/20">
                        mu8ic AI can generate royalty-free soundtracks based on your prompts.
                    </p>
                </motion.div>
            </div>

            {/* Subtle background aesthetics */}
            <div className="fixed bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-yellow-500/[0.02] blur-[150px]" />
            <div className="fixed top-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/[0.02] blur-[150px]" />
        </div>
    );
}
