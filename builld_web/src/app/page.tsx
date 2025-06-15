'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollProvider, useScroll } from '@/context/scroll-context';
import Header from '@/components/layout/header';
import PageIndicator from '@/components/ui/page-indicator';
import SplashScreen from '@/components/sections/splash-screen';
import HeroAndAboutSections from '@/components/sections/hero-about-section';
import ProcessSection from '@/components/sections/process/process-section';
import ServicesSection from '@/components/sections/services-section';
import ContactUs from '@/components/sections/contact-us';
import {
  PerformanceMonitor,
  MemoryMonitor,
} from '@/components/dev/performance-monitor';
import dynamic from 'next/dynamic';

const BackgroundAnimation = dynamic(
  () => import('../components/ui/background-animation'),
  { ssr: false }
);

// Fixed throttle function - removed 'any' type
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T {
  let lastCall = 0;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
}

function HomeContent() {
  const { setActiveSection } = useScroll();
  const [splashComplete, setSplashComplete] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [startReveal, setStartReveal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  // Add ref to track splash timeout for cleanup
  const splashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
    setActiveSection('hero');
    // Clear any existing timeout before setting new one
    if (splashTimeoutRef.current) {
      clearTimeout(splashTimeoutRef.current);
    }
    splashTimeoutRef.current = setTimeout(() => {
      setStartReveal(true);
      splashTimeoutRef.current = null; // Clear ref after execution
    }, 500);
  }, [setActiveSection]);

  // Cleanup effect for splash timeout
  useEffect(() => {
    return () => {
      if (splashTimeoutRef.current) {
        clearTimeout(splashTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Create a properly typed scroll handler
    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;

      if (currentScrollTop > prevScrollTop.current && currentScrollTop > 100) {
        setHideHeader(true);
      } else if (currentScrollTop < prevScrollTop.current) {
        setHideHeader(false);
      }

      prevScrollTop.current = currentScrollTop;
    };

    // Create throttled version with proper typing
    const throttledHandleScroll = throttle(handleScroll, 100);

    // Store for cleanup
    scrollHandlerRef.current = throttledHandleScroll;

    container.addEventListener('scroll', throttledHandleScroll, {
      passive: true,
    });

    return () => {
      if (container && scrollHandlerRef.current) {
        container.removeEventListener('scroll', scrollHandlerRef.current);
      }
      // Clear the ref
      scrollHandlerRef.current = null;
    };
  }, []); // Remove unnecessary dependencies to prevent re-adding listeners

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Development performance monitoring */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <PerformanceMonitor />
          <MemoryMonitor />
        </>
      )}

      {/* Background animation behind everything */}
      <BackgroundAnimation />

      {splashComplete && <Header hideHeader={hideHeader} />}
      {splashComplete && <PageIndicator />}
      <div
        ref={scrollContainerRef}
        className="relative h-screen overflow-y-auto scroll-smooth snap-none md:snap-y md:snap-mandatory overscroll-none"
        style={{
          zIndex: 1,
          willChange: 'scroll-position',
        }}
      >
        <SplashScreen onComplete={handleSplashComplete} />
        <HeroAndAboutSections startReveal={startReveal} />
        <ProcessSection />
        <ServicesSection />
        <ContactUs />
      </div>
    </div>
  );
}

function HomeWrapper() {
  return (
    <ScrollProvider>
      <HomeContent />
    </ScrollProvider>
  );
}

const Home = dynamic(() => Promise.resolve(HomeWrapper), {
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black"></div>,
});

export default Home;
