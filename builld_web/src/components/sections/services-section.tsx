'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { useScroll } from '@/context/scroll-context';
import { useInView } from 'react-intersection-observer';

interface ServiceCard {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  textColor: string;
  features: string[];
}

export default function ServicesSection() {
  const { setActiveSection, scrollToSection } = useScroll();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '-10% 0px',
  });
  const prevInViewRef = useRef(false);

  // Use timeoutRef for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only update if view state has changed
    if (inView !== prevInViewRef.current) {
      prevInViewRef.current = inView;

      if (inView) {
        // Use ref for the timeout to ensure proper cleanup
        timeoutRef.current = setTimeout(() => setActiveSection('services'), 50);
      }
    }
  }, [inView, setActiveSection]);
  // Service cards data
  const serviceCards: ServiceCard[] = useMemo(
    () => [
      {
        title: 'Cyber Security',
        subtitle: 'Protection & Monitoring',
        description:
          'Advanced security solutions to protect your digital assets and ensure compliance with industry standards.',
        icon: '🛡️',
        gradient: 'from-[#06051a] to-[#0a0a20]',
        textColor: 'text-white',
        features: [
          'Threat Detection & Prevention',
          'Security Audits & Compliance',
          'Data Encryption & Protection',
          'Network Security Monitoring',
          'Incident Response Planning',
        ],
      },
      {
        title: 'IT Management',
        subtitle: 'Infrastructure & Support',
        description:
          'Complete IT infrastructure management and 24/7 support to keep your business running smoothly.',
        icon: '💻',
        gradient: 'from-[#b1f90f] to-[#8cc40a]',
        textColor: 'text-slate-900',
        features: [
          'Infrastructure Management',
          '24/7 Technical Support',
          'Cloud Migration Services',
          'System Optimization',
          'Backup & Recovery Solutions',
        ],
      },
      {
        title: 'IT Consultancy',
        subtitle: 'Strategic Planning',
        description:
          'Expert consultation to align your technology strategy with business objectives and drive growth.',
        icon: '📊',
        gradient: 'from-[#06051a] to-[#0a0a20]',
        textColor: 'text-white',
        features: [
          'Technology Strategy Planning',
          'Digital Transformation',
          'Process Optimization',
          'Vendor Assessment',
          'ROI Analysis & Planning',
        ],
      },
      {
        title: 'Cloud Computing',
        subtitle: 'Scalable Solutions',
        description:
          'Scalable cloud solutions that grow with your business while reducing costs and improving efficiency.',
        icon: '☁️',
        gradient: 'from-white to-gray-50',
        textColor: 'text-slate-900',
        features: [
          'Cloud Architecture Design',
          'Multi-Cloud Management',
          'Cost Optimization',
          'Auto-scaling Solutions',
          'Performance Monitoring',
        ],
      },
      {
        title: 'Software Developer',
        subtitle: 'Custom Solutions',
        description:
          'Bespoke software development tailored to your specific business needs and requirements.',
        icon: '👨‍💻',
        gradient: 'from-white to-gray-50',
        textColor: 'text-slate-900',
        features: [
          'Custom Application Development',
          'API Integration & Development',
          'Mobile App Development',
          'Web Application Development',
          'Legacy System Modernization',
        ],
      },
      {
        title: 'Marketing Strategy',
        subtitle: 'Digital Growth',
        description:
          'Data-driven marketing strategies to boost your online presence and drive measurable results.',
        icon: '📈',
        gradient: 'from-[#06051a] to-[#0a0a20]',
        textColor: 'text-white',
        features: [
          'Digital Marketing Strategy',
          'SEO & Content Marketing',
          'Social Media Management',
          'PPC Campaign Management',
          'Analytics & Performance Tracking',
        ],
      },
    ],
    []
  );

  // Animation variants for the cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
  return (
    <section
      id="section-services"
      ref={ref}
      className="section-fullscreen snap-section z-30 flex flex-col items-center justify-center py-16 px-4 md:px-6 overflow-y-auto will-change-transform"
    >
      {/* Background with blur effect */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          zIndex: 2,
          backdropFilter: 'blur(100px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />{' '}
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full blur-xl"
          style={{ backgroundColor: 'rgba(45, 50, 255, 0.1)' }} // accent-blue with opacity
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full blur-xl"
          style={{ backgroundColor: 'rgba(177, 249, 15, 0.08)' }} // accent-green with opacity
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(45, 50, 255, 0.05)' }} // accent-blue with very low opacity
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={titleVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {' '}
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold text-white mb-6"
            style={{
              background:
                'linear-gradient(135deg, #b1f90f 0%, #ffffff 50%, #2d32ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Services
          </motion.h2>
          <motion.div
            className="w-24 h-1 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(to right, #b1f90f, #2d32ff)',
            }}
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : { width: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {serviceCards.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group relative"
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              style={{ perspective: 1000 }}
            >
              {' '}
              {/* Card */}
              <div
                className={`relative h-full p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-br ${service.gradient} transition-all duration-300 group-hover:shadow-3xl overflow-hidden`}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <motion.div
                  className="text-4xl md:text-5xl mb-4 relative z-10"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  {service.icon}
                </motion.div>

                {/* Content */}
                <div className={`relative z-10 ${service.textColor}`}>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base opacity-80 mb-3 font-medium">
                    {service.subtitle}
                  </p>
                  <p className="text-xs md:text-sm opacity-70 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features
                      .slice(0, 3)
                      .map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          className="flex items-start space-x-2 text-xs md:text-sm opacity-80"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1 + featureIndex * 0.05,
                          }}
                        >
                          <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                  </ul>

                  {/* Learn More Button */}
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      service.textColor === 'text-white'
                        ? 'bg-white/20 hover:bg-white/30 border border-white/30'
                        : 'bg-slate-900/10 hover:bg-slate-900/20 border border-slate-900/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full opacity-30" />
              </div>{' '}
              {/* Card glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg -z-10"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(177, 249, 15, 0.3), rgba(45, 50, 255, 0.3))',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {' '}
          <motion.button
            onClick={() => scrollToSection('contact')}
            className="text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #b1f90f, #2d32ff)',
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(177, 249, 15, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
