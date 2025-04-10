"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Base Animation Layer */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 1 }}
        style={{ willChange: "opacity" }}
      >
        <Lottie
          animationData={animationData}
          loop
          style={{ width: "100%", height: "100%", position: "absolute" }}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        />
      </motion.div>

      {/* Blur Overlay */}
      {withBlur && (
        <motion.div
          className="absolute inset-0 z-[1] w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            backdropFilter: `blur(${blurStrength}px)`,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            willChange: "opacity",
          }}
        />
      )}
    </>
  );
}
