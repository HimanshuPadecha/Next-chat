import React, { createContext, useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import { LocalStorage } from "../utils/localstorage";
import { ContextLoader } from "./auth.context";

interface socketcontext {
  socket: Socket | null;
}

const SocketContext = createContext<socketcontext | null>(null);

interface socketcontextprops {
  children: React.ReactNode;
}

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within its provider");
  }

  return context;
};

export const SocketContextProvider = ({ children }: socketcontextprops) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = LocalStorage.get("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
    console.log(token);

    // console.log(import.meta.env.SOCKET_URL);

    const connectSocket = async () => {
      const socket: Socket = io("http://localhost:3000", {
        withCredentials: true,
        auth: {
          accessToken: token,
        },
      });
      
      socket.on("connect", () => {
        setSocket(socket);
        setLoading(false);
      });

      socket.on("error", (error) => {
        console.log(error);
        throw new Error("Error while connecting to socket.io");
      });
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  if (loading) {
    return <ContextLoader loadingText="Connecting to Server..." />;
  }

  return (
    <ErrorBoundary fallback={<ContextLoader loadingText="Something went wrong when making connection to server"/>}>
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    </ErrorBoundary>
  );
};

export default SocketContextProvider;
