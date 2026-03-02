"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music as MusicIcon, X } from 'lucide-react';

interface MusicPlayerProps {
    track: {
        id: string;
        title: string;
        prompt: string;
        file_url: string;
    } | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onClose: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
    track,
    isPlaying,
    onTogglePlay,
    onClose
}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!track) return;

        if (!audioRef.current) {
            audioRef.current = new Audio(track.file_url);
        } else if (audioRef.current.src !== track.file_url) {
            audioRef.current.src = track.file_url;
            setCurrentTime(0);
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            onTogglePlay();
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [track]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, track]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    if (!track) return null;

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AnimatePresence>
            {track && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-5xl"
                >
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl flex items-center gap-6 relative overflow-hidden group">

                        {/* Progress Bar (at the very top of the player) */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 cursor-pointer">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div
                                className="h-full bg-white transition-all duration-150"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        {/* Track Info */}
                        <div className="flex items-center gap-4 min-w-0 w-1/4">
                            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                <MusicIcon className="h-6 w-6 text-white/40" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{track.title || 'Generating...'}</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest truncate mt-0.5">mu8ic ai original</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-2 flex-grow">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={onTogglePlay}
                                    className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                >
                                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                                </button>
                            </div>
                            <div className="flex items-center gap-3 w-full max-w-md">
                                <span className="text-[10px] font-mono text-white/30 w-10 text-right">{formatTime(currentTime)}</span>
                                <div className="flex-grow h-1 bg-white/10 rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-white"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-white/30 w-10">{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Volume & Close */}
                        <div className="flex items-center justify-end gap-6 w-1/4">
                            <div className="flex items-center gap-2 max-w-[120px] group/volume">
                                <button onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4 text-white/30" /> : <Volume2 className="h-4 w-4 text-white/30 hover:text-white" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-20 accent-white h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer"
                                />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
