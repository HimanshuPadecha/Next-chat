import express from "express";
import {
  deleteMessage,
  getChatMessages,
  getLoggedInUser,
  getSideBarUsers,
  login,
  logout,
  sendMessage,
  signup,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uuidValidator, validator } from "../utils/utils";

const router = express.Router();

router.post("/signup", upload.single("profileImg"), signup);
router.post("/login", upload.none(), login);
router.post("/logout", authMiddleware, logout);
router.get("/get-users", authMiddleware, getSideBarUsers);
router.get(
  "/get-user-messages/:id",
  uuidValidator("id"),
  validator,
  authMiddleware,
  getChatMessages
);
router.post("/send-message", upload.none(), authMiddleware, sendMessage);
router.delete(
  "/delete-message/:id",
  uuidValidator("id"),
  validator,
  authMiddleware,
  deleteMessage
);
router.get("/getLoggedinUser", authMiddleware, getLoggedInUser);

export default router;
