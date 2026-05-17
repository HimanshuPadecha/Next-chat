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
    <div className="w-full shrink-0 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3 w-full">
        <Input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50 rounded-full px-6 py-6 transition-all hover:bg-white/10"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
              e.preventDefault();
              handleMessageSend();
            }
          }}
        />
        <Button
          className="rounded-full w-12 h-12 flex items-center justify-center shrink-0 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95"
          disabled={loading || !message.trim()}
          onClick={handleMessageSend}
        >
          {loading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
