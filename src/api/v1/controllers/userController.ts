import { Request, Response } from "express";
import User from "../models/User";
import { IResponse } from "../Interfaces/IResponse";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import ChatList from "../models/ChatList";
import Chat from "../models/Chat";
import Doctor from "../models/Doctor";
import { questionsData } from "../utils/data/questionsData";
import { tasksData } from "../utils/data/tasksData";
import { getRandomItemsFromArray } from "../utils/getRandomItemsFromArray";
import TaskList from "../models/TaskList";
import { formatDateAndSetToIST } from "../utils/formatDateAndSetToIST";

dotenv.config();

export const userCreateController = async (req: Request, res: Response) => {
  const { email } = req.body;

  // checks if user exists
  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        const response: IResponse = {
          status: "failed",
          message: "Account already exists. Please login",
        };
        res.status(400).json(response);
      } else {
        req.body.userId = uuidv4();
        const user = new User({ ...req.body, subscription: false, score: -1 });
        console.log(user);

        user.save();

        const chatListForUserInit = new ChatList({
          userId: req.body.userId,
          chatId: process.env.GROUP_CHAT_ID,
          chatType: "group",
          chatName: "Global Chat",
          recepientId: "",
        });

        chatListForUserInit.save();

        const response: IResponse = {
          status: "success",
          message: "Registration successful",
        };
        res.status(200).json(response);
      }
    })
    .catch((err: any) => {
      const response: IResponse = {
        status: "failed",
        message: "Registration failed",
      };
      res.status(404).json(response);
    });
};

export const userAuthenticateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  console.log(req.body);

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // handling invalid credentials
    if (!user) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid email or password",
      };
      res.status(401).json(response);
    } else if (!user!.verifyPassword(password)) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid email or password",
      };
      res.status(401).json(response);
    } else {
      const { password, ...userWithoutPassword } = user.toObject();

      const response: IResponse = {
        status: "success",
        message: "Login successful",
        data: userWithoutPassword,
      };

      // User is authenticated
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);

    // Handle any errors that occur during the authentication process
    const response: IResponse = {
      status: "failed",
      message: "internal error",
    };

    res.status(500).json(response);
  }
};

export const userChatListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  const userChats = await ChatList.find({ userId }).lean();

  const response: IResponse = {
    status: "success",
    message: "chats fetched successfully",
    data: userChats,
  };

  res.status(200).json(response);
};

export const userAddDoctorsToChatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, doctors } = req.body;

  if (!userId || !doctors) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const user = await User.findOne({ userId });

    doctors.map(async (docId: string) => {
      console.log(docId);
      const chatId = uuidv4();
      const doctor = await Doctor.findOne({ doctorId: docId });

      const userToDoctorChat = new ChatList({
        userId,
        chatId,
        chatType: "doctor",
        chatName: doctor?.name,
        recepientId: docId,
      });

      const doctorToUserChat = new ChatList({
        userId: docId,
        chatId,
        chatType: "patient",
        chatName: user?.name,
        recepientId: userId,
      });

      userToDoctorChat.save();
      doctorToUserChat.save();
    });

    const response: IResponse = {
      status: "success",
      message: "added doctor successfully",
    };

    res.status(200).json(response);
  }
};

export const userFetchTaskListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;
  console.log(userId);

  if (!userId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    let taskList = await TaskList.findOne(
      { userId },
      { _id: 0, __v: 0 }
    ).lean();
    const today = formatDateAndSetToIST(new Date());
    if (!(taskList?.assignedDate === today)) {
      const tasksArray = [...tasksData];
      const randomTasks = await getRandomItemsFromArray(tasksArray, 5);
      taskList = await TaskList.findOneAndUpdate(
        { userId },
        { tasks: [...randomTasks], assignedDate: today },
        { new: true, upsert: true }
      );
    }
    const response: IResponse = {
      status: "success",
      message: "chats fetched successfully",
      data: taskList,
    };

    res.status(200).json(response);
  }
};

export const userFetchAnalysisQuestionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response: IResponse = {
    status: "success",
    message: "chats fetched successfully",
    data: questionsData,
  };
  // console.log(response);

  res.status(200).json(response);
};

export const userfetchChatController = async (req: Request, res: Response) => {
  const { chatId } = req.query;
  if (!chatId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const chat = await Chat.findOne({ chatId }).lean();
    console.log(chat);

    const response: IResponse = {
      status: "success",
      message: "Login successful",
      data: chat ? chat.messages : [],
    };

    res.status(200).json(response);
  }
};

export const userFetchDoctorsListController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.query;
  console.log(userId);

  if (!userId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const doctors = await Doctor.find({}, { password: 0, __v: 0, _id: 0 });

    const response: IResponse = {
      status: "success",
      message: "Fetched doctors successfully",
      data: doctors,
    };

    res.status(200).json(response);
  }
};

export const userSubscribeController = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const user = await User.findOneAndUpdate(
      { userId },
      { subscription: true }
    );
    const { password, ...userData } = user!.toObject();
    const response: IResponse = {
      status: "success",
      message: "subscribed successfully",
      data: userData,
    };

    res.status(200).json(response);
  }
};

export const userEvaluateAnalysisController = async (
  req: Request,
  res: Response
) => {
  const { userId, score } = req.body;
  console.log(score);

  if (!userId || !score) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const user = await User.findOneAndUpdate({ userId }, { score });
    const { password, ...userData } = user!.toObject();

    if (score < 81) {
      const tasksArray = [...tasksData];
      const randomTasks = await getRandomItemsFromArray(tasksArray, 5);
      const date = await formatDateAndSetToIST(new Date());

      await TaskList.findOneAndUpdate(
        { userId },
        { tasks: [...randomTasks], assignedDate: date },
        { new: true, upsert: true }
      );
    }
    const response: IResponse = {
      status: "success",
      message: "analysis completed",
      data: userData,
    };

    res.status(200).json(response);
  }
};

export const userCompleteTaskController = async (
  req: Request,
  res: Response
) => {
  const { userId, taskId } = req.body;
  console.log("hit");

  if (!userId || !taskId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    await TaskList.updateOne(
      { userId: userId, "tasks.taskId": taskId },
      { $set: { "tasks.$.status": "COMPLETED" } }
    )
      .then(() => {
        const response: IResponse = {
          status: "success",
          message: "updated task successfully",
        };

        res.status(200).json(response);
      })
      .catch(() => {
        const response: IResponse = {
          status: "failed",
          message: "internal error",
        };

        res.status(500).json(response);
      });
  }
};
