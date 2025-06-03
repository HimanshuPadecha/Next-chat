"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResonse = void 0;
class ApiResonse {
    constructor(starusCode, data, message, success) {
        this.response = {
            data: null,
            statusCode: 0,
            success: false,
            message: "success",
        };
        this.response.statusCode = starusCode;
        this.response.data = data;
        this.response.success = success;
        this.response.message = message;
    }
}
exports.ApiResonse = ApiResonse;
