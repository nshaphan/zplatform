import { checkSchema } from "express-validator";
import { findUserByEmail, findUserById } from "../services/accounts.service";

export default checkSchema({
  id: {
    toInt: true,
    isEmpty: {
      errorMessage: "Id is required",
      //   negated: true,
    },
    custom: {
      options: async (value) => {
        if (value) {
          const user = await findUserById(value);

          if (user) {
            throw new Error("User does not exists");
          }
        }
        return true;
      },
    },
  },
});
