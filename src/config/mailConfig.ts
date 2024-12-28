import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: "email-smtp.ap-northeast-1.amazonaws.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.PROD_MAILE_USER,
        pass: process.env.PROD_MAIL_PASS,
      },
    });
    
  } else {
    return nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.DEV_MAILE_USER,
        pass: process.env.DEV_MAIL_PASS,
      },
    });
  }
};

export { createTransporter };
