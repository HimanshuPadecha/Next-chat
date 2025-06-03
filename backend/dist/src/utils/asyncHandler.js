"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
const ApiError_1 = require("./ApiError");
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            if (!(error instanceof ApiError_1.ApiError)) {
                return res.status(500).json({
                    message: "Unexpected Error",
                });
            }
            else {
                return res.status(error.statusCode).json({
                    message: error.message,
                    success: error.success,
                    data: null,
                });
            }
        });
    };
}
