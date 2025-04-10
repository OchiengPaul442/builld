'use client';

import { motion } from 'framer-motion';
import { useScroll, SectionType } from '@/context/scroll-context';
import { useState, useEffect, useRef } from 'react';

export default function PageIndicator() {
  const { activeSection } = useScroll();
  const [stableSection, setStableSection] =
    useState<SectionType>(activeSection);
  const [isVisible, setIsVisible] = useState(true);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce activeSection updates to prevent flickering.
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setStableSection(activeSection);
    }, 200);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [activeSection]);

  // Set visibility based on screen size.
  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.innerWidth >= 768);
    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    return () => window.removeEventListener('resize', updateVisibility);
  }, []);

  const sections: SectionType[] = [
    'hero',
    'about',
    'process',
    'services',
    'contact',
  ];
  const labels: Record<SectionType, string> = {
    hero: 'Home',
    about: 'About',
    process: 'Process',
    'process-steps': 'Process',
    services: 'Services',
    contact: 'Contact',
    splash: 'Splash',
  };

  // Normalize process-steps to process.
  const normalizedActiveSection =
    stableSection === 'process-steps' ? 'process' : stableSection;

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed right-4 lg:right-16 top-1/2 -translate-y-1/2 z-50 flex-col space-y-4 lg:space-y-6 hidden md:flex"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {sections.map(section => {
        const isActive = normalizedActiveSection === section;
        return (
          <div
            key={section}
            className="w-5 h-5 lg:w-6 lg:h-6 relative flex items-center justify-center"
          >
            {/* Active indicator ring */}
            {isActive && (
              <motion.div
                className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border border-white absolute"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              />
            )}
            {/* Dot indicator */}
            <motion.div
              className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white"
              animate={{
                scale: isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0.6,
              }}
              transition={{ type: 'spring', damping: 15 }}
            />
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 absolute right-8 whitespace-nowrap bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs transition-opacity duration-200 pointer-events-none">
              {labels[section]}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
