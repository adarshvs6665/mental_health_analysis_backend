import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  userId: string;
  name: string;
  password: string;
  mobile: string;
  email: string;
  subscription: boolean;
  score: number;
  verifyPassword(candidatePassword: string): boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  userId: String,
  name: String,
  password: String,
  mobile: String,
  email: String,
  subscription: Boolean,
  score: Number,
});

// Add a method to compare passwords
UserSchema.methods.verifyPassword = function (
  candidatePassword: string
): boolean {
  return candidatePassword === this.password;
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
