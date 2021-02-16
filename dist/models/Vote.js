"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const voteSchema = new mongoose_1.Schema({
    value: {
        type: Number,
        required: true
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post"
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment"
    }
});
exports.default = mongoose_1.model('Vote', voteSchema);
//# sourceMappingURL=Vote.js.map