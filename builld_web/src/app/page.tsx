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

// Create a client-side only version of the Home content
function HomeContent() {
  const { setActiveSection } = useScroll();
  const [splashComplete, setSplashComplete] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  // New state: once splash is complete, wait 0.5 sec then trigger hero reveal animations.
  const [startReveal, setStartReveal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);

  // When splash screen completes, mark complete, set active section, and trigger reveal after 0.5 sec.
  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
    setActiveSection("hero");
    setTimeout(() => {
      setStartReveal(true);
    }, 500);
  }, [setActiveSection]);

  // Listen to scroll events on the scrollable container.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      // Hide header when scrolling down (past 100px); show when scrolling up.
      if (currentScrollTop > prevScrollTop.current && currentScrollTop > 100) {
        setHideHeader(true);
      } else if (currentScrollTop < prevScrollTop.current) {
        setHideHeader(false);
      }
      prevScrollTop.current = currentScrollTop;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {splashComplete && <Header hideHeader={hideHeader} />}
      {splashComplete && <PageIndicator />}
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory"
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
const Home = dynamic(() => Promise.resolve(HomeWrapper), { ssr: false });
export default Home;
