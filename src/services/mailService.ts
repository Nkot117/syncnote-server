import transporter from "../config/mailConfig.js";

const sendRegistrationMail = async (email: string, token: string) => {
  const info = await transporter.sendMail({
    from: process.env.DEV_MAIL_USER,
    to: email,
    subject: "TestMail",
    text: "This is a test mail",
  });
};

export { sendRegistrationMail };
