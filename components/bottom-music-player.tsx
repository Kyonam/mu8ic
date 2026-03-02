"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from './music-list';

interface BottomMusicPlayerProps {
    track: MusicTrack | null;
    isPlaying: boolean;
    progress: number;
    currentTime: number;
    duration: number;
    volume: number;
    onTogglePlay: () => void;
    onStop: () => void;
    onSeek: (percent: number) => void;
    onVolumeChange: (volume: number) => void;
}

export const BottomMusicPlayer: React.FC<BottomMusicPlayerProps> = ({
    track,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    onTogglePlay,
    onStop,
    onSeek,
    onVolumeChange
}) => {
    if (!track) return null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="w-full bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 shadow-2xl relative"
        >
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-8">
                {/* Left: Track Info */}
                <div className="flex items-center gap-4 w-1/4 min-w-0">
                    <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{track.title || "Untitled"}</h4>
                        <p className="text-[10px] text-white/40 truncate italic">"{track.prompt}"</p>
                    </div>
                </div>

                {/* Center: Controls & Progress */}
                <div className="flex-grow max-w-xl">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={onTogglePlay}
                                className="h-9 w-9 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all"
                            >
                                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                            </button>
                            <div className="w-4" /> {/* Spacer for balance */}
                        </div>

                        <div className="w-full flex items-center gap-3">
                            <span className="text-[10px] tabular-nums text-white/40 w-8">{formatTime(currentTime)}</span>
                            <div
                                className="relative flex-grow h-1 bg-white/10 rounded-full cursor-pointer group"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const percent = (x / rect.width) * 100;
                                    onSeek(percent);
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0 h-full bg-white rounded-full group-hover:bg-blue-400 transition-colors"
                                    style={{ width: `${progress}%` }}
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ left: `${progress}%`, marginLeft: '-6px' }}
                                />
                            </div>
                            <span className="text-[10px] tabular-nums text-white/40 w-8">{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Volume */}
                <div className="flex items-center gap-3 w-1/4 justify-end">
                    <button onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)} className="text-white/40 hover:text-white transition-colors">
                        {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <div
                        className="relative w-24 h-1 bg-white/10 rounded-full cursor-pointer group"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const newVolume = Math.max(0, Math.min(1, x / rect.width));
                            onVolumeChange(newVolume);
                        }}
                    >
                        <div
                            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
