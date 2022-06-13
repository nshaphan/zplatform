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
exports.setPassword = exports.revokeLoginLink = exports.generateLoginLink = exports.changeStatus = exports.updateUserProfile = exports.findUserById = exports.findUserByEmail = exports.checkEmailExists = exports.createUserProfile = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("../utils/jwtHelper");
const prisma = new client_1.PrismaClient();
const createUserProfile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = bcrypt_1.default.hashSync(input.password, 10);
    const user = yield prisma.user.create({
        data: {
            profilePhoto: input.profilePhoto || "",
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            age: input.age,
            dateOfBirth: input.dateOfBirth,
            maritalStatus: input.maritalStatus,
            nationality: input.nationality,
            email: input.email,
            password: passwordHash,
        },
    });
    return user;
});
exports.createUserProfile = createUserProfile;
const checkEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: {
            email,
        },
    });
    if (user) {
        return true;
    }
    return false;
});
exports.checkEmailExists = checkEmailExists;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: {
            email,
        },
    });
    return user;
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: {
            id: Number(id),
        },
    });
    return user;
});
exports.findUserById = findUserById;
const updateUserProfile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            id: Number(input.id),
        },
        data: {
            profilePhoto: input.profilePhoto || undefined,
            firstName: input.firstName || undefined,
            lastName: input.lastName || undefined,
            gender: input.gender || undefined,
            age: input.age || undefined,
            dateOfBirth: input.dateOfBirth || undefined,
            maritalStatus: input.maritalStatus || undefined,
            nationality: input.nationality || undefined,
            email: input.email || undefined,
            documentType: input.documentType || undefined,
            idNumber: input.idNumber || undefined,
            documentAttachment: input.documentAttachment || undefined,
            status: input.isVerification ? "PENDING" : undefined,
        },
    });
    return user;
});
exports.updateUserProfile = updateUserProfile;
const changeStatus = (id, status) => {
    const user = prisma.user.update({
        where: { id },
        data: {
            status,
        },
    });
    return user;
};
exports.changeStatus = changeStatus;
const generateLoginLink = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield findUserByEmail(email);
    const token = (0, jwtHelper_1.signToken)(user, "15m");
    user = yield prisma.user.update({
        where: {
            email,
        },
        data: {
            loginLinkToken: token,
        },
    });
    return user;
});
exports.generateLoginLink = generateLoginLink;
const revokeLoginLink = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            id,
        },
        data: {
            loginLinkToken: null,
        },
    });
    return user;
});
exports.revokeLoginLink = revokeLoginLink;
const setPassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = bcrypt_1.default.hashSync(password, 10);
    yield prisma.user.update({
        where: { id },
        data: {
            password: passwordHash,
        },
    });
});
exports.setPassword = setPassword;
