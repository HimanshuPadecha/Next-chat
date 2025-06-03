"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
// logger.info("The database is string is" + process.env.DATABASE_URI)
exports.db = (0, neon_http_1.drizzle)(process.env.DATABASE_URI);
