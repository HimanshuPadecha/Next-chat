import type { AxiosError, AxiosResponse } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { userInterface } from "../interfaces/user.interface";
import { LocalStorage } from "../utils/localstorage";
import { getLoggedinUser } from "../utils/requests";
import { AxiosErrorHandler } from "../utils/axios.error.handler";
import type { backendResponse } from "../interfaces/backend-response";
import { Loader2Icon } from "lucide-react";

interface authcontext {
  user: userInterface | null;
  token: string | null;
}

const AuthContext = createContext<authcontext>({
  user : null,
  token : null
});

interface authcontextprops {
  children: React.ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within provider");
  }

  return context;
};

const AuthContextProvider = ({ children }: authcontextprops) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<userInterface | null>(null);
  const token = LocalStorage.get("accessToken");
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const getuser = async () => {
      try {
        const response: AxiosResponse<backendResponse<userInterface>> =
          await getLoggedinUser();
        const { data: user } = response.data.response;
        setUser(user);
      } catch (error: AxiosError | any) {
        AxiosErrorHandler(error);
        navigate("/auth/login");
        LocalStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    getuser();
  }, []);

  if (loading) {
    return (
      <ContextLoader loadingText="Loading your deatils..."/>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;



export const ContextLoader = ({loadingText} : {loadingText : string}) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center flex-col gap-2">
          <Loader2Icon className="size-10 animate-spin" />
          <span className="text-md text-black">{loadingText}</span>
        </div>
      </div>
  )
}


