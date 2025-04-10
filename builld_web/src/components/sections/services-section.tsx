"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useScroll } from "@/context/scroll-context";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
const BackgroundAnimation = dynamic(
  () => import("../ui/background-animation"),
  { ssr: false }
);

type PlanPeriod = "monthly" | "quarterly" | "yearly";

interface Service {
  name: string;
  price: number;
}

interface Plan {
  name: string;
  description: string;
  oneTimeTotalPrice: number;
  oneTimeServices: Service[];
  subscriptionServices: string[];
  monthlyPricing: Record<PlanPeriod, number>;
  isLight: boolean;
}

const PLAN_PERIODS: PlanPeriod[] = ["monthly", "quarterly", "yearly"];
const ANIM_DURATION = 0.3;

export default function ServicesSection() {
  const { setActiveSection, scrollToSection } = useScroll();
  const [selectedPlan, setSelectedPlan] = useState<PlanPeriod>("monthly");
  const [showOptionalServices, setShowOptionalServices] = useState<
    Record<string, boolean>
  >({
    LaunchPad: false,
    Ignite: false,
  });
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setActiveSection("services"), 50);
      return () => clearTimeout(timer);
    }
  }, [inView, setActiveSection]);

  const toggleOptionalServices = (planName: string) => {
    setShowOptionalServices((prev) => ({
      ...prev,
      [planName]: !prev[planName],
    }));
  };

  // Memoize plans to avoid unnecessary re-creation on re-renders.
  const plans: Plan[] = useMemo(
    () => [
      {
        name: "LaunchPad",
        description: "Get online fast with a professional digital presence",
        oneTimeTotalPrice: 500,
        oneTimeServices: [
          { name: "Website Design & Development", price: 100 },
          { name: "Branding & Visual Identity", price: 50 },
          { name: "Basic E-Commerce Setup", price: 150 },
          { name: "Social Media Professional Setup", price: 100 },
          { name: "Domain & Hosting Registration", price: 100 },
        ],
        subscriptionServices: [
          "SEO-Optimized Content",
          "Basic Automation & CRM",
        ],
        monthlyPricing: { monthly: 120, quarterly: 100, yearly: 80 },
        isLight: true,
      },
      {
        name: "Ignite",
        description: "Scale, optimize, and automate your digital operations",
        oneTimeTotalPrice: 1000,
        oneTimeServices: [
          { name: "Website Performance Optimization", price: 400 },
          { name: "E-Commerce & Sales Optimization", price: 350 },
          { name: "Security & Cloud Infrastructure", price: 150 },
          { name: "Compliance & Privacy Enhancements", price: 100 },
        ],
        subscriptionServices: [
          "Advanced Digital Marketing",
          "Business Automation & CRM",
          "Data Analytics & Insights",
        ],
        monthlyPricing: { monthly: 180, quarterly: 150, yearly: 120 },
        isLight: false,
      },
    ],
    []
  );

  return (
    <section
      id="section-services"
      ref={ref}
      className="section-fullscreen snap-section bg-gradient-to-br from-purple-800 to-purple-900 flex flex-col items-center justify-center py-12 px-4 md:px-6 overflow-y-auto"
    >
      <BackgroundAnimation withBlur />
      <div className="relative z-10 text-center mb-6 md:mb-8 max-w-7xl w-full mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Plans & Pricing
        </h2>
        <p className="text-lg md:text-xl text-gray-200">
          Flexible solutions for your digital growth
        </p>
      </div>

      <div className="relative z-10 flex space-x-2 bg-white/10 p-1.5 rounded-full mb-6">
        {PLAN_PERIODS.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPlan(period)}
            className={`px-4 py-1.5 text-sm md:px-6 md:py-2 md:text-base rounded-full capitalize transition-all ${
              selectedPlan === period
                ? "bg-white text-purple-700 font-bold shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-8 max-w-7xl w-full mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className={`p-5 md:p-6 rounded-2xl shadow-xl ${
              plan.isLight ? "bg-white text-gray-900" : "bg-gray-900 text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-4">
              <h3 className="text-2xl md:text-3xl font-bold">{plan.name}</h3>
              <p className="text-base md:text-lg opacity-80 mt-1">
                {plan.description}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-lg md:text-xl font-semibold mb-2">
                One-Time Services Package
              </h4>
              <div
                className={`${
                  plan.isLight ? "bg-gray-100" : "bg-gray-800"
                } p-3 md:p-4 rounded-xl`}
              >
                <ul className="space-y-1.5 mb-3">
                  {plan.oneTimeServices.map((service) => (
                    <li
                      key={service.name}
                      className="flex justify-between items-center text-sm md:text-base"
                    >
                      <span className="flex items-center">
                        <span className="text-green-400 text-base mr-2">✔</span>
                        {service.name}
                      </span>
                      <span className="font-semibold">${service.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold">Total One-Time Package</span>
                  <span className="text-lg md:text-xl font-bold">
                    ${plan.oneTimeTotalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={() => toggleOptionalServices(plan.name)}
                className="w-full flex items-center justify-between text-left py-1"
                aria-expanded={showOptionalServices[plan.name]}
              >
                <h4 className="text-lg md:text-xl font-semibold">
                  Optional Subscription Services
                </h4>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showOptionalServices[plan.name] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: showOptionalServices[plan.name] ? "auto" : 0,
                  opacity: showOptionalServices[plan.name] ? 1 : 0,
                }}
                transition={{ duration: ANIM_DURATION }}
                className="overflow-hidden"
              >
                <div
                  className={`${
                    plan.isLight ? "bg-gray-100" : "bg-gray-800"
                  } p-3 md:p-4 rounded-xl mt-2`}
                >
                  <ul className="list-disc list-inside space-y-1 mb-3 text-sm md:text-base">
                    {plan.subscriptionServices.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-sm md:text-base">
                    Subscription Fee: ${plan.monthlyPricing[selectedPlan]}/mo
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mb-4">
              <div className="text-3xl md:text-4xl font-bold">
                ${plan.monthlyPricing[selectedPlan]}
                <span className="text-base md:text-lg opacity-60 ml-1">
                  /mo
                </span>
              </div>
              <div className="text-xs md:text-sm opacity-70 mt-1">
                One-Time Package: ${plan.oneTimeTotalPrice}
              </div>
            </div>

            <button
              onClick={() => scrollToSection("contact")}
              className={`w-full py-2.5 md:py-3 cursor-pointer rounded-xl text-base md:text-lg font-semibold transition-colors ${
                plan.isLight
                  ? "bg-purple-700 text-white hover:bg-purple-800"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
