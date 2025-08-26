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
Object.defineProperty(exports, "__esModule", { value: true });
const httpResponse_1 = require("../../Constants/httpResponse");
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
const index_1 = require("../../Utils/index");
class otpService {
    constructor(_otpRespository, _menteeRepository) {
        this._otpRespository = _otpRespository;
        this._menteeRepository = _menteeRepository;
    }
    sentOtptoMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        success: false,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const otp = (0, index_1.genOtp)();
                const result = yield this._otpRespository.createOtp(email, otp);
                if (!(result === null || result === void 0 ? void 0 : result.otp)) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        success: false,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    };
                }
                const mailOptions = (0, index_1.generateOtpEmailTemplate)(otp, email);
                yield (0, index_1.sendMail)(Object.assign({}, mailOptions));
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.OTP_SEND_TO_MAIL,
                    success: true,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    verifyOtp(email, otp, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !otp || !type) {
                    return {
                        success: false,
                        message: "email or otp is missing",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const data = yield this._otpRespository.verifyOtp(email, otp);
                if (!data) {
                    return {
                        success: false,
                        message: "OTP does not match",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (type == "signup") {
                    const updateResult = yield this._menteeRepository.updateMentee(data.email);
                    if (!updateResult) {
                        return {
                            success: false,
                            message: "User not found or already verified",
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                        };
                    }
                }
                return {
                    success: true,
                    message: "Verified successfully",
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = otpService;
