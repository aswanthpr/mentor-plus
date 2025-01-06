import { toast } from "react-toastify";




export const errorHandler = (error: unknown) => {
  try {
    if (error instanceof Error) {
     
      toast.error(error.message || 'An unexpected error occurred.');
      console.error('Error message:', error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      // Check if it's an Axios error or has a similar structure
      const axiosError = error as { response: { data: { message?: string } } };
      const message = axiosError?.response?.data?.message || 'An error occurred with the request.';
      toast.error(message);
      console.error('Axios error:', message);
    } else {
      // Handle other types of errors (e.g., string, number, etc.)
      const message = String(error) || 'An unknown error occurred.';
      toast.error(message);
      console.error('Unknown error type:', message);
    }
  } catch (catchError) {
    // Handle cases where error inspection itself fails
    toast.error('An unexpected error occurred.');
    console.error('Error while handling the error:', catchError);
  }
};

  