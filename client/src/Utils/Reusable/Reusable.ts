import { toast } from "react-toastify";

export const errorHandler = (error: unknown) => {

  let hasShownToast = false; 
  if (hasShownToast) return;

  try {

    let message = '';

    if (typeof error === 'object' && error !== null && 'response' in error) {
      
      const axiosError = error as { response: { data: { message?: string } } };
      message = axiosError?.response?.data?.message || 'An error occurred with the request.';
      console.error('Axios error:', message);

    } else if (error instanceof Error) {

      // Standard Error handling
      message = error.message || String(error);
      console.error('Error message:', message);

    } else {

      // Handle other types of errors (e.g., string, number, etc.)
      message = String(error) || 'An unknown error occurred.';
      console.error('Unknown error type:', message);

    }

    toast.error(message);
    hasShownToast = true; 
  } catch (catchError) {

    // Handle errors occurring during the error handling
    console.error('Error while handling the error:', catchError);

  }
};
