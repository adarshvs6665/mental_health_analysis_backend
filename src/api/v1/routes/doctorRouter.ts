import express from "express";
import {
  doctorAuthenticateController,
  doctorChatListController,
  doctorCreateController,
  doctorFetchUserProfileController,
  doctorfetchChatController,
} from "../controllers/doctorController";
import Chat from "../models/Chat";

// for routing doctor APIs
export const doctorRouter = express.Router();

// doctor routes
doctorRouter.post("/register", doctorCreateController);
doctorRouter.post("/login", doctorAuthenticateController);
doctorRouter.get("/chats", doctorChatListController);
doctorRouter.get("/fetch-chat-messages", doctorfetchChatController);
doctorRouter.get("/fetch-user-profile", doctorFetchUserProfileController);

