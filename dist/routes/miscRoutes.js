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
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = __importDefault(require("../middleware/user"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const Sub_1 = __importDefault(require("../models/Sub"));
const Vote_1 = __importDefault(require("../models/Vote"));
const router = express_1.Router();
router.post('/vote', user_1.default, auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { value, postId, commentId } = req.body;
    value = +value;
    const { username } = res.locals.user;
    let skipValues = [1, 0, -1];
    if (!skipValues.includes(value)) {
        res.status(404).json('Value could be only 1, 0 or -1');
    }
    try {
        let post;
        let comment;
        let vote;
        if (commentId) {
            comment = yield Comment_1.default.findById(commentId);
            if (!comment) {
                res.status(404).json("Comment dosn't exist");
            }
            vote = yield Vote_1.default.findOne({ username, comment: comment === null || comment === void 0 ? void 0 : comment._id });
        }
        else {
            post = yield Post_1.default.findById(postId);
            if (!post) {
                res.status(404).json("Post dosn't exist");
            }
            vote = yield Vote_1.default.findOne({ username, post: post === null || post === void 0 ? void 0 : post._id });
        }
        if (!vote && value === 0) {
            console.log('!vote && value === 0');
            // if no vote and value = 0 return error
            return res.status(404).json({ error: 'Vote not found' });
        }
        else if (!vote) {
            console.log('!vote');
            vote = new Vote_1.default({ username, value });
            if (comment) {
                vote.comment = comment._id;
                comment.votes.push(vote._id);
            }
            else {
                vote.post = postId;
                post === null || post === void 0 ? void 0 : post.votes.push(vote._id);
            }
            yield vote.save();
        }
        else if (value === 0) {
            if (comment) {
                comment.votes = comment.votes.filter((e) => e !== (vote === null || vote === void 0 ? void 0 : vote._id));
            }
            else {
                post.votes = post.votes.filter((e) => e !== (vote === null || vote === void 0 ? void 0 : vote._id));
            }
            yield vote.remove();
        }
        else if (vote.value !== value) {
            // If vote and value has changed, update vote
            console.log('vote.value !== value');
            vote.value = value;
            yield vote.save();
        }
        if (comment) {
            yield comment.save();
            res.json(yield (comment === null || comment === void 0 ? void 0 : comment.withUserVote(username)));
        }
        else if (post) {
            yield post.save();
            res.json(yield (post === null || post === void 0 ? void 0 : post.withUserVote(username)));
        }
    }
    catch (error) {
        console.log({ error });
        res.status(500).json('Server error');
    }
}));
router.get('/top', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let topSubs = yield Sub_1.default.aggregate([
            { $addFields: { postsAmount: { $size: '$posts' }, imageUrl: { $cond: {
                            if: '$imageUrn',
                            then: { $concat: [`${process.env.APP_DOMMEN}/images/`, '$imageUrn'] },
                            else: `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`
                        } } } },
            { $sort: { postsAmount: -1 } },
            { $project: { author: 1, description: 1, title: 1, posts: 1, name: 1, imageUrl: 1, postAmount: 1 } },
            { $limit: 5 }
        ]);
        res.json(topSubs);
    }
    catch (error) {
        res.json(404).json({ error: 'Something went wrong' });
    }
}));
exports.default = router;
//# sourceMappingURL=miscRoutes.js.map