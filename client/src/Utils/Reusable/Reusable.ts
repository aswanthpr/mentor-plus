import { toast } from "react-toastify";


export const errorHandler = (error: any) => {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      toast.error(message);
      console.error(message);
    }
  };

  