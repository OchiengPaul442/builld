"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollProvider, useScroll } from "@/context/scroll-context";
import Header from "@/components/layout/header";
import PageIndicator from "@/components/ui/page-indicator";
import SplashScreen from "@/components/sections/splash-screen";
import HeroAndAboutSections from "@/components/sections/hero-about-section";
import ProcessSection from "@/components/sections/process/process-section";
import ServicesSection from "@/components/sections/services-section";
import ContactUs from "@/components/sections/contact-us";
import dynamic from "next/dynamic";

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

// Create a client-side only version of the Home content
function HomeContent() {
  const { setActiveSection } = useScroll();
  const [splashComplete, setSplashComplete] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [startReveal, setStartReveal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);
  const scrollHandlerRef = useRef<(() => void) | null>(null);

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
    setActiveSection("hero");
    const timerId = setTimeout(() => {
      setStartReveal(true);
    }, 500);
    return () => clearTimeout(timerId);
  }, [setActiveSection]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    scrollHandlerRef.current = throttle(() => {
      const currentScrollTop = container.scrollTop;

      if (currentScrollTop > prevScrollTop.current && currentScrollTop > 100) {
        setHideHeader(true);
      } else if (currentScrollTop < prevScrollTop.current) {
        setHideHeader(false);
      }

      prevScrollTop.current = currentScrollTop;
    }, 100);

    container.addEventListener("scroll", scrollHandlerRef.current, {
      passive: true,
    });

    return () => {
      if (scrollHandlerRef.current && container) {
        container.removeEventListener("scroll", scrollHandlerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {splashComplete && <Header hideHeader={hideHeader} />}
      {splashComplete && <PageIndicator />}
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-none"
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

// Wrap the entire Home component with ScrollProvider
function HomeWrapper() {
  return (
    <ScrollProvider>
      <HomeContent />
    </ScrollProvider>
  );
}

// Use dynamic import with ssr disabled for the whole page
const Home = dynamic(() => Promise.resolve(HomeWrapper), {
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black"></div>,
});

export default Home;
