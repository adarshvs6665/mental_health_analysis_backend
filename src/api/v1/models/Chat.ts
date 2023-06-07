import mongoose, { Document, Model, Schema } from "mongoose";

interface IChatMessage extends Document {
  message: String;
  userId: String;
  name: String;
}

interface IChat extends Document {
  chatId: String;
  messages: Array<IChatMessage>;
}

const ChatMessageSchema: Schema<IChatMessage> = new mongoose.Schema({
  message: String,
  userId: String,
  name: String,
});

const ChatSchema: Schema<IChat> = new mongoose.Schema({
  chatId: String,
  messages: ChatMessageSchema,
});

const Chat: Model<IChat> = mongoose.model<IChat>(
  "Chat",
  ChatSchema
);

export default Chat;
