'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
  // State management - all hooks must be called in the same order every time
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeIndex, setActiveIndex] = useState(1);
  const [animationPhase, setAnimationPhase] = useState<
    'intro' | 'cards' | 'finale'
  >('intro');
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Intersection observer for section visibility
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  }); // Handle mounting and window resize - single effect to prevent conflicts
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle section visibility and reset state
  useEffect(() => {
    if (!isMounted) return;

    if (!inView) {
      setActiveIndex(1);
      setAnimationPhase('intro');
      setShowFinalMessage(false);
    } else {
      // Start intro phase when section comes into view
      const timer = setTimeout(() => {
        setAnimationPhase('cards');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inView, isMounted]);

  // Auto-progress through cards
  useEffect(() => {
    if (!isMounted || !inView || animationPhase !== 'cards') return;

    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev < 3) {
          return prev + 1;
        } else {
          // Move to finale after last card
          setAnimationPhase('finale');
          setShowFinalMessage(true);
          return prev;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [inView, animationPhase, isMounted]);
  // Memoized calculations - stable order and dependencies
  const getBaseDisplacement = useCallback(() => {
    const { DESKTOP, TABLET, MOBILE } = CARD_CONFIG.BASE_DISPLACEMENT;
    if (windowWidth < 768) return MOBILE;
    if (windowWidth < 1024) return TABLET;
    return DESKTOP;
  }, [windowWidth]);

  const cardSizing = useMemo(() => {
    const { DESKTOP, TABLET, MOBILE } = CARD_CONFIG.CARD_SIZES;
    if (windowWidth < 768) return MOBILE;
    if (windowWidth < 1024) return TABLET;
    return DESKTOP;
  }, [windowWidth]);

  const cardStyles = useMemo(() => {
    const cardBackgroundColor =
      windowWidth < 768
        ? 'rgba(245, 245, 247, 0.2)'
        : 'rgba(245, 245, 247, 0.1)';
    const cardBorder =
      windowWidth < 768
        ? '1.5px solid rgba(245, 245, 247, 0.6)'
        : '1.5px solid rgba(245, 245, 247, 0.4)';
    const cardBoxShadow =
      windowWidth < 768
        ? '0px 0px 20px 0px rgba(255, 255, 255, 0.6) inset'
        : '0px 0px 20px 0px rgba(255, 255, 255, 0.4) inset';

    const cardHeightPx = parseInt(cardSizing.height, 10) || 400;
    const dynamicExtraPushY = -Math.ceil(cardHeightPx * 0.25);
    const dynamicExtraRotate = -Math.ceil(cardHeightPx * 0.02);

    return {
      cardBackgroundColor,
      cardBorder,
      cardBoxShadow,
      dynamicExtraPushY,
      dynamicExtraRotate,
    };
  }, [windowWidth, cardSizing]);

  const firstLevel = useMemo(
    () => ({
      ...getBaseDisplacement(),
      zIndex: 40,
    }),
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
  // Card positioning logic
  const getCardStyles = useCallback(
    (cardIndex: number) => {
      const { dynamicExtraPushY, dynamicExtraRotate } = cardStyles;

      if (windowWidth < 768) {
        // Mobile: only show active card
        return cardIndex === activeIndex - 1
          ? { x: 0, y: 0, rotate: 0, opacity: 1, zIndex: 30, scale: 1 }
          : { opacity: 0 };
      }

      // Desktop/tablet layered animation
      const { ACTIVE, BEHIND } = CARD_CONFIG;

      if (activeIndex === 1) {
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

      return { x: 0, y: 0, rotate: 0, opacity: 1, zIndex: 0, scale: 1 };
    },
    [activeIndex, windowWidth, cardStyles, firstLevel, secondLevel]
  );

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="w-full h-dvh max-w-7xl mx-auto flex flex-col items-center justify-center relative overflow-hidden" />
    );
  }
  return (
    <motion.div
      ref={ref}
      className="w-full h-dvh max-w-7xl mx-auto flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: inView ? 1 : 0,
        y: inView ? 0 : 20,
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      suppressHydrationWarning
    >
      {/* Step Indicator with Progress */}
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
        {/* Progress Dots */}
        <div className="flex space-x-2 mt-4">
          {[1, 2, 3].map(step => (
            <motion.div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step <= activeIndex ? 'bg-[#b0ff00]' : 'bg-white/30'
              }`}
              initial={{ scale: 0 }}
              animate={{
                scale: step <= activeIndex ? 1 : 0.7,
                backgroundColor:
                  step <= activeIndex ? '#b0ff00' : 'rgba(255, 255, 255, 0.3)',
              }}
              transition={{ duration: 0.3, delay: step * 0.1 }}
            />
          ))}
        </div>{' '}
        {/* Auto-progress indicator */}
        {isMounted && animationPhase === 'cards' && activeIndex <= 3 && (
          <motion.div
            className="w-16 h-1 bg-white/20 rounded-full mt-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              key={`progress-${activeIndex}`}
              className="h-full bg-[#b0ff00] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 3,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
        {/* Instructions */}
        {isMounted && animationPhase === 'cards' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xs text-white/60 mt-2 max-w-20"
          >
            Auto-playing
          </motion.p>
        )}
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
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 0.6 },
                  x: { duration: 0.5 },
                  y: { duration: 0.5 },
                }}
                whileHover={
                  index === activeIndex - 1
                    ? { scale: 1.02, transition: { duration: 0.2 } }
                    : {}
                }
              >
                {' '}
                <div
                  className="w-full h-full flex flex-col justify-center items-center text-center rounded-[40px]"
                  style={{
                    padding: cardSizing.padding,
                    backgroundColor: cardStyles.cardBackgroundColor,
                    border: cardStyles.cardBorder,
                    backdropFilter: 'blur(100px)',
                    boxShadow: cardStyles.cardBoxShadow,
                    transition:
                      'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <motion.h3
                    className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    className="text-sm sm:text-base md:text-lg font-light text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {card.description}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}{' '}
        </div>
      </div>{' '}
      {/* Enhanced Final Message with Creative Effects */}
      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.8 },
              scale: { duration: 1, delay: 0.2 },
            }}
            className="absolute bottom-32 sm:bottom-44 md:bottom-48 z-50 flex flex-col items-center"
          >
            {/* Animated Background Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                times: [0, 0.6, 1],
                ease: 'easeOut',
              }}
              className="absolute inset-0 w-full h-full bg-[#b0ff00] rounded-full blur-3xl -z-10"
              style={{ transform: 'scale(2)' }}
            />

            {/* Main Text with Staggered Animation */}
            <div className="relative overflow-hidden">
              <motion.h2
                className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-center px-4"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  All in{' '}
                </motion.span>
                <motion.span
                  className="text-[#b0ff00] relative inline-block"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: 'backOut',
                  }}
                >
                  Weeks!
                  {/* Pulsing underline effect */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: [0, 1.2, 1],
                      opacity: [0, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1.2,
                      times: [0, 0.6, 1],
                    }}
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-[#b0ff00] rounded-full"
                    style={{ transformOrigin: 'center' }}
                  />
                </motion.span>
              </motion.h2>
            </div>

            {/* Floating Particles Effect */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i * 60 * Math.PI) / 180) * (100 + i * 20),
                  y: Math.sin((i * 60 * Math.PI) / 180) * (80 + i * 15) - 50,
                }}
                transition={{
                  duration: 3,
                  delay: 1 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeOut',
                }}
                className="absolute w-2 h-2 bg-[#b0ff00] rounded-full"
                style={{
                  filter: 'blur(1px)',
                  transformOrigin: 'center',
                }}
              />
            ))}

            {/* Subtle Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="text-sm sm:text-base md:text-lg text-white/70 mt-4 text-center px-4 font-light"
            >
              Experience lightning-fast development
            </motion.p>

            {/* Expanding Ring Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 3, 4],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2.5,
                delay: 0.8,
                ease: 'easeOut',
              }}
              className="absolute inset-0 border-2 border-[#b0ff00] rounded-full pointer-events-none"
              style={{
                width: '100px',
                height: '100px',
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
