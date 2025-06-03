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
    <div className="w-72 flex flex-col min-h-screen max-h-screen p-3 overflow-y-scroll">
      {/* user info */}
      <div className="flex items-center justify-between">
        <UserDisplay user={user} status="online" />
        <Button
          onClick={logoutuser}
          disabled={loading}
          className="flex items-center justify-center"
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Logout"}
        </Button>
      </div>
      <div className="flex items-center gap-2 px-5">
        <Badge
          onClick={() => SetSelectedMode("all")}
          variant={selectedMode === "all" ? "default" : "outline"}
          className="cursor-pointer"
        >
          All {users?.length}
        </Badge>
        <Badge
          onClick={() => SetSelectedMode("online")}
          variant={selectedMode === "online" ? "default" : "outline"}
          className="cursor-pointer"
        >
          Online {onlineusers?.length}
        </Badge>
      </div>

      {selectedMode === "all"
        ? users?.map((user) => (
            <UserDisplay
              user={user}
              key={user.id}
              status={onlineusers?.includes(user) ? "online" : "offline"}
            />
          ))
        : onlineusers?.map((user) => (
            <UserDisplay user={user} key={user.id} status="online" />
          ))}
    </div>
  );
};

export default Sidebar;

interface userDisplayprops {
  user: userInterface;
  status: "online" | "offline";
}

const UserDisplay = ({ user, status }: userDisplayprops) => {
  return (
    <Link to={`/${user.id}`}>
      <div className="flex items-center gap-3 my-2 hover:bg-black/10 rounded-md">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profileImg} />
        </Avatar>
        <div className="flex items-center flex-col">
          <span>{user.username}</span>
          <span
            className={cn(
              "text-xs",
              status === "online" ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </Link>
  );
};
