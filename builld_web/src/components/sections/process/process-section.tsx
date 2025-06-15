'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';
import { useScroll, SectionType } from '@/context/scroll-context';
import ProcessIntro from './process-intro';
import ProcessSteps from './process-steps';
import { motion } from 'framer-motion';

export default function ProcessSection() {
  const { setActiveSection } = useScroll();
  const prevSectionRef = useRef<string | null>(null);

  const [mainSectionRef, mainSectionInView] = useInView({
    threshold: 0.3,
    rootMargin: '-10% 0px',
    triggerOnce: false,
  });

  const [stepsRef, stepsInView] = useInView({
    threshold: 0.3,
    rootMargin: '-10% 0px',
    triggerOnce: false,
  });

  useEffect(() => {
    let currentSection: SectionType | null = null;
    if (mainSectionInView) {
      currentSection = 'process';
    } else if (stepsInView) {
      currentSection = 'process-steps';
    }
    if (currentSection && currentSection !== prevSectionRef.current) {
      setActiveSection(currentSection);
      prevSectionRef.current = currentSection;
    }
  }, [mainSectionInView, stepsInView, setActiveSection]);

  return (
    <>
      {' '}
      <section
        ref={mainSectionRef}
        id="section-process"
        className="relative section-fullscreen z-30 snap-section min-h-screen w-full flex items-center will-change-transform"
      >
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            zIndex: 2,
            backdropFilter: 'blur(100px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            willChange: 'opacity',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        />
        <div className="max-w-7xl w-full mx-auto z-[5] relative">
          <ProcessIntro />
        </div>
      </section>
      <section
        ref={stepsRef}
        id="section-process-steps"
        className="relative z-30 section-fullscreen snap-section min-h-screen w-full flex items-center justify-center will-change-transform"
      >
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            zIndex: 2,
            backdropFilter: 'blur(100px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            willChange: 'opacity',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        />
        <div className="max-w-7xl w-full mx-auto z-[5] relative">
          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
