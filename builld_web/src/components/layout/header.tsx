'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Logo from '@/components/ui/logo';
import Navigation from '@/components/ui/navigation';
import { useScroll } from '@/context/scroll-context';

interface HeaderProps {
  hideHeader: boolean;
}

export default function Header({ hideHeader }: HeaderProps) {
  const { activeSection } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Only render header if activeSection isn't "splash"
  useEffect(() => {
    setShouldRender(activeSection !== 'splash');
  }, [activeSection]);

  // Handle resize events for mobile menu.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle mobile menu.
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  // Close mobile menu if clicking outside.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        menuOpen &&
        !target.closest('[data-menu="container"]') &&
        !target.closest('[data-menu="button"]')
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  if (!shouldRender) return null;

  // Motion variants for header opacity.
  const headerVariants = {
    visible: { opacity: 1, transition: { duration: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.header
      // Use semantic <header> element.
      className={`fixed top-0 left-0 right-0 z-50 p-4 sm:p-5 md:p-6 lg:px-10 transition-colors duration-300 ${
        menuOpen ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
      initial="visible"
      animate={hideHeader ? 'hidden' : 'visible'}
      variants={headerVariants}
      style={{ pointerEvents: hideHeader ? 'none' : 'auto' }}
    >
      <div className="flex justify-between items-center max-w-7xl w-full mx-auto">
        <Logo />
        <Navigation />
        <div className="md:hidden" data-menu="button">
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div
              animate={menuOpen ? 'open' : 'closed'}
              initial={false}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 },
              }}
              transition={{ duration: 0.3 }}
              className="relative w-6 h-6"
            >
              <motion.span
                className="absolute block h-0.5 bg-white w-6"
                style={{ top: '40%' }}
                variants={{
                  open: { rotate: 45, translateY: 1 },
                  closed: { rotate: 0, translateY: 0 },
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute block h-0.5 bg-white w-6"
                style={{ top: '60%' }}
                variants={{
                  open: { rotate: -45, translateY: -1 },
                  closed: { rotate: 0, translateY: 0 },
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </button>
        </div>
      </div>
      <motion.nav
        // Use semantic <nav> element.
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: menuOpen ? 'auto' : 0,
          opacity: menuOpen ? 1 : 0,
          display: menuOpen ? 'block' : 'none',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl overflow-hidden"
        data-menu="container"
      >
        <div className="p-4 sm:p-6">
          <Navigation isMobile closeMenu={() => setMenuOpen(false)} />
        </div>
      </motion.nav>
    </motion.header>
  );
}
