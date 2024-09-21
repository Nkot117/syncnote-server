import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = model<IUser>("User", userSchema);

export default User;
export type { IUser };
