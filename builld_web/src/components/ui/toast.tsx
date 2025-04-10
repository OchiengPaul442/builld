// src/components/ui/toast.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoClose,
  IoCheckmarkCircle,
  IoWarning,
  IoInformation,
} from 'react-icons/io5';

// Brand colors
const BRAND = {
  primary: '#b0ff00', // Lime green
  dark: '#000000', // Black
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
  position?: ToastPosition;
  description?: string;
}

// Toast variants for smooth animations based on position
const getToastVariants = (position: ToastPosition) => {
  // Default y-axis animation for top positions
  let yFrom = -20;
  let yTo = 0;

  // For bottom positions, reverse the y direction
  if (position.startsWith('bottom')) {
    yFrom = 20;
    yTo = 0;
  }

  return {
    hidden: {
      opacity: 0,
      y: yFrom,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: yTo,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: yFrom,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };
};

// Get position classes for the toast container
const getPositionClasses = (position: ToastPosition): string => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 right-4';
  }
};

// Toast design properties based on type
interface ToastStyle {
  icon: React.ReactNode;
  accentColor: string;
  iconColor: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  description,
  type = 'success', // Default to success instead of info
  duration = 4000,
  onClose,
  isVisible,
  position = 'top-right',
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and start the progress timer
  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100 && onClose) {
        clearInterval(intervalRef.current!);
        onClose();
      }
    }, 10);
  }, [duration, onClose]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (startTimeRef.current !== null) {
      remainingTimeRef.current = Math.max(
        0,
        duration - (Date.now() - startTimeRef.current)
      );
    }
  }, [duration]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    startTimeRef.current = Date.now() - (duration - remainingTimeRef.current);
    startTimer();
  }, [duration, startTimer]);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      startTimer();
    } else {
      pauseTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, startTimer, pauseTimer]);

  // Handle pause/resume on hover
  useEffect(() => {
    if (isPaused) {
      pauseTimer();
    } else if (isVisible) {
      resumeTimer();
    }
  }, [isPaused, isVisible, pauseTimer, resumeTimer]);

  // Design properties based on toast type
  const getToastStyle = useCallback((): ToastStyle => {
    switch (type) {
      case 'success':
        return {
          icon: <IoCheckmarkCircle className="text-xl" />,
          accentColor: BRAND.primary,
          iconColor: BRAND.primary,
        };
      case 'error':
        return {
          icon: <IoWarning className="text-xl" />,
          accentColor: '#ff4d4d', // Red
          iconColor: '#ff4d4d',
        };
      case 'warning':
        return {
          icon: <IoWarning className="text-xl" />,
          accentColor: '#ffcc00', // Amber
          iconColor: '#ffcc00',
        };
      case 'info':
        return {
          icon: <IoInformation className="text-xl" />,
          accentColor: '#3399ff', // Blue
          iconColor: '#3399ff',
        };
    }
  }, [type]);

  const toastStyle = getToastStyle();
  const positionClasses = getPositionClasses(position);
  const toastVariants = getToastVariants(position);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positionClasses} z-[9999] flex flex-col m-2`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
        >
          <div
            className="rounded-lg shadow-lg overflow-hidden max-w-md backdrop-blur-sm text-white"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              borderLeft: `4px solid ${toastStyle.accentColor}`,
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex items-start p-4">
              <div
                className="shrink-0 mr-3 mt-0.5"
                style={{ color: toastStyle.iconColor }}
              >
                {toastStyle.icon}
              </div>
              <div className="flex-1 mr-3">
                <p className="text-sm font-medium leading-5">{message}</p>
                {description && (
                  <p className="text-xs mt-1 opacity-80 leading-4">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 -mt-1 -mr-1 ml-auto h-8 w-8 flex items-center justify-center rounded-full 
                          hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <IoClose className="text-lg" />
              </button>
            </div>

            {/* Progress bar at the bottom */}
            <div className="h-1 w-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: toastStyle.accentColor }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast context for global toast management
interface ToastContextProps {
  showToast: (
    message: string,
    options?: {
      type?: ToastType;
      duration?: number;
      position?: ToastPosition;
      description?: string;
    }
  ) => void;
  hideToast: () => void;
}

interface ToastState {
  message: string;
  description?: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
  isVisible: boolean;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    duration: 4000,
    position: 'top-right',
    isVisible: false,
  });

  const showToast = (
    message: string,
    options?: {
      type?: ToastType;
      duration?: number;
      position?: ToastPosition;
      description?: string;
    }
  ) => {
    setToast({
      message,
      description: options?.description,
      type: options?.type || 'success',
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        description={toast.description}
        type={toast.type}
        duration={toast.duration}
        position={toast.position}
        onClose={hideToast}
        isVisible={toast.isVisible}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
