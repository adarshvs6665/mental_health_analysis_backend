import mongoose, { Document, Model, Schema } from "mongoose";

interface IChatList extends Document {
  userId: String;
  chatId: String;
  chatType: String;
  chatName: String;
  recipientId: String;
  recipientPhone: String;
}

const ChatListSchema: Schema<IChatList> = new mongoose.Schema({
  userId: String,
  chatId: String,
  chatType: String,
  chatName: String,
  recipientId: String,
  recipientPhone: String,
});

const ChatList: Model<IChatList> = mongoose.model<IChatList>(
  "ChatList",
  ChatListSchema
);

export default ChatList;
