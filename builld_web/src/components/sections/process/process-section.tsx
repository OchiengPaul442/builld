"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useScroll } from "@/context/scroll-context";
import ProcessIntro from "./process-intro";
import ProcessSteps from "./process-steps";
import dynamic from "next/dynamic";
const BackgroundAnimation = dynamic(
  () => import("../../ui/background-animation"),
  { ssr: false }
);

export default function ProcessSection() {
  const { setActiveSection } = useScroll();
  const [mainSectionRef, mainSectionInView] = useInView({ threshold: 0.4 });
  const [stepsRef, stepsInView] = useInView({ threshold: 0.4 });

  useEffect(() => {
    if (mainSectionInView) setActiveSection("process");
    else if (stepsInView) setActiveSection("process-steps");
  }, [mainSectionInView, stepsInView, setActiveSection]);

  return (
    <>
      <section
        ref={mainSectionRef}
        id="section-process"
        className="relative section-fullscreen snap-section min-h-screen w-full flex items-center"
      >
        <BackgroundAnimation withBlur={true} />
        <div className="max-w-7xl w-full mx-auto">
          <ProcessIntro />
        </div>
      </section>
      <section
        ref={stepsRef}
        id="section-process-steps"
        className="relative z-10 section-fullscreen snap-section min-h-screen w-full flex items-center justify-center"
      >
        <BackgroundAnimation withBlur={true} />
        <div className="max-w-7xl w-full mx-auto">
          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
