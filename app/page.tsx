"use client";

import React from 'react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';

export default function Home() {
  const navLinks = [
    { label: 'FEATURES', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'CONTACT', href: '#' },
  ];

  return (
    <main>
      <MinimalistHero
        logoText="mu8ic."
        navLinks={navLinks}
        mainText="Create high-quality, royalty-free soundtracks for your YouTube videos in seconds. Our AI understands your content and generates the perfect mood, rhythm, and style to keep your audience engaged."
        getStartedLink="#"
        imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
        imageAlt="A portrait of a person in a black turtleneck, in profile."
        overlayText={{
          part1: 'AI music for',
          part2: 'creators.',
        }}
      />
    </main>
  );
}