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

// API response type
interface ContactFormResponse {
  message: string;
  status: number;
}

// Create a fetcher function for SWR mutation
const postContactData = async (
  url: string,
  { arg }: { arg: ContactFormData }
): Promise<ContactFormResponse> => {
  try {
    const response = await axios.post<ContactFormResponse>(url, arg, {
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
  const [responseMessage, setResponseMessage] = useState<string>('');

  // Get API URL with fallback to ensure it's never undefined
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const contactEndpoint = `${apiBaseUrl}/api/contact`;

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
      const response = await trigger(data);

      // Store response message to display in toast
      setResponseMessage(response.message);
      setIsSuccess(true);
      return {
        success: true,
        message: response.message,
      };
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setIsSuccess(false);

      // Extract error message if available
      let errorMessage = 'Failed to send message. Please try again.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Reset the form state
  const resetForm = () => {
    setIsSuccess(false);
    setResponseMessage('');
    resetSWR();
  };

  return {
    submitContactForm,
    isLoading,
    isSuccess,
    responseMessage,
    error: error as Error | null,
    resetForm,
  };
}
