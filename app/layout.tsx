import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One, Schoolbell } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  weight: "400",
  variable: "--font-pirata-next",
  subsets: ["latin"],
});

const schoolbell = Schoolbell({
  weight: "400",
  variable: "--font-schoolbell-next",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mu8ic - AI Music for Creators",
  description: "AI-generated music for YouTube video soundtracks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pirataOne.variable} ${schoolbell.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
