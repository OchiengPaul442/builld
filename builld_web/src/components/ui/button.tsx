"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-accent-green text-black";
      case "secondary":
        return "bg-accent-blue text-white";
      case "outline":
        return "bg-transparent border border-white text-white";
      default:
        return "bg-accent-green text-black";
    }
  };

  return (
    <motion.button
      className={`rounded-full px-8 py-3 flex items-center space-x-2 ${getVariantClasses()} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
