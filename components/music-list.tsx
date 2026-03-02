"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    Download,
    Music as MusicIcon,
    XCircle,
    MoreVertical,
    Trash2,
    Edit2,
    Check,
    X
} from 'lucide-react';
import LoadingLines from './ui/loading-lines';

export interface MusicTrack {
    id: string;
    title: string;
    prompt: string;
    file_url?: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
}

interface MusicListProps {
    tracks: MusicTrack[];
    isGenerating: boolean;
    error: string | null;
    currentlyPlaying: string | null;
    isPlaying?: boolean;
    onTogglePlay: (url: string, id: string) => void;
    onDelete?: (id: string) => void;
    onRename?: (id: string, newTitle: string) => void;
}

export const MusicList: React.FC<MusicListProps> = ({
    tracks,
    isGenerating,
    error,
    currentlyPlaying,
    isPlaying = false,
    onTogglePlay,
    onDelete,
    onRename
}) => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const menuRef = useRef<HTMLDivElement | null>(null);

    const completedTracks = tracks.filter(t => t.status === 'completed');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRenameSubmit = (id: string) => {
        if (editValue.trim() && onRename) {
            onRename(id, editValue.trim());
        }
        setEditingId(null);
    };

    if (completedTracks.length === 0 && !isGenerating && !error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <h2 className="text-4xl font-schoolbell opacity-20 select-none">mu8ic ai</h2>
                <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/10 select-none">
                    Ready to generate your next soundtrack
                </p>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 w-full max-w-4xl pb-44">
            {/* Status Section */}
            {(isGenerating || error) && (
                <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed min-h-[140px]">
                    {isGenerating ? (
                        <div className="transform scale-75 h-20 overflow-visible flex items-center justify-center">
                            <LoadingLines />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center space-y-3">
                            <XCircle className="h-8 w-8 text-red-500/50" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-red-500/40 font-medium max-w-[300px] text-center">
                                {error}
                            </span>
                        </div>
                    ) : null}
                </div>
            )}

            {/* List Section */}
            <div className="flex flex-col space-y-3">
                <AnimatePresence mode="popLayout">
                    {completedTracks.map((music) => (
                        <motion.div
                            key={music.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="group relative flex items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
                        >
                            <div className="flex-shrink-0 p-3 rounded-xl bg-white/5 text-white/30 group-hover:text-white/60 transition-colors">
                                <MusicIcon className="h-5 w-5" />
                            </div>

                            <div className="ml-5 flex-grow min-w-0">
                                <div className="flex items-center space-x-2">
                                    {editingId === music.id ? (
                                        <div className="flex items-center gap-2 flex-grow max-w-xs">
                                            <input
                                                autoFocus
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRenameSubmit(music.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-sm text-white focus:outline-none w-full"
                                            />
                                            <button onClick={() => handleRenameSubmit(music.id)} className="text-green-500"><Check className="h-4 w-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-500"><X className="h-4 w-4" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-sm font-semibold text-white/90 truncate max-w-xs">
                                                {music.title || 'Untitled'}
                                            </h3>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/20 uppercase tracking-tighter">
                                                MP3
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/40 italic line-clamp-1 mt-0.5">
                                    "{music.prompt}"
                                </p>
                            </div>

                            <div className="hidden md:block mx-6 text-right whitespace-nowrap">
                                <p className="text-[9px] text-white/10 font-mono uppercase">
                                    {new Date(music.created_at).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => onTogglePlay(music.file_url!, music.id)}
                                    className={`h-11 w-11 flex items-center justify-center rounded-full transition-all shadow-lg ${currentlyPlaying === music.id
                                        ? 'bg-white text-black scale-105'
                                        : 'bg-white/10 text-white hover:bg-white hover:text-black hover:scale-105'
                                        }`}
                                >
                                    {(currentlyPlaying === music.id && isPlaying) ? (
                                        <Pause className="h-4 w-4 fill-current" />
                                    ) : (
                                        <Play className="h-4 w-4 fill-current ml-0.5" />
                                    )}
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setActiveMenuId(activeMenuId === music.id ? null : music.id)}
                                        className="p-2 rounded-full text-white/20 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>

                                    {activeMenuId === music.id && (
                                        <motion.div
                                            ref={menuRef}
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-[#1F2023] border border-white/10 p-1.5 shadow-2xl z-[100]"
                                        >
                                            <button
                                                onClick={() => {
                                                    setEditingId(music.id);
                                                    setEditValue(music.title);
                                                    setActiveMenuId(null);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                                Rename
                                            </button>
                                            <a
                                                href={music.file_url}
                                                download
                                                target="_blank"
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Download
                                            </a>
                                            <div className="my-1 h-[1px] bg-white/5" />
                                            <button
                                                onClick={() => {
                                                    if (onDelete) onDelete(music.id);
                                                    setActiveMenuId(null);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
