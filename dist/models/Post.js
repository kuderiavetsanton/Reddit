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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//function that create  a slug from a title of a post
const slugify_1 = require("../util/slugify");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    body: String,
    sub: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Sub',
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: String,
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    votes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Vote",
        }
    ]
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
//virtual that created from id and slug and in result we have url
postSchema.virtual('url').get(function () {
    return `${this._id}/${this.slug}`;
});
//virtual that show amount of votes in Post 
postSchema.virtual('voteScore').get(function () {
    if (this.populated('votes')) {
        return this.votes.reduce((prev, next) => prev + next.value, 0);
    }
});
//virtual that show amount of comments in post
postSchema.virtual('commentsAmount').get(function () {
    var _a;
    return (_a = this.comments) === null || _a === void 0 ? void 0 : _a.length;
});
//method that we call if user is logged in the end we add property that shows if user has voted and how he what
postSchema.methods.withUserVote = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        let populatedPost = yield this.populate('votes').populate('sub').execPopulate();
        populatedPost = populatedPost.toObject();
        let voteMark = populatedPost.votes.find((vote) => vote.username === username);
        let userVote;
        if (voteMark) {
            userVote = voteMark.value;
        }
        else {
            userVote = 0;
        }
        let result = Object.assign(Object.assign({}, populatedPost), { userVote });
        return result;
    });
};
//amount of posts per page
const limit = 6;
//populate Post with Author , Sub and Votes
postSchema.statics.populateThin = function (page, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.find(condition || null).populate({ path: 'author', select: 'username email' }).populate({ path: 'sub', select: 'name imageUrl imageUrn' }).populate('votes').sort({ createdAt: -1 }).skip(limit * page).limit(limit);
    });
};
//populate Post with Author , Sub and Votes and add additional property (withUserVote)
postSchema.statics.populateThinLoged = function (username, page, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        let populatedPosts;
        populatedPosts = yield this.find(condition || null).populate({ path: 'author', select: 'username email' }).populate({ path: 'sub', select: 'name imageUrl imageUrn' }).populate('votes').sort({ createdAt: -1 }).skip(limit * page).limit(limit);
        populatedPosts = populatedPosts.map((post) => {
            let voteMark = post.votes.find((vote) => vote.username === username);
            let userVote;
            if (voteMark) {
                userVote = voteMark.value;
            }
            else {
                userVote = 0;
            }
            post = post.toObject();
            let result = Object.assign(Object.assign({}, post), { userVote });
            return result;
        });
        return populatedPosts;
    });
};
//add slug before saving document
postSchema.pre('save', function (next) {
    this.slug = slugify_1.slugify(this.title);
    next();
});
exports.default = mongoose_1.model('Post', postSchema);
//# sourceMappingURL=Post.js.map