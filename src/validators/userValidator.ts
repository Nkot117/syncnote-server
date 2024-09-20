import { body } from "express-validator";

import User from "../models/userModel.js";

const userRegisterValidator = [
    body("email").isEmail().withMessage("メールアドレスの形式が正しくありません"),
    body("email").custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("このメールアドレスは既に登録されています");
        }
      });
    }),
]

export { userRegisterValidator };