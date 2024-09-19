import { createTransporter } from "../config/mailConfig.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const sendRegistrationMail = async (
  name: string,
  email: string,
  token: string,
  templateName: string
) => {
  try {
    const transporter = createTransporter();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.ejs`
    );

    const html = await ejs.renderFile(templatePath, { user: { name } });

    const options = {
      from: process.env.DEV_MAIL_USER,
      to: email,
      subject: "Registration",
      html,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
};

export { sendRegistrationMail };
