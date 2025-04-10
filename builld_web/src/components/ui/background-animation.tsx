"use client";

import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gradientBg from "@public/animations/gradient-background.json";

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
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);

    // Cleanup function
    return () => {
      if (lottieRef.current) {
        lottieRef.current.pause();
        lottieRef.current.destroy();
      }
    };
  }, []);

  // Return null while not mounted to avoid any pre-mount rendering issues
  if (!mounted) return null;

  return (
    <>
      {/* Base Animation Layer */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 1 }}
        style={{
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transform: "translateZ(0)",
          }}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        />
      </motion.div>

      {/* Overlay for additional control of background intensity */}
      <div
        className="absolute inset-0 z-[1] w-full h-full"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      ></div>

      {/* Blur Overlay - only render when needed */}
      {withBlur && (
        <motion.div
          className="absolute inset-0 z-[2] w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            backdropFilter: `blur(${blurStrength}px)`,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
        />
      )}
    </>
  );
}
