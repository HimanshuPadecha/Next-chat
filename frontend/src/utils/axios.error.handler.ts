import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const AxiosErrorHandler = (error: AxiosError | any) => {
  if (error.response && error.response.data) {
    // Display server error message
    console.log(error.response.data);

    toast(
      error.response.data.message || "An error occurred. Please try again."
    );
  } else if (error.code == "ECONNABORTED") {
    toast("Request timed out ! please try again ");
  } else {
    // Fallback to generic error message if no response data
    toast(error.message || "An unexpected error occurred.");
  }
  console.log(error);
};
