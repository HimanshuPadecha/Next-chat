import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { userInterface } from "@/interfaces/user.interface";

interface chatHeaderpros {
  user: userInterface;
}

const ChatHeader = ({ user }: chatHeaderpros) => {
  return (
    <div className="w-full mt-2 flex items-center gap-3 p-3 border-b border-b-black/50 absolute top-0 right-0">
      <Avatar>
        <AvatarImage src={user.profileImg} />
      </Avatar>
      <span>{user.username}</span>
    </div>
  );
};

export default ChatHeader;
