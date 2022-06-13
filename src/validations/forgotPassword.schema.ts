import { checkSchema } from "express-validator";
import { findUserByEmail } from "../services/accounts.service";

export default checkSchema({
  email: {
    trim: true,
    isEmail: true,
    errorMessage: "Invalid Email",
    normalizeEmail: true,
    custom: {
      options: async (value) => {
        if (value) {
          const user = await findUserByEmail(value);
          if (!user) {
            throw new Error("User with this email does not exists");
          }
        }
        return true;
      },
    },
  },
});
