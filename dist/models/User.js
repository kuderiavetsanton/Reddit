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
const mongoose_1 = require("mongoose");
//validation function that checking if value is Email
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: [3, 'Username must be at least 3 character long'],
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: isEmail_1.default,
            message: props => `'${props.value}' is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 character long']
    },
    subs: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Sub',
            required: true
        }
    ],
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }
    ]
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let hashPassword = yield bcryptjs_1.default.hash(this.password, 10);
        this.password = hashPassword;
    });
});
exports.default = mongoose_1.model('User', userSchema);
//# sourceMappingURL=User.js.map