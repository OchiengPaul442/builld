import { Variants } from 'framer-motion';

type StepIndex = 0 | 1 | 2 | 3 | 4;
type CardIndex = 1 | 2 | 3;
type RotationMap = Record<StepIndex, Record<CardIndex, number>>;

export const getProcessCardVariants = (
  step: number,
  cardIndex: number
): Variants => {
  // Card rotation angles
  const rotations: RotationMap = {
    // (initial state)
    0: {
      1: -15, // (1 = -15°, 2 = -30°, 3 = -45°)
      2: -30,
      3: -45,
    },
    // Card 1 appears
    1: {
      1: 0, // (1 = 0°, 2 = -15°, 3 = -30°)
      2: -15,
      3: -30,
    },
    // Card 2 appears
    2: {
      1: -15, // (1 = -15°, 2 = 0°, 3 = -15°)
      2: 0,
      3: -15,
    },
    // Card 3 appears
    3: {
      1: -30, // (1 = -30°, 2 = -15°, 3 = 0°)
      2: -15,
      3: 0,
    },
    // All move up
    4: {
      1: -45, // (1 = -45°, 2 = -30°, 3 = -15°)
      2: -30,
      3: -15,
    },
  };

  let y = 0;
  let opacity = 0;
  const safeStep = Math.min(4, Math.max(0, step)) as StepIndex;
  const safeCardIndex = Math.min(3, Math.max(1, cardIndex)) as CardIndex;

  const rotate = rotations[safeStep][safeCardIndex];

  // Handle y position and opacity based on step and card index
  switch (safeStep) {
    case 0:
      y = 100;
      opacity = safeCardIndex === 1 ? 0.8 : safeCardIndex === 2 ? 0.5 : 0.2;
      break;
    case 1:
      opacity = safeCardIndex === 1 ? 1 : safeCardIndex === 2 ? 0.7 : 0.3;
      y = safeCardIndex === 1 ? 0 : 30;
      break;
    case 2:
      opacity = safeCardIndex === 2 ? 1 : safeCardIndex === 1 ? 0.7 : 0.7;
      y = safeCardIndex === 2 ? 0 : safeCardIndex === 1 ? -30 : 30;
      break;
    case 3:
      opacity = safeCardIndex === 3 ? 1 : 0.7;
      y = safeCardIndex === 3 ? 0 : safeCardIndex === 2 ? -30 : -60;
      break;
    case 4:
      opacity = 0.8;
      y = safeCardIndex === 3 ? -30 : safeCardIndex === 2 ? -60 : -90;
      break;
  }

  return {
    initial: {
      y: 100,
      opacity: 0.2,
      rotate: -45,
      zIndex: cardIndex,
    },
    animate: {
      y,
      opacity,
      rotate,
      zIndex: cardIndex,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};
