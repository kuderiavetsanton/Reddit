"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = __importDefault(require("../middleware/user"));
const router = express_1.Router();
router.route('/')
    .post(user_1.default, auth_1.default, postController_1.createPost)
    .get(user_1.default, postController_1.fetchPosts);
router.get('/:postId/:slug', user_1.default, postController_1.getPost);
router.get('/:postId/:slug/comment', user_1.default, postController_1.fetchComments);
router.post('/:postId/:slug/comment', user_1.default, auth_1.default, postController_1.createComment);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map