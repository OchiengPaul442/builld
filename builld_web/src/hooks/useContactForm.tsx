import { useState, useCallback } from 'react';
import axios from 'axios';
import useSWRMutation from 'swr/mutation';

// Define the contact form data type (for the form)
export interface ContactFormData {
  email: string;
  phoneNumber: string;
  challenge: string;
}

// Define the API data type (includes businessStage for backend)
interface ContactFormApiData {
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
  { arg }: { arg: ContactFormApiData }
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
  // Get API URL with fallback to local API route
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const contactEndpoint = apiBaseUrl
    ? `${apiBaseUrl}/api/contact`
    : '/api/contact';

  // Use SWR mutation for making the API call
  const {
    trigger,
    isMutating: isLoading,
    error,
    reset: resetSWR,
  } = useSWRMutation(contactEndpoint, postContactData); // Submit form data function with better error handling
  const submitContactForm = useCallback(
    async (data: ContactFormData) => {
      try {
        console.log(`Submitting to: ${contactEndpoint}`);

        // Add default businessStage since it was removed from the form but API still expects it
        const dataWithBusinessStage = {
          ...data,
          businessStage: 'General', // Default value for hidden business stage field
        };

        const response = await trigger(dataWithBusinessStage);

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
        if (axios.isAxiosError(err)) {
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = `Network error: ${err.message}`;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setResponseMessage(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [trigger, contactEndpoint]
  );
  // Reset the form state
  const resetForm = useCallback(() => {
    setIsSuccess(false);
    setResponseMessage('');
    resetSWR();
  }, [resetSWR]);

  return {
    submitContactForm,
    isLoading,
    isSuccess,
    responseMessage,
    error: error as Error | null,
    resetForm,
  };
}
