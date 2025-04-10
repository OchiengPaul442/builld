'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';
import { useScroll, SectionType } from '@/context/scroll-context';
import ProcessIntro from './process-intro';
import ProcessSteps from './process-steps';
import dynamic from 'next/dynamic';

const BackgroundAnimation = dynamic(
  () => import('../../ui/background-animation'),
  { ssr: false }
);

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
      <section
        ref={mainSectionRef}
        id="section-process"
        className="relative section-fullscreen snap-section min-h-screen w-full flex items-center will-change-transform"
      >
        <BackgroundAnimation withBlur={true} />
        <div className="max-w-7xl w-full mx-auto z-[5] relative">
          <ProcessIntro />
        </div>
      </section>
      <section
        ref={stepsRef}
        id="section-process-steps"
        className="relative z-10 section-fullscreen snap-section min-h-screen w-full flex items-center justify-center will-change-transform"
      >
        <BackgroundAnimation withBlur={true} />
        <div className="max-w-7xl w-full mx-auto z-[5] relative">
          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
