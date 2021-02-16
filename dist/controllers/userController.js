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
exports.getUser = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username } = req.params;
    username = username === null || username === void 0 ? void 0 : username.toString();
    let me = res.locals.user;
    try {
        let user = yield User_1.default.findOne({ username }, 'username');
        let comments = yield Comment_1.default.find({ username: username }).populate({
            path: 'post',
            select: 'title slug url sub',
            populate: {
                path: 'sub',
                select: 'name'
            }
        });
        let posts;
        if (!user) {
            return res.status(404).json({ error: 'User with that name doesnt exist' });
        }
        if (me) {
            posts = yield Post_1.default.populateThinLoged(me.username, 0, { author: user._id });
        }
        else {
            posts = yield Post_1.default.populateThin(0, { author: user._id });
        }
        let submitions = [...posts];
        comments.forEach((comment) => {
            submitions.push(Object.assign(Object.assign({}, comment.toObject()), { type: 'Comment' }));
        });
        user = user.toObject();
        submitions = submitions.sort((a, b) => {
            if (a.createdAt > b.createdAt)
                return -1;
            else if (a.createdAt < b.createdAt)
                return 1;
            else
                return 0;
        });
        res.json(Object.assign(Object.assign({}, user), { submitions }));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.getUser = getUser;
//# sourceMappingURL=userController.js.map