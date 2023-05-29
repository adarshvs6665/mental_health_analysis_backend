import express from "express";
import { userAuthenticateController, userChatListController, userCreateController, userFetchAnalysisQuestionsController, userTaskListController } from "../controllers/userController";


// for routing user APIs
export const userRouter = express.Router();



// user routes
userRouter.post("/register", userCreateController);
userRouter.post("/login", userAuthenticateController);
userRouter.get("/chats", userChatListController);
userRouter.get("/tasks", userTaskListController);
userRouter.get("/fetch-analysis-questions", userFetchAnalysisQuestionsController);


