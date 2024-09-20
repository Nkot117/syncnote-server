import { Schema, model } from "mongoose";

interface IMemo {
  title: string;
  content: string;
}

const memoSchema = new Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

const Memo = model<IMemo>("Memo", memoSchema);

export default Memo;
