"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accounts_controller_1 = require("../../controllers/accounts.controller");
const authRouter = express_1.default.Router();
authRouter.get('/', (req, res) => {
    res.send('Express & TypeScript Server is running.');
});
authRouter.post('/signup', accounts_controller_1.signUp);
authRouter;
exports.default = authRouter;
