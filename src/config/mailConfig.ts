import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: process.env.DEV_MAILE_USER,
      pass: process.env.DEV_MAIL_PASS,
    },
  });
};

export { createTransporter };
