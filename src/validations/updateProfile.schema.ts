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
  firstName: {
    trim: true,
    escape: true,
  },
  lastName: {
    trim: true,
    escape: true,
  },
  gender: {
    optional: true,
    isIn: {
      options: [["Male", "Female"]],
      errorMessage: "Invalid Gender",
    },
  },
  age: {
    optional: true,
    isNumeric: true,
  },
  maritalStatus: {
    optional: true,
    isIn: {
      options: [["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]],
      errorMessage: "Invalid Marital Status",
    },
  },
  nationality: {
    escape: true,
  },
  email: {
    optional: true,
    trim: true,
    isEmail: true,
    // errorMessage: "Invalid Email",
    normalizeEmail: true,
    custom: {
      options: async (value) => {
        if (value) {
          const user = await findUserByEmail(value);

          if (user && user.email !== value) {
            throw new Error("User with this email already exists");
          }
        }
        return true;
      },
    },
  },
  idNumber: {
    trim: true,
  },
  documentType: {
    trim: true,
  },
  documentAttachment: {
    trim: true,
  },
});
