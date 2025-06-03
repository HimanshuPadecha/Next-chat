import { ApiError } from "../utils/ApiError";
import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../utils/asyncHandler";
import logger from "../utils/winston.logger";

export interface jwtPayload {
  username: string;
}

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // logger.info("reached to middleware")
    const token =
      req.cookies?.accessToken ||
      req.header("Authorizition")?.replace("bearer ", "");

    if (token === undefined) {
      throw new ApiError(404, "No token found");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwtPayload;

    const { username } = decodedToken;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      throw new ApiError(404, "user not found on this token");
    }

    req.user = user;
    next();
  }
);
