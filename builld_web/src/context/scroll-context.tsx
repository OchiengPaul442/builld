'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

export type SectionType =
  | 'splash'
  | 'hero'
  | 'about'
  | 'process'
  | 'process-steps'
  | 'services'
  | 'contact';

type ScrollContextType = {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  scrollToSection: (section: SectionType) => void;
  processCardStep: number;
  setProcessCardStep: (step: number) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

// Properly typed throttle function that avoids using 'any'
function throttle<Args extends unknown[], R>(
  func: (...args: Args) => R,
  delay: number
): (...args: Args) => R | undefined {
  let lastCall = 0;

  return function (...args: Args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
    return undefined;
  };
}

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = useState<SectionType>('splash');
  const [processCardStep, setProcessCardStep] = useState(0);
  const isScrolling = useRef(false);
  const manualSectionUpdateRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const scrollToSection = useCallback((section: SectionType) => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    manualSectionUpdateRef.current = true;
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isScrolling.current = false;
        manualSectionUpdateRef.current = false;
      }, 1000);
    } else {
      isScrolling.current = false;
      manualSectionUpdateRef.current = false;
    }
  }, []);
  // Simplified throttled functions with stable references
  const throttledUpdateActiveSection = useCallback(
    (section: SectionType) => {
      if (manualSectionUpdateRef.current) return;
      setActiveSection(prevSection => {
        if (prevSection === section) return prevSection;
        return section;
      });
    },
    [] // Remove activeSection dependency to prevent infinite loops
  );
  const throttledUpdateProcessCardStep = useCallback(() => {
    const processSection = document.getElementById('section-process');
    if (processSection) {
      const { top, height } = processSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / height));
      const newStep = Math.min(4, Math.floor(progress * 5));
      setProcessCardStep(prevStep => {
        if (prevStep === newStep) return prevStep;
        return newStep;
      });
    }
  }, []); // Remove activeSection dependency
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current || manualSectionUpdateRef.current) return;

      const sections: SectionType[] = [
        'splash',
        'hero',
        'about',
        'process',
        'process-steps',
        'services',
        'contact',
      ];
      let maxVisibleSection: SectionType | null = null;
      let maxVisibleArea = 0;
      const windowHeight = window.innerHeight;

      // Batch DOM reads together
      const sectionMeasurements = sections.map(section => {
        const element = document.getElementById(`section-${section}`);
        if (!element) return { section, visibleArea: 0 };

        const { top, bottom } = element.getBoundingClientRect();
        const visibleTop = Math.max(0, top);
        const visibleBottom = Math.min(windowHeight, bottom);

        let visibleArea = 0;
        if (visibleBottom > visibleTop) {
          visibleArea = visibleBottom - visibleTop;
          // Apply weighting based on position
          const weightFactor = 1 + (1 - visibleTop / windowHeight) * 0.1;
          visibleArea *= weightFactor;
        }

        return { section, visibleArea };
      });

      // Find section with maximum visible area
      for (const { section, visibleArea } of sectionMeasurements) {
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleSection = section;
        }
      }
      if (maxVisibleSection) {
        throttledUpdateActiveSection(maxVisibleSection);
      }

      // Update process card step if in process section
      throttledUpdateProcessCardStep();
    };

    // Apply throttling with properly typed function
    const throttledHandleScroll = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledUpdateActiveSection, throttledUpdateProcessCardStep]); // Remove activeSection dependency to prevent infinite re-registration

  return (
    <ScrollContext.Provider
      value={{
        activeSection,
        setActiveSection,
        scrollToSection,
        processCardStep,
        setProcessCardStep,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context)
    throw new Error('useScroll must be used within a ScrollProvider');
  return context;
};
