import type { userInterface } from "@/interfaces/user.interface";
import { Outlet, useParams } from "react-router-dom";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";

interface chatprops {
  users: userInterface[];
}

const Chat = ({ users }: chatprops) => {
  const { id } = useParams();

  const user = id ? users.find((user) => user.id === id) as userInterface : undefined;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-black/20 backdrop-blur-sm">
      {user ? (
        <>
          <ChatHeader user={user} />
          <Outlet />
          <MessageInput receiverId={id as string} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40">
          <div className="w-20 h-20 mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <p className="text-lg">Select a conversation</p>
          <p className="text-sm">Choose a user from the sidebar to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
