"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const winston_logger_1 = __importDefault(require("./utils/winston.logger"));
dotenv_1.default.config({ path: "./.env" });
app_1.app.listen(process.env.PORT || 3000, () => {
    winston_logger_1.default.info(`The backend is running on ${process.env.PORT}`);
});
