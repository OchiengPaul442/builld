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

  const debouncedSetActiveSection = useCallback(
    (section: SectionType) => {
      if (section === activeSection || manualSectionUpdateRef.current) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActiveSection(section), 100);
    },
    [activeSection]
  );

  useEffect(() => {
    const handleScroll = () => {
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

      sections.forEach((section) => {
        const element = document.getElementById(`section-${section}`);
        if (!element) return;
        const { top, bottom } = element.getBoundingClientRect();
        const visibleTop = Math.max(0, top);
        const visibleBottom = Math.min(windowHeight, bottom);
        if (visibleBottom > visibleTop) {
          const visibleArea = visibleBottom - visibleTop;
          const adjustedArea =
            visibleArea * (1 + (1 - visibleTop / windowHeight) * 0.1);
          if (adjustedArea > maxVisibleArea) {
            maxVisibleArea = adjustedArea;
            maxVisibleSection = section;
          }
        }
      });

      if (maxVisibleSection && maxVisibleSection !== activeSection) {
        debouncedSetActiveSection(maxVisibleSection);
      }

      if (activeSection === "process") {
        const processSection = document.getElementById("section-process");
        if (processSection) {
          const { top, height } = processSection.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, -top / height));
          const newStep = Math.min(4, Math.floor(progress * 5));
          setProcessCardStep(newStep);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
    };
  }, [activeSection, debouncedSetActiveSection]);

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
