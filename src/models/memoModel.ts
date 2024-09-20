import { Schema, model } from "mongoose";

interface IMemo {
  title: String;
  content: String;
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
