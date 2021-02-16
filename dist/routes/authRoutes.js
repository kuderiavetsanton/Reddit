"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const user_1 = __importDefault(require("../middleware/user"));
const router = express_1.default();
router.route('/')
    .post(authController_1.register);
router.route('/login')
    .post(authController_1.login);
router.get('/me', user_1.default, authController_1.me);
router.get('/logout', authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map