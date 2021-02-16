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
exports.uploadSubImage = exports.searchSub = exports.fetchSubPosts = exports.fetchSub = exports.createSub = void 0;
const trim_1 = __importDefault(require("../util/trim"));
const Post_1 = __importDefault(require("../models/Post"));
const Sub_1 = __importDefault(require("../models/Sub"));
const fs_1 = __importDefault(require("fs"));
const createSub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let errors = {};
        req.body = trim_1.default(req.body, ['description']);
        let { name, title, description } = req.body;
        if (name === '') {
            console.log(name);
            errors.name = 'Name cant be empty';
        }
        if (name.split(' ').length > 1) {
            console.log(name);
            errors.name = 'Name can contain only one word';
        }
        if (title.length < 5) {
            errors.title = 'Title should be at least 5 character long no less';
        }
        if (title.length > 50) {
            errors.title = 'Title should be only 50 character long no more';
        }
        if (title === '') {
            errors.title = 'Title cant be empty';
        }
        if (Object.keys(errors).length > 0) {
            res.status(400).json(Object.assign({}, errors));
        }
        let sub = new Sub_1.default(Object.assign(Object.assign({}, req.body), { author: res.locals.user._id }));
        res.json(yield sub.save());
    }
    catch (error) {
        console.log(Object.assign({}, error));
        res.status(500).json('Something went wrong');
    }
});
exports.createSub = createSub;
const fetchSub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = req.params;
    name = name === null || name === void 0 ? void 0 : name.toString();
    try {
        let sub = yield Sub_1.default.findOne({ name: name }).populate('author');
        sub = sub.toObject();
        sub.posts = [];
        res.json(sub);
    }
    catch (error) {
        res.status(404).json('Sub with that name dont found');
    }
});
exports.fetchSub = fetchSub;
const fetchSubPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let name = req.params.name;
    let page = +(req.query.page || 0);
    const user = res.locals.user;
    try {
        let sub = yield Sub_1.default.findOne({ name: name }, '_id');
        let posts;
        if (user) {
            posts = yield Post_1.default.populateThinLoged(user.username, page, { sub: sub._id });
        }
        else {
            posts = yield Post_1.default.populateThin(page, { sub: sub._id });
        }
        console.log(posts);
        res.json(posts);
    }
    catch (error) {
        res.status(404).json('Sub with that name dont found');
    }
});
exports.fetchSubPosts = fetchSubPosts;
const searchSub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = req.params;
    name = name === null || name === void 0 ? void 0 : name.toString();
    try {
        let sub = yield Sub_1.default.find({ name: { $regex: name, $options: 'i' } }, 'name imageUrl posts imageUrn');
        if (!sub) {
            res.status(404).json('Sub with that name dont found');
        }
        res.json(sub);
    }
    catch (error) {
        res.status(505).json('Something went wrong');
    }
});
exports.searchSub = searchSub;
const uploadSubImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const sub = res.locals.sub;
    const type = req.body.type;
    console.log(type, file);
    try {
        if (type !== 'image' && type !== 'banner') {
            fs_1.default.unlinkSync(file.path);
            res.status(400).json('Only images are allowed');
        }
        let oldImage = '';
        if (type === 'image') {
            oldImage = sub.imageUrn || '';
            sub.imageUrn = file.filename;
        }
        else if (type === 'banner') {
            oldImage = sub.bannerUrn || '';
            sub.bannerUrn = file.filename;
        }
        if (oldImage !== '') {
            fs_1.default.unlinkSync(`public\\images\\${oldImage}`);
        }
        res.json(yield sub.save());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.uploadSubImage = uploadSubImage;
//# sourceMappingURL=subController.js.map