import express from "express";
import {
  userAddDoctorsToChatController,
  userAuthenticateController,
  userChatListController,
  userCreateController,
  userEvaluateAnalysisController,
  userFetchAnalysisQuestionsController,
  userFetchDoctorsListController,
  userSubscribeController,
  userFetchTaskListController,
  userfetchChatController,
  userCompleteTaskController,
} from "../controllers/userController";

// for routing user APIs
export const userRouter = express.Router();

// user routes
userRouter.post("/register", userCreateController);
userRouter.post("/login", userAuthenticateController);
userRouter.get("/chats", userChatListController);
userRouter.get("/doctors", userFetchDoctorsListController);
userRouter.post("/add-doctors", userAddDoctorsToChatController);
userRouter.get("/fetch-chat-messages", userfetchChatController);
userRouter.get("/tasks", userFetchTaskListController);
userRouter.post("/subscribe", userSubscribeController);
userRouter.get(
  "/fetch-analysis-questions",
  userFetchAnalysisQuestionsController
);
userRouter.post("/evaluate-analysis", userEvaluateAnalysisController);
userRouter.post("/complete-task", userCompleteTaskController);
