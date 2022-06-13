import { checkSchema } from "express-validator";
import { checkEmailExists } from "../services/accounts.service";

export default checkSchema({
  firstName: {
    trim: true,
    isEmpty: {
      errorMessage: "First name is required",
      negated: true,
    },
    escape: true,
  },
  lastName: {
    trim: true,
    isEmpty: {
      errorMessage: "Last name is required",
      negated: true,
    },
    escape: true,
  },
  gender: {
    isIn: {
      options: [["Male", "Female"]],
      errorMessage: "Invalid Gender",
    },
  },
  age: {
    optional: true,
    isNumeric: true,
  },
  dateOfBirth: {
    isEmpty: {
      errorMessage: "Birt Date is required",
      negated: true,
    },
  },
  maritalStatus: {
    isIn: {
      options: [["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]],
      errorMessage: "Invalid Marital Status",
    },
  },
  nationality: {
    isEmpty: {
      errorMessage: "Nationality is required",
      negated: true,
    },
    escape: true,
  },
  email: {
    trim: true,
    isEmail: true,
    errorMessage: "Invalid Email",
    custom: {
      options: async (value) =>
        checkEmailExists(value).then((isExists) => {
          if (isExists) {
            throw new Error("User with this email already exists");
          }
        }),
    },
  },
  password: {
    trim: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password must have at least 8 characters",
    },
  },
  confirmPassword: {
    errorMessage: "Must have the same value as the password field",
    custom: {
      options: (value, { req }) => value === req.body.password,
    },
  },
});
