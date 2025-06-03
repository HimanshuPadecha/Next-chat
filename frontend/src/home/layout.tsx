import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import type { userInterface } from "@/interfaces/user.interface";
import type { AxiosResponse } from "axios";
import type { backendResponse } from "@/interfaces/backend-response";
import { getUsers } from "@/utils/requests";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import { Loader2Icon } from "lucide-react";
import Chat from "@/chat/chat";

const HomeLayout = () => {
  const [users,setUsers] = useState<userInterface[] | null>(null)
  
  useEffect(() => {
    const getUsersFromDb = async () => {
      try {
        const response: AxiosResponse<backendResponse<userInterface[]>> =
          await getUsers();
        setUsers(response.data.response.data);
      } catch (error) {
        AxiosErrorHandler(error);
      }
    };
    getUsersFromDb();
  }, []);

  if (!users) {
    return (
      <div className="w-72 flex flex-col items-center min-h-screen p-3">
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <Loader2Icon className="size-5 animate-spin" />
            <span className="text-md">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex">
      <Sidebar users={users} />
      <Chat users={users}/>
    </div>
  );
};

export default HomeLayout;
