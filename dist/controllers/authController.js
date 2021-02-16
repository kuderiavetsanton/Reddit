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
exports.logout = exports.me = exports.login = exports.register = void 0;
const trim_1 = __importDefault(require("../util/trim"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Database collections and typescript interfaces
const User_1 = __importDefault(require("../models/User"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //delete spaces from a start and end of the req.body properties except password
        req.body = trim_1.default(req.body, ['password']);
        //create User
        const user = yield User_1.default.create(req.body, 'username email');
        res.json({ email: user.email, username: user.username });
    }
    catch (error) {
        let validationErrors = {};
        //validation failed
        if (error.errors) {
            for (let key in error.errors) {
                validationErrors[key] = error.errors[key].properties.message;
            }
            res.status(400).json(validationErrors);
        }
        //uniquness failed
        else if (error.code === 11000) {
            const key = Object.keys(error.keyValue)[0];
            res.status(400).json({ errors: { [key]: `Your ${key} is already taken` } });
        }
        else {
            next({ message: 'Server error', status: 500 });
        }
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, username } = req.body;
        //find a user with that username
        const user = yield User_1.default.findOne({ username }, 'username email password');
        //check if user exist
        if (user) {
            //compare passwords in database and what we recieve from client
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            //if its match set create token and set Cookie and send it to a Client back
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ username: user.username }, process.env.JWT_SECRET);
                res.set('Set-Cookie', cookie_1.default.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 3600,
                    sameSite: true,
                    path: '/'
                }));
                res.json({ username, email: user.email });
            }
            else {
                throw new Error("User with that username or password doesn't exist");
            }
        }
        else {
            throw new Error("User with that username or password doesn't exist");
        }
    }
    catch (error) {
        next({ message: error.message, status: 422 });
    }
});
exports.login = login;
const me = (req, res) => {
    // if user exist send its email and username to the client
    const user = res.locals.user;
    if (user) {
        res.json({ username: user.username, email: user.email });
    }
    else {
        res.status(302).json({ error: 'User not logged' });
    }
};
exports.me = me;
const logout = (req, res) => {
    //set a token Http cookie on response with maxAge of 1 so its imidiatly expire
    try {
        res.set('Set-Cookie', cookie_1.default.serialize('token', '', {
            httpOnly: true,
            maxAge: 1,
            sameSite: true,
            path: '/'
        }));
        res.json({ success: true });
    }
    catch (error) {
        res.json('Something went wrong');
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map