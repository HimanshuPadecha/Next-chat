import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import type { userInterface } from "@/interfaces/user.interface";
import type { AxiosResponse } from "axios";
import type { backendResponse } from "@/interfaces/backend-response";
import { getUsers } from "@/utils/requests";
import { AxiosErrorHandler } from "@/utils/axios.error.handler";
import Chat from "@/chat/chat";
import { FullScreenLoader } from "@/components/ui/loader";

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
    return <FullScreenLoader text="Loading users..." />;
  }

  return (
    <div className="w-full h-screen overflow-hidden flex bg-transparent relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      
      <Sidebar users={users} />
      <div className="flex-1 h-full glass m-2 rounded-xl overflow-hidden shadow-2xl relative z-10 flex flex-col">
        <Chat users={users}/>
      </div>
    </div>
  );
};

export default HomeLayout;
