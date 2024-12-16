"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const AuthRoute_1 = __importDefault(require("./ROUTES/AuthRoute"));
const AdminRoute_1 = __importDefault(require("./ROUTES/AdminRoute"));
const MenteeRoute_1 = __importDefault(require("./ROUTES/MenteeRoute"));
const MentorRoute_1 = __importDefault(require("./ROUTES/MentorRoute"));
const DataBase_1 = require("./CONFIG/DataBase");
const index_middleware_1 = require("./MIDDLEWARE/index_middleware");
(0, DataBase_1.connectDb)();
//using middlewares
app.use((0, cors_1.default)(index_middleware_1.corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/auth', AuthRoute_1.default);
app.use('/admin', AdminRoute_1.default);
app.use('/mentee', MenteeRoute_1.default);
app.use('/mentor', MentorRoute_1.default);
app.listen(process.env.PORT, () => {
    console.log('\x1b[33m%s\x1b[0m', "server listen on http://localhost:3000");
});
exports.default = app;
