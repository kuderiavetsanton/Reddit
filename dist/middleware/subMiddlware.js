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
exports.ownSub = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const Sub_1 = __importDefault(require("../models/Sub"));
const multerStorage = multer_1.default.diskStorage({
    filename(req, file, callback) {
        try {
            const ext = path_1.default.extname(file.originalname);
            let fileId = uuid_1.v4();
            console.log(`${fileId}${ext}`);
            callback(null, `${fileId}${ext}`);
        }
        catch (error) {
            callback(new Error('something wrong with image'), 'a');
        }
    },
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    }
});
const multerFilter = (req, file, callback) => {
    console.log(file.mimetype);
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback(new Error('The file u upload its not an image'));
    }
};
exports.upload = multer_1.default({
    storage: multerStorage,
    fileFilter: multerFilter
});
const ownSub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('s1');
    const user = res.locals.user;
    const name = req.params.name;
    try {
        let sub = yield Sub_1.default.findOne({ name }).populate({
            path: 'author',
            select: 'username'
        });
        if (sub.author.username !== user.username) {
            res.status(403).json({ error: 'You are not owner of that sub' });
        }
        else {
            res.locals.sub = sub;
            next();
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.ownSub = ownSub;
//# sourceMappingURL=subMiddlware.js.map