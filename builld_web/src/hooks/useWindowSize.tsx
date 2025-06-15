'use client';

import { useState, useEffect, useRef } from 'react';

interface UseWindowSizeOptions {
  debounceMs?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const {
    debounceMs = 100,
    initialWidth = 1200,
    initialHeight = 800,
  } = options;

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : initialWidth,
    height: typeof window !== 'undefined' ? window.innerHeight : initialHeight,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        timeoutRef.current = null;
      }, debounceMs);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [debounceMs]);

  return windowSize;
}

export function useWindowWidth(options: UseWindowSizeOptions = {}) {
  const { width } = useWindowSize(options);
  return width;
}

export function useWindowHeight(options: UseWindowSizeOptions = {}) {
  const { height } = useWindowSize(options);
  return height;
}
