'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function ProcessIntro() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSize = useMemo(() => {
    if (windowWidth < 640) {
      return {
        containerSize: 'w-36 h-36',
        logoSize: { width: 70, height: 70 },
        roundedSize: 'rounded-[40px]',
      };
    } else if (windowWidth < 768) {
      return {
        containerSize: 'w-44 h-44',
        logoSize: { width: 90, height: 90 },
        roundedSize: 'rounded-[50px]',
      };
    } else if (windowWidth < 1024) {
      return {
        containerSize: 'w-52 h-52',
        logoSize: { width: 100, height: 100 },
        roundedSize: 'rounded-[60px]',
      };
    } else {
      return {
        containerSize: 'w-60 h-60',
        logoSize: { width: 120, height: 120 },
        roundedSize: 'rounded-[80px]',
      };
    }
  }, [windowWidth]);

  return (
    <div
      ref={ref}
      className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-0  py-8 sm:py-12 md:py-16 relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.6 }}
          className="md:col-span-4 flex justify-center md:justify-start"
        >
          <div
            className={`${logoSize.containerSize} flex items-center justify-center ${logoSize.roundedSize} transform -rotate-90`}
            style={{
              padding: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(200px)',
            }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src="/images/L.png"
                alt="Company Logo"
                width={logoSize.logoSize.width}
                height={logoSize.logoSize.height}
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="md:col-span-8 flex flex-col"
        >
          <motion.div
            className="flex items-center mb-8 sm:mb-12 md:mb-16"
            variants={fadeUpVariant}
            custom={0}
          >
            <div className="w-6 sm:w-8 h-px bg-white/70 mr-2"></div>
            <span className="text-xs sm:text-sm text-white/70">
              Our Process
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6 md:mb-8 text-white leading-tight tracking-tight"
            variants={fadeUpVariant}
            custom={0.1}
          >
            From Concept to Launch
            <br />— The <span className="text-[#b0ff00]">Builld</span> Way
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg font-light max-w-2xl text-gray-200 opacity-90 leading-relaxed"
            variants={fadeUpVariant}
            custom={0.2}
          >
            Explore our clear, three-phase process that ensures efficient
            project delivery without compromising quality.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
