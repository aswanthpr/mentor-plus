"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//custorm imports
const logger_util_1 = require("./Utils/logger.util");
const dataBase_config_1 = require("./Config/dataBase.config");
const index_middleware_1 = require("./Middleware/index_middleware");
const googleAuth_config_1 = __importDefault(require("./Config/googleAuth.config"));
const socket_1 = require("./Socket/socket");
//routes import
const authRoute_1 = __importDefault(require("./Routes/authRoute"));
const adminRoute_1 = __importDefault(require("./Routes/adminRoute"));
const menteeRoute_1 = __importDefault(require("./Routes/menteeRoute"));
const mentorRoute_1 = __importDefault(require("./Routes/mentorRoute"));
// Initializing the application and server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: index_middleware_1.corsConfig,
});
// connecting with database
(0, dataBase_config_1.connectDb)();
//initialize the socket
exports.socketManager = new socket_1.SocketManager(exports.io);
exports.socketManager.initialize();
//using middlewares
if (process.env.NODE_ENV === "production") {
    // In production, trust the first proxy.
    app.set("trust proxy", 1);
}
app.use(index_middleware_1.cacheControl);
app.use(index_middleware_1.helmetConfig); // set security headers
// app.use(limiter); //express rate limit
app.use(index_middleware_1.compress); //response compresser for performance
app.use((0, cors_1.default)(index_middleware_1.corsOptions)); //to bypass sop
app.use((0, cookie_parser_1.default)()); // to parse cookie data
app.use(index_middleware_1.jsonParseOrRaw); //conditionally parse body data to json or  remain raw
app.use(index_middleware_1.urlEncoding); //encode response data
app.use(index_middleware_1.sessionConfig); // sesion configuration
app.use(googleAuth_config_1.default.initialize());
app.use(googleAuth_config_1.default.session());
app.use((0, morgan_1.default)("dev"));
app.use(logger_util_1.fileLogger);
// Routes
app.use("/auth", authRoute_1.default);
app.use("/admin", adminRoute_1.default);
app.use("/mentee", menteeRoute_1.default);
app.use("/mentor", mentorRoute_1.default);
// app.use(errorLogger)
//server listening
server.listen(process.env.PORT, () => {
    console.log(`


\x1b[1;35m
 ███▄ ▄███▓▓█████  ███▄    █ ▄▄▄█████▓ ▒█████   ██▀███      ██▓███   ██▓     █    ██   ██████ 
▓██▒▀█▀ ██▒▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒   ▓██░  ██▒▓██▒     ██  ▓██▒▒██    ▒ 
▓██    ▓██░▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒   ▓██░ ██▓▒▒██░    ▓██  ▒██░░ ▓██▄   
▒██    ▒██ ▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄     ▒██▄█▓▒ ▒▒██░    ▓▓█  ░██░  ▒   ██▒
▒██▒   ░██▒░▒████▒▒██░   ▓██░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒   ▒██▒ ░  ░░██████▒▒▒█████▓ ▒██████▒▒
░ ▒░   ░  ░░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░   ▒▓▒░ ░  ░░ ▒░▓  ░░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░
░  ░      ░ ░ ░  ░░ ░░   ░ ▒░    ░      ░ ▒ ▒░   ░▒ ░ ▒░   ░▒ ░     ░ ░ ▒  ░░░▒░ ░ ░ ░ ░▒  ░ ░
░      ░      ░      ░   ░ ░   ░      ░ ░ ░ ▒    ░░   ░    ░░         ░ ░    ░░░ ░ ░ ░  ░  ░  
       ░      ░  ░         ░              ░ ░     ░                     ░  ░   ░           ░  
\x1b[0
\x1b[1;32m******************************\x1b[0m
\x1b[1;33m🌟 Server is up! 🌟\x1b[0m
\x1b[1;34mServer running at http://localhost:${process.env.PORT}\x1b[0m
\x1b[1;36mCurrent Time: ${new Date().toLocaleString()}\x1b[0m
\x1b[1;32m******************************\x1b[0m`);
}).on('error', (err) => {
    console.error(err instanceof Error ? err.message : String(err));
});
exports.default = app;
