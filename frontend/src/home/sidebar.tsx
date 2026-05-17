import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import {
  SOCKET_EVENTS_ENUM,
  type onlineuser,
} from "@/interfaces/requestes.interfaces";
import type { userInterface } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import { LocalStorage } from "@/utils/localstorage";
import { logout } from "@/utils/requests";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface sidebarprops {
  users: userInterface[] | null;
}

const Sidebar = ({ users }: sidebarprops) => {
  const userContext = useAuth();
  const { user } = userContext;

  if (!user) {
    return;
  }

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const socketContext = useSocket();
  const [onlineusers, setOnlineusers] = useState<userInterface[] | null>(null);

  useEffect(() => {
    if (!socketContext?.socket) return;

    const { socket } = socketContext;

    // console.log("useEffect is running");

    const handleOnlineUsers = (data: onlineuser[]) => {
      const onlineusers = data.filter(
        (item) => item.username !== user.username
      );
      const onlineusersMapped: userInterface[] = [];
      users?.forEach((user) => {
        onlineusers.forEach((onlineuser) => {
          if (onlineuser.username === user.username) {
            onlineusersMapped.push(user);
          }
        });
      });
      setOnlineusers(onlineusersMapped);
    };

    socket.emit(SOCKET_EVENTS_ENUM.sendOnlineUsers);
    socket.on(SOCKET_EVENTS_ENUM.receiveOnlineUsers, handleOnlineUsers);

    return () => {
      socket.off(SOCKET_EVENTS_ENUM.receiveOnlineUsers, handleOnlineUsers);
    };
  }, [socketContext]);

  const logoutuser = async () => {
    setLoading(true);
    try {
      await logout();
      LocalStorage.clear();
      navigate("/auth/login");
      toast.success("Logged out!");
      socketContext?.socket?.disconnect();
    } catch (error) {
      AxiosErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedMode, SetSelectedMode] = useState<"all" | "online">("all");

  // const [users, setUsers] = useState<userInterface[] | null>(null);

  return (
    <div className="w-80 flex flex-col h-full py-4 px-3 overflow-y-auto border-r border-white/10 z-10 bg-black/20 backdrop-blur-sm shadow-xl">
      {/* user info */}
      <div className="flex items-center justify-between mb-6 px-2">
        <UserDisplay user={user} status="online" isCurrentUser />
        <Button
          onClick={logoutuser}
          disabled={loading}
          variant="destructive"
          size="sm"
          className="flex items-center justify-center shadow-lg hover:shadow-red-500/20 transition-all rounded-full px-4"
        >
          {loading ? <Loader2Icon className="animate-spin size-4 mr-2" /> : null}
          {loading ? "..." : "Logout"}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 px-2 mb-4">
        <Badge
          onClick={() => SetSelectedMode("all")}
          variant={selectedMode === "all" ? "default" : "outline"}
          className={cn("cursor-pointer transition-all", selectedMode === "all" ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "hover:bg-white/10")}
        >
          All {users?.length}
        </Badge>
        <Badge
          onClick={() => SetSelectedMode("online")}
          variant={selectedMode === "online" ? "default" : "outline"}
          className={cn("cursor-pointer transition-all", selectedMode === "online" ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "hover:bg-white/10")}
        >
          Online {onlineusers?.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 px-1 custom-scrollbar">
        {selectedMode === "all"
          ? users?.map((user) => (
              <UserDisplay
                user={user}
                key={user.id}
                status={onlineusers?.some(u => u.id === user.id) ? "online" : "offline"}
              />
            ))
          : onlineusers?.map((user) => (
              <UserDisplay user={user} key={user.id} status="online" />
            ))}
      </div>
    </div>
  );
};

export default Sidebar;

interface userDisplayprops {
  user: userInterface;
  status: "online" | "offline";
  isCurrentUser?: boolean;
}

const UserDisplay = ({ user, status, isCurrentUser }: userDisplayprops) => {
  return (
    <Link to={isCurrentUser ? "#" : `/${user.id}`} className={isCurrentUser ? "pointer-events-none" : ""}>
      <div className={cn(
        "flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group",
        isCurrentUser ? "bg-white/5" : "hover:bg-white/10 cursor-pointer hover:shadow-md"
      )}>
        <div className="relative">
          <Avatar className="h-12 w-12 border border-white/10 group-hover:border-primary/50 transition-colors">
            <AvatarImage src={user.profileImg} className="object-cover" />
          </Avatar>
          <div className={cn(
            "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background",
            status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-500"
          )} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-medium text-white/90 group-hover:text-white transition-colors">
            {user.username} {isCurrentUser && "(You)"}
          </span>
          <span
            className={cn(
              "text-[11px] font-medium tracking-wide uppercase",
              status === "online" ? "text-green-400" : "text-zinc-500"
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </Link>
  );
};
