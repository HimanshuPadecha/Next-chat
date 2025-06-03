import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { backendResponse } from "@/interfaces/backend-response";
import type { message } from "@/interfaces/requestes.interfaces";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import { sendMessage } from "@/utils/requests";
import type { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface messageInputProps {
  receiverId: string;
}

const MessageInput = ({ receiverId }: messageInputProps) => {
  const [loading, setLoading] = useState(false);

  const handleMessageSend = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<backendResponse<message>> =
        await sendMessage({ content: message, receiverId });
      console.log(response);
      toast.success("Message sent !!!");
      setMessage("");
    } catch (error) {
      AxiosErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState("");
  return (
    <div className="absolute bottom-3 right-0 w-full flex items-center gap-3 px-7">
      <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button
        className="px-12 flex items-center justify-center"
        disabled={loading}
        onClick={handleMessageSend}
      >
        {loading ? <Loader2Icon className="size-5 animate-spin" /> : "Send"}
      </Button>
    </div>
  );
};

export default MessageInput;
