import axios from "axios";
import { LocalStorage } from "./localstorage";

export const apiClient = axios.create({
    baseURL : "https://next-chat-qlmt.onrender.com/api/v1",
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = LocalStorage.get("accessToken");
    if (token) {
        // Using "Authorizition" to match the typo in the backend authMiddleware
        config.headers["Authorizition"] = `bearer ${token}`;
    }
    return config;
});
