import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { userInterface } from "@/interfaces/user.interface";
import { useSocket } from "@/context/socket.context";
import { useEffect, useState } from "react";
import { SOCKET_EVENTS_ENUM, type onlineuser } from "@/interfaces/requestes.interfaces";
import { cn } from "@/lib/utils";

interface chatHeaderpros {
  user: userInterface;
}

const ChatHeader = ({ user }: chatHeaderpros) => {
  const socketContext = useSocket();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!socketContext?.socket) return;
    const { socket } = socketContext;

    const handleOnlineUsers = (data: onlineuser[]) => {
      const online = data.some((onlineUser) => onlineUser.username === user.username);
      setIsOnline(online);
    };

    socket.on(SOCKET_EVENTS_ENUM.receiveOnlineUsers, handleOnlineUsers);

    return () => {
      socket.off(SOCKET_EVENTS_ENUM.receiveOnlineUsers, handleOnlineUsers);
    };
  }, [socketContext, user.username]);

  return (
    <div className="w-full shrink-0 flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-10 shadow-sm">
      <div className="relative">
        <Avatar className="h-11 w-11 border border-white/20 shadow-lg">
          <AvatarImage src={user.profileImg} className="object-cover" />
        </Avatar>
        <div className={cn(
          "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#121214]",
          isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-500"
        )} />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-[17px] text-white/90">{user.username}</span>
        <span className={cn(
          "text-xs font-medium tracking-wide uppercase",
          isOnline ? "text-green-400" : "text-zinc-500"
        )}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
