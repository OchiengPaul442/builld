"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
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
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    setMounted(true);

    // Create cleanup function that properly captures the current ref
    return () => {
      // Fix the React hooks exhaustive-deps warning by capturing current ref
      const currentLottieRef = lottieRef.current;

      if (currentLottieRef) {
        // Use optional chaining for safer method access
        currentLottieRef.pause?.();
        currentLottieRef.destroy?.();
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

      <div
        className="absolute inset-0 z-[1] w-full h-full"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          willChange: "opacity",
          transform: "translateZ(0)",
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
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
        />
      )}
    </>
  );
}
