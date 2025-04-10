import { useState } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';

// Define the contact form data type
export interface ContactFormData {
  email: string;
  phoneNumber: string;
  businessStage: string;
  challenge: string;
}

// Create a fetcher function for SWR mutation
const postContactData = async (
  url: string,
  { arg }: { arg: ContactFormData }
) => {
  try {
    const response = await axios.post(url, arg, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting contact data:', error);
    throw error;
  }
};

export function useContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  // Get API URL with fallback to ensure it's never undefined
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const contactEndpoint = `${apiBaseUrl}/api/contact/`;

  // Use SWR mutation for making the API call
  const {
    trigger,
    isMutating: isLoading,
    error,
    reset: resetSWR,
  } = useSWRMutation(contactEndpoint, postContactData);

  // Submit form data function
  const submitContactForm = async (data: ContactFormData) => {
    try {
      console.log(`Submitting to: ${contactEndpoint}`);
      await trigger(data);
      setIsSuccess(true);
      return true;
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setIsSuccess(false);
      return false;
    }
  };

  // Reset the form state
  const resetForm = () => {
    setIsSuccess(false);
    resetSWR();
  };

  return {
    submitContactForm,
    isLoading,
    isSuccess,
    error: error as Error | null,
    resetForm,
  };
}
