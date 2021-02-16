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
const commentSchema = new mongoose_1.Schema({
    body: {
        type: String,
        required: true
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    username: {
        type: String,
        required: true
    },
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
//virtual that show amount of votes in Comment 
commentSchema.virtual('voteScore').get(function () {
    if (this.populated('votes')) {
        return this.votes.reduce((prev, next) => prev + next.value, 0);
    }
});
//method that we call if user is logged in the end we add property that shows if user has voted and how he what
commentSchema.methods.withUserVote = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        let populatedComment = yield this.populate('votes').execPopulate();
        populatedComment = populatedComment.toObject();
        let voteMark = populatedComment.votes.find((vote) => vote.username === username);
        let userVote;
        if (voteMark) {
            userVote = voteMark.value;
        }
        else {
            userVote = 0;
        }
        let result = Object.assign(Object.assign({}, populatedComment), { userVote, voteScore: this.voteScore });
        return result;
    });
};
//populate Comment with Author , Sub and Votes
commentSchema.statics.populateThin = function (postId) {
    return this.find({ post: postId }).populate('votes');
};
//populate Comment with Author , Sub and Votes and add additional property (withUserVote)
commentSchema.statics.populateThinLoged = function (postId, username) {
    return __awaiter(this, void 0, void 0, function* () {
        let populatedComments = yield this.find({ post: postId }).populate('votes');
        populatedComments = populatedComments.map((comment) => {
            let voteMark = comment.votes.find((vote) => vote.username === username);
            let userVote;
            if (voteMark) {
                userVote = voteMark.value;
            }
            else {
                userVote = 0;
            }
            comment = comment.toObject();
            let result = Object.assign(Object.assign({}, comment), { userVote });
            return result;
        });
        return populatedComments;
    });
};
exports.default = mongoose_1.model('Comment', commentSchema);
//# sourceMappingURL=Comment.js.map