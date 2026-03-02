"use client";

import React from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/components/user-profile';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const navLinks = [
    { label: 'FEATURES', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'CONTACT', href: '#' },
  ];

  if (user) {
    navLinks.push({ label: 'WORKSPACE', href: '/workspace' });
  }

  return (
    <main>
      <div className="relative">
        <MinimalistHero
          logoText="mu8ic"
          navLinks={navLinks}
          userProfile={user ? <UserProfile className="!text-foreground" /> : undefined}
          mainText={
            user
              ? `Welcome back, ${user.user_metadata?.full_name || user.email}! Your creative workspace is ready. Let's start generating your next viral soundtrack.`
              : "Create high-quality, royalty-free soundtracks for your YouTube videos in seconds. Our AI understands your content and generates the perfect mood, rhythm, and style to keep your audience engaged."
          }
          getStartedLink={user ? "/workspace" : "/auth"}
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