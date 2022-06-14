"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const globals_1 = require("@jest/globals");
const client_1 = __importDefault(require("./client"));
globals_1.jest.mock("./client", () => ({
    __esModule: true,
    default: (0, jest_mock_extended_1.mockDeep)(),
}));
const prismaMock = client_1.default;
(0, globals_1.beforeEach)(() => {
    (0, jest_mock_extended_1.mockReset)(prismaMock);
});
exports.default = prismaMock;
