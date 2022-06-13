import { checkSchema } from "express-validator";

export default checkSchema({
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
