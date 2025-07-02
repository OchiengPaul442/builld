'use client';

import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gradientBg from '@public/animations/gradient-background.json';

export interface BackgroundAnimationProps {
  animationData?: object;
  withBlur?: boolean;
  blurStrength?: number;
  opacity?: number;
}

// Wrap component with dynamic import to avoid SSR issues
export default function BackgroundAnimation({
  animationData = gradientBg,
  withBlur = false,
  blurStrength = 100,
  opacity = 1,
}: BackgroundAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only run effect on client-side
  useEffect(() => {
    // Ensure this code only runs on the client
    setMounted(true);

    // Skip the rest of the effect during SSR
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // Debounce resize events to prevent flickering
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(prevIsMobile => {
          // Only update if state actually changed
          if (prevIsMobile !== mobile && lottieRef.current) {
            if (mobile && typeof lottieRef.current.pause === 'function') {
              lottieRef.current.pause();
            } else if (
              !mobile &&
              typeof lottieRef.current.play === 'function'
            ) {
              lottieRef.current.play();
            }
          }
          return mobile;
        });
        resizeTimeoutRef.current = null;
      }, 150); // Debounce resize events
    };

    if (typeof window !== 'undefined') {
      handleResize(); // Initial call
      window.addEventListener('resize', handleResize, { passive: true });
    }

    // Capture current lottieRef for cleanup
    const currentRef = lottieRef.current;

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }

      if (currentRef) {
        if (typeof currentRef.pause === 'function') {
          currentRef.pause();
        }
        if (typeof currentRef.destroy === 'function') {
          currentRef.destroy();
        }
      }
    };
  }, []); // Empty dependency array to run only once

  if (!mounted) return null;
  return (
    <>
      <motion.div
        className="fixed inset-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? opacity : 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          zIndex: -10, // Move to very back
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Prevent flickering
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          autoplay={!isMobile}
          loop={!isMobile}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
        />
      </motion.div>

      <div
        className="fixed hidden md:block inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: -9, // Just above the animation
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      ></div>

      {withBlur && (
        <motion.div
          className="fixed inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            zIndex: -8, // Above the dark overlay
            backdropFilter: `blur(${blurStrength}px)`,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            willChange: 'opacity',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        />
      )}
    </>
  );
}
