'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import localFont from 'next/font/local';

// Load your local Doubleplus font (OTF)
const doubleplus = localFont({
  src: [
    {
      path: '../../../public/fonts/Doubleplus.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-doubleplus',
  display: 'swap',
});

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Refs for animation frames and timeouts
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const milestones = useMemo(() => [0, 25, 50, 75, 100], []);
  const duration = 800;

  // Determine if the device is mobile based on window width
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);
  // Cleanup on unmount with proper null checks
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, []);
  // Progress animation with proper cleanup
  useEffect(() => {
    if (currentMilestone >= milestones.length - 1) return;

    const start = performance.now();
    const current = milestones[currentMilestone];
    const next = milestones[currentMilestone + 1];

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(current + (next - current) * t);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentMilestone(prev => prev + 1);
      }
    };

    timeoutRef.current = setTimeout(
      () => {
        animationFrameRef.current = requestAnimationFrame(animate);
      },
      currentMilestone === 0 ? 500 : 300
    );

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentMilestone, milestones, duration]);
  // Handle exit animation and onComplete callback with proper cleanup
  useEffect(() => {
    if (currentMilestone === milestones.length - 1) {
      exitTimeoutRef.current = setTimeout(() => {
        setIsExiting(true);
        exitTimeoutRef.current = setTimeout(() => {
          if (onComplete) onComplete();
          exitTimeoutRef.current = null;
        }, 800);
      }, 500);

      return () => {
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
          exitTimeoutRef.current = null;
        }
      };
    }
  }, [currentMilestone, milestones.length, onComplete]);

  // Calculate logo size based on window width
  const logoSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return { width: 160, height: 40 };
      if (width < 768) return { width: 200, height: 50 };
      if (width < 1024) return { width: 220, height: 55 };
      return { width: 240, height: 60 };
    }
    return { width: 240, height: 60 };
  }, []);

  return (
    <motion.div
      className={`${doubleplus.className} fixed inset-0 z-50 flex items-center justify-center bg-black`}
      initial={{ y: 0 }}
      animate={{ y: isExiting ? '-100%' : 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Common centered container */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {isMobile ? (
          // Static logo for mobile devices
          <Image
            src="/logo.png"
            alt="Build Logo"
            width={logoSize.width}
            height={logoSize.height}
            priority
            className="w-auto h-auto"
          />
        ) : (
          // Animated floating logo for larger screens
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
            }}
          >
            <Image
              src="/logo.png"
              alt="Build Logo"
              width={logoSize.width}
              height={logoSize.height}
              priority
              className="w-auto h-auto"
            />
          </motion.div>
        )}
      </div>
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 px-6 sm:px-8 md:px-12">
        <div className="h-1 sm:h-1.5 w-full rounded bg-[#1a1a1a] relative">
          <motion.div
            className="h-full rounded bg-[#b0ff00]"
            style={{
              width: `${progress}%`,
              transform: 'translateZ(0)',
            }}
          />
        </div>
        <div className="absolute right-6 sm:right-8 md:right-12 top-[-24px] sm:top-[-26px] md:top-[-30px]">
          <motion.div
            key={milestones[currentMilestone]}
            className="text-white text-base sm:text-lg md:text-2xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {milestones[currentMilestone]} %
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
