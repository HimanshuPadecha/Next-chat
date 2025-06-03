import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import type { backendResponse } from "@/interfaces/backend-response";
import {
  SOCKET_EVENTS_ENUM,
  type messages,
} from "@/interfaces/requestes.interfaces";
import { cn } from "@/lib/utils";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import { getMessages } from "@/utils/requests";
import type { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ChatMessages = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<messages[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUserMessages = async () => {
      if (!id) {
        return;
      }
      try {
        const response: AxiosResponse<backendResponse<messages[]>> =
          await getMessages(id);
        const { data: messages } = response.data.response;
        setMessages(messages);
      } catch (error) {
        AxiosErrorHandler(error);
      } finally {
        setLoading(false);
      }
    };

    getUserMessages();
  }, [id]);

  const userContext = useAuth();

  const messageDivRef = useRef<HTMLDivElement>(null);
  const socketContext = useSocket();

  if (!socketContext) {
    return <div>No socketContext found</div>;
  }

  useEffect(() => {
    if (!socketContext.socket) return;

    const { socket } = socketContext;

    const handleIncomingMessages = (data: messages) => {

      console.log("th");
      
      setMessages(prevMessages => {
        if (prevMessages === null || prevMessages.length === 0) {
          return [data];
        }
        return [...prevMessages, data];
      });
    };

    socket.on(SOCKET_EVENTS_ENUM.sendMessage, handleIncomingMessages);
    socket.on("error",(error) => {
      console.log(error);
    })

    return () => {
      socket.off(SOCKET_EVENTS_ENUM.sendMessage, handleIncomingMessages);
      socket.off("error")
    };
  }, [socketContext]);

  useEffect(() => {
    if (messages && messageDivRef.current) {
      messageDivRef.current.scrollTo({
        top: messageDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <Loader2Icon className="animate-spin size-7" />
          <span>Loading Messages...</span>
        </div>
      </div>
    );
  }
  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black min-h-screen">
        <span className="text-white">No messages found</span>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto py-16 max-h-screen flex flex-col gap-2 min-h-screen px-4"
      ref={messageDivRef}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex w-full",
            userContext.user && userContext.user.id === message.sender.id
              ? "justify-end"
              : "justify-start"
          )}
        >
          <span
            className={cn(
              "bg-black text-white px-3 py-2 rounded-lg max-w-xs break-words",
              userContext.user && userContext.user.id === message.sender.id
                ? "rounded-br-sm"
                : "rounded-bl-sm"
            )}
          >
            {message.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
