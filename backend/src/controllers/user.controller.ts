import { Request, Response } from "express";
import { options, sendMessageSchema, signupSchema, SOCKET_EVENTS_ENUM } from "../types";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import {
  uploadToCloudinary,
  uploadToCloudinaryResponse,
} from "../utils/cloudinary";
import {
  generateAccessToken,
  hashPassword,
  isPasswordCorrect,
} from "../utils/utils";
import { db } from "../db";
import { messages, users } from "../db/schema";
import { ApiResonse } from "../utils/apiResponse";
import { and, asc, desc, eq, getTableColumns, not, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import logger from "../utils/winston.logger";
import { emitSocketEvent } from "../socket";

export const getLoggedInUser = asyncHandler(async (req : Request , res : Response) => {
    const {user} = req
    if(!user){
      throw new ApiError(404,"Not logged in")
    }

    return res.status(200)
    .json(new ApiResonse(200,user,"user fetched"))
})

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(404, "Please provide proper username and passwords");
  }

  const { data: body } = result;

  const [alreadyExist] = await db
    .select()
    .from(users)
    .where(eq(users.username, body.username))
    .limit(1);

  if (alreadyExist) {
    throw new ApiError(401, "This username already exist");
  }

  if (!req.file) {
    // logger.info("file does not exist")
    throw new ApiError(404, "Please provide profile pic");
  }

  const response: uploadToCloudinaryResponse | undefined =
    await uploadToCloudinary(req.file.path);

  if (!response) {
    throw new ApiError(500, "Internal Server Error");
  }
  // logger.info(response.uploadedImgUrl)

  const { uploadedImgUrl: profileImg } = response;

  const hashedPassword = await hashPassword(body.password);

  const [user] = await db
    .insert(users)
    .values({
      password: hashedPassword,
      username: body.username,
      profileImg,
    })
    .returning()

  return res.status(200).json(new ApiResonse(200, user, "signed up"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {

  const result = signupSchema.safeParse(req.body);
  
  if (!result.success) {
    throw new ApiError(400, `${result.error}`);
  }

  const { data: body } = result;

  const { username, password } = body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    throw new ApiError(400, "User not found");
  }
  console.log({password});
  console.log({userPass : user.password});
  

  const passwordCorrect = await isPasswordCorrect(password, user.password);
  console.log(passwordCorrect);

  if (!passwordCorrect) {
    throw new ApiError(401, "The password is incorrect");
  }

  const accessToken = await generateAccessToken(username);
  console.log(accessToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResonse(200, { accessToken }, "Logged in successfully"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResonse(200, req.user, "logged out"));
});

export const getSideBarUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
      throw new ApiError(404, "No user found");
    }

    const allusers = await db
      .select()
      .from(users)
      .where(not(eq(users.id, user.id)));

    return res
      .status(200)
      .json(new ApiResonse(200, allusers, "Users Fetched Successfully"));
  }
);

export const getChatMessages = asyncHandler(
  async (req: Request, res: Response) => {
    // logger.info("reached to controller")
    const { id: anotheruserId } = req.params;

    const { user } = req;

    if (!user) {
      throw new ApiError(404, "user not found");
    }
    // console.log({userid : user.id});
    // console.log({anotheruserId});

    const sender = alias(users, "sender");
    const receiver = alias(users, "receiver");

    const bothUserMessages = await db
      .select({
        id : messages.id,
        content : messages.content,
        sender: {
          ...getTableColumns(sender),
        },
        receiver: {
          ...getTableColumns(receiver),
        },
      })
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, anotheruserId),
            eq(messages.receiverId, user.id)
          ),
          and(
            eq(messages.receiverId, anotheruserId),
            eq(messages.senderId, user.id)
          )
        )
      )
      .innerJoin(sender, eq(sender.id, messages.senderId))
      .innerJoin(receiver, eq(receiver.id, messages.receiverId))
      .orderBy(asc(messages.createAt), asc(messages.updatedAt));


    return res
      .status(200)
      .json(
        new ApiResonse(200, bothUserMessages, "Messages fetched successfully")
      );
  }
);

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const result = sendMessageSchema.safeParse(req.body);
  
  if (!result.success) {
    throw new ApiError(404, "Please provide important fields");
  }

  const { user } = req;

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  const { receiverId, content } = result.data;

  if(receiverId === user.id){
    throw new ApiError(405,"Cannot send messages to yourself")
  }

  const [createdMessage] = await db
    .insert(messages)
    .values({
      senderId: user.id,
      receiverId,
      content,
    })
    .returning();

    const sender = alias(users, "sender");
    const receiver = alias(users, "receiver");


    const [message] = await db
        .select({
          id : messages.id,
          content : messages.content,
          sender : {
            ...getTableColumns(sender)
          },
          receiver : {
            ...getTableColumns(receiver)
          }
        })
        .from(messages)
        .where(eq(messages.id,createdMessage.id))
        .innerJoin(sender,eq(sender.id,messages.senderId))
        .innerJoin(receiver,eq(receiver.id,messages.receiverId))


    emitSocketEvent(req,receiverId,SOCKET_EVENTS_ENUM.sendMessage,message)
    emitSocketEvent(req,user.id,SOCKET_EVENTS_ENUM.sendMessage,message)

  return res
    .status(200)
    .json(new ApiResonse(200, createdMessage, "Message sent"));
});

export const deleteMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id : messageId } = req.params;

    const [existingMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));

    if (!existingMessage) {
      throw new ApiError(404, "Message Not found");
    }

    if (!req.user) {
      throw new ApiError(404, "user not found");
    }

    if (existingMessage.senderId !== req.user.id) {
      throw new ApiError(401, "You are not owner of this message");
    }

    const [deletedMessage] = await db
      .delete(messages)
      .where(eq(messages.id, existingMessage.id))
      .returning();

    return res
      .status(200)
      .json(new ApiResonse(200, deletedMessage, "Message deleted"));
  }
);
