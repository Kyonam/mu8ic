"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error handling auth callback:', error);
                router.push('/auth');
            } else {
                router.push('/workspace');
            }
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#171717] text-white">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                <p className="text-sm font-medium tracking-widest uppercase opacity-50">Authenticating...</p>
            </div>
        </div>
    );
}
