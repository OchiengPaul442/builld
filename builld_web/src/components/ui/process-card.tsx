'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProcessCardProps {
  title: string;
  description: string;
  step: number;
  rotation: number;
  yPosition: number;
  opacity: number;
  delay?: number;
}

export default function ProcessCard({
  title,
  description,
  step,
  rotation,
  yPosition,
  opacity,
  delay = 0,
}: ProcessCardProps) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Responsive card sizing
  const getCardSize = () => {
    if (windowWidth < 640) {
      return {
        width: '280px',
        height: '280px',
        padding: '40px 24px',
        borderRadius: '24px',
      };
    } else if (windowWidth < 768) {
      return {
        width: '340px',
        height: '340px',
        padding: '56px 32px',
        borderRadius: '32px',
      };
    } else if (windowWidth < 1024) {
      return {
        width: '380px',
        height: '380px',
        padding: '72px 40px',
        borderRadius: '36px',
      };
    } else {
      return {
        width: '432px',
        height: '423px',
        padding: '91px 48px',
        borderRadius: '40px',
      };
    }
  };

  const cardSize = getCardSize();

  return (
    <motion.div
      className="absolute"
      style={{
        width: cardSize.width,
        height: cardSize.height,
        zIndex: 10 - step,
      }}
      initial={{
        y: 100,
        opacity: 0.2,
        rotate: -45,
        x: 0,
      }}
      animate={{
        y: yPosition,
        opacity: opacity,
        rotate: rotation,
        x: 0,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: delay,
      }}
    >
      <div
        className="w-full h-full flex flex-col justify-center items-center text-center"
        style={{
          padding: cardSize.padding,
          backgroundColor: 'rgba(245, 245, 247, 0.1)',
          border: '1.5px solid rgba(245, 245, 247, 0.4)',
          backdropFilter: 'blur(100px)',
          boxShadow: '0px 0px 20px 0px rgba(255, 255, 255, 0.4) inset',
          borderRadius: cardSize.borderRadius,
        }}
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          {title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-white/80">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
