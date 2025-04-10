'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronForwardOutline, IoChevronBackOutline } from 'react-icons/io5';

interface ProcessCardData {
  title: string;
  description: string;
  id: number;
}

const processCards: ProcessCardData[] = [
  {
    title: 'Pre-Project',
    description: 'Planning, onboarding, and defining the scope.',
    id: 1,
  },
  {
    title: 'During Project',
    description:
      'Design sprints, prototype reviews, and iterative development.',
    id: 2,
  },
  {
    title: 'Close & Post-Project',
    description: 'Deployment, client handover, and optional support.',
    id: 3,
  },
];

const CARD_CONFIG = {
  ACTIVE: { y: 0, x: 0, rotate: 0, zIndex: 30, scale: 1 },
  BASE_DISPLACEMENT: {
    DESKTOP: { y: -500, x: 60, rotate: 15, scale: 0.97 },
    TABLET: { y: -480, x: 45, rotate: 15, scale: 0.95 },
    MOBILE: { y: -400, x: 30, rotate: 15, scale: 0.9 },
  },
  MULTIPLIER: 2,
  BEHIND: { offsetY: 15, offsetX: 10, rotate: -8 },
  CARD_SIZES: {
    DESKTOP: { width: '432px', height: '423px', padding: '91px 48px' },
    TABLET: { width: '360px', height: '350px', padding: '60px 36px' },
    MOBILE: { width: '270px', height: '270px', padding: '40px 24px' },
  },
};

