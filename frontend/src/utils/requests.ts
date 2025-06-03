import { apiClient } from "./axios";

type logincredentials = { username: string; password: string };

export const login = async (data: logincredentials) => {
  return await apiClient.post("/users/login", data);
};

export const signup = async (data: FormData) => {
  return await apiClient.post("/users/signup", data);
};

export const getLoggedinUser = async () => {
  return await apiClient.get("/users/getLoggedinUser")
}

export const getUsers = async () => {
  return await apiClient.get("/users/get-users")
}

export const logout = async () => {
  return await apiClient.post("/users/logout")
}

export const getMessages = async (userid : string) => {
  return await apiClient.get(`/users/get-user-messages/${userid}`)
}

export const sendMessage = async (data : {receiverId : string,content : string}) => {
  return await apiClient.post("/users/send-message",data)
} 