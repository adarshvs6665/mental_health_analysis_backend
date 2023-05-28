import { Request, Response } from "express";
import User from "../models/User";
import { IResponse } from "../Interfaces/IResponse";
import { v4 as uuidv4 } from "uuid";

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
                const user = new User(req.body);

                user.save();
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
    console.log(userId);

    const response: IResponse = {
        status: "success",
        message: "chats fetched successfully",
        data: [
            {
                chatId: "ndfansdofijsd89fau9834iun",
                chatName: "Group Alpha",
                chatType: "group",
            },
            {
                chatId: "ndfansdofijsd89fausav4iun",
                chatName: "Doctor",
                chatType: "individual",
            },
            {
                chatId: "ndfansdofijsd89fausav4iun",
                chatName: "Doctor",
                chatType: "individual",
            },
        ],
    };

    res.status(200).json(response);
};

// {
//     data: [
//         {
//             chatId: "ndfansdofijsd89fau9834iun",
//             chatName: "Group Alpha",
//             chatType: "group"
//         },
//         {
//             chatId: "ndfansdofijsd89fausav4iun",
//             chatName: "Doctor",
//             chatType: "individual"
//         },

//     ]
// }
