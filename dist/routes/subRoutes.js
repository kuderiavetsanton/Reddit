"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subController_1 = require("../controllers/subController");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = __importDefault(require("../middleware/user"));
const subMiddlware_1 = require("../middleware/subMiddlware");
const router = express_1.Router();
router.route('/')
    .post(user_1.default, auth_1.default, subController_1.createSub);
router.get('/search/:name', user_1.default, subController_1.searchSub);
router.get('/:name', user_1.default, subController_1.fetchSub);
router.get('/:name/posts', user_1.default, subController_1.fetchSubPosts);
router.post('/:name/image', user_1.default, auth_1.default, subMiddlware_1.upload.single('file'), subMiddlware_1.ownSub, subController_1.uploadSubImage);
exports.default = router;
//# sourceMappingURL=subRoutes.js.map