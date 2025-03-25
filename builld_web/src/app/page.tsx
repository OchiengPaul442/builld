"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [logoError, setLogoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Primary gradients - optimized for all screen sizes */}
      <motion.div
        className={`absolute ${isMobile ? "-left-32" : "-left-64"} ${
          isMobile ? "-bottom-32" : "-bottom-64"
        } ${
          isMobile ? "h-[600px] w-[600px]" : "h-[1000px] w-[1000px]"
        } rounded-full opacity-50 blur-3xl`}
        animate={{
          x: [-20, 40, -20],
          y: [-40, 20, -40],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: isMobile ? 20 : 28,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(65, 70, 255, 0.9) 0%, rgba(45, 50, 255, 0.4) 30%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        className={`absolute ${isMobile ? "-right-32" : "-right-64"} ${
          isMobile ? "-top-32" : "-top-64"
        } ${
          isMobile ? "h-[600px] w-[600px]" : "h-[1000px] w-[1000px]"
        } rounded-full opacity-50 blur-3xl`}
        animate={{
          x: [40, -20, 40],
          y: [20, -40, 20],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: isMobile ? 18 : 26,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(192, 255, 30, 0.9) 0%, rgba(177, 249, 15, 0.4) 30%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary gradients - only shown on larger screens */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
            animate={{
              x: [-60, 60, -60],
              y: [30, -30, 30],
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 3,
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(65, 70, 255, 0.7) 0%, rgba(0, 0, 0, 0) 70%)",
              filter: "blur(60px)",
            }}
          />

          <motion.div
            className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl"
            animate={{
              x: [30, -30, 30],
              y: [-20, 40, -20],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(190, 90, 255, 0.7) 0%, rgba(0, 0, 0, 0) 70%)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}

      {/* Content container with improved vertical centering and spacing */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-6 py-8 md:px-8">
        {/* Logo with responsive sizing */}
        <motion.div
          className="mb-8 md:mb-16"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            {logoError ? (
              <div className="flex h-[60px] w-[180px] items-center justify-center rounded bg-[#B1F90F] text-xl font-bold text-black md:h-[75px] md:w-[220px] md:text-2xl">
                BUILLD
              </div>
            ) : (
              <Image
                src="/logo.png"
                alt="Builld Logo"
                width={isMobile ? 180 : 220}
                height={isMobile ? 60 : 75}
                priority
                className="h-auto"
                onError={() => setLogoError(true)}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Coming Soon Text with improved responsive typography */}
        <motion.h2
          className="mb-2 text-center text-3xl font-medium text-white sm:text-4xl md:text-5xl lg:text-6xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ textShadow: "0 0 10px rgba(177, 249, 15, 0.3)" }}
        >
          Coming Soon
        </motion.h2>

        {/* Responsive divider with subtle animation */}
        <motion.div
          className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#B1F90F] to-transparent md:mt-8 md:w-32"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Tagline with improved responsive sizing and enhanced readability */}
        <motion.p
          className="mt-6 max-w-xs text-center text-base text-gray-300 sm:text-lg md:mt-10 md:max-w-md md:text-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          High-quality websites and digital products, delivered in weeks — not
          months.
        </motion.p>
      </div>
    </main>
  );
}
