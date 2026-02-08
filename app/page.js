'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import MissionClock from '@/components/MissionClock';

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen bg-background selection:bg-accent selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-background z-10" />
          <div className="w-full h-full bg-[url('/hero-custom.png')] bg-cover bg-center animate-subtle-zoom" style={{ backgroundImage: "url('/hero-custom.png')" }}></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-6 animate-fade-in text-white uppercase px-4">
            ELITE <span className="text-accent-light">COMMUNITY</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in-delayed">
            The ultimate tactical arena for airsoft enthusiasts. Join discussions, share gear reviews, and connect with operators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delayed">
            <Link href={session ? "/forum" : "/login"} className="px-10 py-5 bg-accent text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(75,83,32,0.4)]">
              {session ? "Enter Forum" : "Login to Forum"}
            </Link>
            {!session && (
              <Link href="/register" className="px-10 py-5 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all border border-white/20">
                Join the Squad
              </Link>
            )}
          </div>
          <MissionClock />
        </div>


      </section>
    </main>
  );
}
