"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    imageUrn: String,
    bannerUrn: String,
    posts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }],
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
//virtual that create full url from urn for image
subSchema.virtual('imageUrl').get(function () {
    return this.imageUrn ? `${process.env.APP_DOMMEN}/images/${this.imageUrn}` : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`;
});
//virtual that create full url from urn  for banner
subSchema.virtual('bannerUrl').get(function () {
    return this.bannerUrn ? `${process.env.APP_DOMMEN}/images/${this.bannerUrn}` : null;
});
exports.default = mongoose_1.model('Sub', subSchema);
//# sourceMappingURL=Sub.js.map