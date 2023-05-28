import express from "express";
import { userAuthenticateController, userChatListController, userCreateController } from "../controllers/userController";


// for routing user APIs
export const userRouter = express.Router();



// user routes
userRouter.post("/register", userCreateController);
userRouter.post("/login", userAuthenticateController);
userRouter.get("/chats", userChatListController);


