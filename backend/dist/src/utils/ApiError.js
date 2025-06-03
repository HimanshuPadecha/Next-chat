"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.errors = [];
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
    }
}
exports.ApiError = ApiError;
