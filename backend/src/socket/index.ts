import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { jwtPayload } from "../middlewares/auth.middleware";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { onlineuser, SOCKET_EVENTS_ENUM } from "../types";
import { Request } from "express";

let onlineUsers: onlineuser[] = [];

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const { accessToken } = socket.handshake.auth;
      console.log("this is done again");

      console.log({ accessToken });

      if (!accessToken) {
        return next(new ApiError(404, "no accesstoken found"));
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as jwtPayload;

      const { username } = decodedToken;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (!user) {
        return next(new ApiError(404, "No user found"));
      }

      socket.join(user.id);

      socket.user = user;
      next();
    } catch (error) {
      return next(error instanceof Error ? error : new Error(String(error)));
    }
  });

  io.on("connection", (socket) => {
    console.log("user connected: ", socket.user?.username);

    onlineUsers.push({ socketId: socket.id, username: socket.user.username });
    console.log(onlineUsers);
    socket.emit(SOCKET_EVENTS_ENUM.receiveOnlineUsers, onlineUsers);
    socket.broadcast.emit(SOCKET_EVENTS_ENUM.receiveOnlineUsers, onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(
        (user) => user.username !== socket.user.username
      );
      socket.broadcast.emit(SOCKET_EVENTS_ENUM.receiveOnlineUsers, onlineUsers);
      socket.leave(socket.user.id);
      console.log("user disconnected", socket.user.username);
      console.log(onlineUsers);
    });
    
    socket.on(SOCKET_EVENTS_ENUM.sendOnlineUsers, () => {
      socket.emit(SOCKET_EVENTS_ENUM.receiveOnlineUsers, onlineUsers);
    });
  });

  return io;
};

export const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: string,
  payload: any
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};
