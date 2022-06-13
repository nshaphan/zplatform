"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (0, express_validator_1.checkSchema)({
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
