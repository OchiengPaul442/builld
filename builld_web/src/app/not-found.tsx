'use client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamic import with no SSR to prevent document access issues
const BackgroundAnimation = dynamic(
  () => import('@/components/ui/background-animation'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center gradient-bg overflow-hidden">
      {/* Animated background - only render after mounting */}
      {mounted && (
        <BackgroundAnimation opacity={0.7} withBlur blurStrength={80} />
      )}
      <div className="absolute top-8 left-0 w-full flex justify-center z-10">
        <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
      </div>
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-12">
        <h1
          className="text-7xl sm:text-8xl font-bold text-accent-green mb-4 drop-shadow-lg"
          style={{ letterSpacing: '-0.04em' }}
        >
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 fade-in">
          Page Not Found
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl fade-in">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
          <br />
          Let&apos;s get you back on track.
        </p>
        <Link href="/">
          <Button variant="primary" className="text-lg px-8 py-4 shadow-lg">
            Go Home
          </Button>
        </Link>
      </main>
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-10">
        <span className="text-xs text-gray-500">
          Builld &mdash; Fast-Track Your Ideas into Reality
        </span>
      </div>
    </div>
  );
}
