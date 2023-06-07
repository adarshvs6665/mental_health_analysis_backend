import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import { IResponse } from "../Interfaces/IResponse";
import { v4 as uuidv4 } from "uuid";
import Chat from "../models/Chat";

export const doctorCreateController = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(req.body);

  console.log("hit");

  // checks if doctor exists
  Doctor.findOne({ email: email })
    .then((existingDoctor) => {
      if (existingDoctor) {
        console.log(existingDoctor);
        const response: IResponse = {
          status: "failed",
          message: "Account already exists. Please login",
        };
        res.status(400).json(response);
      } else {
        req.body.doctorId = uuidv4();
        const doctor = new Doctor(req.body);
        console.log(doctor);
        console.log(req.body);

        doctor.save();
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

export const doctorAuthenticateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  console.log(req.body);

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });

    // handling invalid credentials
    if (!doctor) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid email or password",
      };
      res.status(401).json(response);
    } else if (!doctor!.verifyPassword(password)) {
      const response: IResponse = {
        status: "failed",
        message: "Invalid email or password",
      };
      res.status(401).json(response);
    } else {
      const { password, ...doctorWithoutPassword } = doctor.toObject();

      const response: IResponse = {
        status: "success",
        message: "Login successful",
        data: doctorWithoutPassword,
      };

      // Doctor is authenticated
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

export const doctorChatListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { doctorId } = req.query;
  console.log(doctorId);

  const response: IResponse = {
    status: "success",
    message: "chats fetched successfully",
    data: [
      {
        chatId: "1",
        chatName: "Group Alpha",
        chatType: "group",
      },
      {
        chatId: "2",
        chatName: "Doctor",
        chatType: "individual",
      },
      {
        chatId: "3",
        chatName: "Doctor",
        chatType: "individual",
      },
    ],
  };

  res.status(200).json(response);
};

export const fetchChatController = async (req: Request, res: Response) => {
  const { chatId } = req.query;
  if (!chatId) {
    const response: IResponse = {
      status: "failed",
      message: "Insufficient information",
    };
    res.status(400).json(response);
  } else {
    const chat = await Chat.findOne({ chatId }).lean();

    const response: IResponse = {
      status: "success",
      message: "Login successful",
      data: chat?.messages,
    };

    res.status(200).json(response);
  }
};
