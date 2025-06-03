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
exports.signup = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const types_1 = require("../types");
const ApiError_1 = require("../utils/ApiError");
exports.signup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = types_1.signupSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError_1.ApiError(404, "Please provide proper username and passwords");
    }
    const { data: body } = result;
    if (!req.file) {
        throw new ApiError_1.ApiError(404, "Please provide profile pic");
    }
}));
