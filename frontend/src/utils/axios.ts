import axios from "axios";

export const apiClient = axios.create({
    baseURL : "https://next-chat-qlmt.onrender.com/api/v1",
    withCredentials: true,
}) 

