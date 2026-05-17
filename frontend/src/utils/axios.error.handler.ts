import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const AxiosErrorHandler = (error: AxiosError | any) => {
  if (error.response && error.response.data) {
    // Display server error message
    console.log(error.response.data);

    let messageToDisplay = error.response.data.message || "An error occurred. Please try again.";

    // Try to parse if it's a Zod error array (stringified) or an array
    try {
      let parsed = messageToDisplay;
      if (typeof messageToDisplay === "string" && messageToDisplay.startsWith("[")) {
        parsed = JSON.parse(messageToDisplay);
      }
      
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
        // Construct a friendly message: "username: String must contain at most 10 character(s)"
        const firstError = parsed[0];
        const field = firstError.path && firstError.path.length > 0 ? `${firstError.path.join('.')}: ` : '';
        messageToDisplay = `${field}${firstError.message}`;
      }
    } catch (e) {
      // Ignore parse errors
    }

    toast.error(messageToDisplay);
  } else if (error.code == "ECONNABORTED") {
    toast("Request timed out ! please try again ");
  } else {
    // Fallback to generic error message if no response data
    toast(error.message || "An unexpected error occurred.");
  }
  console.log(error);
};
