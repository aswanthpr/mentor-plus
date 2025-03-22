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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const menteeRepository_1 = __importDefault(require("../Repository/menteeRepository"));
require("express-session");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: (_a = process.env) === null || _a === void 0 ? void 0 : _a.GOOGLE_CLIENT_ID,
    clientSecret: process === null || process === void 0 ? void 0 : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (_b = process.env) === null || _b === void 0 ? void 0 : _b.CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const profileUrl = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
        const name = (profile === null || profile === void 0 ? void 0 : profile.displayName) || "Unnamed User";
        if (!email) {
            return done(new Error("Email is required but not provided in Google profile"), undefined);
        }
        const existingUser = yield menteeRepository_1.default.findMentee(email);
        if (existingUser && existingUser.provider === "email") {
            return done(null, false, { message: "This email is already registered with a different provider" });
        }
        let user;
        if (existingUser) {
            user = existingUser;
        }
        else {
            user = (yield menteeRepository_1.default.createDocument({
                name,
                email,
                profileUrl,
                verified: true,
                provider: 'google'
            }));
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, undefined);
    }
})));
//google OAuth2 Strategy
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            throw new Error("User ID is missing during deserialization.");
        }
        const User = yield menteeRepository_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        done(null, User);
    }
    catch (error) {
        done(error, null);
    }
}));
exports.default = passport_1.default;
