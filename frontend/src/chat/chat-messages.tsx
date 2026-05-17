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
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/loader";

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
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn("flex w-full", i % 2 === 0 ? "justify-end" : "justify-start")}>
            <Skeleton className={cn("h-12 w-[60%] rounded-xl", i % 2 === 0 ? "rounded-br-sm bg-primary/20" : "rounded-bl-sm")} />
          </div>
        ))}
      </div>
    );
  }
  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-white/40">Start a conversation</span>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar"
      ref={messageDivRef}
    >
      {messages.map((message) => {
        const isSentByMe = userContext.user && userContext.user.id === message.sender.id;
        return (
          <div
            key={message.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
              isSentByMe ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "px-4 py-2.5 max-w-[70%] break-words shadow-md transition-all hover:shadow-lg",
                isSentByMe
                  ? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl rounded-tr-sm"
                  : "bg-white/10 backdrop-blur-md text-white/90 border border-white/5 rounded-2xl rounded-tl-sm"
              )}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
