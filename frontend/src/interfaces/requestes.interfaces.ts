import type { userInterface } from "./user.interface";

export interface loginResponseInterface {
  accessToken: string;
}

export interface messages {
  id: string;
  content: string;
  sender: userInterface;
  receiver: userInterface;
}

export const SOCKET_EVENTS_ENUM = Object.freeze({
  sendOnlineUsers : "sendOnlineUsers",
  receiveMessage: "receiveMessage",
  receiveOnlineUsers : "receiveOnlineUsers",
  sendMessage : "sendMessage"
});

export interface onlineuser{
    socketId : string,
    username : string
}

export interface message{
  id : string,
  content : string,
  senderId : string,
  receiverId : string,
  createdAt : Date,
  updatedAt : Date
}