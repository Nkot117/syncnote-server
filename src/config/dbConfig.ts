import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import env from "dotenv";
env.config();

const dbUri = process.env.MONGO_URI || "";

// MongoDBに接続
try {
  mongoose.connect(dbUri, {
    serverApi: ServerApiVersion.v1,
  }).then(() => {
    console.log("MongoDB connected");
  })
} catch (error) {
  console.error(error);
}
