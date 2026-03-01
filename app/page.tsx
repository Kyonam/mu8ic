"use client";

import React from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  const navLinks = [
    { label: 'FEATURES', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'CONTACT', href: '#' },
  ];

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    window.location.reload(); // Simple refresh for auth state cleanup
  };

  return (
    <main>
      <div className="relative">
        {user && (
          <button
            onClick={handleSignOut}
            className="absolute right-32 top-10 z-50 text-[10px] uppercase tracking-widest text-[#171717]/40 hover:text-[#171717] transition-colors"
          >
            Sign Out
          </button>
        )}
        <MinimalistHero
          logoText="mu8ic"
          navLinks={navLinks}
          mainText={
            user
              ? `Welcome back, ${user.user_metadata?.full_name || user.email}! Ready to create your next viral soundtrack? Our AI is waiting for your story.`
              : "Create high-quality, royalty-free soundtracks for your YouTube videos in seconds. Our AI understands your content and generates the perfect mood, rhythm, and style to keep your audience engaged."
          }
          getStartedLink={user ? "#generate" : "/auth"}
          imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
          imageAlt="A portrait of a person in a black turtleneck, in profile."
          overlayText={{
            part1: user ? 'hello' : 'AI music for',
            part2: user ? (user.user_metadata?.full_name?.split(' ')[0].toLowerCase() || 'creator') : 'creators.',
          }}
        />
      </div>
    </main>
  );
}