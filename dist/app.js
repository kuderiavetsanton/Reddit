"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//framework and libraries imports
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
//Routes imports
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const subRoutes_1 = __importDefault(require("./routes/subRoutes"));
const miscRoutes_1 = __importDefault(require("./routes/miscRoutes"));
//port
let port = process.env.PORT || 4000;
//add properties to precess.env from .env file
dotenv_1.default.config();
const app = express_1.default();
//Mongoose connection
mongoose_1.default.connect('mongodb://127.0.0.1:27017/reddit', { useNewUrlParser: true, useUnifiedTopology: true });
//Cors for our client
app.use(cors_1.default({
    origin: process.env.ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
// handle static files
app.use(express_1.default.static('public'));
//Routes
app.use('/auth', authRoutes_1.default);
app.use('/post', postRoutes_1.default);
app.use('/sub', subRoutes_1.default);
app.use('/misc', miscRoutes_1.default);
//Error route
app.use('/', (err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json(err.errors ? err.errors : err.message);
});
//starting server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map