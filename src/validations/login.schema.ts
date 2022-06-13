import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    trim: true,
    normalizeEmail: true,
  },
});
