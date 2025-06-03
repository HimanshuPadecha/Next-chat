"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").notNull().defaultRandom().primaryKey(),
    username: (0, pg_core_1.text)("username").notNull(),
    profileImg: (0, pg_core_1.text)("profile_img").notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    createAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.uuid)("id").notNull().defaultRandom().primaryKey(),
    senderId: (0, pg_core_1.uuid)("sender_id").references(() => exports.users.id).notNull(),
    receiverId: (0, pg_core_1.uuid)("receiver_id").references(() => exports.users.id).notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    createAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
