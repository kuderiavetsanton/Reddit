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
exports.createComment = exports.fetchComments = exports.getPost = exports.fetchPosts = exports.createPost = void 0;
const trim_1 = __importDefault(require("../util/trim"));
//Database collections and typescript interfaces for a documents
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const Sub_1 = __importDefault(require("../models/Sub"));
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //delete spaces from start and end of the req.body properties except body
        req.body = trim_1.default(req.body, ['body']);
        let { subId, title, body } = req.body;
        //find a sub that corespnse to a sub id user send you
        let sub = yield Sub_1.default.findById(subId, '_id posts');
        //if sub doesnt exist throw an error
        if (!sub) {
            throw new Error('Sub with that id doesnt exist');
        }
        //create a Post
        let post = new Post_1.default({ author: res.locals.user._id, title, body, sub: subId });
        //add that post to a sub he corespond to
        (_a = sub.posts) === null || _a === void 0 ? void 0 : _a.push(post._id);
        //save sub and post
        if (sub.save) {
            sub === null || sub === void 0 ? void 0 : sub.save();
        }
        let newPost = yield post.save();
        //send post with usetVote property
        res.json(yield newPost.withUserVote(res.locals.user.username));
    }
    catch (error) {
        next({ message: error.message, status: 404 });
    }
});
exports.createPost = createPost;
const fetchPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //retrieve a current page
    let page = +(req.query.page || 0);
    let user = res.locals.user;
    //if user is authorized retrieve posts with userVotes property else don`t
    let posts;
    if (!user) {
        console.log('user doesnt exist');
        posts = yield Post_1.default.populateThin(page);
    }
    else {
        console.log('after loging in', user);
        posts = yield Post_1.default.populateThinLoged(user.username, page);
    }
    res.json(posts);
});
exports.fetchPosts = fetchPosts;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user } = res.locals;
        let { postId: id, slug } = req.params;
        //find post with id and slug from params
        let post = yield Post_1.default.findOne({ _id: id, slug });
        if (!post) {
            throw new Error('Wrong id or slug of post');
        }
        if (user) {
            post = yield post.withUserVote(user.username);
        }
        else {
            post = yield post.populate('votes').populate('sub').execPopulate();
        }
        res.json(post);
    }
    catch (error) {
        next({ message: error.message, status: 404 });
    }
});
exports.getPost = getPost;
const fetchComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user } = res.locals;
        let { postId, } = req.params;
        let comments;
        if (user) {
            comments = yield Comment_1.default.populateThinLoged(postId, user.username);
        }
        else {
            comments = yield Comment_1.default.populateThin(postId);
        }
        res.json(comments);
    }
    catch (error) {
        next({ message: error.message, status: 404 });
    }
});
exports.fetchComments = fetchComments;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { postId } = req.params;
    let { body } = req.body;
    let post = yield Post_1.default.findById(postId);
    if (!post) {
        throw new Error('Post doesnt exist');
    }
    let comment = new Comment_1.default({ body, post: post._id, username: res.locals.user.username });
    let newComment = yield comment.save();
    post.comments.push(newComment._id);
    yield post.save();
    res.json(newComment);
});
exports.createComment = createComment;
// http://localhost:4000/post?page=0 http://localhost:4000/posts?page=0 
//# sourceMappingURL=postController.js.map