'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useScroll } from '@/context/scroll-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { useContactForm } from '@/hooks/useContactForm';
import { useToast } from '@/components/ui/toast';

// Define the form data type
interface FormData {
  email: string;
  phoneNumber: string;
  businessStage: string;
  challenge: string;
}

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .test(
      'is-valid-phone',
      'Please enter a valid phone number',
      function (value) {
        if (!value) return false;
        // Ensure the phone number has a leading plus
        let phoneStr = value.trim();
        if (!phoneStr.startsWith('+')) {
          phoneStr = '+' + phoneStr;
        }
        const phone = parsePhoneNumberFromString(phoneStr);
        return phone ? phone.isValid() : false;
      }
    ),
  businessStage: Yup.string().required('Please select a business stage'),
  challenge: Yup.string().required('Please describe your biggest challenge'),
});

// Simpler animation variants with better performance
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: 'easeOut' },
  }),
};

export default function ContactUs() {
  const { setActiveSection } = useScroll();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  // Use the contact form hook
  const {
    submitContactForm,
    isLoading,
    isSuccess,
    responseMessage,
    resetForm,
  } = useContactForm();
  const { showToast } = useToast();

  // Use a ref to track the previous inView state
  const prevInViewRef = useRef(false);

  // Timeout ref for proper cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only update section if the view state changed
    if (inView !== prevInViewRef.current) {
      prevInViewRef.current = inView;

      if (inView) {
        // Debounce the section update to avoid rapid changes during scroll
        timeoutRef.current = setTimeout(() => setActiveSection('contact'), 100);
      }
    }
  }, [inView, setActiveSection]);

  // Handle form submission using the contactForm hook
  const onSubmit = async (data: FormData) => {
    try {
      const result = await submitContactForm(data);

      if (result.success) {
        // Show success toast with the API response message
        showToast(result.message || 'Message sent successfully!', {
          type: 'success',
          position: 'bottom-right',
          description: "We'll get back to you as soon as possible.",
        });
        reset(); // Reset the form
      } else {
        // Show error toast with the error message
        showToast(result.message, {
          type: 'error',
          position: 'bottom-right',
        });
      }
    } catch {
      // Fallback error message if something unexpected happens
      showToast('Failed to send message. Please try again later.', {
        type: 'error',
        position: 'bottom-right',
      });
    }
  };

  // Reset the form and contact form state
  const handleResetForm = () => {
    resetForm();
    reset();
    showToast('Ready for a new message', {
      type: 'info',
      position: 'bottom-right',
    });
  };

  return (
    <section
      id="section-contact"
      ref={ref}
      className="section-fullscreen snap-section z-30 bg-black flex items-center justify-center py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 will-change-transform"
    >
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left content */}
        <div className="w-full max-w-2xl text-white">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeIn}
            custom={0}
          >
            Let&apos;s Build <span className="text-[#b0ff00]">Something</span>{' '}
            Together
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeIn}
            custom={0.1}
          >
            Ready to bring your ideas to life? Reach out to us and let&apos;s
            get started.
          </motion.p>
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeIn}
            custom={0.2}
          >
            <div>
              <h3 className="text-[#b0ff00] font-medium">Email</h3>
              <p>Sentomerojeremy@gmail.com</p>
              <p>Jsentomero@gmail.com</p>
            </div>
            <div>
              <h3 className="text-[#b0ff00] font-medium">Phone Number</h3>
              <p>+254 793 462205</p>
            </div>
          </motion.div>
        </div>

        {/* Right content (form) */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl bg-zinc-800/50 backdrop-blur-lg p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeIn}
          custom={0.3}
          style={{ transform: 'translateZ(0)' }}
        >
          {isSuccess ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full py-10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-[#b0ff00] rounded-full flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
              <p className="text-gray-300">
                {responseMessage ||
                  "We'll get back to you as soon as possible."}
              </p>
              <button
                type="button"
                className="mt-6 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                onClick={handleResetForm}
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-1 sm:mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-700/50 
                               border border-zinc-600 rounded-lg text-white 
                               focus:outline-none focus:ring-2 focus:ring-[#b0ff00]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-200 mb-1 sm:mb-2"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    country="us"
                    enableSearch={true}
                    value=""
                    onChange={(value: string) =>
                      setValue('phoneNumber', value, { shouldValidate: true })
                    }
                    containerStyle={{
                      width: '100%',
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '51px',
                      background: '#3f3f46',
                      color: 'white',
                      border: 'gray',
                      borderRadius: '0.5rem',
                      paddingLeft: '3rem',
                      outline: 'none',
                      fontSize: '0.875rem',
                    }}
                    buttonStyle={{
                      background: '#3f3f46',
                      color: 'white',
                      border: '1px solid rgba(107, 114, 128, 1)',
                      borderRadius: '0.5rem 0 0 0.5rem',
                      outline: 'none',
                    }}
                    dropdownStyle={{
                      background: 'white/10',
                      color: 'black',
                      border: 'gray',
                      zIndex: 9999,
                    }}
                    searchStyle={{
                      background: 'rgba(55, 65, 81, 0.5)',
                      color: 'white',
                      borderRadius: '0.25rem',
                    }}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Business Stage Field */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="businessStage"
                    className="block text-sm font-medium text-gray-200 mb-1 sm:mb-2"
                  >
                    Business Stage
                  </label>
                  <select
                    id="businessStage"
                    {...register('businessStage')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 
                               bg-zinc-700/50 border border-zinc-600 
                               rounded-lg text-white 
                               focus:outline-none focus:ring-2 focus:ring-[#b0ff00]"
                  >
                    <option value="">Choose a Plan</option>
                    <option value="LaunchPad">LaunchPad</option>
                    <option value="Ignite">Ignite</option>
                  </select>
                  {errors.businessStage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessStage.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Challenge Field */}
              <div className="mb-6">
                <label
                  htmlFor="challenge"
                  className="block text-sm font-medium text-gray-200 mb-1 sm:mb-2"
                >
                  Your Biggest Challenge
                </label>
                <textarea
                  id="challenge"
                  {...register('challenge')}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-700/50 
                             border border-zinc-600 rounded-lg text-white 
                             focus:outline-none focus:ring-2 focus:ring-[#b0ff00] 
                             resize-none"
                  placeholder="What's your biggest challenge right now?"
                />
                {errors.challenge && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.challenge.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 bg-[#9de600c4] 
                           rounded-lg text-base sm:text-lg font-medium 
                           hover:scale-95 transition-all duration-200
                           disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
}
