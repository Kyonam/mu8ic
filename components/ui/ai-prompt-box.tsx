"use client";

import React, { useState, useEffect, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    ArrowUp,
    X,
    StopCircle,
    Mic,
    Music,
    Clock,
    Layers,
    ChevronUp,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactDOM from "react-dom";

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
    <textarea
        className={cn(
            "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none overflow-y-auto",
            className
        )}
        ref={ref}
        rows={1}
        {...props}
    />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-xs text-white shadow-md",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Portal Modal for Lyrics
const LyricsModal = ({ isOpen, onClose, value, onChange }: { isOpen: boolean, onClose: () => void, value: string, onChange: (v: string) => void }) => {
    const [mounted, setMounted] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        if (isOpen) setLocalValue(value);
    }, [isOpen, value]);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleApply = () => {
        onChange(localValue);
        onClose();
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1F2023] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Music className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Song Lyrics</h3>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <textarea
                                autoFocus
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                placeholder="Enter your lyrics here... [Verse 1] [Chorus]"
                                className="w-full h-80 bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/30 transition-all resize-none font-mono text-sm leading-relaxed"
                            />
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="px-6 py-2.5 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

// Main PromptInputBox Component
interface PromptInputBoxProps {
    onSend?: (options: { prompt: string, lyrics: string, duration: number, batch_size: number }) => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}

export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
    const { onSend = () => { }, isLoading = false, placeholder = "Describe the mood, genre or instruments...", className } = props;

    // State
    const [input, setInput] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [duration, setDuration] = useState(30);
    const [batchSize, setBatchSize] = useState(1);

    // UI State
    const [isLyricsOpen, setIsLyricsOpen] = useState(false);
    const [showDurationMenu, setShowDurationMenu] = useState(false);
    const [showBatchMenu, setShowBatchMenu] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside handler to close menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDurationMenu(false);
                setShowBatchMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
        }
    }, [input]);

    const handleSubmit = () => {
        if (input.trim()) {
            onSend({
                prompt: input.trim(),
                lyrics: lyrics.trim(),
                duration,
                batch_size: batchSize
            });
            setInput("");
            setLyrics("");
            setDuration(30);
            setBatchSize(1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full max-w-3xl mx-auto flex flex-col gap-3", className)}
        >
            <div className={cn(
                "rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-2xl backdrop-blur-3xl transition-all duration-300",
                isLoading && "border-white/20 animate-pulse"
            )}>
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="min-h-[60px]"
                />

                <div className="flex items-center justify-between pt-2 px-1">
                    <div className="flex items-center gap-1.5">
                        {/* Lyrics Button */}
                        <button
                            onClick={() => {
                                setIsLyricsOpen(true);
                                setShowDurationMenu(false);
                                setShowBatchMenu(false);
                            }}
                            className={cn(
                                "flex h-8 items-center gap-2 rounded-full px-3 text-xs transition-all",
                                lyrics ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5"
                            )}
                        >
                            <Music className="h-3.5 w-3.5" />
                            <span>Lyrics</span>
                        </button>

                        <div className="h-4 w-[1px] bg-white/10 mx-1" />

                        {/* Duration Button */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowDurationMenu(!showDurationMenu);
                                    setShowBatchMenu(false);
                                }}
                                className={cn(
                                    "flex h-8 items-center gap-2 rounded-full px-3 text-xs transition-all",
                                    duration !== 30 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:bg-white/5"
                                )}
                            >
                                <Clock className="h-3.5 w-3.5" />
                                <span>{duration}s</span>
                            </button>
                            <AnimatePresence>
                                {showDurationMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full mb-2 left-0 w-32 bg-[#2E3033] border border-white/10 rounded-xl p-1 shadow-2xl z-[50]"
                                    >
                                        {[30, 60, 120, 180].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => { setDuration(d); setShowDurationMenu(false); }}
                                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <span>{d}s</span>
                                                {duration === d && <Check className="h-3 w-3 text-blue-400" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Batch Size Button */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowBatchMenu(!showBatchMenu);
                                    setShowDurationMenu(false);
                                }}
                                className={cn(
                                    "flex h-8 items-center gap-2 rounded-full px-3 text-xs transition-all",
                                    batchSize > 1 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-400 hover:bg-white/5"
                                )}
                            >
                                <Layers className="h-3.5 w-3.5" />
                                <span>Batch: {batchSize}</span>
                            </button>
                            <AnimatePresence>
                                {showBatchMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full mb-2 left-0 w-32 bg-[#2E3033] border border-white/10 rounded-xl p-1 shadow-2xl z-[50]"
                                    >
                                        {[1, 2, 3, 4].map((b) => (
                                            <button
                                                key={b}
                                                onClick={() => { setBatchSize(b); setShowBatchMenu(false); }}
                                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <span>{b} variation{b > 1 ? 's' : ''}</span>
                                                {batchSize === b && <Check className="h-3 w-3 text-orange-400" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                            input.trim() ? "bg-white text-black" : "bg-white/5 text-gray-500"
                        )}
                    >
                        {isLoading ? <StopCircle className="h-4 w-4 animate-pulse" /> : <ArrowUp className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <LyricsModal
                isOpen={isLyricsOpen}
                onClose={() => setIsLyricsOpen(false)}
                value={lyrics}
                onChange={setLyrics}
            />
        </div>
    );
});
PromptInputBox.displayName = "PromptInputBox";
