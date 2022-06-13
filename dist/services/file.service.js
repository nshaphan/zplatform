"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const upload = (field, folderName, sizeLimit, accept, uploadErrorMessage) => {
    const dir = `public/${folderName}`;
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/${folderName}`);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (accept.includes(file.mimetype)) {
            cb(null, true);
            re;
        }
        cb(null, false);
        return cb(new Error(uploadErrorMessage));
    };
};
return (0, multer_1.default)({
    limits: { fieldSize: sizeLimit * 1024 * 1024 },
    storage,
    fileFilter,
}).single(field);
;
