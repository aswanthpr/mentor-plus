import { toast } from "react-toastify";

let hasShownToast = false; 

export const errorHandler = (error: unknown) => {
  if (hasShownToast) return; 

  try {
    let message = '';

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      message = axiosError?.response?.data?.message || 'An error occurred with the request.';
      console.error('Axios error:', message);
    } else if (error instanceof Error) {
      message = error.message || String(error);
      console.error('Error message:', message);
    } else {
      message = String(error) || 'An unknown error occurred.';
      console.error('Unknown error type:', message);
    }

    toast.error(message);
    hasShownToast = true; 

    
    setTimeout(() => {
      hasShownToast = false;
    }, 2000); 

  } catch (catchError) {
    console.error('Error while handling the error:', catchError);
  }
};