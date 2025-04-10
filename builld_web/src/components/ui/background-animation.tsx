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

export default function BackgroundAnimation({
  animationData = gradientBg,
  withBlur = false,
  blurStrength = 100,
  opacity = 1,
}: BackgroundAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // Ensure this code only runs on the client
    setMounted(true);
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768; // adjust threshold as needed
      setIsMobile(mobile);
      if (
        mobile &&
        lottieRef.current &&
        typeof lottieRef.current.pause === 'function'
      ) {
        lottieRef.current.pause();
      }
    }
    // Capture current lottieRef for cleanup
    const currentRef = lottieRef.current;
    return () => {
      if (currentRef) {
        if (typeof currentRef.pause === 'function') {
          currentRef.pause();
        }
        if (typeof currentRef.destroy === 'function') {
          currentRef.destroy();
        }
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 1 }}
        style={{
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          // Disable looping and autoplay on mobile devices
          autoplay={!isMobile}
          loop={!isMobile}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            transform: 'translateZ(0)',
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
        />
      </motion.div>

      <div
        className="absolute hidden md:block inset-0 z-[1] w-full h-full"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      ></div>

      {withBlur && (
        <motion.div
          className="absolute inset-0 z-[2] w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            backdropFilter: `blur(${blurStrength}px)`,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            willChange: 'opacity',
            transform: 'translateZ(0)',
          }}
        />
      )}
    </>
  );
}
