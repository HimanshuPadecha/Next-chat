import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import Auth from "./auth/auth.tsx";
import AuthLayout from "./auth/layout.tsx";
import AuthContextProvider from "./context/auth.context.tsx";
import SocketContextProvider from "./context/socket.context.tsx";
import HomeLayout from "./home/layout.tsx";
import "./index.css";
import ChatMessages from "./chat/chat-messages.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="/auth/login" element={<Auth usecase="login" />} />
        <Route path="/auth/signup" element={<Auth usecase="signup" />} />
      </Route>

      <Route
        path="/"
        element={
          <AuthContextProvider>
            <SocketContextProvider>
              <HomeLayout />
            </SocketContextProvider>
          </AuthContextProvider>
        }
      >
        <Route path="/:id" element={<ChatMessages />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