export default function ProcessSteps() {
  // The initial state will be card one (activeIndex = 1)
  const [activeIndex, setActiveIndex] = useState(1);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  // Check if the section is in view
  const isInView = useMemo(() => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight * 0.7 &&
      rect.bottom >= window.innerHeight * 0.3
    );
  }, [sectionRef.current, windowWidth]);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBaseDisplacement = useCallback(() => {
    const { DESKTOP, TABLET, MOBILE } = CARD_CONFIG.BASE_DISPLACEMENT;
    if (windowWidth < 768) return MOBILE;
    else if (windowWidth < 1024) return TABLET;
    else return DESKTOP;
  }, [windowWidth]);

  const firstLevel = useMemo(
    () => ({ ...getBaseDisplacement(), zIndex: 40 }),
    [getBaseDisplacement]
  );

  const secondLevel = useMemo(() => {
    const base = getBaseDisplacement();
    const { MULTIPLIER } = CARD_CONFIG;
    return {
      y: base.y * MULTIPLIER,
      x: base.x * MULTIPLIER,
      rotate: base.rotate * MULTIPLIER,
      zIndex: 50,
      scale: Math.max(0.8, base.scale - 0.05),
    };
  }, [getBaseDisplacement]);

  const getCardSizing = useCallback(() => {
    const { DESKTOP, TABLET, MOBILE } = CARD_CONFIG.CARD_SIZES;
    if (windowWidth < 768) return MOBILE;
    else if (windowWidth < 1024) return TABLET;
    else return DESKTOP;
  }, [windowWidth]);

  const cardSizing = getCardSizing();

  // Adjust card background opacity for mobile devices
  const cardBackgroundColor =
    windowWidth < 768 ? 'rgba(245, 245, 247, 0.2)' : 'rgba(245, 245, 247, 0.1)';
  const cardBorder =
    windowWidth < 768
      ? '1.5px solid rgba(245, 245, 247, 0.6)'
      : '1.5px solid rgba(245, 245, 247, 0.4)';
  const cardBoxShadow =
    windowWidth < 768
      ? '0px 0px 20px 0px rgba(255, 255, 255, 0.6) inset'
      : '0px 0px 20px 0px rgba(255, 255, 255, 0.4) inset';

  // Parse card height and calculate dynamic extra push & rotation.
  const cardHeightPx = parseInt(cardSizing.height, 10) || 400;
  const dynamicExtraPushY = -Math.ceil(cardHeightPx * 0.25);
  const dynamicExtraRotate = -Math.ceil(cardHeightPx * 0.02);

  // When the section becomes visible or hidden, reset to the initial state smoothly.
  useEffect(() => {
    if (isInView) {
      // Smoothly reset to card one when entering the section
      setActiveIndex(1);
      setShowFinalMessage(false);
    } else {
      // Also reset state when leaving the section
      setActiveIndex(1);
      setShowFinalMessage(false);
    }
  }, [isInView]);

  useEffect(() => {
    if (activeIndex === 3) {
      const timer = setTimeout(() => setShowFinalMessage(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowFinalMessage(false);
    }
  }, [activeIndex]);

  // Compute card style transformations.
  const getCardStyles = (cardIndex: number) => {
    const { ACTIVE, BEHIND } = CARD_CONFIG;
    if (activeIndex === 1) {
      // Initial state: Show card one (activeIndex = 1)
      if (cardIndex === 0) return { ...ACTIVE, opacity: 1 };
      if (cardIndex === 1)
        return {
          y: BEHIND.offsetY,
          x: BEHIND.offsetX,
          rotate: BEHIND.rotate,
          zIndex: ACTIVE.zIndex - 10,
          scale: 1,
          opacity: 1,
        };
      if (cardIndex === 2)
        return {
          y: BEHIND.offsetY * 2,
          x: BEHIND.offsetX * 2,
          rotate: BEHIND.rotate * 2,
          zIndex: ACTIVE.zIndex - 20,
          scale: 1,
          opacity: 1,
        };
    }
    if (activeIndex === 2) {
      if (cardIndex === 0) return { ...firstLevel, opacity: 1 };
      if (cardIndex === 1) return { ...ACTIVE, opacity: 1 };
      if (cardIndex === 2)
        return {
          y: BEHIND.offsetY,
          x: BEHIND.offsetX,
          rotate: BEHIND.rotate,
          zIndex: ACTIVE.zIndex - 10,
          scale: 1,
          opacity: 1,
        };
    }
    if (activeIndex === 3) {
      if (cardIndex === 0)
        return {
          ...secondLevel,
          y: secondLevel.y + dynamicExtraPushY,
          rotate: secondLevel.rotate + dynamicExtraRotate,
          opacity: 1,
        };
      if (cardIndex === 1)
        return {
          ...firstLevel,
          y: firstLevel.y + dynamicExtraPushY,
          rotate: firstLevel.rotate + dynamicExtraRotate,
          opacity: 1,
        };
      if (cardIndex === 2)
        return {
          ...ACTIVE,
          y: ACTIVE.y + dynamicExtraPushY,
          rotate: ACTIVE.rotate + dynamicExtraRotate,
          opacity: 1,
        };
    }
    // Default fallback
    return { x: 0, y: 0, rotate: 0, opacity: 1, zIndex: 0, scale: 1 };
  };

  return (
    <div
      ref={sectionRef}
      className="w-full h-dvh max-w-7xl mx-auto flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Step Indicator */}
      <div className="absolute left-4 md:left-0 top-32 sm:top-48 md:top-64 z-50">
        <AnimatePresence mode="wait">
          {activeIndex > 0 && activeIndex <= 3 && (
            <motion.div
              key={`step-${activeIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              {`0${activeIndex}.`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Container */}
      <div className="h-dvh flex items-center justify-center max-w-7xl w-full mx-auto">
        <div
          className="relative"
          style={{ width: cardSizing.width, height: cardSizing.height }}
        >
          {processCards.map((card, index) => {
            const styles = getCardStyles(index);
            return (
              <motion.div
                key={card.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: cardSizing.width,
                  height: cardSizing.height,
                  zIndex: styles.zIndex,
                  transformOrigin: 'center center',
                }}
                animate={styles}
                transition={{
                  type: 'spring',
                  stiffness: 75,
                  damping: 22,
                  opacity: { duration: 0 },
                }}
              >
                <div
                  className="w-full h-full flex flex-col justify-center items-center text-center rounded-[40px]"
                  style={{
                    padding: cardSizing.padding,
                    backgroundColor: cardBackgroundColor,
                    border: cardBorder,
                    backdropFilter: 'blur(100px)',
                    boxShadow: cardBoxShadow,
                    transition:
                      'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-6">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-light text-white/80">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-14 flex space-x-6 md:space-x-8 z-40">
        <button
          onClick={() => activeIndex > 1 && setActiveIndex(activeIndex - 1)}
          disabled={activeIndex <= 1}
          className={`rounded-full border border-white/30 p-3 md:p-4 transition-all duration-300 ${
            activeIndex <= 1
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Previous step"
        >
          <IoChevronBackOutline size={windowWidth < 640 ? 16 : 20} />
        </button>

        <button
          onClick={() => activeIndex < 3 && setActiveIndex(activeIndex + 1)}
          disabled={activeIndex === 3}
          className={`rounded-full border ${
            activeIndex === 3 ? 'border-white/30' : 'border-white'
          } p-3 md:p-4 transition-all duration-300 ${
            activeIndex === 3
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Next step"
        >
          <IoChevronForwardOutline size={windowWidth < 640 ? 16 : 20} />
        </button>
      </div>

      {/* Final Message */}
      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-40 sm:bottom-44 md:bottom-48 z-50"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold">
              All in <span className="text-[#b0ff00]">Weeks!</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
