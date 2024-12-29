import { createTransporter } from "../config/mailConfig.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

const sendRegistrationMail = async (
  name: string,
  email: string,
  token: string,
  templateName: string
) => {
  try {
    const transporter = createTransporter();
    const from = setFromEmailAddress();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.ejs`
    );

    const verificationLink = `${process.env.CLIENT_URL}/api/user/verify-email?token=${token}`;

    const html = await ejs.renderFile(templatePath, {
      user: { name, verificationLink },
    });

    const options = {
      from: from,
      to: email,
      subject: "Registration",
      html,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
};

const setFromEmailAddress = () => {
  if(process.env.NODE_ENV === "production") {
    return process.env.PROD_MAIL_ADDRESS
  } else {
    return process.env.DEV_MAIL_ADDRESS
  }
    
}

export { sendRegistrationMail };
