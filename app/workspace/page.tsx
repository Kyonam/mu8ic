"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceNavbar } from '@/components/workspace-navbar';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { MusicList, MusicTrack } from '@/components/music-list';
import { BottomMusicPlayer } from '@/components/bottom-music-player';

export default function WorkspacePage() {
    const { user, session, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [musics, setMusics] = useState<MusicTrack[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Playback State
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const playerRef = React.useRef<HTMLDivElement | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Click outside player to stop
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
                // Check if the click was on one of the play buttons in the list
                // We don't want to stop if we're clicking a different song to play
                const isPlayButton = (event.target as HTMLElement).closest('button')?.innerHTML.includes('Play') ||
                    (event.target as HTMLElement).closest('button')?.innerHTML.includes('Pause');

                if (!isPlayButton) {
                    handleStop();
                }
            }
        };

        if (currentlyPlaying) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentlyPlaying]);

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/auth');
        } else if (user) {
            fetchMusics();
        }
    }, [user, isAuthLoading, router]);

    // Audio Event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            const current = audio.currentTime;
            const dur = audio.duration || 0;
            setCurrentTime(current);
            setDuration(dur);
            setProgress(dur > 0 ? (current / dur) * 100 : 0);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [currentlyPlaying]);

    const fetchMusics = async () => {
        if (!user) return;
        const { data, error: fetchError } = await supabase
            .from('musics')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('Error fetching musics:', fetchError);
        } else {
            setMusics(data || []);
        }
    };

    const handleSendMessage = async (options: { prompt: string, lyrics: string, duration: number, batch_size: number }) => {
        if (!user || isGenerating) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...options
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Generation failed');

            await fetchMusics();

        } catch (err: any) {
            console.error('Generation execution failed:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        setMusics(prev => prev.filter(m => m.id !== id));
        const fileName = `${user.id}/${id}.mp3`;
        const [dbResult] = await Promise.all([
            supabase.from('musics').delete().eq('id', id),
            supabase.storage.from('musics').remove([fileName])
        ]);
        if (dbResult.error) fetchMusics();
    };

    const handleRename = async (id: string, newTitle: string) => {
        if (!user) return;
        setMusics(prev => prev.map(m => m.id === id ? { ...m, title: newTitle } : m));
        const { error } = await supabase.from('musics').update({ title: newTitle }).eq('id', id);
        if (error) fetchMusics();
    };

    const togglePlay = (url: string, id: string) => {
        if (currentlyPlaying === id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            const audio = new Audio(url);
            audio.volume = volume;
            audioRef.current = audio;
            setCurrentlyPlaying(id);
            setIsPlaying(true);
            audio.play();
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }
        setCurrentlyPlaying(null);
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
    };

    const handleSeek = (percent: number) => {
        if (audioRef.current && audioRef.current.duration) {
            const newTime = (percent / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            setProgress(percent);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const currentTrack = musics.find(m => m.id === currentlyPlaying) || null;
    const filteredMusics = musics.filter(music =>
        music.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isAuthLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#171717] text-white/50">
                <div className="h-4 w-4 animate-ping rounded-full bg-white/20" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#171717] text-white font-sans overflow-hidden relative">
            <WorkspaceNavbar searchValue={searchQuery} onSearchChange={setSearchQuery} />

            <main className="flex-grow flex flex-col items-center p-8 relative overflow-y-auto scrollbar-hide pb-32">
                <div className="w-full flex justify-center pt-12">
                    <MusicList
                        tracks={filteredMusics}
                        isGenerating={isGenerating}
                        error={error}
                        currentlyPlaying={currentlyPlaying}
                        isPlaying={isPlaying}
                        onTogglePlay={togglePlay}
                        onDelete={handleDelete}
                        onRename={handleRename}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>
            </main>

            {/* Fixed Bottom Layout */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="w-full flex flex-col items-center">
                    <div className={`w-full flex justify-center p-8 pb-6 bg-gradient-to-t from-[#171717] via-[#171717]/90 to-transparent transition-all duration-500 pointer-events-auto ${currentlyPlaying ? 'translate-y-[-10px]' : 'translate-y-0'}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-3xl"
                        >
                            <PromptInputBox
                                onSend={handleSendMessage}
                                isLoading={isGenerating}
                                placeholder="Describe the mood or lyrics for your music..."
                            />
                            <p className="mt-4 text-center text-[9px] uppercase tracking-widest text-white/20">
                                mu8ic AI generates unique soundtracks based on your prompts.
                            </p>
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {currentlyPlaying && (
                            <div ref={playerRef} className="w-full pointer-events-auto">
                                <BottomMusicPlayer
                                    track={currentTrack}
                                    isPlaying={isPlaying}
                                    progress={progress}
                                    currentTime={currentTime}
                                    duration={duration}
                                    volume={volume}
                                    onTogglePlay={() => togglePlay(currentTrack?.file_url!, currentlyPlaying!)}
                                    onStop={handleStop}
                                    onSeek={handleSeek}
                                    onVolumeChange={handleVolumeChange}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
