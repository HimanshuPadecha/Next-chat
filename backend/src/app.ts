import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.router"
import { initSocket } from "./socket";

app.use("/api/v1/users",userRouter)

const httpServer = createServer(app)

const io = initSocket(httpServer)

app.set("io", io);

export { httpServer };
