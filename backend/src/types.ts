import { object, z } from "zod";
import "express";
import "socket.io"
import { CookieOptions } from "express";
import { Socket } from "socket.io";

declare global {
    namespace Express {
      interface Request {
        user?: userInterface;
      }
    }
  }

declare module "socket.io"{
    interface Socket {
        user: userInterface
    }
}

export const signupSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(3),
});

export interface userInterface {
  id: string;
  username: string;
  password: string;
  profileImg: string;
  createdAt: Date;
  updatedAt: Date;
}

export const options: CookieOptions = {
  httpOnly: true,
  secure: true,
};

export interface onlineuser {
  username: string;
  socketId: string;
}

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string(),
});

export const SOCKET_EVENTS_ENUM = Object.freeze({
  sendOnlineUsers : "sendOnlineUsers",
  receiveMessage: "receiveMessage",
  receiveOnlineUsers : "receiveOnlineUsers",
  sendMessage : "sendMessage"
});
