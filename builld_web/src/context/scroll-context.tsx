"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export type SectionType =
  | "splash"
  | "hero"
  | "about"
  | "process"
  | "process-steps"
  | "services"
  | "contact";

type ScrollContextType = {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  scrollToSection: (section: SectionType) => void;
  processCardStep: number;
  setProcessCardStep: (step: number) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

// Throttle function to limit execution frequency
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = useState<SectionType>("splash");
  const [processCardStep, setProcessCardStep] = useState(0);
  const isScrolling = useRef(false);
  const manualSectionUpdateRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      element.scrollIntoView({ behavior: "smooth" });
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

  // Use throttling for section detection to improve performance
  const updateActiveSection = useCallback(
    throttle((section: SectionType) => {
      if (section === activeSection || manualSectionUpdateRef.current) return;
      setActiveSection(section);
    }, 100),
    [activeSection]
  );

  // Throttled calculation of process card step
  const updateProcessCardStep = useCallback(
    throttle(() => {
      if (activeSection === "process") {
        const processSection = document.getElementById("section-process");
        if (processSection) {
          const { top, height } = processSection.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, -top / height));
          const newStep = Math.min(4, Math.floor(progress * 5));
          setProcessCardStep(newStep);
        }
      }
    }, 100),
    [activeSection]
  );

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isScrolling.current || manualSectionUpdateRef.current) return;

      const sections: SectionType[] = [
        "splash",
        "hero",
        "about",
        "process",
        "process-steps",
        "services",
        "contact",
      ];
      let maxVisibleSection: SectionType | null = null;
      let maxVisibleArea = 0;
      const windowHeight = window.innerHeight;

      // Batch DOM reads together
      const sectionMeasurements = sections.map((section) => {
        const element = document.getElementById(`section-${section}`);
        if (!element) return { section, visibleArea: 0 };

        const { top, bottom } = element.getBoundingClientRect();
        const visibleTop = Math.max(0, top);
        const visibleBottom = Math.min(windowHeight, bottom);

        let visibleArea = 0;
        if (visibleBottom > visibleTop) {
          visibleArea = visibleBottom - visibleTop;
          // Apply weighting based on position (favor sections near the top)
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

      if (maxVisibleSection && maxVisibleSection !== activeSection) {
        updateActiveSection(maxVisibleSection);
      }

      // Update process card step if in process section
      updateProcessCardStep();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection, updateActiveSection, updateProcessCardStep]);

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
    throw new Error("useScroll must be used within a ScrollProvider");
  return context;
};
