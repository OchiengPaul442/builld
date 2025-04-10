"use client";

import { useScroll, SectionType } from "@/context/scroll-context";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NavigationProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

export default function Navigation({
  isMobile = false,
  closeMenu,
}: NavigationProps) {
  const { activeSection, scrollToSection } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: Array<{
    label: string;
    section: SectionType;
    activeSections?: SectionType[];
  }> = [
    { label: "About", section: "about" },
    {
      label: "Process",
      section: "process",
      activeSections: ["process", "process-steps"],
    },
    { label: "Services", section: "services" },
    { label: "Contact", section: "contact" },
  ];

  // Check if a nav item should be active based on current section
  const isActive = (item: (typeof navItems)[0]): boolean => {
    if (!mounted) return false;

    if (item.activeSections) {
      return item.activeSections.includes(activeSection);
    }
    return activeSection === item.section;
  };

  const handleNavClick = (section: SectionType) => {
    scrollToSection(section);
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  // Mobile navigation appearance
  if (isMobile) {
    return (
      <div className="w-full flex flex-col space-y-4">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            onClick={() => handleNavClick(item.section)}
            className={`cursor-pointer py-3 px-2 text-left text-lg font-medium border-b border-gray-700/30 ${
              isActive(item)
                ? "text-accent-green"
                : "text-white hover:text-accent-green"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    );
  }

  // Desktop navigation appearance
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
      {navItems.map((item) => (
        <motion.button
          key={item.label}
          onClick={() => handleNavClick(item.section)}
          className={`cursor-pointer text-sm lg:text-base font-medium transition-colors ${
            isActive(item)
              ? "text-accent-green"
              : "text-white hover:text-accent-green"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {item.label}
        </motion.button>
      ))}
    </nav>
  );
}
