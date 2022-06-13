"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const accounts_service_1 = require("../services/accounts.service");
exports.default = (0, express_validator_1.checkSchema)({
    email: {
        trim: true,
        isEmail: true,
        errorMessage: "Invalid Email",
        normalizeEmail: true,
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                if (value) {
                    const user = yield (0, accounts_service_1.findUserByEmail)(value);
                    if (!user) {
                        throw new Error("User with this email does not exists");
                    }
                }
                return true;
            }),
        },
    },
});
