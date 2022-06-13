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
    id: {
        toInt: true,
        isEmpty: {
            errorMessage: "Id is required",
            //   negated: true,
        },
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                if (value) {
                    const user = yield (0, accounts_service_1.findUserById)(value);
                    if (user) {
                        throw new Error("User does not exists");
                    }
                }
                return true;
            }),
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
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                if (value) {
                    const user = yield (0, accounts_service_1.findUserByEmail)(value);
                    if (user && user.email !== value) {
                        throw new Error("User with this email already exists");
                    }
                }
                return true;
            }),
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
