"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const accounts_controller_1 = require("../controllers/accounts.controller");
const forgotPassword_schema_1 = __importDefault(require("../validations/forgotPassword.schema"));
const signup_schema_1 = __importDefault(require("../validations/signup.schema"));
const login_schema_1 = __importDefault(require("../validations/login.schema"));
const updateProfile_schema_1 = __importDefault(require("../validations/updateProfile.schema"));
const verifyProfile_schema_1 = __importDefault(require("../validations/verifyProfile.schema"));
const setPassword_schema_1 = __importDefault(require("../validations/setPassword.schema"));
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/docs");
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Appending extension
    },
});
const authRouter = express_1.default.Router();
authRouter.get("/", (req, res) => {
    res.send("ZPlatform Server is running.");
});
const uploadDocs = (0, multer_1.default)({ storage });
authRouter
    .post("/signup", signup_schema_1.default, accounts_controller_1.signUp)
    .post("/login", login_schema_1.default, accounts_controller_1.login)
    .post("/reset-password", forgotPassword_schema_1.default, accounts_controller_1.forgotPassword)
    .post("/update-profile", updateProfile_schema_1.default, uploadDocs.single("documentAttachment"), accounts_controller_1.updateProfile)
    .post("/verify-profile", verifyProfile_schema_1.default, accounts_controller_1.verifyProfile)
    .post("/send-login-link", forgotPassword_schema_1.default, accounts_controller_1.sendLoginLink)
    .post("/set-password", setPassword_schema_1.default, accounts_controller_1.ResetPassword);
exports.default = authRouter;
