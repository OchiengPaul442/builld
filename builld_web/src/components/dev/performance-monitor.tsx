'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
  logThreshold?: number; // Log if frame time exceeds this (in ms)
}

export function PerformanceMonitor({
  enabled = process.env.NODE_ENV === 'development',
  logThreshold = 16.67, // ~60fps
}: PerformanceMonitorProps) {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Log slow frames
      if (delta > logThreshold) {
        console.warn(`Slow frame detected: ${delta.toFixed(2)}ms`);
      }

      // Log FPS every 60 frames
      if (frameCountRef.current % 60 === 0) {
        const fps = 1000 / delta;
        console.log(`FPS: ${fps.toFixed(1)}`);
      }

      lastTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, logThreshold]);

  return null;
}

// Memory usage monitor
export function MemoryMonitor({
  enabled = process.env.NODE_ENV === 'development',
  interval = 10000, // Check every 10 seconds
}: {
  enabled?: boolean;
  interval?: number;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const checkMemory = () => {
      // Check if the browser supports performance.memory
      if ('memory' in performance) {
        const memory = (
          performance as Performance & {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;

        if (memory) {
          console.log('Memory usage:', {
            used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
          });
        }
      }
    };

    intervalRef.current = setInterval(checkMemory, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  return null;
}
