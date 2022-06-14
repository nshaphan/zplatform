"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = require("chai");
const mocha_1 = require("mocha");
(0, chai_1.use)(chai_http_1.default);
(0, mocha_1.describe)("/signup", () => {
    (0, mocha_1.it)("it should create new user", () => {
    });
});
