import type { userInterface } from "@/interfaces/user.interface";
import { Outlet, useParams } from "react-router-dom";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";

interface chatprops {
  users: userInterface[];
}

const Chat = ({ users }: chatprops) => {
  const { id } = useParams();

  if (!id) {
    return <div>No user id found</div>;
  }
  const user = users.find((user) => user.id === id) as userInterface;

  return (
    <div className="flex-1 overflow-hidden relative">
      {user && <ChatHeader user={user} />}
      {user && <Outlet />}
      <MessageInput receiverId={id} />
    </div>
  );
};

export default Chat;
