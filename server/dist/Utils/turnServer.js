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
exports.fetchTurnServer = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchTurnServer = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post("https://turnix.io/api/v1/credentials/ice", {}, {
            headers: {
                Authorization: `Bearer ${process.env.TURNIX_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (err) {
        const error = err;
        const message = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) && typeof error.response.data === "object"
            ? JSON.stringify(error.response.data)
            : error.message || "Unknown error while fetching TURN credentials";
        console.error("TURN credential error:", message);
        throw new Error(message);
    }
});
exports.fetchTurnServer = fetchTurnServer;
