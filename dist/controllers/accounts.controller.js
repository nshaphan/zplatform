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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.ResetPassword = exports.LoginWithLink = exports.sendLoginLink = exports.verifyProfile = exports.updateProfile = exports.forgotPassword = exports.login = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("../config"));
const accounts_service_1 = require("../services/accounts.service");
const jwtHelper_1 = require("../utils/jwtHelper");
const mailer_1 = __importDefault(require("../utils/mailer"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield (0, accounts_service_1.createUserProfile)(req.body);
    return res.status(201).json({
        status: true,
        message: "Profile created successfully",
        data: {
            id: user.id,
        },
    });
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    const user = yield (0, accounts_service_1.findUserByEmail)(input.email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Incorrect credentials",
        });
    }
    if (!bcrypt_1.default.compareSync(input.password, user.password)) {
        return res.status(401).json({
            success: false,
            message: "Incorrect credentials",
        });
    }
    const token = (0, jwtHelper_1.signToken)(user, "24h");
    return res.status(201).json({
        success: true,
        message: "Logged in successfully",
        data: {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token,
        },
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield (0, accounts_service_1.findUserByEmail)(input.email);
    const token = (0, jwtHelper_1.signToken)(user, "15m");
    (0, mailer_1.default)({
        to: input.email,
        subject: "ZPlatform - Reset Password",
        message: `Click here to reset password: ${config_1.default.FRONTEND_HOST}/reset-password/${token}`,
    });
    // send email
    return res.status(201).json({
        status: "success",
        message: "Password email sent successfully, check your email.",
    });
});
exports.forgotPassword = forgotPassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const input = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield (0, accounts_service_1.updateUserProfile)(Object.assign(Object.assign({}, input), { documentAttachment: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "" }));
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return res.status(201).json({
        status: "success",
        message: "Profile created successfully",
        data: {
            id: Number(user.id),
        },
    });
});
exports.updateProfile = updateProfile;
const verifyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield (0, accounts_service_1.changeStatus)(input.id, input.status);
    return res.status(201).json({
        status: "success",
        message: "Profile created successfully",
        data: {
            id: Number(user.id),
        },
    });
});
exports.verifyProfile = verifyProfile;
const sendLoginLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = yield (0, accounts_service_1.generateLoginLink)(input.email);
    (0, mailer_1.default)({
        to: input.email,
        subject: "ZPlatform - Login Link",
        message: `Click here to Login: ${config_1.default.FRONTEND_HOST}/login-link/${user.loginLinkToken}`,
    });
    // send email
    return res.status(201).json({
        status: "success",
        message: "Login link email sent successfully, check your email.",
    });
});
exports.sendLoginLink = sendLoginLink;
const LoginWithLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.params;
    const data = yield (0, jwtHelper_1.verifyToken)(input.token);
    if (data.error) {
        return res.status(401).json({
            success: false,
            message: "The link is either invalid or expired",
        });
    }
    const user = yield (0, accounts_service_1.revokeLoginLink)(data.id || 0);
    const token = (0, jwtHelper_1.signToken)(user, "24h");
    return res.status(201).json({
        success: true,
        message: "Logged in successfully",
        data: {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token,
        },
    });
});
exports.LoginWithLink = LoginWithLink;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    const { params } = req;
    const data = yield (0, jwtHelper_1.verifyToken)(params.token);
    if (data.error) {
        return res.status(401).json({
            success: false,
            message: "The link is either invalid or expired",
        });
    }
    yield (0, accounts_service_1.setPassword)(data.id || 0, input.password);
    return res.status(201).json({
        success: true,
        message: "Password reset successfully",
    });
});
exports.ResetPassword = ResetPassword;
const getUserProfile = (req, res) => {
    const { user } = res.locals;
    return res.status(201).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
            user: {
                profilePhoto: user.profilePhoto || "",
                firstName: user.firstName,
                lastName: user.firstName,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                maritalStatus: user.maritalStatus,
                nationality: user.nationality,
                email: user.email,
                status: user.status || null || undefined,
                documentAttachment: user.documentAttachment || "",
            },
        },
    });
};
exports.getUserProfile = getUserProfile;
